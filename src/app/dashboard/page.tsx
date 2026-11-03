import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, CheckCircle2, ClipboardList, Heart, Settings2, Sparkles, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";

function HeartIcon() { return <Heart size={19} />; }

export default async function DashboardPage() {
  const { supabase, user, profile } = await getCurrentUser();
  if (!supabase) return <div className="page-shell container"><div className="notice-panel"><span className="eyebrow">DASHBOARD PENGGUNA</span><h1>Progres belajarmu dimulai di sini.</h1><p>Hubungkan project dengan Supabase untuk mengaktifkan akun, menyimpan kosakata yang dipelajari, dan merekam hasil latihan.</p><Link href="/daftar" className="btn btn-primary">Buat akun</Link></div></div>;
  if (!user) return <div className="page-shell container"><div className="notice-panel"><span className="eyebrow">RUANG BELAJAR</span><h1>Masuk untuk melihat progresmu.</h1><p>Progres, riwayat latihan, dan kosakata yang telah dipelajari akan tersimpan di akunmu.</p><Link href="/masuk" className="btn btn-primary">Masuk sekarang</Link></div></div>;

  const [progressResult, attemptsResult, favoritesResult] = await Promise.all([
    supabase.from("user_progress").select("id,status,vocabulary_id,last_reviewed").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("id,score,total_questions,correct_answers,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("favorites").select("id").eq("user_id", user.id),
  ]);
  const progress = progressResult.data ?? [];
  const attempts = attemptsResult.data ?? [];
  const favorites = favoritesResult.data ?? [];
  const average = attempts.length ? Math.round(attempts.reduce((sum: number, item: any) => sum + Number(item.score), 0) / attempts.length) : 0;
  return <div className="page-shell container dashboard-page">
    <div className="dashboard-welcome"><div><span className="eyebrow">AREA BELAJAR PRIBADI</span><h1>Assalamu'alaikum, {profile?.full_name?.split(" ")[0] ?? "Sahabat"}!</h1><p>Setiap kata yang kamu pelajari adalah langkah kecil menuju kefasihan.</p></div><form action={signOutAction}><button className="btn btn-outline" type="submit">Keluar</button></form></div>
    <div className="dashboard-stats"><div className="dashboard-stat"><span className="stat-icon"><BookOpen size={19} /></span><strong>{progress.length}</strong><small>Kosakata dipelajari</small></div><div className="dashboard-stat"><span className="stat-icon stat-icon-gold"><ClipboardList size={19} /></span><strong>{attempts.length}</strong><small>Latihan dikerjakan</small></div><div className="dashboard-stat"><span className="stat-icon stat-icon-blue"><Trophy size={19} /></span><strong>{average}%</strong><small>Rata-rata nilai</small></div><div className="dashboard-stat"><span className="stat-icon stat-icon-gold"><HeartIcon /></span><strong>{favorites.length}</strong><small>Kosakata favorit</small></div></div>
    <div className="dashboard-columns"><section className="dashboard-panel"><div className="section-heading"><div><span className="eyebrow">AKTIVITAS TERBARU</span><h2>Riwayat latihan</h2></div><Link href="/latihan" className="text-link">Latihan lagi</Link></div>{attempts.length ? <div className="activity-list">{attempts.map((attempt: any) => <div className="activity-item" key={attempt.id}><span className="activity-icon"><CheckCircle2 size={18} /></span><div><strong>Latihan mufrodat</strong><small>{new Date(attempt.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} · {attempt.correct_answers}/{attempt.total_questions} benar</small></div><b>{attempt.score}%</b></div>)}</div> : <div className="empty-inline"><p>Belum ada latihan yang tersimpan.</p><Link href="/latihan" className="text-link">Mulai latihan pertama <Sparkles size={15} /></Link></div>}</section>
      <aside className="dashboard-panel"><span className="eyebrow">LANJUTKAN BELAJAR</span><h2>Jadikan belajar kebiasaan.</h2><p className="muted">Luangkan beberapa menit setiap hari untuk membaca, mendengar, dan menggunakan kosakata baru.</p><Link href="/mufrodat" className="btn btn-primary btn-full">Buka kamus <BookOpen size={17} /></Link>{profile?.role === "admin" && <Link href="/admin" className="admin-shortcut"><Settings2 size={16} /> Buka dashboard admin</Link>}</aside></div>
  </div>;
}
