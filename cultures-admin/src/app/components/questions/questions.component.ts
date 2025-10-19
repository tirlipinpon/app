import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ImageService } from '../../services/image.service';
import { Question } from '../../models/question.model';
import { Category } from '../../models/category.model';
import { MapEditorComponent, MapZone } from '../map-editor/map-editor.component';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, MapEditorComponent, ImageCropperComponent],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions = signal<Question[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');
  showScrollTop = signal(false);
  
  selectedCategoryId = signal<number | undefined>(undefined);
  selectedQuestionType = signal<string>('');
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
  glisserMapping = signal<{item: string, category: string}[]>([]);
  remplirBlancsAnswers = signal<string[]>(['']);
  mapImageUrl = signal<string>('');
  mapImageBlob = signal<Blob | null>(null);
  mapImageEvent: any = null; // Pour ngx-image-cropper
  mapZones = signal<MapZone[]>([]);
  mapValidationMode = signal<'any' | 'all'>('any');
  uploadingImage = signal(false);
  showCropTool = signal(false);
  croppedImageBlob: Blob | null = null;

  questionTypes = [
    { value: 'input', label: 'Texte libre' },
    { value: 'qcm', label: 'QCM' },
    { value: 'vrai-faux', label: 'Vrai/Faux' },
    { value: 'ordre', label: 'Ordre' },
    { value: 'association', label: 'Association' },
    { value: 'glisser-deposer', label: 'Glisser-déposer' },
    { value: 'remplir-blancs', label: 'Remplir les blancs' },
    { value: 'map-click', label: 'Carte clicable' },
    { value: 'timeline', label: 'Chronologie' }
  ];

  constructor(
    private dataService: DataService,
    private imageService: ImageService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadQuestions();
    this.setupScrollListener();
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.showScrollTop.set(window.scrollY > 300);
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      // Filtrer par type si sélectionné (et différent de '')
      const typeFilter = this.selectedQuestionType();
      if (typeFilter && typeFilter !== '') {
        data = data.filter(q => q.question_type === typeFilter);
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

  formatOptionsPreview(options: any, type: string): string {
    if (!options) return 'N/A';
    
    try {
      switch(type) {
        case 'qcm':
        case 'ordre':
          // Array simple
          return Array.isArray(options) ? options.join(', ') : JSON.stringify(options);
        
        case 'timeline':
          // Array d'objets avec text
          if (Array.isArray(options)) {
            return options.map(o => o.text || o).join(' → ');
          }
          return JSON.stringify(options);
        
        case 'association':
          // {left: [...], right: [...]}
          if (options.left && options.right) {
            return `Gauche: ${options.left.join(', ')} | Droite: ${options.right.join(', ')}`;
          }
          return JSON.stringify(options);
        
        case 'glisser-deposer':
          // {categories: [...], items: [...]}
          if (options.categories && options.items) {
            return `Catégories: ${options.categories.join(', ')} | Items: ${options.items.join(', ')}`;
          }
          return JSON.stringify(options);
        
        default:
          return JSON.stringify(options);
      }
    } catch (e) {
      return String(options);
    }
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
    let answerValue: any = '';
    if (question.answer) {
      if (question.question_type === 'vrai-faux') {
        // answer = {"value": true} ou {"value": false}
        answerValue = question.answer.value === true ? 'Vrai' : 'Faux';
      } else if (question.question_type === 'remplir-blancs' && question.answer.value) {
        // answer = {"value": "texte"} ou {"value": ["texte1", "texte2"]}
        if (Array.isArray(question.answer.value)) {
          this.remplirBlancsAnswers.set(question.answer.value);
          answerValue = question.answer.value[0] || '';
        } else {
          this.remplirBlancsAnswers.set([String(question.answer.value)]);
          answerValue = String(question.answer.value);
        }
      } else if (question.answer.value !== undefined && question.answer.value !== null) {
        // answer = {"value": "texte"}
        answerValue = String(question.answer.value);
      } else {
        answerValue = '';
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
    if (question.question_type === 'association' && question.answer) {
      // Pour association, charger depuis answer (pas options)
      this.loadOptionsForType(question.question_type, question.answer);
    } else if (question.question_type === 'map-click' && question.options) {
      // Pour map-click, charger image et zones
      if (question.options.imageUrl) {
        this.mapImageUrl.set(question.options.imageUrl);
        this.mapZones.set(question.options.zones || []);
      }
    } else {
      this.loadOptionsForType(question.question_type, question.options);
    }
    
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
            // Créer mapping si pas présent (pour rétro-compatibilité)
            if (opts.mapping) {
              this.glisserMapping.set(opts.mapping);
            } else {
              // Auto-générer un mapping vide pour chaque item
              const mapping = opts.items.map((item: string) => ({ item, category: '' }));
              this.glisserMapping.set(mapping);
            }
          } else {
            this.glisserCategories.set(['', '']);
            this.glisserItems.set(['', '', '', '']);
            this.glisserMapping.set([]);
          }
          break;
        
        case 'map-click':
          if (opts && opts.imageUrl) {
            this.mapImageUrl.set(opts.imageUrl);
            this.mapZones.set(opts.zones || []);
            this.mapValidationMode.set(opts.validationMode || 'any');
          } else {
            this.mapImageUrl.set('');
            this.mapZones.set([]);
            this.mapValidationMode.set('any');
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
      this.glisserMapping.set([]);
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
      
      // Si c'est un map-click avec une nouvelle image, uploader maintenant
      if (data.question_type === 'map-click' && this.mapImageBlob()) {
        console.log('📤 Upload de l\'image vers Supabase...');
        const finalImageUrl = await this.imageService.uploadOptimizedImage(
          this.mapImageBlob()!,
          data.id
        );
        console.log('✅ Image uploadée:', finalImageUrl);
        this.mapImageUrl.set(finalImageUrl);
      }
      
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
          items: this.glisserItems().filter(o => o.trim()),
          mapping: this.glisserMapping().filter(m => m.item && m.category)
        };
      case 'map-click':
        return {
          imageUrl: this.mapImageUrl(),
          zones: this.mapZones(),
          validationMode: this.mapValidationMode()
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
        // Format: {"value": "texte"}
        return answerValue ? { value: answerValue } : null;
      
      case 'remplir-blancs':
        // Format: {"value": "texte"} ou {"value": ["texte1", "texte2"], "validateFlexible": true}
        const answers = this.remplirBlancsAnswers().filter(a => a.trim());
        if (answers.length === 0) return null;
        if (answers.length === 1) {
          return { value: answers[0], validateFlexible: true };
        } else {
          return { value: answers, validateFlexible: true };
        }
      
      case 'association':
        // Format: {"left": [...], "right": [...], "pairs": [...]}
        const pairs = this.associationPairs().filter(p => p.left && p.right);
        if (pairs.length === 0) return null;
        return {
          left: this.associationLeft().filter(o => o.trim()),
          right: this.associationRight().filter(o => o.trim()),
          pairs: pairs
        };
      
      case 'map-click':
        // Format: Array des IDs des zones correctes (peut être plusieurs)
        const correctZones = this.mapZones().filter(z => z.isCorrect);
        if (correctZones.length === 0) return null;
        
        // Mode "all" : retourner toujours un array pour forcer la collecte de toutes les zones
        if (this.mapValidationMode() === 'all') {
          return correctZones.map(z => z.id);
        }
        
        // Mode "any" : Si une seule zone, retourner l'ID directement (rétrocompatibilité)
        if (correctZones.length === 1) return correctZones[0].id;
        // Si plusieurs zones, retourner un array d'IDs
        return correctZones.map(z => z.id);
      
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

  setVraiFauxAnswer(value: string) {
    this.formData.set({ ...this.formData(), answer: value });
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

  // Gestion du mapping glisser-déposer
  addGlisserMapping() {
    this.glisserMapping.set([...this.glisserMapping(), { item: '', category: '' }]);
  }

  updateGlisserMapping(index: number, field: 'item' | 'category', value: string) {
    const mapping = [...this.glisserMapping()];
    mapping[index][field] = value;
    this.glisserMapping.set(mapping);
  }

  removeGlisserMapping(index: number) {
    this.glisserMapping.set(this.glisserMapping().filter((_, i) => i !== index));
  }

  autoGenerateGlisserMapping() {
    const items = this.glisserItems().filter(i => i.trim());
    const mapping = items.map(i => ({ item: i, category: '' }));
    this.glisserMapping.set(mapping);
  }

  // Gestion Remplir-blancs (réponses multiples)
  updateRemplirBlancsAnswer(index: number, value: string) {
    const answers = [...this.remplirBlancsAnswers()];
    answers[index] = value;
    this.remplirBlancsAnswers.set(answers);
  }
  addRemplirBlancsAnswer() {
    this.remplirBlancsAnswers.set([...this.remplirBlancsAnswers(), '']);
  }
  removeRemplirBlancsAnswer(index: number) {
    this.remplirBlancsAnswers.set(this.remplirBlancsAnswers().filter((_, i) => i !== index));
  }

  // Gestion Map-Click
  onImageUpload(event: any) {
    // Sauvegarder l'event pour ngx-image-cropper
    this.mapImageEvent = event;
    this.showCropTool.set(true);
    this.mapZones.set([]); // Reset zones
  }

  imageCropped(event: ImageCroppedEvent) {
    // Sauvegarder le blob croppé
    this.croppedImageBlob = event.blob || null;
  }

  imageLoaded() {
    console.log('✅ Image chargée dans le cropper');
  }

  cropperReady() {
    console.log('✅ Cropper prêt');
  }

  loadImageFailed() {
    alert('Erreur de chargement de l\'image');
    this.showCropTool.set(false);
  }

  openCropTool() {
    if (!this.mapImageEvent) {
      alert('Uploadez d\'abord une image');
      return;
    }
    this.showCropTool.set(true);
  }

  closeCropTool() {
    this.showCropTool.set(false);
  }

  async applyCrop() {
    if (!this.croppedImageBlob) {
      alert('Aucune image à recadrer');
      return;
    }

    this.uploadingImage.set(true);

    try {
      console.log('✂️ Optimisation de l\'image recadrée...');
      
      // Créer un File à partir du Blob
      const croppedFile = new File([this.croppedImageBlob], 'cropped.png', { type: 'image/png' });
      
      // Optimiser l'image recadrée (max 800px)
      const { blob, dataUrl } = await this.imageService.optimizeImageWithDimensions(
        croppedFile,
        'original',
        800
      );
      
      console.log('✅ Image recadrée et optimisée:', blob.size, 'bytes');
      
      this.mapImageUrl.set(dataUrl);
      this.mapImageBlob.set(blob);
      this.showCropTool.set(false);
      
    } catch (error: any) {
      this.error.set('Erreur: ' + error.message);
      console.error('❌ Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      this.uploadingImage.set(false);
    }
  }

  onMapZonesChange(zones: MapZone[]) {
    this.mapZones.set(zones);
  }
}

