import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Masuk" };
const messages: Record<string, string> = {
  supabase: "Supabase belum dikonfigurasi. Isi variabel NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY terlebih dahulu.",
  "login-required": "Silakan masuk untuk melanjutkan.",
};
export default async function MasukPage({ searchParams }: { searchParams: Promise<{ error?: string; registered?: string }> }) {
  const params = await searchParams;
  const error = params.error ? (messages[params.error] ?? decodeURIComponent(params.error)) : undefined;
  const notice = params.registered ? "Akun berhasil dibuat. Jika konfirmasi email aktif, silakan cek email sebelum masuk." : undefined;
  return <div className="auth-page"><div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" /><AuthForm mode="signin" error={error} notice={notice} /></div>;
}
