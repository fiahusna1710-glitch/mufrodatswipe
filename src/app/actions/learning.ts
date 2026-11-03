"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function markVocabularyLearned(vocabularyId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Hubungkan Supabase untuk menyimpan progres." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Silakan masuk terlebih dahulu." };
  const { error } = await supabase.from("user_progress").upsert({
    user_id: user.id,
    vocabulary_id: vocabularyId,
    status: "known",
    times_seen: 1,
    last_reviewed: new Date().toISOString(),
  }, { onConflict: "user_id,vocabulary_id" });
  return { ok: !error, message: error?.message };
}

export async function gradeQuizAttempt(input: { answers: Array<{ questionId: string; answer: string }> }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { saved: false, score: null as number | null, total: input.answers.length, details: [] as any[] };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false, score: null as number | null, total: input.answers.length, details: [] as any[] };
  const { data, error } = await supabase.rpc("grade_quiz_attempt", { p_answers: input.answers });
  if (error || !data) return { saved: false, score: null as number | null, total: input.answers.length, details: [] as any[] };
  return { saved: true, score: Number(data.score ?? 0), total: Number(data.total ?? input.answers.length), details: Array.isArray(data.details) ? data.details : [] };
}

export async function toggleFavoriteAction(vocabularyId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, isFavorite: false };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, isFavorite: false };
  const { data: existing } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("vocabulary_id", vocabularyId).maybeSingle();
  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    return { ok: !error, isFavorite: false };
  }
  const { error } = await supabase.from("favorites").insert({ user_id: user.id, vocabulary_id: vocabularyId });
  return { ok: !error, isFavorite: !error };
}
