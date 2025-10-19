export interface Question {
  id?: number;
  category_id: number;
  question_text: string;
  question_type: 'qcm' | 'text' | 'vrai_faux' | 'association' | 'timeline' | 'mapclick';
  correct_answer: string;
  wrong_answers?: string[];
  difficulty?: 'facile' | 'moyen' | 'difficile';
  hint?: string;
  explanation?: string;
  created_at?: string;
  updated_at?: string;
}

