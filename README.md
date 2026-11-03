# Mufrodat Academy

Platform pembelajaran kosakata bahasa Arab dengan Next.js App Router, TypeScript, Tailwind CSS, Supabase/PostgreSQL, dan deployment Vercel.

## Fitur awal

- Beranda pembelajaran dan ringkasan materi.
- Kamus mufrodat dengan pencarian dan filter kategori.
- Detail kosakata: tulisan Arab berharakat, transliterasi, arti, contoh kalimat, dan audio.
- Latihan pilihan ganda dengan penilaian server-side agar kunci jawaban database tidak dikirim ke browser; pengunjung dapat mencoba soal demo.
- Registrasi, login, dan logout menggunakan Supabase Auth.
- Dashboard pengguna untuk progres belajar dan hasil kuis.
- Dashboard admin untuk menambah, mengubah, dan menghapus kosakata, kategori, serta soal latihan.
- Favorit kosakata dan progres belajar per akun.
- Data demo lokal agar antarmuka dapat dicoba sebelum Supabase dikonfigurasi.

## Persyaratan

- Node.js 20.9 atau lebih baru.
- npm 10+ direkomendasikan.
- Akun GitHub, Vercel, dan Supabase untuk deployment full-stack.

## 1. Jalankan secara lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka http://localhost:3000.

Jika Supabase belum dikonfigurasi, halaman kamus dan latihan memakai data demo. Login, penyimpanan progres, dan dashboard admin membutuhkan Supabase.

## 2. Siapkan Supabase

1. Buat project baru di https://supabase.com.
2. Buka SQL Editor.
3. Jalankan seluruh isi `supabase/schema.sql`.
4. Jalankan `supabase/seed.sql` untuk memasukkan kategori dan kosakata contoh.
5. Salin Project URL dan Publishable key dari Project Settings > API.
6. Masukkan nilainya ke `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jangan pernah menaruh `service_role` key di variabel `NEXT_PUBLIC_*` atau mengunggahnya ke GitHub.

## 3. Buat akun admin

1. Daftarkan akun melalui halaman `/daftar`.
2. Pastikan akun sudah muncul di tabel `profiles` (jika konfirmasi email aktif, konfirmasi email terlebih dahulu).
3. Dari Supabase SQL Editor, ubah role akun tersebut:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin-anda@example.com';
```

4. Login kembali dan buka `/admin`.

Jangan memberi role admin kepada akun publik secara otomatis. Role admin hanya diubah melalui dashboard/database oleh pemilik project.

## 4. Upload ke GitHub

Buat repository kosong, lalu dari folder project:

```bash
git init
git add .
git commit -m "Initial Mufrodat Academy full-stack app"
git branch -M main
git remote add origin https://github.com/USERNAME/mufrodat-academy.git
git push -u origin main
```

Pastikan `.env.local` tidak ikut ter-commit. File tersebut sudah masuk `.gitignore`.

## 5. Deploy ke Vercel

1. Masuk ke https://vercel.com dan pilih **Add New > Project**.
2. Import repository GitHub `mufrodat-academy`.
3. Framework preset akan terdeteksi sebagai Next.js.
4. Tambahkan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `NEXT_PUBLIC_SITE_URL` pada Project Settings > Environment Variables.
5. Deploy.
6. Di Supabase > Authentication > URL Configuration, tambahkan URL domain Vercel ke Site URL / Redirect URLs. Contoh: `https://nama-aplikasi.vercel.app/**` dan `http://localhost:3000/**`.

Setiap push ke branch produksi akan memicu deployment baru. Preview deployment dapat digunakan untuk branch lain.

## Struktur folder

```text
src/
  app/                 # halaman, route handler, dan server actions
  components/          # komponen UI
  data/                # data demo
  lib/                 # Supabase client, akses data, dan helper
  types/               # tipe data TypeScript
supabase/
  schema.sql           # tabel, trigger, dan kebijakan RLS
  seed.sql             # data awal
```

## Catatan keamanan dan pengembangan

- Row Level Security (RLS) diaktifkan pada tabel yang berisi data pengguna.
- Kunci service role tidak diperlukan oleh frontend dan tidak boleh diekspos.
- Data demo hanya fallback untuk tampilan; data produksi disimpan di Supabase.
- Admin ditentukan oleh `profiles.role`, dan setiap server action admin memeriksa role tersebut.
- Kunci jawaban kuis disembunyikan dari view publik dan penilaian database dilakukan melalui RPC server-side.
- Sebelum digunakan secara luas, tambahkan verifikasi email, reset password, validasi konten audio/gambar, rate limiting, dan pengujian akses RLS.
