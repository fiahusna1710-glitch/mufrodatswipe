import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Daftar" };
export default async function DaftarPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params.error ? (params.error === "supabase" ? "Supabase belum dikonfigurasi. Isi variabel environment terlebih dahulu." : decodeURIComponent(params.error)) : undefined;
  return <div className="auth-page"><div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" /><AuthForm mode="signup" error={error} /></div>;
}
