"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";

/** حقل رفع صورة: يرفع إلى /api/upload ويملأ input مخفياً بالمسار */
export function ImageUpload({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
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
      if (json.ok) setUrl(json.url);
      else setError("تعذّر رفع الصورة");
    } catch {
      setError("تعذّر رفع الصورة");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <input type="hidden" name={name} value={url} readOnly />

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-navy-20 bg-cream">
          {url ? (
            <Image src={url} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-gray">
              لا صورة
            </span>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-20 bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-gold disabled:opacity-60"
          >
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {busy ? "جارٍ الرفع…" : "رفع صورة"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <input
            type="text"
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/images/... أو رابط الصورة"
            className="mt-2 w-full rounded-lg border border-navy-20 bg-white px-3 py-2 text-start text-xs text-navy outline-none focus:border-gold"
          />
          {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
