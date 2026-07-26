"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { destroySession, getSession } from "@/lib/auth";

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export async function updateQuoteStatus(id: string, status: string) {
  if (!(await getSession())) redirect("/admin/login");
  if (!QUOTE_STATUSES.includes(status)) return;
  await db.quoteRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
}

export async function saveQuoteNotes(id: string, notes: string) {
  if (!(await getSession())) redirect("/admin/login");
  await db.quoteRequest.update({ where: { id }, data: { notes: notes || null } });
  revalidatePath("/admin/quotes");
}
