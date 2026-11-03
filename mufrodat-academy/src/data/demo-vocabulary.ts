import type { Category, QuizQuestion, Vocabulary } from "@/types";

export const demoCategories: Category[] = [
  { id: "cat-school", name: "Sekolah", slug: "sekolah", description: "Kosakata yang sering digunakan di lingkungan sekolah.", icon: "BookOpen" },
  { id: "cat-family", name: "Keluarga", slug: "keluarga", description: "Anggota keluarga dan hubungan kekerabatan.", icon: "Users" },
  { id: "cat-food", name: "Makanan & Minuman", slug: "makanan-minuman", description: "Nama makanan, minuman, dan kegiatan makan.", icon: "Coffee" },
  { id: "cat-home", name: "Rumah", slug: "rumah", description: "Benda dan tempat di sekitar rumah.", icon: "House" },
  { id: "cat-verbs", name: "Kata Kerja", slug: "kata-kerja", description: "Kata kerja dasar untuk percakapan sehari-hari.", icon: "Zap" },
  { id: "cat-adjectives", name: "Kata Sifat", slug: "kata-sifat", description: "Kata sifat untuk mendeskripsikan sesuatu.", icon: "Sparkles" },
];

const category = (slug: string) => demoCategories.find((item) => item.slug === slug)!;

export const demoVocabulary: Vocabulary[] = [
  { id: "demo-1", slug: "kitabun", arabic: "كِتَابٌ", transliteration: "kitābun", meaning: "Buku", partOfSpeech: "Isim", exampleArabic: "هَذَا كِتَابٌ جَدِيدٌ", exampleMeaning: "Ini adalah buku baru.", level: "Pemula", category: category("sekolah") },
  { id: "demo-2", slug: "qalamun", arabic: "قَلَمٌ", transliteration: "qalamun", meaning: "Pulpen", partOfSpeech: "Isim", exampleArabic: "عِنْدِي قَلَمٌ أَزْرَقُ", exampleMeaning: "Saya mempunyai pulpen biru.", level: "Pemula", category: category("sekolah") },
  { id: "demo-3", slug: "madrasatun", arabic: "مَدْرَسَةٌ", transliteration: "madrasatun", meaning: "Sekolah", partOfSpeech: "Isim", exampleArabic: "أَذْهَبُ إِلَى الْمَدْرَسَةِ", exampleMeaning: "Saya pergi ke sekolah.", level: "Pemula", category: category("sekolah") },
  { id: "demo-4", slug: "muallimun", arabic: "مُعَلِّمٌ", transliteration: "mu'allimun", meaning: "Guru laki-laki", partOfSpeech: "Isim", exampleArabic: "الْمُعَلِّمُ فِي الْفَصْلِ", exampleMeaning: "Guru itu berada di kelas.", level: "Pemula", category: category("sekolah") },
  { id: "demo-5", slug: "talibun", arabic: "طَالِبٌ", transliteration: "ṭālibun", meaning: "Siswa laki-laki", partOfSpeech: "Isim", exampleArabic: "الطَّالِبُ يَقْرَأُ الْكِتَابَ", exampleMeaning: "Siswa itu membaca buku.", level: "Pemula", category: category("sekolah") },
  { id: "demo-6", slug: "baytun", arabic: "بَيْتٌ", transliteration: "baytun", meaning: "Rumah", partOfSpeech: "Isim", exampleArabic: "بَيْتِي قَرِيبٌ مِنَ الْمَسْجِدِ", exampleMeaning: "Rumah saya dekat dari masjid.", level: "Pemula", category: category("rumah") },
  { id: "demo-7", slug: "babun", arabic: "بَابٌ", transliteration: "bābun", meaning: "Pintu", partOfSpeech: "Isim", exampleArabic: "هَذَا بَابُ الْبَيْتِ", exampleMeaning: "Ini pintu rumah.", level: "Pemula", category: category("rumah") },
  { id: "demo-8", slug: "kursiyyun", arabic: "كُرْسِيٌّ", transliteration: "kursiyyun", meaning: "Kursi", partOfSpeech: "Isim", exampleArabic: "الْكِتَابُ عَلَى الْكُرْسِيِّ", exampleMeaning: "Buku berada di atas kursi.", level: "Pemula", category: category("rumah") },
  { id: "demo-9", slug: "abun", arabic: "أَبٌ", transliteration: "abun", meaning: "Ayah", partOfSpeech: "Isim", exampleArabic: "أَبِي يَعْمَلُ فِي الْمَكْتَبِ", exampleMeaning: "Ayah saya bekerja di kantor.", level: "Pemula", category: category("keluarga") },
  { id: "demo-10", slug: "ummun", arabic: "أُمٌّ", transliteration: "ummun", meaning: "Ibu", partOfSpeech: "Isim", exampleArabic: "أُمِّي تُحِبُّ الْأُسْرَةَ", exampleMeaning: "Ibu saya menyayangi keluarga.", level: "Pemula", category: category("keluarga") },
  { id: "demo-11", slug: "akhun", arabic: "أَخٌ", transliteration: "akhun", meaning: "Saudara laki-laki", partOfSpeech: "Isim", exampleArabic: "لِي أَخٌ وَاحِدٌ", exampleMeaning: "Saya mempunyai satu saudara laki-laki.", level: "Pemula", category: category("keluarga") },
  { id: "demo-12", slug: "ukhtun", arabic: "أُخْتٌ", transliteration: "ukhtun", meaning: "Saudara perempuan", partOfSpeech: "Isim", exampleArabic: "أُخْتِي طَالِبَةٌ", exampleMeaning: "Saudara perempuan saya seorang siswi.", level: "Pemula", category: category("keluarga") },
  { id: "demo-13", slug: "maaun", arabic: "مَاءٌ", transliteration: "mā'un", meaning: "Air", partOfSpeech: "Isim", exampleArabic: "أَشْرَبُ الْمَاءَ كُلَّ يَوْمٍ", exampleMeaning: "Saya minum air setiap hari.", level: "Pemula", category: category("makanan-minuman") },
  { id: "demo-14", slug: "khubzun", arabic: "خُبْزٌ", transliteration: "khubzun", meaning: "Roti", partOfSpeech: "Isim", exampleArabic: "أَكُلُ الْخُبْزَ فِي الصَّبَاحِ", exampleMeaning: "Saya makan roti pada pagi hari.", level: "Pemula", category: category("makanan-minuman") },
  { id: "demo-15", slug: "tuffahatun", arabic: "تُفَّاحَةٌ", transliteration: "tuffāḥatun", meaning: "Buah apel", partOfSpeech: "Isim", exampleArabic: "التُّفَّاحَةُ حُلْوَةٌ", exampleMeaning: "Buah apel itu manis.", level: "Pemula", category: category("makanan-minuman") },
  { id: "demo-16", slug: "yaktubu", arabic: "يَكْتُبُ", transliteration: "yaktubu", meaning: "Dia menulis", partOfSpeech: "Fi'il mudhari'", exampleArabic: "الطَّالِبُ يَكْتُبُ الدَّرْسَ", exampleMeaning: "Siswa itu menulis pelajaran.", level: "Pemula", category: category("kata-kerja") },
  { id: "demo-17", slug: "yaqrau", arabic: "يَقْرَأُ", transliteration: "yaqra'u", meaning: "Dia membaca", partOfSpeech: "Fi'il mudhari'", exampleArabic: "أَحْمَدُ يَقْرَأُ الْقُرْآنَ", exampleMeaning: "Ahmad membaca Al-Qur'an.", level: "Pemula", category: category("kata-kerja") },
  { id: "demo-18", slug: "yashrabu", arabic: "يَشْرَبُ", transliteration: "yashrabu", meaning: "Dia minum", partOfSpeech: "Fi'il mudhari'", exampleArabic: "الْوَلَدُ يَشْرَبُ اللَّبَنَ", exampleMeaning: "Anak laki-laki itu minum susu.", level: "Pemula", category: category("kata-kerja") },
  { id: "demo-19", slug: "jamilun", arabic: "جَمِيلٌ", transliteration: "jamīlun", meaning: "Indah / bagus", partOfSpeech: "Sifat", exampleArabic: "هَذَا بَيْتٌ جَمِيلٌ", exampleMeaning: "Ini rumah yang indah.", level: "Pemula", category: category("kata-sifat") },
  { id: "demo-20", slug: "kabirun", arabic: "كَبِيرٌ", transliteration: "kabīrun", meaning: "Besar", partOfSpeech: "Sifat", exampleArabic: "الْمَسْجِدُ كَبِيرٌ", exampleMeaning: "Masjid itu besar.", level: "Pemula", category: category("kata-sifat") },
];

