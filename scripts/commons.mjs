import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "images", "stock");
const UA = { "User-Agent": "RawafidSabaSite/1.0 (contact: site admin)" };
const FREE = /^(cc0|cc by(-sa)?( \d\.\d)?|public domain|pd)/i;
const bad = /(1900|191\d|192\d|193\d|194\d|195\d|toy|lego|model|museum|vintage|historic)/i;

const targets = [
  { slug: "hero", search: "mobile crane construction site", min: 1600 },
  { slug: "jcb-backhoes", search: "JCB backhoe loader", min: 1100 },
];

const credits = JSON.parse(fs.readFileSync(path.join(OUT, "credits.json"), "utf8"));

for (const { slug, search, min } of targets) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    `&gsrsearch=${encodeURIComponent("filetype:bitmap " + search)}` +
    "&gsrnamespace=6&gsrlimit=30&prop=imageinfo" +
    "&iiprop=url|size|extmetadata&iiurlwidth=1800&format=json";
  const res = await fetch(api, { headers: UA });
  const json = await res.json();
  const pages = Object.values(json?.query?.pages || {});
  const cands = pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const meta = ii.extmetadata || {};
      return {
        title: p.title,
        w: ii.width, h: ii.height,
        thumb: ii.thumburl,
        page: ii.descriptionurl,
        license: meta.LicenseShortName?.value || "",
        author: (meta.Artist?.value || "").replace(/<[^>]+>/g, ""),
        date: meta.DateTimeOriginal?.value || "",
      };
    })
    .filter((c) => c && c.w >= min && c.w > c.h && FREE.test(c.license) &&
      !bad.test(c.title) && !bad.test(c.date))
    .sort((a, b) => b.w - a.w);

  let ok = false;
  for (const c of cands.slice(0, 8)) {
    try {
      const img = await fetch(c.thumb, { headers: UA });
      if (!img.ok) continue;
      const buf = Buffer.from(await img.arrayBuffer());
      if (buf.length < 100_000) continue;
      fs.writeFileSync(path.join(OUT, `${slug}.jpg`), buf);
      credits[slug] = { title: c.title, creator: c.author, license: c.license, source: c.page };
      console.log(`OK ${slug}: ${(buf.length / 1024).toFixed(0)} KB — ${c.license} — ${c.title}`);
      ok = true;
      break;
    } catch { /* next */ }
  }
  if (!ok) console.error(`FAIL ${slug} (candidates: ${cands.length})`);
}
fs.writeFileSync(path.join(OUT, "credits.json"), JSON.stringify(credits, null, 2));
