import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacation, VacationStatus } from '../../../vacation.interface.models';

@Component({
  selector: 'app-cancel-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-modal.component.html',
  styleUrls: ['./cancel-modal.component.scss']
})
export class CancelModalComponent {
  @Input() currentVacation: Vacation | null = null;
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getStatusLabel(status: VacationStatus): string {
    const statusLabels: { [key in VacationStatus]?: string } = {
      [VacationStatus.PENDING]: 'На согласовании',
      [VacationStatus.APPROVED]: 'Утвержден',
      [VacationStatus.ACTIVE]: 'Активен',
      [VacationStatus.REJECTED]: 'Отклонен',
      [VacationStatus.CANCELLED]: 'Отменен'
    };
    return statusLabels[status] || status;
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
}