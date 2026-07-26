"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileText } from "lucide-react";

/** رفع ملف (PDF/مستند): يرفع إلى /api/upload ويملأ حقلين مخفيين بالمسار والحجم */
export function FileUpload({
  nameUrl,
  nameSize,
  defaultUrl = "",
  defaultSize = "",
}: {
  nameUrl: string;
  nameSize: string;
  defaultUrl?: string;
  defaultSize?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [size, setSize] = useState(defaultSize);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) {
        setUrl(json.url);
        setSize(json.size ?? "");
        setFileName(json.name ?? "");
      } else {
        setError("تعذّر رفع الملف");
      }
    } catch {
      setError("تعذّر رفع الملف");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input type="hidden" name={nameUrl} value={url} readOnly />
      <input type="hidden" name={nameSize} value={size} readOnly />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold disabled:opacity-60"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {busy ? "جارٍ الرفع…" : "رفع ملف"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />

      {url ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-navy-20/60 bg-cream/40 px-3 py-2 text-sm">
          <FileText size={16} className="text-gold" />
          <span dir="ltr" className="latin-nums flex-1 truncate text-start text-navy">
            {fileName || url}
          </span>
          {size ? <span className="latin-nums text-xs text-gray">{size}</span> : null}
        </div>
      ) : null}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
