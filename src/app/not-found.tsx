import Link from "next/link";
import { SearchX } from "lucide-react";
export default function NotFound() {
  return <div className="page-shell container"><div className="empty-state"><span className="empty-icon"><SearchX size={30} /></span><h1>Halaman tidak ditemukan</h1><p>Kosakata atau halaman yang kamu cari belum tersedia.</p><Link href="/mufrodat" className="btn btn-primary">Kembali ke kamus</Link></div></div>;
}
