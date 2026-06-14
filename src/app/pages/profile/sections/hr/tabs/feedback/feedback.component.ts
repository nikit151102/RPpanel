// feedback.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedBacks: any[] = [];
  isLoading: boolean = false;

  statuses = [
    { name: 'Отработана', code: 'worked' },
    { name: 'Не отработана', code: 'not_worked' },
  ];

  selectedStatus: string = '';
  dropdownStates: { [key: string]: boolean } = {};
  selectedStatuses: { [key: string]: string } = {};

  // Pagination
  currentPage: number = 1;
  rowsPerPage: number = 25;
  totalPages: number = 1;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    this.feedbackService.getFeedback().subscribe({
      next: (value: any) => {
        this.feedBacks = value;
        this.assignStatuses();
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading feedbacks:', error);
        this.isLoading = false;
        this.showNotification('Ошибка загрузки обращений', 'error');
      }
    });
  }

  assignStatuses(): void {
    this.feedBacks.forEach((feedback: any) => {
      const status = this.statuses.find(status => status.code === feedback.status);
      if (status) {
        this.selectedStatuses[feedback.id] = status.name;
      } else {
        this.selectedStatuses[feedback.id] = '';
      }
    });
  }

  toggleDropdown(feedbackId: string): void {
    // Close all other dropdowns
    Object.keys(this.dropdownStates).forEach(id => {
      if (id !== feedbackId) {
        this.dropdownStates[id] = false;
      }
    });
    
    // Toggle current dropdown
    this.dropdownStates[feedbackId] = !this.dropdownStates[feedbackId];
  }

  selectStatus(feedBack: any, status: any): void {
    this.feedbackService.setStatusFeedback(feedBack.id, status.code).subscribe({
      next: (value: any) => {
        this.selectedStatuses[feedBack.id] = status.name;
        this.dropdownStates[feedBack.id] = false;
        this.showNotification('Статус успешно обновлен', 'success');
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.showNotification('Ошибка обновления статуса', 'error');
      }
    });
  }

  // Pagination methods
  get paginatedFeedbacks() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.feedBacks.slice(start, end);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.rowsPerPage, this.feedBacks.length);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.feedBacks.length / this.rowsPerPage);
    // Ensure current page is within bounds
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1 && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onRowsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    // Можно реализовать кастомные уведомления или использовать alert
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  }
}