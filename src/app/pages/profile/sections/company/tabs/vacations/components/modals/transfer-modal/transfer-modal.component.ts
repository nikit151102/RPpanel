import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Vacation, VacationStatus } from '../../../vacation.interface.models';
import { VacationService } from '../../../vacation.service';

@Component({
  selector: 'app-transfer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
export class TransferModalComponent {
  @Input() currentVacation: Vacation | null = null;
  @Input() transferForm!: FormGroup;
  @Input() vacationService!: VacationService;
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() transferDatesChange = new EventEmitter<void>();
  @Output() transfer = new EventEmitter<void>();

  formatDisplayDate(dateStr: any): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

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

  onDatesChange(): void {
    const startDate = new Date(this.transferForm.get('new_start_date')?.value);
    const endDate = new Date(this.transferForm.get('new_end_date')?.value);
    
    if (startDate && endDate && startDate <= endDate) {
      const totalDays = this.vacationService.calculateTotalDays(startDate, endDate);
      const workDays = this.vacationService.calculateWorkDays(startDate, endDate);
      
      this.transferForm.patchValue({
        total_days: totalDays,
        work_days: workDays
      });
    }
    this.transferDatesChange.emit();
  }
}