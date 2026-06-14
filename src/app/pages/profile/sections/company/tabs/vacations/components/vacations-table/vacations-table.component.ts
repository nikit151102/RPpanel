import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacation, VacationStatus, VacationType, User } from '../../vacation.interface.models';

@Component({
  selector: 'app-vacations-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacations-table.component.html',
  styleUrls: ['./vacations-table.component.scss']
})
export class VacationsTableComponent {
  @Input() vacations: Vacation[] = [];
  @Input() vacationStatuses: any[] = [];
  @Input() vacationTypes: any[] = [];
  @Input() currentUser: User | null = null;
  @Input() managedStore: string | null = null;
  @Input() isDirector = false;
  @Input() isDeputyDirector = false;
  @Input() isStoreManager = false;
  VacationType = VacationType
  VacationStatus = VacationStatus

  @Output() openApproveModal = new EventEmitter<Vacation>();
  @Output() openRejectModal = new EventEmitter<Vacation>();
  @Output() openCancelModal = new EventEmitter<Vacation>();
  @Output() openTransferModal = new EventEmitter<Vacation>();
  @Output() openUserSummary = new EventEmitter<User>();
  @Output() openCheckLimitsModal = new EventEmitter<Vacation>();

  getStatusColor(status: VacationStatus): string {
    const colors: { [key: string]: string } = {
      [VacationStatus.DRAFT]: '#9ca3af',
      [VacationStatus.PENDING]: '#f59e0b',
      [VacationStatus.APPROVED]: '#10b981',
      [VacationStatus.REJECTED]: '#ef4444',
      [VacationStatus.CANCELLED]: '#6b7280',
      [VacationStatus.ACTIVE]: '#3b82f6',
      [VacationStatus.COMPLETED]: '#8b5cf6',
      [VacationStatus.TRANSFERRED]: '#fbbf24'
    };
    return colors[status] || '#9ca3af';
  }

  getTypeLabel(type: VacationType): string {
    const typeObj = this.vacationTypes?.find((t: any) => t.value === type);
    return typeObj?.label || type;
  }

  getStatusLabel(status: VacationStatus): string {
    const statusObj = this.vacationStatuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
  }

  formatDisplayDate(dateStr: any): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[date.getDay()];
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

  canCancelVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;

    if (vacation.user_id === this.currentUser.id) {
      return vacation.status === VacationStatus.PENDING || vacation.status === VacationStatus.APPROVED;
    }

    return this.canApproveVacation(vacation);
  }

  canTransferVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;

    if (vacation.status !== VacationStatus.APPROVED) return false;

    if (vacation.user_id === this.currentUser.id) return true;

    return this.canApproveVacation(vacation);
  }

  isVacationActive(vacation: Vacation): boolean {
    if (vacation.status !== VacationStatus.APPROVED) return false;
    const now = new Date();
    const start = new Date(vacation.start_date);
    const end = new Date(vacation.end_date);
    return now >= start && now <= end;
  }

  getStatusClass(status: VacationStatus): string {
    switch (status) {
      case VacationStatus.APPROVED: return 'status-approved';
      case VacationStatus.PENDING: return 'status-pending';
      case VacationStatus.REJECTED: return 'status-rejected';
      case VacationStatus.CANCELLED: return 'status-cancelled';
      case VacationStatus.ACTIVE: return 'status-active';
      default: return '';
    }
  }

  getUserInitials(user: User | undefined): string {
    if (!user) return '?';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  }

  getVacationDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}