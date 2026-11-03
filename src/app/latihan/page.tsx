import type { Metadata } from "next";
import { Brain, Sparkles } from "lucide-react";
import { getQuizQuestions } from "@/lib/data";
import { QuizPlayer } from "@/components/quiz-player";

export const metadata: Metadata = { title: "Latihan Mufrodat", description: "Uji pemahaman kosakata bahasa Arab melalui latihan pilihan ganda." };

export default async function LatihanPage() {
  const questions = await getQuizQuestions();
  return <div className="page-shell container quiz-page">
    <div className="page-intro"><span className="eyebrow"><Brain size={15} /> RUANG LATIHAN</span><h1>Uji pemahamanmu, <em>naikkan levelmu.</em></h1><p>Jawab pertanyaan dengan teliti. Setelah memilih jawaban, kamu akan mendapatkan pembahasan singkat.</p><div className="quiz-meta-pills"><span><Sparkles size={14} /> {questions.length} pertanyaan</span><span>Level pemula</span><span>Estimasi 3–5 menit</span></div></div>
    <QuizPlayer questions={questions} />
  </div>;
}
