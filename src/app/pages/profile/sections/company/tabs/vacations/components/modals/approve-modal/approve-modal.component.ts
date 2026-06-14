import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacation, VacationType } from '../../../vacation.interface.models';

@Component({
  selector: 'app-approve-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.scss']
})
export class ApproveModalComponent {
  @Input() currentVacation: Vacation | null = null;
  @Input() vacationTypes: any[] = [];
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();

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
}