"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { markVocabularyLearned } from "@/app/actions/learning";

export function MarkLearnedButton({ vocabularyId }: { vocabularyId: string }) {
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  return <button className={`btn ${done ? "btn-soft" : "btn-primary"}`} disabled={pending || done} onClick={() => startTransition(async () => { const result = await markVocabularyLearned(vocabularyId); if (result.ok) setDone(true); })}>
    {pending ? <LoaderCircle size={17} className="spin" /> : <CheckCircle2 size={17} />}{done ? "Sudah dipelajari" : "Tandai sudah dipelajari"}
  </button>;
}
