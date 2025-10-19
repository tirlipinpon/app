export interface Question {
  id?: string;
  category_id: number;
  question_text: string;
  question_type: 'input' | 'qcm' | 'vrai-faux' | 'ordre' | 'association' | 'glisser-deposer' | 'remplir-blancs';
  answer?: any; // Réponse correcte (pour vrai-faux, input, etc.)
  options?: any;
  tags?: string[];
  hint?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

