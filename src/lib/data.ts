import { demoCategories, demoQuiz, demoVocabulary } from "@/data/demo-vocabulary";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, QuizQuestion, Vocabulary } from "@/types";

function mapCategory(row: any): Category {
  return {
    id: String(row?.id ?? "unknown"),
    name: row?.name ?? "Tanpa kategori",
    slug: row?.slug ?? "tanpa-kategori",
    description: row?.description ?? null,
    icon: row?.icon ?? null,
  };
}

function mapVocabulary(row: any): Vocabulary {
  const relation = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: String(row.id),
    slug: row.slug,
    arabic: row.arabic,
    transliteration: row.transliteration,
    meaning: row.meaning,
    partOfSpeech: row.part_of_speech ?? null,
    exampleArabic: row.example_arabic ?? null,
    exampleMeaning: row.example_meaning ?? null,
    audioUrl: row.audio_url ?? null,
    imageUrl: row.image_url ?? null,
    level: row.level ?? "Pemula",
    category: relation ? mapCategory(relation) : demoCategories[0],
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoCategories;
  const { data, error } = await supabase.from("categories").select("id,name,slug,description,icon").order("name");
  if (error || !data?.length) return demoCategories;
  return data.map(mapCategory);
}

export async function getVocabulary(): Promise<Vocabulary[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoVocabulary;
  const { data, error } = await supabase
    .from("vocabularies")
    .select("*, categories(id,name,slug,description,icon)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error || !data?.length) return demoVocabulary;
  return data.map(mapVocabulary);
}

export async function getVocabularyBySlug(slug: string): Promise<Vocabulary | null> {
  const all = await getVocabulary();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return demoQuiz;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return demoQuiz;
  const { data, error } = await supabase
    .from("quiz_questions_public")
    .select("id,question_text,options,vocabulary_id")
    .limit(10);
  if (error || !data?.length) return demoQuiz;
  return data.map((row: any) => ({
    id: String(row.id),
    question: row.question_text,
    options: Array.isArray(row.options) ? row.options : [],
    vocabularyId: row.vocabulary_id,
  }));
}
