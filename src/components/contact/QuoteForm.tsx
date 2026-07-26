"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { quoteSchema, type QuoteInput } from "@/lib/schemas/quote";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CategoryOption = { value: string; label: string };

export type QuoteFormLabels = {
  title: string;
  note: string;
  name: string;
  phone: string;
  phoneHint: string;
  company: string;
  category: string;
  categoryPlaceholder: string;
  duration: string;
  durationOptions: { daily: string; weekly: string; monthly: string; unspecified: string };
  city: string;
  details: string;
  detailsPlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorGeneric: string;
  errors: { name: string; phone: string; category: string; city: string };
};

export function QuoteForm({
  categories,
  labels,
  defaultCity,
  locale,
}: {
  categories: CategoryOption[];
  labels: QuoteFormLabels;
  defaultCity: string;
  locale: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { duration: "unspecified", city: defaultCity, website: "" },
  });

  const onSubmit = async (data: QuoteInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = await res.json();
      if (json.ok) setSubmitted(true);
      else setServerError(labels.errorGeneric);
    } catch {
      setServerError(labels.errorGeneric);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-gold/40 bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-[#1faa53]" size={48} />
        <h3 className="mb-2 font-heading text-2xl text-navy">
          {labels.successTitle}
        </h3>
        <p className="text-gray leading-relaxed">{labels.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-navy-20/60 bg-white p-6 lg:p-8"
    >
      <h3 className="font-heading text-2xl text-navy">{labels.title}</h3>
      <p className="mt-2 mb-6 text-sm text-gray">{labels.note}</p>

      {/* مصيدة السبام — مخفية عن المستخدمين */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        {...register("website")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={labels.name} required error={errors.name && labels.errors.name}>
          <input
            type="text"
            autoComplete="name"
            className={inputCls(!!errors.name)}
            {...register("name")}
          />
        </Field>

        <Field
          label={labels.phone}
          required
          error={errors.phone && labels.errors.phone}
          hint={labels.phoneHint}
        >
          <input
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            className={cn(inputCls(!!errors.phone), "text-start")}
            {...register("phone")}
          />
        </Field>

        <Field label={labels.company}>
          <input
            type="text"
            autoComplete="organization"
            className={inputCls(false)}
            {...register("company")}
          />
        </Field>

        <Field label={labels.city} required error={errors.city && labels.errors.city}>
          <input type="text" className={inputCls(!!errors.city)} {...register("city")} />
        </Field>

        <Field
          label={labels.category}
          required
          error={errors.category && labels.errors.category}
        >
          <select className={inputCls(!!errors.category)} {...register("category")} defaultValue="">
            <option value="" disabled>
              {labels.categoryPlaceholder}
            </option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={labels.duration}>
          <select className={inputCls(false)} {...register("duration")}>
            <option value="daily">{labels.durationOptions.daily}</option>
            <option value="weekly">{labels.durationOptions.weekly}</option>
            <option value="monthly">{labels.durationOptions.monthly}</option>
            <option value="unspecified">{labels.durationOptions.unspecified}</option>
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={labels.details}>
          <textarea
            rows={4}
            placeholder={labels.detailsPlaceholder}
            className={cn(inputCls(false), "resize-y")}
            {...register("details")}
          />
        </Field>
      </div>

      {serverError ? (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClasses("gold", "mt-6 w-full disabled:opacity-60")}
      >
        <Send size={18} />
        {isSubmitting ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-cream/40 px-4 py-3 text-navy outline-none transition-colors",
    "focus:border-gold focus:bg-white",
    hasError ? "border-red-400" : "border-navy-20"
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | false;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-80">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      {children}
      {hint && !error ? (
        <span className="mt-1 block text-xs text-gray latin-nums">{hint}</span>
      ) : null}
      {error ? (
        <span role="alert" className="mt-1 block text-xs text-red-500">
          {error}
        </span>
      ) : null}
    </label>
  );
}
