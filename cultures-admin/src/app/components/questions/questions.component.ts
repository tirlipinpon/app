import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Question } from '../../models/question.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions = signal<Question[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');
  
  selectedCategoryId = signal<number | undefined>(undefined);
  showForm = signal(false);
  editingQuestion = signal<Question | null>(null);
  
  formData = signal({
    category_id: 0,
    question_text: '',
    question_type: 'qcm' as Question['question_type'],
    correct_answer: '',
    wrong_answers: ['', '', ''],
    difficulty: 'moyen' as Question['difficulty'],
    hint: '',
    explanation: ''
  });

  questionTypes = [
    { value: 'qcm', label: 'QCM' },
    { value: 'text', label: 'Texte libre' },
    { value: 'vrai_faux', label: 'Vrai/Faux' },
    { value: 'association', label: 'Association' },
    { value: 'timeline', label: 'Chronologie' },
    { value: 'mapclick', label: 'Carte interactive' }
  ];

  difficulties = [
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' }
  ];

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadQuestions();
  }

  async loadCategories() {
    try {
      const data = await this.dataService.getCategories();
      this.categories.set(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des catégories', error);
    }
  }

  async loadQuestions() {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const data = await this.dataService.getQuestions(this.selectedCategoryId());
      this.questions.set(data);
    } catch (error: any) {
      this.error.set('Erreur lors du chargement des questions');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  onCategoryFilterChange() {
    this.loadQuestions();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Inconnue';
  }

  openCreateForm() {
    this.editingQuestion.set(null);
    this.formData.set({
      category_id: this.categories()[0]?.id || 0,
      question_text: '',
      question_type: 'qcm',
      correct_answer: '',
      wrong_answers: ['', '', ''],
      difficulty: 'moyen',
      hint: '',
      explanation: ''
    });
    this.showForm.set(true);
  }

  openEditForm(question: Question) {
    this.editingQuestion.set(question);
    this.formData.set({
      category_id: question.category_id,
      question_text: question.question_text,
      question_type: question.question_type,
      correct_answer: question.correct_answer,
      wrong_answers: question.wrong_answers || ['', '', ''],
      difficulty: question.difficulty || 'moyen',
      hint: question.hint || '',
      explanation: question.explanation || ''
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingQuestion.set(null);
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');

    try {
      const editing = this.editingQuestion();
      const data = {
        ...this.formData(),
        wrong_answers: this.formData().wrong_answers.filter(a => a.trim() !== '')
      };
      
      if (editing) {
        await this.dataService.updateQuestion(editing.id!, data);
      } else {
        await this.dataService.createQuestion(data);
      }

      await this.loadQuestions();
      this.closeForm();
    } catch (error: any) {
      this.error.set('Erreur lors de l\'enregistrement');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteQuestion(question: Question) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette question ?`)) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.dataService.deleteQuestion(question.id!);
      await this.loadQuestions();
    } catch (error: any) {
      this.error.set('Erreur lors de la suppression');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  updateWrongAnswer(index: number, value: string) {
    const wrongAnswers = [...this.formData().wrong_answers];
    wrongAnswers[index] = value;
    this.formData.set({ ...this.formData(), wrong_answers: wrongAnswers });
  }

  addWrongAnswer() {
    const wrongAnswers = [...this.formData().wrong_answers, ''];
    this.formData.set({ ...this.formData(), wrong_answers: wrongAnswers });
  }

  removeWrongAnswer(index: number) {
    const wrongAnswers = this.formData().wrong_answers.filter((_, i) => i !== index);
    this.formData.set({ ...this.formData(), wrong_answers: wrongAnswers });
  }
}

