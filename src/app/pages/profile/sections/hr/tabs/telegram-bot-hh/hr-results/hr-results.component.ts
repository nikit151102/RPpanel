import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResultsTestComponent } from './results-test/results-test.component';
import { environment } from '../../../../../../../../evirement';

@Component({
  selector: 'app-hr-results',
  imports: [CommonModule, FormsModule, ResultsTestComponent],
  templateUrl: './hr-results.component.html',
  styleUrls: ['./hr-results.component.scss']
})
export class HrResultsComponent implements OnInit {
  results: any[] = [];
  filteredResults: any[] = [];
  searchQuery: string = '';
  statusFilter: string = 'all';
  isLoading: boolean = false;
  showToast: boolean = false;
  showDetailsModal: boolean = false;
  selectedResultId: string | null = null;
  
  // Управление выпадающими меню
  activeDropdownIndex: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadResults();
  }

  // Закрытие выпадающего меню при клике вне его
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }

  // Переключение выпадающего меню
  toggleDropdown(index: number): void {
    event?.stopPropagation();
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  // Закрытие выпадающего меню
  closeDropdown(): void {
    this.activeDropdownIndex = null;
  }

  loadResults(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrlHR}/results/results`).subscribe({
      next: (data) => {
        this.results = data.sort((a, b) => {
          const dateA = new Date(a.passed_at).getTime();
          const dateB = new Date(b.passed_at).getTime();
          return dateB - dateA;
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при получении тестов', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.results];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(result =>
        result.test?.name?.toLowerCase().includes(query) ||
        result.user?.last_name?.toLowerCase().includes(query) ||
        result.user?.first_name?.toLowerCase().includes(query) ||
        result.user?.middle_name?.toLowerCase().includes(query) ||
        result.user?.phone_number?.includes(query)
      );
    }

    // Status filter
    switch (this.statusFilter) {
      case 'passed':
        filtered = filtered.filter(result => result.second_stage && result.second_stage > 0);
        break;
      case 'not_passed':
        filtered = filtered.filter(result => !result.second_stage || result.second_stage === 0);
        break;
    }

    this.filteredResults = filtered;
  }

  setStatusFilter(filter: string): void {
    this.statusFilter = filter;
    this.applyFilters();
  }

  refreshData(): void {
    this.loadResults();
  }

  viewDetails(result: any): void {
    this.selectedResultId = result.id;
    this.showDetailsModal = true;
    this.closeDropdown(); // Закрываем меню при открытии модального окна
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedResultId = null;
  }

  acceptTestInterview(id: string): void {
    if (!confirm('Вы уверены, что хотите пригласить кандидата на собеседование?')) return;
    this.http.post(`${environment.apiUrlHR}/results/${id}/send_interview_invitation`, {}).subscribe({
      next: () => {
        this.loadResults();
        this.closeDropdown();
      },
      error: (err) => console.error('Ошибка при отправке приглашения', err)
    });
  }

  acceptInternshipTest(id: string): void {
    if (!confirm('Вы уверены, что хотите пригласить кандидата на стажировку?')) return;
    this.http.post(`${environment.apiUrlHR}/results/${id}/send_internship_invitation`, {}).subscribe({
      next: () => {
        this.loadResults();
        this.closeDropdown();
      },
      error: (err) => console.error('Ошибка при отправке приглашения', err)
    });
  }

  rejectTest(id: string): void {
    if (!confirm('Вы уверены, что хотите отказать?')) return;
    this.http.patch(`${environment.apiUrlHR}/results/${id}/decision`, { "decision": false }).subscribe({
      next: () => {
        this.loadResults();
        this.closeDropdown();
      },
      error: (err) => console.error('Ошибка при отказе', err)
    });
  }

  deleteTest(testId: string): void {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;
    this.http.delete(`${environment.apiUrlHR}/results/${testId}`).subscribe({
      next: () => {
        this.loadResults();
        this.closeDropdown();
      },
      error: (err) => console.error('Ошибка при удалении теста', err)
    });
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return 'Не указан';
    // Format phone number logic here
    return phone;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU');
  }
}