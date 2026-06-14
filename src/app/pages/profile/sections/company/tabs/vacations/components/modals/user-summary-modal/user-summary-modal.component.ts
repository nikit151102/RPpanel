import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserVacationSummary, Vacation, VacationStatus, VacationType } from '../../../vacation.interface.models';

@Component({
  selector: 'app-user-summary-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-summary-modal.component.html',
  styleUrls: ['./user-summary-modal.component.scss']
})
export class UserSummaryModalComponent {
  @Input() selectedUser: any | null = null;
  @Input() userVacationSummary: UserVacationSummary | null = null;
  @Input() vacationStatuses: any[] = [];
  @Input() vacationTypes: any[] = [];
  @Input() currentUser: User | null = null;
  @Input() isDirector = false;
  @Input() isDeputyDirector = false;
  @Input() isStoreManager = false;
  @Input() managedStore: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() openCreateForUserModal = new EventEmitter<void>();
  @Output() openApproveModal = new EventEmitter<Vacation>();

  VacationStatus = VacationStatus;

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

  getStatusLabel(status: VacationStatus): string {
    const statusObj = this.vacationStatuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
  }

  getTypeLabel(type: VacationType): string {
    const typeObj = this.vacationTypes?.find((t: any) => t.value === type);
    return typeObj?.label || type;
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
}