import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  constructor(private authService: AuthService) {}

  async onSubmit() {
    this.error.set('');
    this.loading.set(true);

    const result = await this.authService.login(
      this.email(),
      this.password()
    );

    this.loading.set(false);

    if (!result.success) {
      this.error.set(result.error || 'Erreur de connexion');
    }
  }
}

