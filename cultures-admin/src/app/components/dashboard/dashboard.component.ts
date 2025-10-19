import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  categoriesCount = signal(0);
  questionsCount = signal(0);
  loading = signal(true);

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    this.loading.set(true);
    try {
      const [categories, questions] = await Promise.all([
        this.dataService.getCategories(),
        this.dataService.getQuestions()
      ]);
      
      this.categoriesCount.set(categories.length);
      this.questionsCount.set(questions.length);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques', error);
    } finally {
      this.loading.set(false);
    }
  }
}

