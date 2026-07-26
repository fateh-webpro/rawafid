import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "images", "stock");
const UA = { "User-Agent": "RawafidSabaSite/1.0" };
const targets = [
  { slug: "hero", queries: ["construction cranes site", "crane construction dusk", "construction site crane"] },
  { slug: "man-lifts", queries: ["cherry picker truck", "articulated boom lift", "man lift platform"] },
  { slug: "tower-lights", queries: ["mobile lighting tower", "light plant construction", "construction night lights"] },
  { slug: "jcb-backhoes", queries: ["JCB digger", "JCB excavator", "yellow backhoe"] },
];
const bad = /(lego|toy|drawing|clipart|illustration|model|miniature|cartoon)/i;
const credits = JSON.parse(fs.readFileSync(path.join(OUT, "credits.json"), "utf8"));

for (const { slug, queries } of targets) {
  let ok = false;
  for (const q of queries) {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&per_page=20&extension=jpg&source=flickr,wikimedia`;
    let json;
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) continue;
      json = await res.json();
    } catch { continue; }
    const cands = (json.results || []).filter(r =>
      r.width >= 1200 && r.width > r.height &&
      !bad.test(r.title || "") &&
      !bad.test((r.tags || []).map(t => t.name).join(" "))
    ).sort((a, b) => {
      const rank = l => (l === "cc0" || l === "pdm" ? 0 : l === "by" ? 1 : 2);
      return rank(a.license) - rank(b.license);
    });
    for (const r of cands.slice(0, 6)) {
      try {
        const img = await fetch(r.url, { headers: UA });
        if (!img.ok) continue;
        const type = img.headers.get("content-type") || "";
        if (!type.startsWith("image/jpeg")) continue;
        const buf = Buffer.from(await img.arrayBuffer());
        if (buf.length < 100_000) continue;
        fs.writeFileSync(path.join(OUT, `${slug}.jpg`), buf);
        credits[slug] = { title: r.title, creator: r.creator, license: (r.license || "").toUpperCase(), source: r.foreign_landing_url };
        console.log(`✓ ${slug} (${q}): ${(buf.length/1024).toFixed(0)} KB — ${r.license} — "${r.title}" by ${r.creator}`);
        ok = true;
        break;
      } catch { continue; }
    }
    if (ok) break;
  }
  if (!ok) console.error(`✗ ${slug}`);
}
fs.writeFileSync(path.join(OUT, "credits.json"), JSON.stringify(credits, null, 2));
