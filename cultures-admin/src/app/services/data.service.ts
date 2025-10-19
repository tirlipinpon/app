import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Category } from '../models/category.model';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private supabase: SupabaseService) {}

  // === CATÉGORIES ===
  
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getCategoryById(id: number): Promise<Category | null> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCategory(id: number): Promise<void> {
    const { error } = await this.supabase.client
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // === QUESTIONS ===

  async getQuestions(categoryId?: number): Promise<Question[]> {
    let query = this.supabase.client
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  async getQuestionById(id: number): Promise<Question | null> {
    const { data, error } = await this.supabase.client
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createQuestion(question: Partial<Question>): Promise<Question> {
    const { data, error } = await this.supabase.client
      .from('questions')
      .insert(question)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
    const { data, error } = await this.supabase.client
      .from('questions')
      .update(question)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteQuestion(id: number): Promise<void> {
    const { error } = await this.supabase.client
      .from('questions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

