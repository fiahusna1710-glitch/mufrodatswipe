import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCategories, getVocabulary } from "@/lib/data";
import { AdminVocabularyForm } from "@/components/admin-vocabulary-form";
import { AdminQuestionForm } from "@/components/admin-question-form";
import { deleteQuestionAction, deleteVocabularyAction, saveCategoryAction } from "@/app/actions/admin";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; deleted?: string; categorySaved?: string; questionSaved?: string; questionDeleted?: string }> }) {
  const params = await searchParams;
  const { supabase, user, profile } = await getCurrentUser();
  if (!supabase) return <div className="page-shell container"><div className="notice-panel"><span className="eyebrow">ADMINISTRATOR</span><h1>Dashboard admin membutuhkan Supabase.</h1><p>Konfigurasikan database dan autentikasi terlebih dahulu. Jalankan schema SQL pada folder <code>supabase/</code>.</p><Link href="/" className="btn btn-outline">Kembali</Link></div></div>;
  if (!user) redirect("/masuk?error=login-required");
  if (profile?.role !== "admin") redirect("/dashboard?error=admin-only");
  const [categories, vocabulary, questionResult] = await Promise.all([
    getCategories(),
    getVocabulary(),
    supabase.from("quiz_questions").select("id,question_text,options,correct_answer,explanation,vocabulary_id").order("created_at", { ascending: false }),
  ]);
  const realVocabulary = vocabulary.filter((item) => !item.id.startsWith("demo-"));
  const questions = questionResult.data ?? [];
  return <div className="page-shell container admin-page">
    <div className="dashboard-welcome"><div><span className="eyebrow"><Settings2 size={14} /> PANEL ADMINISTRATOR</span><h1>Kelola konten belajar.</h1><p>Atur kategori dan kosakata yang tampil di Mufrodat Academy.</p></div><Link href="/" className="btn btn-outline">Lihat website</Link></div>
    {params.error && <div className="alert alert-error">{decodeURIComponent(params.error)}</div>}{params.saved && <div className="alert alert-success">Kosakata berhasil disimpan.</div>}{params.deleted && <div className="alert alert-success">Kosakata berhasil dihapus.</div>}{params.categorySaved && <div className="alert alert-success">Kategori berhasil ditambahkan.</div>}{params.questionSaved && <div className="alert alert-success">Soal latihan berhasil disimpan.</div>}{params.questionDeleted && <div className="alert alert-success">Soal latihan berhasil dihapus.</div>}
    <div className="admin-summary"><div><strong>{realVocabulary.length}</strong><span>Kosakata di database</span></div><div><strong>{categories.length}</strong><span>Kategori tersedia</span></div><div><strong>{questions.length}</strong><span>Soal latihan</span></div></div>
    <section className="admin-panel"><div className="section-heading"><div><span className="eyebrow">KONTEN BARU</span><h2><Plus size={20} /> Tambah kosakata</h2></div></div><AdminVocabularyForm categories={categories} /></section>
    <section className="admin-panel"><div className="section-heading"><div><span className="eyebrow">KAMUS</span><h2>Daftar kosakata</h2></div><span className="muted small-text">{realVocabulary.length} data database</span></div>{realVocabulary.length ? <div className="admin-word-list">{realVocabulary.map((item) => <details className="admin-word" key={item.id}><summary><span className="admin-word-arabic" dir="rtl">{item.arabic}</span><span><strong>{item.meaning}</strong><small>{item.category.name} · {item.transliteration}</small></span><span className="muted">Edit</span></summary><div className="admin-edit-area"><AdminVocabularyForm categories={categories} vocabulary={item} /><form action={deleteVocabularyAction}><input type="hidden" name="id" value={item.id} /><button className="btn btn-danger btn-small" type="submit"><Trash2 size={15} /> Hapus kosakata</button></form></div></details>)}</div> : <div className="empty-inline"><p>Belum ada kosakata di database. Jalankan seed.sql atau tambahkan kosakata baru.</p></div>}</section>
    <section className="admin-panel"><div className="section-heading"><div><span className="eyebrow">BANK SOAL</span><h2>Tambah soal latihan</h2></div></div><AdminQuestionForm vocabulary={vocabulary} /></section>
    <section className="admin-panel"><div className="section-heading"><div><span className="eyebrow">BANK SOAL</span><h2>Daftar soal latihan</h2></div><span className="muted small-text">{questions.length} soal</span></div>{questions.length ? <div className="admin-word-list">{questions.map((question: any, index: number) => <details className="admin-word" key={question.id}><summary><span className="admin-word-arabic">{String(index + 1).padStart(2, "0")}</span><span><strong>{question.question_text}</strong><small>{Array.isArray(question.options) ? question.options.length : 0} pilihan · Jawaban: {question.correct_answer}</small></span><span className="muted">Edit</span></summary><div className="admin-edit-area"><AdminQuestionForm vocabulary={vocabulary} question={question} /><form action={deleteQuestionAction}><input type="hidden" name="id" value={question.id} /><button className="btn btn-danger btn-small" type="submit"><Trash2 size={15} /> Hapus soal</button></form></div></details>)}</div> : <div className="empty-inline"><p>Belum ada soal latihan di database.</p></div>}</section>
    <section className="admin-panel"><div className="section-heading"><div><span className="eyebrow">PENGELOMPOKAN</span><h2>Tambah kategori</h2></div></div><form action={saveCategoryAction} className="category-form"><label>Nama kategori<input name="name" placeholder="Contoh: Transportasi" required minLength={2} /></label><label>Deskripsi<input name="description" placeholder="Deskripsi singkat kategori" /></label><button className="btn btn-primary" type="submit">Tambah kategori</button></form></section>
  </div>;
}
