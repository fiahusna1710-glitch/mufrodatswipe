import Link from "next/link";
import { BookOpen, GraduationCap, LayoutDashboard, LogIn, Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand" aria-label="Mufrodat Academy beranda">
          <span className="brand-mark">م</span>
          <span><strong>Mufrodat</strong><small>ACADEMY</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          <Link href="/mufrodat"><BookOpen size={16} /> Kamus</Link>
          <Link href="/latihan"><Sparkles size={16} /> Latihan</Link>
          <Link href="/dashboard"><LayoutDashboard size={16} /> Progres</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/masuk" className="btn btn-outline btn-small"><LogIn size={16} /> Masuk</Link>
          <Link href="/daftar" className="btn btn-primary btn-small"><GraduationCap size={16} /> Mulai belajar</Link>
        </div>
      </div>
    </header>
  );
}
