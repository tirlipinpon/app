import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { EmojiService } from '../../services/emoji.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal('');
  
  showForm = signal(false);
  editingCategory = signal<Category | null>(null);
  
  formData = signal({
    name: '',
    description: '',
    icon: ''
  });

  emojiSuggestions = signal<string[]>([]);
  showEmojiPicker = signal(false);

  constructor(
    private dataService: DataService,
    private emojiService: EmojiService
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading.set(true);
    this.error.set('');
    
    try {
      const data = await this.dataService.getCategories();
      this.categories.set(data);
    } catch (error: any) {
      this.error.set('Erreur lors du chargement des catégories');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateForm() {
    this.editingCategory.set(null);
    this.formData.set({ name: '', description: '', icon: '' });
    this.showForm.set(true);
  }

  openEditForm(category: Category) {
    this.editingCategory.set(category);
    this.formData.set({
      name: category.name,
      description: category.description || '',
      icon: category.icon || ''
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCategory.set(null);
    this.formData.set({ name: '', description: '', icon: '' });
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');

    try {
      const editing = this.editingCategory();
      
      if (editing) {
        await this.dataService.updateCategory(editing.id!, this.formData());
      } else {
        await this.dataService.createCategory(this.formData());
      }

      await this.loadCategories();
      this.closeForm();
    } catch (error: any) {
      this.error.set('Erreur lors de l\'enregistrement');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCategory(category: Category) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.dataService.deleteCategory(category.id!);
      await this.loadCategories();
    } catch (error: any) {
      this.error.set('Erreur lors de la suppression');
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  onIconInputChange(value: string) {
    const suggestions = this.emojiService.searchEmojis(value);
    this.emojiSuggestions.set(suggestions);
    this.showEmojiPicker.set(suggestions.length > 0);
  }

  selectEmoji(emoji: string) {
    this.formData.set({ ...this.formData(), icon: emoji });
    this.showEmojiPicker.set(false);
  }

  showPopularEmojis() {
    this.emojiSuggestions.set(this.emojiService.getPopularEmojis());
    this.showEmojiPicker.set(true);
  }
}

