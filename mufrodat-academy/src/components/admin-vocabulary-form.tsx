import { saveVocabularyAction } from "@/app/actions/admin";
import type { Category, Vocabulary } from "@/types";

export function AdminVocabularyForm({ categories, vocabulary }: { categories: Category[]; vocabulary?: Vocabulary }) {
  return <form action={saveVocabularyAction} className="admin-form-grid">
    {vocabulary && <input type="hidden" name="id" value={vocabulary.id} />}
    <label>Tulisan Arab<input name="arabic" defaultValue={vocabulary?.arabic} placeholder="كِتَابٌ" dir="rtl" lang="ar" required /></label>
    <label>Transliterasi<input name="transliteration" defaultValue={vocabulary?.transliteration} placeholder="kitābun" required /></label>
    <label>Arti bahasa Indonesia<input name="meaning" defaultValue={vocabulary?.meaning} placeholder="Buku" required /></label>
    <label>Kategori<select name="categoryId" defaultValue={vocabulary?.category.id ?? categories[0]?.id} required>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label>Jenis kata<input name="partOfSpeech" defaultValue={vocabulary?.partOfSpeech ?? "Isim"} placeholder="Isim / Fi'il / Sifat" /></label>
    <label>Level<select name="level" defaultValue={vocabulary?.level ?? "Pemula"}><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select></label>
    <label className="span-2">Contoh kalimat Arab<input name="exampleArabic" defaultValue={vocabulary?.exampleArabic ?? ""} placeholder="هَذَا كِتَابٌ" dir="rtl" lang="ar" /></label>
    <label className="span-2">Terjemahan contoh<input name="exampleMeaning" defaultValue={vocabulary?.exampleMeaning ?? ""} placeholder="Ini adalah buku." /></label>
    <label className="span-2">URL audio (opsional)<input name="audioUrl" type="url" defaultValue={vocabulary?.audioUrl ?? ""} placeholder="https://.../audio.mp3" /></label>
    <div className="span-2 form-actions"><button className="btn btn-primary" type="submit">{vocabulary ? "Simpan perubahan" : "Tambah kosakata"}</button></div>
  </form>;
}
