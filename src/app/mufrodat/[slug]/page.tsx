import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Headphones, Volume2 } from "lucide-react";
import { notFound } from "next/navigation";
import { getVocabulary, getVocabularyBySlug } from "@/lib/data";
import { MarkLearnedButton } from "@/components/mark-learned-button";
import { FavoriteButton } from "@/components/favorite-button";
import { getCurrentUser } from "@/lib/auth";
import { VocabularyCard } from "@/components/vocabulary-card";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getVocabularyBySlug(slug);
  return { title: item ? `${item.arabic} — ${item.meaning}` : "Kosakata tidak ditemukan" };
}

export default async function VocabularyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getVocabularyBySlug(slug);
  if (!item) notFound();
  const all = await getVocabulary();
  const related = all.filter((word) => word.category.slug === item.category.slug && word.id !== item.id).slice(0, 3);
  const { supabase, user } = await getCurrentUser();
  let initialFavorite = false;
  if (supabase && user && !item.id.startsWith("demo-")) {
    const { data } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("vocabulary_id", item.id).maybeSingle();
    initialFavorite = Boolean(data);
  }
  return <div className="page-shell container detail-page">
    <Link href="/mufrodat" className="back-link"><ArrowLeft size={16} /> Kembali ke kamus</Link>
    <div className="detail-grid">
      <section className="detail-main">
        <div className="detail-topline"><span className="tag">{item.category.name}</span><span className="level-label">Level {item.level ?? "Pemula"}</span></div>
        <div className="detail-word" dir="rtl" lang="ar">{item.arabic}</div>
        <div className="detail-translit">{item.transliteration}</div>
        <h1>{item.meaning}</h1>
        <p className="detail-subtitle">{item.partOfSpeech ?? "Kosakata bahasa Arab"}</p>
        {item.audioUrl ? <div className="audio-panel"><span className="audio-icon"><Headphones size={19} /></span><div><strong>Dengarkan pelafalan</strong><small>Putar audio untuk mendengar pengucapan.</small></div><audio controls preload="none" src={item.audioUrl}>Browser tidak mendukung audio.</audio></div> : <div className="audio-placeholder"><Volume2 size={19} /><span>Audio pelafalan belum ditambahkan untuk kosakata ini.</span></div>}
        <div className="example-panel"><span className="eyebrow">CONTOH PENGGUNAAN</span><p className="example-arabic" dir="rtl" lang="ar">{item.exampleArabic ?? "—"}</p><p className="example-meaning">{item.exampleMeaning ?? "Contoh kalimat belum tersedia."}</p></div>
        {item.imageUrl && <img src={item.imageUrl} alt={item.meaning} className="detail-image" />}
        <div className="detail-actions">{user && !item.id.startsWith("demo-") ? <><MarkLearnedButton vocabularyId={item.id} /><FavoriteButton vocabularyId={item.id} initialFavorite={initialFavorite} /></> : <Link href="/masuk" className="btn btn-outline">Masuk untuk menyimpan progres</Link>}</div>
      </section>
      <aside className="detail-aside"><div className="aside-card"><span className="eyebrow">TIPS BELAJAR</span><h3>Gunakan dalam kalimat</h3><p>Jangan hanya menghafal arti. Ucapkan kosakata, baca contoh kalimat, lalu coba buat kalimatmu sendiri.</p><div className="aside-arabic" dir="rtl">اِقْرَأْ وَاكْتُبْ وَتَعَلَّمْ</div></div><div className="aside-card aside-card-soft"><BookOpen size={21} /><h3>Ingat kembali</h3><p>Ulangi kosakata setelah beberapa jam dan gunakan dalam latihan agar lebih melekat di ingatan.</p><Link href="/latihan" className="text-link">Ke latihan <ArrowLeft size={15} /></Link></div></aside>
    </div>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">LANJUTKAN BELAJAR</span><h2>Kosakata terkait</h2></div><Link href="/mufrodat" className="text-link">Lihat semua</Link></div><div className="vocab-grid">{related.map((word) => <VocabularyCard key={word.id} item={word} compact />)}</div></section>}
  </div>;
}
