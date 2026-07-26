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
import type { ComponentType } from "react";

/** فئات الأسطول الثمانية — الصور من أسطول الشركة الفعلي، والأيقونات مخصصة */
export type Category = {
  slug: string;
  icon: ComponentType<EquipmentIconProps>;
  image: string;
};

export const categories: Category[] = [
  { slug: "forklifts", icon: ForkliftIcon, image: "/images/equipment/forklifts.jpg" },
  { slug: "mobile-cranes", icon: MobileCraneIcon, image: "/images/equipment/mobile-cranes.jpg" },
  { slug: "jcb-backhoes", icon: BackhoeIcon, image: "/images/equipment/jcb-backhoes.jpg" },
  { slug: "bobcats", icon: SkidSteerIcon, image: "/images/equipment/bobcats.jpg" },
  { slug: "scissor-lifts", icon: ScissorLiftIcon, image: "/images/equipment/scissor-lifts.jpg" },
  { slug: "man-lifts", icon: ManLiftIcon, image: "/images/equipment/man-lifts.jpg" },
  { slug: "tower-lights", icon: TowerLightIcon, image: "/images/equipment/tower-lights.jpg" },
  { slug: "telehandlers", icon: TelehandlerIcon, image: "/images/equipment/telehandlers.jpg" },
];

export const serviceSlugs = [
  "operated-rental",
  "bare-rental",
  "flexible-terms",
  "transport",
  "maintenance",
  "site-assessment",
] as const;
