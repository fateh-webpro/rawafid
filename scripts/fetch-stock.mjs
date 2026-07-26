/**
 * تنزيل صور مؤقتة بتراخيص مفتوحة تسمح بالاستخدام التجاري (عبر Openverse)
 * تُستبدل لاحقاً بصور معدات الشركة الحقيقية.
 * التشغيل: node scripts/fetch-stock.mjs
 */
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "images", "stock");
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  { slug: "hero", queries: ["mobile crane construction"] },
  { slug: "forklifts", queries: ["forklift"] },
  { slug: "mobile-cranes", queries: ["mobile crane"] },
  {
    slug: "jcb-backhoes",
    queries: ["JCB backhoe", "backhoe excavator", "excavator construction"],
  },
  {
    slug: "bobcats",
    queries: ["bobcat loader", "skid steer", "compact loader"],
  },
  {
    slug: "scissor-lifts",
    queries: ["scissor lift", "aerial work platform scissor"],
  },
  {
    slug: "man-lifts",
    queries: ["cherry picker", "boom lift", "aerial platform"],
  },
  {
    slug: "tower-lights",
    queries: ["light tower construction", "portable light tower", "construction floodlight"],
  },
  {
    slug: "telehandlers",
    queries: ["telescopic handler", "telehandler", "manitou"],
  },
];

const UA = { "User-Agent": "RawafidSabaSite/1.0 (placeholder image fetch)" };
const CREDITS_FILE = path.join(OUT, "credits.json");
const credits = fs.existsSync(CREDITS_FILE)
  ? JSON.parse(fs.readFileSync(CREDITS_FILE, "utf8"))
  : {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRetry(url, opts = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow", ...opts });
      if (res.ok) return res;
      if (res.status === 429) await sleep(3000);
    } catch {
      await sleep(2000 * (i + 1));
    }
  }
  return null;
}

async function tryDownload(result, slug) {
  const img = await fetchRetry(result.url, {}, 2);
  if (!img) return false;
  const type = img.headers.get("content-type") || "";
  if (!type.startsWith("image/")) return false;
  let buf;
  try {
    buf = Buffer.from(await img.arrayBuffer());
  } catch {
    return false;
  }
  if (buf.length < 40_000) return false;
  const ext = type.includes("png") ? "png" : "jpg";
  fs.writeFileSync(path.join(OUT, `${slug}.${ext}`), buf);
  credits[slug] = {
    title: result.title,
    creator: result.creator,
    license: `${result.license}`.toUpperCase() + " " + (result.license_version || ""),
    source: result.foreign_landing_url,
  };
  console.log(
    `✓ ${slug}: ${(buf.length / 1024).toFixed(0)} KB — ${result.license} — by ${result.creator}`
  );
  return true;
}

for (const { slug, queries } of targets) {
  if (fs.existsSync(path.join(OUT, `${slug}.jpg`)) || fs.existsSync(path.join(OUT, `${slug}.png`))) {
    console.log(`↷ ${slug}: exists, skipping`);
    continue;
  }
  let ok = false;
  for (const query of queries) {
    const url =
      `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}` +
      `&license_type=commercial&per_page=20`;
    const res = await fetchRetry(url);
    if (!res) continue;
    let json;
    try {
      json = await res.json();
    } catch {
      continue;
    }
    // تفضيل الأفقية الكبيرة وتراخيص cc0/by — مع تساهل تدريجي
    const all = json.results || [];
    const tiers = [
      all.filter((r) => r.width >= 1000 && r.width > r.height),
      all.filter((r) => r.width >= 800),
    ];
    for (const tier of tiers) {
      const sorted = tier.sort((a, b) => {
        const rank = (l) => (l === "cc0" || l === "pdm" ? 0 : l === "by" ? 1 : 2);
        return rank(a.license) - rank(b.license);
      });
      for (const result of sorted.slice(0, 6)) {
        ok = await tryDownload(result, slug);
        if (ok) break;
      }
      if (ok) break;
    }
    if (ok) break;
  }
  if (!ok) console.error(`✗ ${slug}: no downloadable result`);
}

fs.writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 2));
const txt = Object.entries(credits)
  .map(([k, c]) => `${k} — "${c.title}" by ${c.creator} — ${c.license} — ${c.source}`)
  .join("\n");
fs.writeFileSync(
  path.join(OUT, "CREDITS.txt"),
  "صور مؤقتة بتراخيص مفتوحة تسمح بالاستخدام التجاري — تُستبدل بصور الشركة قبل الإطلاق.\n" +
    "تراخيص BY وBY-SA تتطلب نسب المصدر إذا بقيت الصور في الموقع المنشور.\n\n" +
    txt +
    "\n"
);
console.log("\nDone:", Object.keys(credits).length, "/", targets.length);
