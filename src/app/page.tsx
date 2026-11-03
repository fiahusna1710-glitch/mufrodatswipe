import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Headphones, Layers3, Sparkles, Target, Trophy } from "lucide-react";
import { getCategories, getVocabulary } from "@/lib/data";
import { VocabularyCard } from "@/components/vocabulary-card";
import { SectionHeading } from "@/components/section-heading";

export default async function HomePage() {
  const [categories, vocabulary] = await Promise.all([getCategories(), getVocabulary()]);
  const featured = vocabulary.slice(0, 3);
  const daily = vocabulary[0];
  return <>
    <section className="hero-section">
      <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-kicker"><Sparkles size={15} /> منصة تعلُّم المفردات العربية · Platform belajar mufrodat</span>
          <h1>Perkaya kosakata Arabmu,<br /><em>satu kata setiap hari.</em></h1>
          <p>Belajar bahasa Arab jadi lebih terarah melalui kamus berharakat, pelafalan, contoh kalimat, dan latihan interaktif.</p>
          <div className="hero-actions"><Link href="/mufrodat" className="btn btn-primary btn-large">Jelajahi mufrodat <ArrowRight size={18} /></Link><Link href="/latihan" className="btn btn-glass btn-large">Coba latihan <Brain size={18} /></Link></div>
          <div className="hero-proof"><div className="avatar-stack"><span>ع</span><span>ب</span><span>م</span></div><span>Mulai dari dasar, berkembang dengan percaya diri.</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-card-main"><div className="card-overline"><span className="live-dot" /> KATA HARI INI</div><div className="hero-arabic" dir="rtl" lang="ar">{daily?.arabic ?? "كِتَابٌ"}</div><div className="hero-translit">{daily?.transliteration ?? "kitābun"}</div><h2>{daily?.meaning ?? "Buku"}</h2><div className="hero-divider" /><div className="hero-example" dir="rtl" lang="ar">{daily?.exampleArabic ?? "هَذَا كِتَابٌ جَدِيدٌ"}</div><p>{daily?.exampleMeaning ?? "Ini adalah buku baru."}</p><Link href={daily ? `/mufrodat/${daily.slug}` : "/mufrodat"} className="text-link">Pelajari kata ini <ArrowRight size={15} /></Link></div>
          <div className="floating-note note-top"><span className="note-icon"><Headphones size={18} /></span><span><strong>Dengarkan</strong><small>Latih pelafalanmu</small></span></div>
          <div className="floating-note note-bottom"><span className="note-icon note-gold"><Trophy size={18} /></span><span><strong>Terus berkembang</strong><small>Belajar sedikit demi sedikit</small></span></div>
          <div className="hero-decoration">ا ب ت ث ج ح خ</div>
        </div>
      </div>
      <div className="hero-bottom container"><span>BAHASA ARAB UNTUK SEMUA</span><span className="hero-bottom-line" /><span>مِنَ الْبِدَايَةِ إِلَى الْإِتْقَانِ</span></div>
    </section>

    <section className="stats-strip container"><div><strong>{vocabulary.length}+</strong><span>Kosakata contoh</span></div><div><strong>{categories.length}</strong><span>Kategori belajar</span></div><div><strong>3</strong><span>Level pembelajaran</span></div><div><strong>24/7</strong><span>Akses belajar</span></div></section>

    <section className="section container"><SectionHeading eyebrow="MULAI DARI MINATMU" title="Pilih kategori belajar" description="Kelompokkan kosakata berdasarkan tema agar lebih mudah diingat." action={<Link href="/mufrodat" className="text-link">Semua kategori <ArrowRight size={16} /></Link>} /><div className="category-grid">{categories.map((item, index) => { const icons = [BookOpen, Layers3, Headphones, Target, Brain, Sparkles]; const Icon = icons[index % icons.length]; return <Link href={`/mufrodat?kategori=${item.slug}`} className="category-card" key={item.id}><span className={`category-icon tone-${index % 4}`}><Icon size={21} /></span><strong>{item.name}</strong><p>{item.description}</p><span className="category-arrow"><ArrowRight size={16} /></span></Link>; })}</div></section>

    <section className="section section-tinted"><div className="container"><SectionHeading eyebrow="KOSAKATA PILIHAN" title="Mulai dengan kata sederhana" description="Pelajari kosakata dasar yang sering muncul dalam percakapan sehari-hari." action={<Link href="/mufrodat" className="text-link">Lihat kamus <ArrowRight size={16} /></Link>} /><div className="vocab-grid">{featured.map((item) => <VocabularyCard key={item.id} item={item} />)}</div></div></section>

    <section className="section container"><div className="learning-banner"><div className="banner-copy"><span className="eyebrow eyebrow-light">BELAJAR LEBIH TERARAH</span><h2>Ubah hafalan menjadi kebiasaan.</h2><p>Latihan singkat membantu kamu mengingat arti kata dan mengenali kosakata dalam konteks kalimat.</p><Link href="/latihan" className="btn btn-light">Mulai latihan <ArrowRight size={17} /></Link></div><div className="banner-visual"><div className="banner-orbit orbit-a" /><div className="banner-orbit orbit-b" /><div className="banner-word" dir="rtl">عِلْمٌ</div><span className="banner-chip chip-a">+1 kata</span><span className="banner-chip chip-b">مُمْتَازٌ</span></div></div></section>
  </>;
}
