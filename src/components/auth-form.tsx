import Link from "next/link";
import { signInAction, signUpAction } from "@/app/actions/auth";

export function AuthForm({ mode, error, notice }: { mode: "signin" | "signup"; error?: string; notice?: string }) {
  const signup = mode === "signup";
  return <div className="auth-card">
    <div className="auth-brand"><span className="brand-mark">م</span><span className="eyebrow">MU FRODAT ACADEMY</span></div>
    <h1>{signup ? "Mulai perjalanan belajarmu" : "Selamat datang kembali"}</h1>
    <p className="muted">{signup ? "Buat akun untuk menyimpan progres belajar bahasa Arab." : "Masuk untuk melanjutkan latihan dan melihat progresmu."}</p>
    {error && <div className="alert alert-error">{error}</div>}
    {notice && <div className="alert alert-success">{notice}</div>}
    <form action={signup ? signUpAction : signInAction} className="form-stack">
      {signup && <label>Nama lengkap<input name="fullName" type="text" placeholder="Nama kamu" autoComplete="name" required minLength={2} /></label>}
      <label>Email<input name="email" type="email" placeholder="nama@email.com" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" placeholder="Minimal 8 karakter" autoComplete={signup ? "new-password" : "current-password"} required minLength={8} /></label>
      <button className="btn btn-primary btn-full" type="submit">{signup ? "Buat akun" : "Masuk ke akun"}</button>
    </form>
    <p className="auth-switch">{signup ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={signup ? "/masuk" : "/daftar"}>{signup ? "Masuk" : "Daftar sekarang"}</Link></p>
    <Link href="/" className="back-home">← Kembali ke beranda</Link>
  </div>;
}
