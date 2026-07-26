"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { saveSettings, type SettingsState } from "./actions";

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(
    saveSettings,
    {} as SettingsState
  );

  const Text = ({ name, label, ltr }: { name: string; label: string; ltr?: boolean }) => (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-80">{label}</span>
      <input
        type="text"
        name={name}
        dir={ltr ? "ltr" : undefined}
        defaultValue={values[name] ?? ""}
        className={field + (ltr ? " text-start latin-nums" : "")}
      />
    </label>
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      {/* التواصل */}
      <Section title="معلومات التواصل">
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="contact.phone" label="رقم الهاتف (للاتصال)" ltr />
          <Text name="contact.phoneDisplay" label="الهاتف كما يظهر" ltr />
          <Text name="contact.whatsapp" label="رقم واتساب (أرقام فقط بمقدمة الدولة)" ltr />
          <Text name="contact.email" label="البريد الإلكتروني (يظهر بالموقع)" ltr />
          <Text name="quotes.notifyEmail" label="بريد استقبال الطلبات (للإشعارات)" ltr />
        </div>
      </Section>

      {/* الأرقام */}
      <Section title="أرقام الإنجازات">
        <div className="grid gap-4 sm:grid-cols-4">
          <Text name="stats.foundedYear" label="سنة التأسيس" ltr />
          <Text name="stats.equipment" label="عدد المعدات" ltr />
          <Text name="stats.projects" label="عدد المشاريع" ltr />
          <Text name="stats.clients" label="عدد العملاء" ltr />
        </div>
      </Section>

      {/* صورة الهيدر */}
      <Section title="الصفحة الرئيسية — صورة الهيدر">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة الهيدر</span>
          <ImageUpload name="hero.image" defaultValue={values["hero.image"]} />
          <p className="mt-3 text-xs text-gray">
            نصوص الهيدر وبقية نصوص الصفحات تُعدَّل من قسم «نصوص الموقع».
          </p>
        </div>
      </Section>

      {/* التواصل الاجتماعي */}
      <Section title="روابط التواصل الاجتماعي">
        <p className="mb-4 text-xs text-gray">
          ضع الرابط الكامل لكل منصة — الفارغة تختفي من الموقع تلقائيًا.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text name="social.facebook" label="فيسبوك" ltr />
          <Text name="social.instagram" label="إنستقرام" ltr />
          <Text name="social.tiktok" label="تيك توك" ltr />
          <Text name="social.snapchat" label="سناب شات" ltr />
          <Text name="social.x" label="X (تويتر)" ltr />
        </div>
      </Section>

      {/* نشاط الألمنيوم */}
      <Section title="صفحة أنشطتنا — نشاط الألمنيوم والواجهات">
        <div className="grid gap-4">
          <Text name="aluminum.url" label="رابط موقع الألمنيوم (اتركه فارغًا ليظهر «قريبًا»)" ltr />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-navy-80">صورة بطاقة الألمنيوم</span>
            <ImageUpload name="aluminum.image" defaultValue={values["aluminum.image"]} />
          </div>
        </div>
      </Section>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.success}
        </p>
      ) : null}

      <div className="sticky bottom-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3 font-heading font-bold text-navy shadow-lg transition-colors hover:bg-gold-80 disabled:opacity-60"
        >
          <Save size={18} />
          {pending ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-navy-20/50 bg-white p-6">
      <h2 className="mb-5 font-heading text-lg font-bold text-navy">{title}</h2>
      {children}
    </section>
  );
}
