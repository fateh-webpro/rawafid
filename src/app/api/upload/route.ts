import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_IMAGE = 6 * 1024 * 1024; // 6MB
const MAX_DOC = 25 * 1024 * 1024; // 25MB

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(req: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isDoc = DOC_TYPES.includes(file.type);
  if (!isImage && !isDoc) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 415 });
  }
  if (file.size > (isImage ? MAX_IMAGE : MAX_DOC)) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const ext = EXT[file.type] ?? "bin";
  const folder = process.env.CLOUDINARY_FOLDER?.trim() || "rawafid/uploads";
  const publicId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const cloudinary = getCloudinary();
    const result = await new Promise<{
      secure_url?: string;
      public_id?: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "auto",
          format: ext,
          unique_filename: false,
          use_filename: false,
          overwrite: false,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(uploadResult ?? {});
        }
      );

      stream.end(bytes);
    });

    if (!result.secure_url || !result.public_id) {
      return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
      publicId: result.public_id,
      size: humanSize(file.size),
      name: file.name,
    });
  } catch (error) {
    console.error("Upload failed", error instanceof Error ? error.message : "unknown_error");
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }
}