export const demoQuiz: QuizQuestion[] = [
  { id: "q1", question: "Apa arti dari كِتَابٌ?", options: ["Buku", "Pintu", "Kursi", "Sekolah"], correctAnswer: "Buku", explanation: "كِتَابٌ (kitābun) berarti buku.", vocabularyId: "demo-1" },
  { id: "q2", question: "Kosakata bahasa Arab untuk 'Ibu' adalah ...", options: ["أَبٌ", "أُمٌّ", "أَخٌ", "أُخْتٌ"], correctAnswer: "أُمٌّ", explanation: "أُمٌّ (ummun) berarti ibu.", vocabularyId: "demo-10" },
  { id: "q3", question: "Apa arti dari مَاءٌ?", options: ["Roti", "Susu", "Air", "Apel"], correctAnswer: "Air", explanation: "مَاءٌ (mā'un) berarti air.", vocabularyId: "demo-13" },
  { id: "q4", question: "يَكْتُبُ memiliki arti ...", options: ["Dia membaca", "Dia menulis", "Dia minum", "Dia pergi"], correctAnswer: "Dia menulis", explanation: "يَكْتُبُ (yaktubu) berarti dia menulis.", vocabularyId: "demo-16" },
  { id: "q5", question: "Apa arti dari جَمِيلٌ?", options: ["Kecil", "Besar", "Indah", "Baru"], correctAnswer: "Indah", explanation: "جَمِيلٌ (jamīlun) berarti indah atau bagus.", vocabularyId: "demo-19" },
];
