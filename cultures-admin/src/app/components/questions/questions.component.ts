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
  selectedQuestionType = signal<string | undefined>(undefined);
  showForm = signal(false);
  editingQuestion = signal<Question | null>(null);
  
  formData = signal({
    id: '',
    category_id: 0,
    question_text: '',
    question_type: 'qcm' as Question['question_type'],
    answer: '' as any,
    options: '' as any,
    tags: [] as string[],
    hint: '',
    is_active: true
  });

  // Pour les différents types de questions
  qcmOptions = signal<string[]>(['', '', '', '']);
  ordreItems = signal<string[]>(['', '', '']);
  associationLeft = signal<string[]>(['', '', '']);
  associationRight = signal<string[]>(['', '', '', '']);
  associationPairs = signal<{left: string, right: string}[]>([]);
  glisserCategories = signal<string[]>(['', '']);
  glisserItems = signal<string[]>(['', '', '', '']);

  questionTypes = [
    { value: 'input', label: 'Texte libre' },
    { value: 'qcm', label: 'QCM' },
    { value: 'vrai-faux', label: 'Vrai/Faux' },
    { value: 'ordre', label: 'Ordre' },
    { value: 'association', label: 'Association' },
    { value: 'glisser-deposer', label: 'Glisser-déposer' },
    { value: 'remplir-blancs', label: 'Remplir les blancs' }
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
      let data = await this.dataService.getQuestions(this.selectedCategoryId());
      
      // Filtrer par type si sélectionné
      if (this.selectedQuestionType()) {
        data = data.filter(q => q.question_type === this.selectedQuestionType());
      }
      
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

  onTypeFilterChange() {
    this.loadQuestions();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Inconnue';
  }

  openCreateForm() {
    this.editingQuestion.set(null);
    const randomId = 'q_' + Date.now();
    this.formData.set({
      id: randomId,
      category_id: this.categories()[0]?.id || 1,
      question_text: '',
      question_type: 'qcm',
      answer: '',
      options: '',
      tags: [],
      hint: '',
      is_active: true
    });
    this.showForm.set(true);
  }

  openEditForm(question: Question) {
    this.editingQuestion.set(question);
    
    // Extraire la valeur de answer selon le format
    let answerValue = '';
    if (question.answer) {
      if (question.question_type === 'vrai-faux') {
        // answer = {"value": true} ou {"value": false}
        answerValue = question.answer.value ? 'Vrai' : 'Faux';
      } else if (question.answer.value !== undefined) {
        // answer = {"value": "texte"}
        answerValue = question.answer.value;
      }
    }
    
    this.formData.set({
      id: question.id || '',
      category_id: question.category_id,
      question_text: question.question_text,
      question_type: question.question_type,
      answer: answerValue,
      options: question.options,
      tags: question.tags || [],
      hint: question.hint || '',
      is_active: question.is_active ?? true
    });

    // Charger les options selon le type
    this.loadOptionsForType(question.question_type, question.options || question.answer);
    
    this.showForm.set(true);
  }

  loadOptionsForType(type: string, data: any) {
    try {
      const opts = typeof data === 'string' ? JSON.parse(data) : data;
      
      switch(type) {
        case 'qcm':
          this.qcmOptions.set(Array.isArray(opts) ? opts : ['', '', '', '']);
          break;
        case 'ordre':
          this.ordreItems.set(Array.isArray(opts) ? opts : ['', '', '']);
          break;
        case 'association':
          // Pour association, les données peuvent être dans options OU answer
          if (opts && opts.left && opts.right) {
            this.associationLeft.set(opts.left);
            this.associationRight.set(opts.right);
            this.associationPairs.set(opts.pairs || []);
          } else {
            this.associationLeft.set(['', '', '']);
            this.associationRight.set(['', '', '', '']);
            this.associationPairs.set([]);
          }
          break;
        case 'glisser-deposer':
          if (opts && opts.categories && opts.items) {
            this.glisserCategories.set(opts.categories);
            this.glisserItems.set(opts.items);
          } else {
            this.glisserCategories.set(['', '']);
            this.glisserItems.set(['', '', '', '']);
          }
          break;
      }
    } catch (e) {
      // Reset aux valeurs par défaut
      this.qcmOptions.set(['', '', '', '']);
      this.ordreItems.set(['', '', '']);
      this.associationLeft.set(['', '', '']);
      this.associationRight.set(['', '', '', '']);
      this.associationPairs.set([]);
      this.glisserCategories.set(['', '']);
      this.glisserItems.set(['', '', '', '']);
    }
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
      const data = { ...this.formData() };
      
      // Construire les options selon le type
      data.options = this.buildOptionsForType(data.question_type);
      
      // Construire answer dans le bon format pour l'app cultures
      data.answer = this.buildAnswerForType(data.question_type, data.answer);
      
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

  buildOptionsForType(type: string): any {
    switch(type) {
      case 'qcm':
        return this.qcmOptions().filter(o => o.trim());
      case 'ordre':
        return this.ordreItems().filter(o => o.trim());
      case 'association':
        return {
          left: this.associationLeft().filter(o => o.trim()),
          right: this.associationRight().filter(o => o.trim())
        };
      case 'glisser-deposer':
        return {
          categories: this.glisserCategories().filter(o => o.trim()),
          items: this.glisserItems().filter(o => o.trim())
        };
      default:
        return null;
    }
  }

  buildAnswerForType(type: string, answerValue: any): any {
    switch(type) {
      case 'vrai-faux':
        // Format: {"value": true} ou {"value": false}
        const boolValue = answerValue === 'Vrai' || answerValue === true;
        return { value: boolValue };
      
      case 'input':
      case 'qcm':
      case 'remplir-blancs':
        // Format: {"value": "texte"}
        return answerValue ? { value: answerValue } : null;
      
      case 'association':
        // Format: {"left": [...], "right": [...], "pairs": [...]}
        const pairs = this.associationPairs().filter(p => p.left && p.right);
        if (pairs.length === 0) return null;
        return {
          left: this.associationLeft().filter(o => o.trim()),
          right: this.associationRight().filter(o => o.trim()),
          pairs: pairs
        };
      
      case 'ordre':
      case 'glisser-deposer':
        // Ces types n'ont pas de answer, juste options
        return null;
      
      default:
        return null;
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

  updateTags(tagsString: string) {
    const tags = tagsString.split(',').map(t => t.trim()).filter(t => t);
    this.formData.set({ ...this.formData(), tags });
  }

  // Gestion QCM
  updateQcmOption(index: number, value: string) {
    const options = [...this.qcmOptions()];
    options[index] = value;
    this.qcmOptions.set(options);
  }
  addQcmOption() {
    this.qcmOptions.set([...this.qcmOptions(), '']);
  }
  removeQcmOption(index: number) {
    this.qcmOptions.set(this.qcmOptions().filter((_, i) => i !== index));
  }

  // Gestion Ordre
  updateOrdreItem(index: number, value: string) {
    const items = [...this.ordreItems()];
    items[index] = value;
    this.ordreItems.set(items);
  }
  addOrdreItem() {
    this.ordreItems.set([...this.ordreItems(), '']);
  }
  removeOrdreItem(index: number) {
    this.ordreItems.set(this.ordreItems().filter((_, i) => i !== index));
  }

  // Gestion Association
  updateAssociationLeft(index: number, value: string) {
    const items = [...this.associationLeft()];
    items[index] = value;
    this.associationLeft.set(items);
  }
  addAssociationLeft() {
    this.associationLeft.set([...this.associationLeft(), '']);
  }
  removeAssociationLeft(index: number) {
    this.associationLeft.set(this.associationLeft().filter((_, i) => i !== index));
  }
  updateAssociationRight(index: number, value: string) {
    const items = [...this.associationRight()];
    items[index] = value;
    this.associationRight.set(items);
  }
  addAssociationRight() {
    this.associationRight.set([...this.associationRight(), '']);
  }
  removeAssociationRight(index: number) {
    this.associationRight.set(this.associationRight().filter((_, i) => i !== index));
  }

  // Gestion Glisser-Déposer
  updateGlisserCategory(index: number, value: string) {
    const cats = [...this.glisserCategories()];
    cats[index] = value;
    this.glisserCategories.set(cats);
  }
  addGlisserCategory() {
    this.glisserCategories.set([...this.glisserCategories(), '']);
  }
  removeGlisserCategory(index: number) {
    this.glisserCategories.set(this.glisserCategories().filter((_, i) => i !== index));
  }
  updateGlisserItem(index: number, value: string) {
    const items = [...this.glisserItems()];
    items[index] = value;
    this.glisserItems.set(items);
  }
  addGlisserItem() {
    this.glisserItems.set([...this.glisserItems(), '']);
  }
  removeGlisserItem(index: number) {
    this.glisserItems.set(this.glisserItems().filter((_, i) => i !== index));
  }

  onTypeChange() {
    // Réinitialiser les options quand on change de type
    const type = this.formData().question_type;
    this.loadOptionsForType(type, null);
  }

  // Gestion des paires d'association
  addAssociationPair() {
    this.associationPairs.set([...this.associationPairs(), { left: '', right: '' }]);
  }

  updateAssociationPair(index: number, field: 'left' | 'right', value: string) {
    const pairs = [...this.associationPairs()];
    pairs[index][field] = value;
    this.associationPairs.set(pairs);
  }

  removeAssociationPair(index: number) {
    this.associationPairs.set(this.associationPairs().filter((_, i) => i !== index));
  }

  // Auto-générer les paires à partir des items left (pour faciliter)
  autoGeneratePairs() {
    const left = this.associationLeft().filter(l => l.trim());
    const pairs = left.map(l => ({ left: l, right: '' }));
    this.associationPairs.set(pairs);
  }
}

