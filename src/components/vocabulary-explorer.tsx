"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Vocabulary } from "@/types";
import { VocabularyCard } from "@/components/vocabulary-card";

export function VocabularyExplorer({ vocabulary, categories, initialCategory = "semua" }: { vocabulary: Vocabulary[]; categories: Category[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState("semua");
  const filtered = useMemo(() => vocabulary.filter((item) => {
    const term = query.toLocaleLowerCase("id");
    const matchesQuery = !term || [item.arabic, item.transliteration, item.meaning, item.exampleArabic ?? ""].some((value) => value.toLocaleLowerCase("id").includes(term));
    const matchesCategory = category === "semua" || item.category.slug === category;
    const matchesLevel = level === "semua" || (item.level ?? "Pemula").toLowerCase() === level;
    return matchesQuery && matchesCategory && matchesLevel;
  }), [vocabulary, query, category, level]);

  return (
    <div>
      <div className="filter-panel">
        <label className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kata Arab, transliterasi, atau arti..." /><button type="button" className="clear-search" onClick={() => setQuery("")} aria-label="Hapus pencarian">{query && <X size={16} />}</button></label>
        <label className="select-box"><SlidersHorizontal size={17} /><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="semua">Semua kategori</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
        <label className="select-box"><select value={level} onChange={(event) => setLevel(event.target.value)}><option value="semua">Semua level</option><option value="pemula">Pemula</option><option value="menengah">Menengah</option><option value="lanjutan">Lanjutan</option></select></label>
      </div>
      <div className="results-meta"><span><strong>{filtered.length}</strong> kosakata ditemukan</span><span>Gunakan pencarian untuk belajar lebih terarah</span></div>
      {filtered.length ? <div className="vocab-grid">{filtered.map((item) => <VocabularyCard key={item.id} item={item} />)}</div> : <div className="empty-state"><span className="empty-icon">⌕</span><h3>Kosakata belum ditemukan</h3><p>Coba kata kunci atau kategori yang berbeda.</p><button className="btn btn-outline" onClick={() => { setQuery(""); setCategory("semua"); setLevel("semua"); }}>Reset filter</button></div>}
    </div>
  );
}
