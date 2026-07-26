/**
 * أيقونات المعدات المخصصة — رسم خطي موحد (stroke 1.7) يعكس شكل كل معدة.
 * واجهة متوافقة مع أيقونات lucide: size / className / strokeWidth.
 */
import type { SVGProps } from "react";

export type EquipmentIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

function base({ size = 24, strokeWidth = 1.7, ...props }: EquipmentIconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

/** رافعة شوكية: صارٍ + شوكتان + مقصورة وعجلات */
export function ForkliftIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M17 6v11" />
      <path d="M17 17h5" />
      <path d="M17 12.5h4" />
      <path d="M3 12V7.5h5L10 12" />
      <path d="M2.5 12h9.5v4H2.5z" />
      <circle cx="5" cy="18.5" r="1.8" />
      <circle cx="10.5" cy="18.5" r="1.8" />
    </svg>
  );
}

/** موبايل كرين: شاحنة + ذراع تلسكوبي مائل + خطاف */
export function MobileCraneIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M2.5 14.5h13v4h-13z" />
      <circle cx="6" cy="20" r="1.6" />
      <circle cx="12.5" cy="20" r="1.6" />
      <path d="M5 14.5 18 5.5" />
      <path d="M7.5 12.8 19.5 4.5" />
      <path d="M19 5v4.5" />
      <path d="M19 9.5c0 1 1.6 1 1.6 0" />
      <path d="M15.5 14.5V11" />
    </svg>
  );
}

/** حفار JCB: مقصورة + دلو أمامي + ذراع حفر خلفية بدلو صغير */
export function BackhoeIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 14.5h7v-2l-1.5-3h-3L9 12.5H8z" />
      <circle cx="9" cy="17" r="2.4" />
      <circle cx="15.5" cy="17.8" r="1.7" />
      <path d="M8 13 5 13" />
      <path d="M5 11.5v3.5H2.8v-3z" />
      <path d="M15 11 18.5 6" />
      <path d="M18.5 6 21.5 11" />
      <path d="M21.5 11l-2.2 2.8" />
      <path d="M21.5 11l1 2.5-1.7.3" />
    </svg>
  );
}

/** بوبكات: جسم مدمج + ذراع جانبية + دلو أمامي منخفض */
export function SkidSteerIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 9h6.5v5H6z" />
      <path d="M13.5 10.5h3L18 14h-4.5" />
      <path d="M18 14v2.5h3V14z" />
      <circle cx="8" cy="17.5" r="1.9" />
      <circle cx="13.5" cy="17.5" r="1.9" />
      <path d="M9 9V6.5h3.5V9" />
    </svg>
  );
}

/** سيزر لفت: منصة + مقصات X + قاعدة بعجلات */
export function ScissorLiftIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5.5 4.5h13v2.5h-13z" />
      <path d="M6.5 7l11 4.5" />
      <path d="M17.5 7l-11 4.5" />
      <path d="M6.5 11.5 17.5 16" />
      <path d="M17.5 11.5 6.5 16" />
      <path d="M5 16h14v2.5H5z" />
      <circle cx="8" cy="20.5" r="1.4" />
      <circle cx="16" cy="20.5" r="1.4" />
    </svg>
  );
}

/** مانلفت: قاعدة + ذراع مفصلية + سلة عمل */
export function ManLiftIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 17.5h8v2H3z" />
      <circle cx="5" cy="21" r="1.2" />
      <circle cx="9" cy="21" r="1.2" />
      <path d="M7 17.5 10.5 11l6-2.5" />
      <path d="M16.5 8.5V5.5" />
      <path d="M15 3.5h5V7h-5z" />
    </svg>
  );
}

/** تاور لايت: عمود + كشافات + قاعدة مقطورة */
export function TowerLightIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 17V7" />
      <path d="M8.5 4.5h7v3h-7z" />
      <path d="M10 4.5 8.5 2.5M14 4.5l1.5-2M12 4.5V2" />
      <path d="M6.5 17h11l-1.5 3h-8z" />
      <circle cx="12" cy="21.5" r="1.2" />
      <path d="M9.5 17 12 13.5l2.5 3.5" />
    </svg>
  );
}

/** تليهاندلر: جسم بعجلات كبيرة + ذراع تلسكوبي مرتفع للأمام + شوكة عند الطرف */
export function TelehandlerIcon(p: EquipmentIconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 13h9.5v4.5H8z" />
      <circle cx="10.5" cy="19.5" r="2" />
      <circle cx="16" cy="19.5" r="2" />
      <path d="M17 13 6.5 5.5" />
      <path d="M17.5 11 8.5 4.5" />
      <path d="M6.5 5.5 5.5 8" />
      <path d="M5.5 8H3v-2.5" />
      <path d="M8 15H5.5" />
    </svg>
  );
}

/** خريطة الأيقونات بالمفتاح — تُستخدم داخل مكونات العميل بدل تمرير الدوال */
export const equipmentIconMap: Record<
  string,
  (p: EquipmentIconProps) => React.ReactElement
> = {
  forklifts: ForkliftIcon,
  "mobile-cranes": MobileCraneIcon,
  "jcb-backhoes": BackhoeIcon,
  bobcats: SkidSteerIcon,
  "scissor-lifts": ScissorLiftIcon,
  "man-lifts": ManLiftIcon,
  "tower-lights": TowerLightIcon,
  telehandlers: TelehandlerIcon,
};
