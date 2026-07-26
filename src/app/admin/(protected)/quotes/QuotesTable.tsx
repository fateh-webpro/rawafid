"use client";

import { useState, useTransition } from "react";
import { Phone, MessageCircle, ChevronDown, StickyNote } from "lucide-react";
import { updateQuoteStatus, saveQuoteNotes } from "../actions";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export type QuoteRow = {
  id: string;
  name: string;
  phone: string;
  company: string | null;
  category: string;
  duration: string;
  city: string;
  details: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-gold text-navy" },
  contacted: { label: "تم التواصل", cls: "bg-navy text-white" },
  quoted: { label: "مُسعّر", cls: "bg-blue-100 text-blue-800" },
  won: { label: "مكسوب", cls: "bg-green-100 text-green-800" },
  lost: { label: "مفقود", cls: "bg-red-100 text-red-700" },
};
const STATUS_ORDER = ["new", "contacted", "quoted", "won", "lost"];

const CATEGORY_AR: Record<string, string> = {
  forklifts: "رافعات شوكية",
  "mobile-cranes": "موبايل كرين",
  "jcb-backhoes": "حفارات JCB",
  bobcats: "بوبكات",
  "scissor-lifts": "سيزر لفت",
  "man-lifts": "مانلفت",
  "tower-lights": "تاور لايت",
  telehandlers: "تليهاندلر",
  other: "أخرى",
};
const DURATION_AR: Record<string, string> = {
  daily: "يومي",
  weekly: "أسبوعي",
  monthly: "شهري",
  unspecified: "غير محدد",
};

export function QuotesTable({ rows }: { rows: QuoteRow[] }) {
  const [filter, setFilter] = useState<string>("all");
  const filtered = rows.filter((r) => filter === "all" || r.status === filter);

  const counts = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      {/* فلترة بالحالة */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          الكل <Num n={rows.length} />
        </FilterChip>
        {STATUS_ORDER.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS[s].label} <Num n={counts[s]} />
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-navy-20/50 bg-white p-10 text-center text-gray">
          لا توجد طلبات في هذه الحالة.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((row) => (
            <QuoteCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuoteCard({ row }: { row: QuoteRow }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(row.notes ?? "");
  const [pending, startTransition] = useTransition();

  const changeStatus = (status: string) =>
    startTransition(() => {
      updateQuoteStatus(row.id, status);
    });

  const persistNotes = () =>
    startTransition(() => {
      saveQuoteNotes(row.id, notes);
    });

  const waMsg = `مرحباً ${row.name}، بخصوص طلبكم لتأجير ${CATEGORY_AR[row.category] ?? row.category} من روافد سبأ`;

  return (
    <article
      className={cn(
        "rounded-xl border bg-white transition-colors",
        row.status === "new" ? "border-gold/50" : "border-navy-20/50"
      )}
    >
      <div className="flex flex-wrap items-center gap-3 p-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-start"
        >
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-gray transition-transform", open && "rotate-180")}
          />
          <span className="min-w-0">
            <span className="block truncate font-heading font-bold text-navy">
              {row.name}
            </span>
            <span className="block truncate text-sm text-gray">
              {CATEGORY_AR[row.category] ?? row.category}
              {row.company ? ` · ${row.company}` : ""} · {row.city}
            </span>
          </span>
        </button>

        <span className={cn("rounded-full px-3 py-1 text-xs font-medium", STATUS[row.status]?.cls)}>
          {STATUS[row.status]?.label ?? row.status}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${row.phone}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-gold transition-colors hover:bg-navy-deep"
            aria-label="اتصال"
          >
            <Phone size={16} />
          </a>
          <a
            href={whatsappLink(waMsg).replace("wa.me/966538131822", `wa.me/${normalizePhone(row.phone)}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1faa53] text-white transition-colors hover:bg-[#178f45]"
            aria-label="واتساب"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>

      {open ? (
        <div className="border-t border-navy-20/40 p-4">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="الجوال" value={row.phone} ltr />
            <Row label="المدة" value={DURATION_AR[row.duration] ?? row.duration} />
            <Row label="المدينة" value={row.city} />
            <Row label="التاريخ" value={new Date(row.createdAt).toLocaleString("ar-SA")} />
            {row.details ? (
              <div className="sm:col-span-2">
                <Row label="التفاصيل" value={row.details} />
              </div>
            ) : null}
          </dl>

          {/* تغيير الحالة */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray">تغيير الحالة:</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  disabled={pending || row.status === s}
                  onClick={() => changeStatus(s)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-default",
                    row.status === s
                      ? STATUS[s].cls + " border-transparent"
                      : "border-navy-20 bg-white text-navy-80 hover:border-gold"
                  )}
                >
                  {STATUS[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* ملاحظات داخلية */}
          <div className="mt-4">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray">
              <StickyNote size={13} /> ملاحظات داخلية
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={persistNotes}
              rows={2}
              placeholder="أضف ملاحظة عن هذا الطلب…"
              className="w-full resize-y rounded-lg border border-navy-20 bg-cream/40 px-3 py-2 text-sm text-navy outline-none focus:border-gold"
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

function normalizePhone(phone: string) {
  const clean = phone.replace(/[\s-]/g, "");
  if (clean.startsWith("+966")) return clean.slice(1);
  if (clean.startsWith("966")) return clean;
  if (clean.startsWith("0")) return "966" + clean.slice(1);
  if (clean.startsWith("5")) return "966" + clean;
  return clean;
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-gray">{label}:</dt>
      <dd dir={ltr ? "ltr" : undefined} className={cn("text-navy", ltr && "latin-nums")}>
        {value}
      </dd>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-navy bg-navy text-white" : "border-navy-20 bg-white text-navy-80 hover:border-gold"
      )}
    >
      {children}
    </button>
  );
}

function Num({ n }: { n: number }) {
  return (
    <span className="latin-nums rounded-full bg-black/10 px-1.5 text-[0.7rem]">{n}</span>
  );
}
