import { db } from "@/lib/db";
import { QuotesTable, type QuoteRow } from "./QuotesTable";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await db.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: QuoteRow[] = quotes.map((q) => ({
    id: q.id,
    name: q.name,
    phone: q.phone,
    company: q.company,
    category: q.category,
    duration: q.duration,
    city: q.city,
    details: q.details,
    status: q.status,
    notes: q.notes,
    createdAt: q.createdAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">الطلبات الواردة</h1>
        <p className="mt-1 text-gray">
          إجمالي <span className="latin-nums">{rows.length}</span> طلب — أدِر حالة كل
          طلب وتواصل مع العميل مباشرة.
        </p>
      </header>

      <QuotesTable rows={rows} />
    </div>
  );
}
