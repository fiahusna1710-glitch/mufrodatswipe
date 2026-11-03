import Link from "next/link";
import { ArrowUpRight, Volume2 } from "lucide-react";
import type { Vocabulary } from "@/types";

export function VocabularyCard({ item, compact = false }: { item: Vocabulary; compact?: boolean }) {
  return (
    <article className={`vocab-card ${compact ? "vocab-card-compact" : ""}`}>
      <div className="vocab-card-top"><span className="tag">{item.category.name}</span><span className="level-label">{item.level ?? "Pemula"}</span></div>
      <Link href={`/mufrodat/${item.slug}`} className="vocab-arabic" dir="rtl" lang="ar">{item.arabic}</Link>
      <div className="vocab-translit">{item.transliteration}</div>
      <h3>{item.meaning}</h3>
      {!compact && item.exampleArabic && <p className="vocab-example" dir="rtl" lang="ar">{item.exampleArabic}</p>}
      <div className="vocab-card-bottom">
        <span>{item.partOfSpeech ?? "Kosakata"}</span>
        <Link href={`/mufrodat/${item.slug}`} className="icon-link" aria-label={`Pelajari ${item.meaning}`}><ArrowUpRight size={17} /></Link>
      </div>
    </article>
  );
}
