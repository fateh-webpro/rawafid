import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// الفئات وخيارات التشغيل (مطابقة لبيانات الموقع)
const categories = [
  { slug: "forklifts", nameAr: "رافعات شوكية", nameEn: "Forklifts", operator: "both", units: 4 },
  { slug: "mobile-cranes", nameAr: "موبايل كرين", nameEn: "Mobile Cranes", operator: "operated", units: 4 },
  { slug: "jcb-backhoes", nameAr: "حفارات JCB", nameEn: "JCB Backhoes", operator: "operated", units: 4 },
  { slug: "bobcats", nameAr: "بوبكات", nameEn: "Bobcats", operator: "operated", units: 4 },
  { slug: "scissor-lifts", nameAr: "سيزر لفت", nameEn: "Scissor Lifts", operator: "both", units: 4 },
  { slug: "man-lifts", nameAr: "مانلفت", nameEn: "Man Lifts", operator: "both", units: 4 },
  { slug: "tower-lights", nameAr: "تاور لايت", nameEn: "Tower Lights", operator: "self", units: 2 },
  { slug: "telehandlers", nameAr: "تليهاندلر", nameEn: "Telehandlers", operator: "operated", units: 4 },
];

const projects = [
  { titleAr: "رفع هياكل معدنية", titleEn: "Steel Structure Lifting", tagAr: "أعمال الرفع", tagEn: "Lifting", image: "/images/projects/p1.jpg" },
  { titleAr: "أعمال إنشائية على المباني", titleEn: "Construction Works on Buildings", tagAr: "دعم المشاريع", tagEn: "Project Support", image: "/images/projects/p2.jpg" },
  { titleAr: "تجهيز موقع مشروع", titleEn: "Project Site Preparation", tagAr: "المناولة", tagEn: "Handling", image: "/images/projects/p3.jpg" },
  { titleAr: "أعمال ارتفاعات على الهياكل", titleEn: "Height Works on Structures", tagAr: "الوصول الآمن", tagEn: "Safe Access", image: "/images/projects/p4.jpg" },
  { titleAr: "أعمال داخلية بالسيزر لفت", titleEn: "Interior Works with Scissor Lift", tagAr: "الوصول الآمن", tagEn: "Safe Access", image: "/images/projects/p5.jpg" },
  { titleAr: "رفع ثقيل بموقع مفتوح", titleEn: "Heavy Lifting at Open Site", tagAr: "أعمال الرفع", tagEn: "Lifting", image: "/images/projects/p6.jpg" },
];

async function main() {
  // مستخدم مدير افتراضي
  const adminEmail = "admin@rawafidsaba.com";
  const adminPass = "Rawafid@2018";
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "مدير النظام",
      email: adminEmail,
      password: await bcrypt.hash(adminPass, 10),
      role: "admin",
    },
  });
  console.log(`✓ Admin user: ${adminEmail} / ${adminPass}`);

  // الفئات والمعدات
  for (let ci = 0; ci < categories.length; ci++) {
    const c = categories[ci];
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: { nameAr: c.nameAr, nameEn: c.nameEn, operator: c.operator, order: ci },
      create: { slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn, operator: c.operator, order: ci },
    });
    for (let u = 1; u <= c.units; u++) {
      const image = `/images/equipment/gallery/${c.slug}/${u}.jpg`;
      const existing = await db.equipment.findFirst({
        where: { categoryId: cat.id, image },
      });
      if (!existing) {
        await db.equipment.create({
          data: {
            categoryId: cat.id,
            nameAr: c.nameAr,
            nameEn: c.nameEn,
            image,
            order: u,
          },
        });
      }
    }
  }
  console.log(`✓ ${categories.length} categories with equipment`);

  // المشاريع
  const projectCount = await db.project.count();
  if (projectCount === 0) {
    for (let i = 0; i < projects.length; i++) {
      await db.project.create({ data: { ...projects[i], order: i } });
    }
    console.log(`✓ ${projects.length} projects`);
  } else {
    console.log(`↷ projects already seeded (${projectCount})`);
  }

  // إعدادات عامة
  const settings = {
    phone: "+966538131822",
    whatsapp: "966538131822",
    "stats.equipment": "273",
    "stats.projects": "732",
    "stats.clients": "245",
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  console.log("✓ settings");
}

main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    db.$disconnect();
    process.exit(1);
  });
