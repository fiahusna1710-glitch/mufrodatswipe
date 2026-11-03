export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
};

export type Vocabulary = {
  id: string;
  slug: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  partOfSpeech?: string | null;
  exampleArabic?: string | null;
  exampleMeaning?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  level?: string | null;
  category: Category;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string | null;
  vocabularyId?: string | null;
};
