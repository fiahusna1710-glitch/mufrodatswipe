-- Starter categories and vocabulary. Safe to run more than once.
insert into public.categories (name, slug, description, icon) values
  ('Sekolah', 'sekolah', 'Kosakata yang sering digunakan di lingkungan sekolah.', 'BookOpen'),
  ('Keluarga', 'keluarga', 'Anggota keluarga dan hubungan kekerabatan.', 'Users'),
  ('Makanan & Minuman', 'makanan-minuman', 'Nama makanan, minuman, dan kegiatan makan.', 'Coffee'),
  ('Rumah', 'rumah', 'Benda dan tempat di sekitar rumah.', 'House'),
  ('Kata Kerja', 'kata-kerja', 'Kata kerja dasar untuk percakapan sehari-hari.', 'Zap'),
  ('Kata Sifat', 'kata-sifat', 'Kata sifat untuk mendeskripsikan sesuatu.', 'Sparkles')
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into public.vocabularies (category_id, slug, arabic, transliteration, meaning, part_of_speech, example_arabic, example_meaning, level, is_published)
select c.id, v.slug, v.arabic, v.transliteration, v.meaning, v.part_of_speech, v.example_arabic, v.example_meaning, 'Pemula', true
from (values
  ('sekolah','kitabun','كِتَابٌ','kitābun','Buku','Isim','هَذَا كِتَابٌ جَدِيدٌ','Ini adalah buku baru.'),
  ('sekolah','qalamun','قَلَمٌ','qalamun','Pulpen','Isim','عِنْدِي قَلَمٌ أَزْرَقُ','Saya mempunyai pulpen biru.'),
  ('sekolah','madrasatun','مَدْرَسَةٌ','madrasatun','Sekolah','Isim','أَذْهَبُ إِلَى الْمَدْرَسَةِ','Saya pergi ke sekolah.'),
  ('sekolah','muallimun','مُعَلِّمٌ','mu''allimun','Guru laki-laki','Isim','الْمُعَلِّمُ فِي الْفَصْلِ','Guru itu berada di kelas.'),
  ('sekolah','talibun','طَالِبٌ','ṭālibun','Siswa laki-laki','Isim','الطَّالِبُ يَقْرَأُ الْكِتَابَ','Siswa itu membaca buku.'),
  ('rumah','baytun','بَيْتٌ','baytun','Rumah','Isim','بَيْتِي قَرِيبٌ مِنَ الْمَسْجِدِ','Rumah saya dekat dari masjid.'),
  ('rumah','babun','بَابٌ','bābun','Pintu','Isim','هَذَا بَابُ الْبَيْتِ','Ini pintu rumah.'),
  ('rumah','kursiyyun','كُرْسِيٌّ','kursiyyun','Kursi','Isim','الْكِتَابُ عَلَى الْكُرْسِيِّ','Buku berada di atas kursi.'),
  ('keluarga','abun','أَبٌ','abun','Ayah','Isim','أَبِي يَعْمَلُ فِي الْمَكْتَبِ','Ayah saya bekerja di kantor.'),
  ('keluarga','ummun','أُمٌّ','ummun','Ibu','Isim','أُمِّي تُحِبُّ الْأُسْرَةَ','Ibu saya menyayangi keluarga.'),
  ('keluarga','akhun','أَخٌ','akhun','Saudara laki-laki','Isim','لِي أَخٌ وَاحِدٌ','Saya mempunyai satu saudara laki-laki.'),
  ('keluarga','ukhtun','أُخْتٌ','ukhtun','Saudara perempuan','Isim','أُخْتِي طَالِبَةٌ','Saudara perempuan saya seorang siswi.'),
  ('makanan-minuman','maaun','مَاءٌ','mā’un','Air','Isim','أَشْرَبُ الْمَاءَ كُلَّ يَوْمٍ','Saya minum air setiap hari.'),
  ('makanan-minuman','khubzun','خُبْزٌ','khubzun','Roti','Isim','أَكُلُ الْخُبْزَ فِي الصَّبَاحِ','Saya makan roti pada pagi hari.'),
  ('makanan-minuman','tuffahatun','تُفَّاحَةٌ','tuffāḥatun','Buah apel','Isim','التُّفَّاحَةُ حُلْوَةٌ','Buah apel itu manis.'),
  ('kata-kerja','yaktubu','يَكْتُبُ','yaktubu','Dia menulis','Fi''il mudhari''','الطَّالِبُ يَكْتُبُ الدَّرْسَ','Siswa itu menulis pelajaran.'),
  ('kata-kerja','yaqrau','يَقْرَأُ','yaqra’u','Dia membaca','Fi''il mudhari''','أَحْمَدُ يَقْرَأُ الْقُرْآنَ','Ahmad membaca Al-Qur’an.'),
  ('kata-kerja','yashrabu','يَشْرَبُ','yashrabu','Dia minum','Fi''il mudhari''','الْوَلَدُ يَشْرَبُ اللَّبَنَ','Anak laki-laki itu minum susu.'),
  ('kata-sifat','jamilun','جَمِيلٌ','jamīlun','Indah / bagus','Sifat','هَذَا بَيْتٌ جَمِيلٌ','Ini rumah yang indah.'),
  ('kata-sifat','kabirun','كَبِيرٌ','kabīrun','Besar','Sifat','الْمَسْجِدُ كَبِيرٌ','Masjid itu besar.')
) as v(category_slug,slug,arabic,transliteration,meaning,part_of_speech,example_arabic,example_meaning)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  arabic = excluded.arabic,
  transliteration = excluded.transliteration,
  meaning = excluded.meaning,
  part_of_speech = excluded.part_of_speech,
  example_arabic = excluded.example_arabic,
  example_meaning = excluded.example_meaning,
  updated_at = now();

insert into public.quiz_questions (question_text, options, correct_answer, explanation, vocabulary_id)
select 'Apa arti dari كِتَابٌ?', '["Buku","Pintu","Kursi","Sekolah"]'::jsonb, 'Buku', 'كِتَابٌ (kitābun) berarti buku.', id
from public.vocabularies v
where v.slug = 'kitabun' and not exists (select 1 from public.quiz_questions q where q.question_text = 'Apa arti dari كِتَابٌ?');

insert into public.quiz_questions (question_text, options, correct_answer, explanation, vocabulary_id)
select 'Kosakata bahasa Arab untuk Ibu adalah ...', '["أَبٌ","أُمٌّ","أَخٌ","أُخْتٌ"]'::jsonb, 'أُمٌّ', 'أُمٌّ (ummun) berarti ibu.', id
from public.vocabularies v
where v.slug = 'ummun' and not exists (select 1 from public.quiz_questions q where q.question_text = 'Kosakata bahasa Arab untuk Ibu adalah ...');

insert into public.quiz_questions (question_text, options, correct_answer, explanation, vocabulary_id)
select 'Apa arti dari مَاءٌ?', '["Roti","Susu","Air","Apel"]'::jsonb, 'Air', 'مَاءٌ (mā’un) berarti air.', id
from public.vocabularies v
where v.slug = 'maaun' and not exists (select 1 from public.quiz_questions q where q.question_text = 'Apa arti dari مَاءٌ?');
