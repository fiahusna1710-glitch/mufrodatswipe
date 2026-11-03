"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CircleHelp, RotateCcw, Trophy, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { gradeQuizAttempt } from "@/app/actions/learning";

type GradeDetail = { questionId: string; correct: boolean; correctAnswer: string; explanation?: string | null };

export function QuizPlayer({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gradeDetails, setGradeDetails] = useState<GradeDetail[]>([]);
  const [pending, startTransition] = useTransition();
  const current = questions[index];
  const demoMode = questions.every((question) => Boolean(question.correctAnswer));

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    setAnswers((previous) => ({ ...previous, [current.id]: option }));
    setAnswered(true);
    if (demoMode && option === current.correctAnswer) setScore((value) => value + 1);
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }
    if (demoMode) {
      setFinished(true);
      setGradeDetails(questions.map((question) => ({ questionId: question.id, correct: answers[question.id] === question.correctAnswer, correctAnswer: question.correctAnswer ?? "", explanation: question.explanation })));
      return;
    }
    startTransition(async () => {
      const result = await gradeQuizAttempt({ answers: questions.map((question) => ({ questionId: question.id, answer: answers[question.id] ?? "" })) });
      setScore(result.score ?? 0);
      setSaved(result.saved);
      setGradeDetails(result.details as GradeDetail[]);
      setFinished(true);
    });
  }

  function restart() {
    setIndex(0); setSelected(null); setAnswered(false); setScore(0); setAnswers({}); setFinished(false); setSaved(false); setGradeDetails([]);
  }

  if (!questions.length) return <div className="empty-state"><h3>Belum ada soal</h3><p>Admin dapat menambahkan soal melalui dashboard.</p></div>;

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return <div className="quiz-result">
      <div className="result-trophy"><Trophy size={34} /></div>
      <span className="eyebrow">Latihan selesai</span>
      <h2>{percentage >= 80 ? "Luar biasa!" : percentage >= 60 ? "Terus berlatih!" : "Jangan menyerah!"}</h2>
      <div className="result-score">{score}<span>/{questions.length}</span></div>
      <p>Kamu menjawab benar {score} dari {questions.length} pertanyaan ({percentage}%).</p>
      <div className="progress-track"><span style={{ width: `${percentage}%` }} /></div>
      <div className="quiz-review">{gradeDetails.map((detail, detailIndex) => <div className="quiz-review-item" key={detail.questionId}><span>{detail.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}</span><div><strong>Pertanyaan {detailIndex + 1}: {detail.correct ? "Benar" : `Jawaban: ${detail.correctAnswer || "belum dinilai"}`}</strong>{detail.explanation && <small>{detail.explanation}</small>}</div></div>)}</div>
      <p className="muted small-text">{demoMode ? "Mode demo: hasil latihan belum disimpan ke database." : saved ? "Hasil latihan tersimpan di akunmu." : "Hasil belum tersimpan. Masuk ke akun dan pastikan Supabase sudah dikonfigurasi untuk menyimpan nilai."}</p>
      <button className="btn btn-primary" onClick={restart}><RotateCcw size={17} /> Ulangi latihan</button>
    </div>;
  }

  return <div className="quiz-shell">
    <div className="quiz-topline"><span>PERTANYAAN {index + 1} DARI {questions.length}</span><span>{demoMode ? `${score} benar` : "Pilih jawaban terbaik"}</span></div>
    <div className="progress-track"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
    <div className="quiz-question"><span className="question-icon"><CircleHelp size={20} /></span><h2>{current.question}</h2></div>
    <div className="quiz-options">{current.options.map((option, optionIndex) => {
      const isCorrect = demoMode && option === current.correctAnswer;
      const isSelected = option === selected;
      const stateClass = answered && isCorrect ? "option-correct" : answered && isSelected && demoMode && !isCorrect ? "option-wrong" : "";
      return <button key={`${current.id}-${optionIndex}`} className={`quiz-option ${stateClass}`} onClick={() => choose(option)} disabled={answered}>
        <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span dir={/[\u0600-\u06FF]/.test(option) ? "rtl" : "ltr"}>{option}</span>
        {answered && isCorrect && <CheckCircle2 size={19} className="option-status" />}{answered && isSelected && demoMode && !isCorrect && <XCircle size={19} className="option-status" />}
      </button>;
    })}</div>
    {answered && <div className={`answer-explanation ${demoMode ? (selected === current.correctAnswer ? "answer-good" : "answer-bad") : "answer-good"}`}><strong>{demoMode ? (selected === current.correctAnswer ? "Jawaban benar!" : `Jawaban yang tepat: ${current.correctAnswer}`) : "Jawaban dicatat"}</strong><p>{demoMode ? current.explanation : "Pembahasan dan hasil jawaban akan ditampilkan setelah semua pertanyaan selesai."}</p></div>}
    <div className="quiz-footer"><span className="muted small-text">Pilih satu jawaban yang paling tepat.</span><button className="btn btn-primary" onClick={next} disabled={!answered || pending}>{index === questions.length - 1 ? "Lihat hasil" : "Berikutnya"}{index === questions.length - 1 ? <Trophy size={17} /> : <span>→</span>}</button></div>
  </div>;
}
