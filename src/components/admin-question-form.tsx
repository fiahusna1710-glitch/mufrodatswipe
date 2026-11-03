import { saveQuestionAction } from "@/app/actions/admin";
import type { Vocabulary } from "@/types";

type AdminQuestion = { id?: string; question_text?: string; options?: string[]; correct_answer?: string; explanation?: string | null; vocabulary_id?: string | null };

export function AdminQuestionForm({ vocabulary, question }: { vocabulary: Vocabulary[]; question?: AdminQuestion }) {
  return <form action={saveQuestionAction} className="admin-form-grid">
    {question?.id && <input type="hidden" name="id" value={question.id} />}
    <label className="span-2">Pertanyaan<input name="questionText" defaultValue={question?.question_text} placeholder="Apa arti dari كِتَابٌ؟" required minLength={5} /></label>
    <label className="span-2">Pilihan jawaban (satu pilihan per baris)<textarea name="options" rows={4} defaultValue={question?.options?.join("\n") ?? ""} placeholder={"Buku\nPulpen\nKursi\nSekolah"} required /></label>
    <label>Jawaban benar<input name="correctAnswer" defaultValue={question?.correct_answer} placeholder="Buku" required /></label>
    <label>Kosakata terkait (opsional)<select name="vocabularyId" defaultValue={question?.vocabulary_id ?? ""}><option value="">Tidak terkait</option>{vocabulary.filter((item) => !item.id.startsWith("demo-")).map((item) => <option key={item.id} value={item.id}>{item.arabic} — {item.meaning}</option>)}</select></label>
    <label className="span-2">Pembahasan singkat<input name="explanation" defaultValue={question?.explanation ?? ""} placeholder="Jelaskan mengapa jawaban tersebut benar." /></label>
    <div className="span-2 form-actions"><button className="btn btn-primary" type="submit">{question ? "Simpan soal" : "Tambah soal"}</button></div>
  </form>;
}
