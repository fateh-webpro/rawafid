import type { ComponentType } from "react";
import {
  BackhoeIcon,
  ForkliftIcon,
  ManLiftIcon,
  MobileCraneIcon,
  ScissorLiftIcon,
  SkidSteerIcon,
  TelehandlerIcon,
  TowerLightIcon,
  type EquipmentIconProps,
} from "@/components/icons/equipment";

/** خيار التشغيل — من إفادة العميل: الفوركلفت والبوبكات بمشغل أو بدون */
export type OperatorMode = "both" | "operated" | "self";

export type EquipmentCategory = {
  slug: string;
  icon: ComponentType<EquipmentIconProps>;
  cover: string;
  operator: OperatorMode;
  /** صور وحدات حقيقية من الأسطول */
  units: string[];
};

const g = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/images/equipment/gallery/${slug}/${i + 1}.jpg`);

export const equipmentCategories: EquipmentCategory[] = [
  {
    slug: "forklifts",
    icon: ForkliftIcon,
    cover: "/images/equipment/forklifts.jpg",
    operator: "both",
    units: g("forklifts", 4),
  },
  {
    slug: "mobile-cranes",
    icon: MobileCraneIcon,
    cover: "/images/equipment/mobile-cranes.jpg",
    operator: "operated",
    units: g("mobile-cranes", 4),
  },
  {
    slug: "jcb-backhoes",
    icon: BackhoeIcon,
    cover: "/images/equipment/jcb-backhoes.jpg",
    operator: "operated",
    units: g("jcb-backhoes", 4),
  },
  {
    slug: "bobcats",
    icon: SkidSteerIcon,
    cover: "/images/equipment/bobcats.jpg",
    operator: "operated",
    units: g("bobcats", 4),
  },
  {
    slug: "scissor-lifts",
    icon: ScissorLiftIcon,
    cover: "/images/equipment/scissor-lifts.jpg",
    operator: "both",
    units: g("scissor-lifts", 4),
  },
  {
    slug: "man-lifts",
    icon: ManLiftIcon,
    cover: "/images/equipment/man-lifts.jpg",
    operator: "both",
    units: g("man-lifts", 4),
  },
  {
    slug: "tower-lights",
    icon: TowerLightIcon,
    cover: "/images/equipment/tower-lights.jpg",
    operator: "self",
    units: g("tower-lights", 2),
  },
  {
    slug: "telehandlers",
    icon: TelehandlerIcon,
    cover: "/images/equipment/telehandlers.jpg",
    operator: "operated",
    units: g("telehandlers", 4),
  },
];

/** عنصر معدة مسطّح للعرض في الكتالوج */
export type EquipmentUnit = {
  id: string;
  categorySlug: string;
  image: string;
  operator: OperatorMode;
};

export const equipmentUnits: EquipmentUnit[] = equipmentCategories.flatMap((c) =>
  c.units.map((image, i) => ({
    id: `${c.slug}-${i + 1}`,
    categorySlug: c.slug,
    image,
    operator: c.operator,
  }))
);
