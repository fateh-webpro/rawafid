import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    origin: req.headers.get("origin"),
    host: req.headers.get("host"),
    "x-forwarded-host": req.headers.get("x-forwarded-host"),
    "x-forwarded-proto": req.headers.get("x-forwarded-proto"),
    "x-forwarded-port": req.headers.get("x-forwarded-port"),
    referer: req.headers.get("referer"),
    "user-agent": req.headers.get("user-agent"),
    method: req.method,
  });
}
