"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const vocabularySchema = z.object({
  arabic: z.string().trim().min(1),
  transliteration: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
  categoryId: z.string().uuid(),
  partOfSpeech: z.string().optional(),
  level: z.enum(["Pemula", "Menengah", "Lanjutan"]),
  exampleArabic: z.string().optional(),
  exampleMeaning: z.string().optional(),
  audioUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

async function requireAdmin() {
  const { supabase, user, profile } = await getCurrentUser();
  if (!supabase || !user) redirect("/masuk?error=login-required");
  if (profile?.role !== "admin") redirect("/dashboard?error=admin-only");
  return supabase;
}

export async function saveVocabularyAction(formData: FormData) {
  const supabase = await requireAdmin();
  const parsed = vocabularySchema.safeParse({
    arabic: formData.get("arabic"),
    transliteration: formData.get("transliteration"),
    meaning: formData.get("meaning"),
    categoryId: formData.get("categoryId"),
    partOfSpeech: formData.get("partOfSpeech") ?? "",
    level: formData.get("level"),
    exampleArabic: formData.get("exampleArabic") ?? "",
    exampleMeaning: formData.get("exampleMeaning") ?? "",
    audioUrl: formData.get("audioUrl") ?? "",
  });
  if (!parsed.success) redirect("/admin?error=validation");
  const id = String(formData.get("id") ?? "").trim();
  const payload = {
    ...parsed.data,
    category_id: parsed.data.categoryId,
    part_of_speech: parsed.data.partOfSpeech || null,
    example_arabic: parsed.data.exampleArabic || null,
    example_meaning: parsed.data.exampleMeaning || null,
    audio_url: parsed.data.audioUrl || null,
    slug: slugify(parsed.data.transliteration),
    is_published: true,
    updated_at: new Date().toISOString(),
  } as Record<string, unknown>;
  delete payload.categoryId;
  delete payload.partOfSpeech;
  delete payload.exampleArabic;
  delete payload.exampleMeaning;
  delete payload.audioUrl;
  const result = id
    ? await supabase.from("vocabularies").update(payload).eq("id", id)
    : await supabase.from("vocabularies").insert(payload);
  if (result.error) redirect(`/admin?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath("/admin"); revalidatePath("/mufrodat"); revalidatePath("/");
  redirect("/admin?saved=1");
}

export async function deleteVocabularyAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin?error=missing-id");
  const { error } = await supabase.from("vocabularies").delete().eq("id", id);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/mufrodat");
  redirect("/admin?deleted=1");
}

export async function saveCategoryAction(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (name.length < 2) redirect("/admin?error=category");
  const { error } = await supabase.from("categories").insert({ name, slug: slugify(name), description, icon: "BookOpen" });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/mufrodat");
  redirect("/admin?categorySaved=1");
}

export async function saveQuestionAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const questionText = String(formData.get("questionText") ?? "").trim();
  const options = String(formData.get("options") ?? "").split("\n").map((item) => item.trim()).filter(Boolean);
  const correctAnswer = String(formData.get("correctAnswer") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const vocabularyId = String(formData.get("vocabularyId") ?? "").trim() || null;
  if (questionText.length < 5 || options.length < 2 || !options.includes(correctAnswer)) redirect("/admin?error=question-validation");
  const payload = { question_text: questionText, options, correct_answer: correctAnswer, explanation: explanation || null, vocabulary_id: vocabularyId, is_published: true };
  const result = id
    ? await supabase.from("quiz_questions").update(payload).eq("id", id)
    : await supabase.from("quiz_questions").insert(payload);
  if (result.error) redirect(`/admin?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath("/admin"); revalidatePath("/latihan");
  redirect("/admin?questionSaved=1");
}

export async function deleteQuestionAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin?error=missing-question-id");
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/latihan");
  redirect("/admin?questionDeleted=1");
}
