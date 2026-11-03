import type { Metadata } from "next";
import { BookOpenCheck } from "lucide-react";
import { getCategories, getVocabulary } from "@/lib/data";
import { VocabularyExplorer } from "@/components/vocabulary-explorer";

export const metadata: Metadata = { title: "Kamus Mufrodat", description: "Cari dan pelajari kosakata bahasa Arab lengkap dengan harakat, transliterasi, arti, dan contoh." };

export default async function MufrodatPage({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const params = await searchParams;
  const [vocabulary, categories] = await Promise.all([getVocabulary(), getCategories()]);
  return <div className="page-shell container">
    <div className="page-intro"><span className="eyebrow"><BookOpenCheck size={15} /> KAMUS DIGITAL</span><h1>Jelajahi dunia <em>mufrodat.</em></h1><p>Temukan kosakata bahasa Arab, pahami maknanya, dan lihat bagaimana kata digunakan dalam kalimat.</p><div className="intro-arabic" dir="rtl">مُفْرَدَاتٌ جَدِيدَةٌ، مَعْرِفَةٌ جَدِيدَةٌ</div></div>
    <VocabularyExplorer vocabulary={vocabulary} categories={categories} initialCategory={params.kategori ?? "semua"} />
  </div>;
}
