import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.initAuth();
  }

  private async initAuth() {
    // Vérifier l'utilisateur actuel
    const user = await this.supabase.getCurrentUser();
    this.currentUser.set(user);
    this.isAuthenticated.set(!!user);

    // Écouter les changements d'authentification
    this.supabase.onAuthStateChange((user) => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
    });
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.signIn(email, password);
      if (error) throw error;
      
      this.currentUser.set(data.user);
      this.isAuthenticated.set(true);
      this.router.navigate(['/admin']);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.supabase.signOut();
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}

