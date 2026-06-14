import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../../../../evirement';

@Component({
  selector: 'app-results-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './results-test.component.html',
  styleUrls: ['./results-test.component.scss']
})
export class ResultsTestComponent implements OnInit, OnChanges {
  @Input() resultId!: string;
  @Output() close = new EventEmitter<void>();

  dataTestResult: any = null;
  filteredAnswers: any[] = [];
  searchQuery: string = '';
  currentFilter: string = 'all';
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.resultId) {
      this.loadResults();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resultId'] && changes['resultId'].currentValue) {
      this.loadResults();
    }
  }

  loadResults(): void {
    if (!this.resultId) return;
    
    this.isLoading = true;
    this.http.get(`${environment.apiUrlHR}/results/result/${this.resultId}`).subscribe({
      next: (response) => {
        this.dataTestResult = response;
        this.filteredAnswers = this.dataTestResult?.answers || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка при загрузке результатов:', error);
        this.isLoading = false;
      }
    });
  }

  // Filtering methods
  filterAnswers(): void {
    if (!this.dataTestResult?.answers) return;

    let filtered = this.dataTestResult.answers;

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((answer: any) =>
        answer.question.text.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (this.currentFilter) {
      case 'answered':
        filtered = filtered.filter((answer: any) =>
          answer.option || answer.open_answer
        );
        break;
      case 'skipped':
        filtered = filtered.filter((answer: any) =>
          !answer.option && !answer.open_answer
        );
        break;
    }

    this.filteredAnswers = filtered;
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.filterAnswers();
  }

  // Statistics methods
  getAnsweredCount(): number {
    if (!this.dataTestResult?.answers) return 0;
    return this.dataTestResult.answers.filter((answer: any) =>
      answer.option || answer.open_answer
    ).length;
  }

  getSkippedCount(): number {
    if (!this.dataTestResult?.answers) return 0;
    return this.dataTestResult.answers.filter((answer: any) =>
      !answer.option && !answer.open_answer
    ).length;
  }

  getAnsweredPercentage(): number {
    if (!this.dataTestResult?.answers?.length) return 0;
    return Math.round((this.getAnsweredCount() / this.dataTestResult.answers.length) * 100);
  }

  getSkippedPercentage(): number {
    if (!this.dataTestResult?.answers?.length) return 0;
    return Math.round((this.getSkippedCount() / this.dataTestResult.answers.length) * 100);
  }

  getCorrectAnswersCount(): number | null {
    if (!this.dataTestResult?.answers) return null;
    const answersWithCorrectness = this.dataTestResult.answers.filter((answer: any) =>
      answer.correct !== undefined
    );
    if (answersWithCorrectness.length === 0) return null;
    return answersWithCorrectness.filter((answer: any) => answer.correct).length;
  }

  getCorrectPercentage(): number {
    const correctCount = this.getCorrectAnswersCount();
    if (correctCount === null) return 0;
    const totalWithCorrectness = this.dataTestResult.answers.filter((answer: any) =>
      answer.correct !== undefined
    ).length;
    return Math.round((correctCount / totalWithCorrectness) * 100);
  }

  getQuestionNumber(answer: any): number {
    if (!this.dataTestResult?.answers) return 0;
    return this.dataTestResult.answers.indexOf(answer) + 1;
  }

  getCorrectAnswer(answer: any): string | null {
    // This would depend on your API structure
    // You might need to adjust this based on how correct answers are stored
    if (answer.correct_option) {
      return answer.correct_option.text;
    }
    return null;
  }

  // Utility methods
  formatPhoneNumber(phone: string): string {
    if (!phone) return 'Не указан';
    // Basic phone formatting
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Action methods
  printResults(): void {
    window.print();
  }

  exportToPDF(): void {
    console.log('Экспорт в PDF...');
    // Implement PDF export logic here
    // You might want to use libraries like jspdf or html2canvas
  }

  refreshData(): void {
    this.loadResults();
  }
}