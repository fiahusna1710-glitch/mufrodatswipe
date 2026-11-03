"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/learning";

export function FavoriteButton({ vocabularyId, initialFavorite = false }: { vocabularyId: string; initialFavorite?: boolean }) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [pending, startTransition] = useTransition();
  return <button type="button" className={`btn ${favorite ? "btn-soft" : "btn-outline"}`} disabled={pending} onClick={() => startTransition(async () => { const result = await toggleFavoriteAction(vocabularyId); if (result.ok) setFavorite(result.isFavorite); })}>
    <Heart size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "Tersimpan di favorit" : "Simpan favorit"}
  </button>;
}
