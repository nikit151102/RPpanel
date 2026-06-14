import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vacation, VacationStatus, VacationType, User } from '../../../vacation.interface.models';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  isOtherMonth: boolean;
  vacations: Vacation[];
  vacationCount: number;
}

@Component({
  selector: 'app-day-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './day-details-modal.component.html',
  styleUrls: ['./day-details-modal.component.scss']
})
export class DayDetailsModalComponent implements OnInit, OnDestroy {
  @Input() selectedDay: CalendarDay | null = null;
  @Input() selectedDayVacations: Vacation[] = [];
  @Input() vacationStatuses: any[] = [];
  @Input() vacationTypes: any[] = [];
  @Input() currentUser: User | null = null;
  @Input() isDirector = false;
  @Input() isDeputyDirector = false;
  @Input() isStoreManager = false;
  @Input() managedStore: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() openApproveModal = new EventEmitter<Vacation>();
  @Output() openRejectModal = new EventEmitter<Vacation>();
  @Output() openCreateForUserModal = new EventEmitter<void>();

  VacationStatus = VacationStatus;
  statusFilter: string = 'all';
  filteredVacations: Vacation[] = [];
  
  // Анимационные состояния
  showAnimation = true;
  private animationTimeout: any;

  ngOnInit(): void {
    this.filteredVacations = [...this.selectedDayVacations];
    
    // Автоматически скрываем анимацию через 2 секунды
    this.animationTimeout = setTimeout(() => {
      this.showAnimation = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  // Фильтрация
  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.statusFilter === 'all') {
      this.filteredVacations = [...this.selectedDayVacations];
    } else {
      this.filteredVacations = this.selectedDayVacations.filter(vacation => {
        switch(this.statusFilter) {
          case 'pending': return vacation.status === VacationStatus.PENDING;
          case 'approved': return vacation.status === VacationStatus.APPROVED;
          case 'active': return vacation.status === VacationStatus.ACTIVE;
          default: return true;
        }
      });
    }
  }

  // Статистика
  getPendingCount(): number {
    return this.selectedDayVacations.filter(v => v.status === VacationStatus.PENDING).length;
  }

  getApprovedCount(): number {
    return this.selectedDayVacations.filter(v => v.status === VacationStatus.APPROVED).length;
  }

  getActiveCount(): number {
    return this.selectedDayVacations.filter(v => v.status === VacationStatus.ACTIVE).length;
  }

  // Вспомогательные методы
  getUserInitials(user: any): string {
    if (!user) return '??';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  }

  getDayName(date: Date | undefined): string {
    if (!date) return '';
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  }

  getPluralEnding(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) return '';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'а';
    return 'ов';
  }

  getStatusColor(status: VacationStatus): string {
    const colors: { [key: string]: string } = {
      [VacationStatus.DRAFT]: 'linear-gradient(135deg, #9ca3af, #6b7280)',
      [VacationStatus.PENDING]: 'linear-gradient(135deg, #f59e0b, #d97706)',
      [VacationStatus.APPROVED]: 'linear-gradient(135deg, #10b981, #059669)',
      [VacationStatus.REJECTED]: 'linear-gradient(135deg, #ef4444, #dc2626)',
      [VacationStatus.CANCELLED]: 'linear-gradient(135deg, #6b7280, #4b5563)',
      [VacationStatus.ACTIVE]: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      [VacationStatus.COMPLETED]: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      [VacationStatus.TRANSFERRED]: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    };
    return colors[status] || '#6b7280';
  }

  getStatusLabel(status: VacationStatus): string {
    const statusObj = this.vacationStatuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
  }

  getTypeLabel(type: VacationType): string {
    const typeObj = this.vacationTypes?.find((t: any) => t.value === type);
    return typeObj?.label || type;
  }

  getStatusIcon(status: VacationStatus): string {
    switch(status) {
      case VacationStatus.APPROVED: return 'fa-check-circle';
      case VacationStatus.PENDING: return 'fa-clock';
      case VacationStatus.ACTIVE: return 'fa-sun';
      case VacationStatus.REJECTED: return 'fa-times-circle';
      case VacationStatus.CANCELLED: return 'fa-ban';
      case VacationStatus.COMPLETED: return 'fa-check-double';
      case VacationStatus.TRANSFERRED: return 'fa-exchange-alt';
      default: return 'fa-calendar';
    }
  }

  formatDisplayDate(dateStr: any): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(' г.', '');
  }

  canApproveVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;
    if (this.isDirector) return true;

    if (this.isDeputyDirector) {
      const userDepartment = vacation.user?.department?.toLowerCase() || '';
      const isStoreEmployee = userDepartment.includes('магазин') || userDepartment.includes('store');
      return isStoreEmployee;
    }

    if (this.isStoreManager && this.managedStore) {
      const userDepartment = vacation.user?.department?.toLowerCase() || '';
      const isStoreEmployee = userDepartment.includes('магазин') || userDepartment.includes('store');
      const sameStore = vacation.user?.store_id === this.managedStore;
      return isStoreEmployee && sameStore;
    }

    return false;
  }

  // Дополнительные функции
  exportDayData(): void {
    // Реализация экспорта данных
    console.log('Экспорт данных дня:', this.selectedDay);
  }

  // Открытие модального окна создания отпуска
  onCreateVacationClick(): void {
    this.openCreateForUserModal.emit();
  }
}