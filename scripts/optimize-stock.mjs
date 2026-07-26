import fs from "fs";
import path from "path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "images", "stock");
const files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const f of files) {
  const p = path.join(DIR, f);
  const slug = f.replace(/\.(jpe?g|png)$/i, "");
  const w = slug === "hero" ? 2000 : 1400;
  const out = path.join(DIR, `${slug}.opt.jpg`);
  await sharp(p).rotate().resize({ width: w, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true }).toFile(out);
  fs.rmSync(p);
  fs.renameSync(out, path.join(DIR, `${slug}.jpg`));
  const kb = (fs.statSync(path.join(DIR, `${slug}.jpg`)).size / 1024).toFixed(0);
  console.log(`✓ ${slug}.jpg → ${kb} KB`);
}
