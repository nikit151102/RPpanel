import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { VacationType, User } from '../../../vacation.interface.models';

interface AvailableWeek {
  startDate: Date;
  endDate: Date;
  weekNumber: number;
  isAvailable: boolean;
  availableSlots: number;
  totalSlots: number;
  reason?: string;
}

interface WeekPeriod {
  id: string;
  label: string;
  weeks: number;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-create-user-vacation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-user-vacation-modal.component.html',
  styleUrls: ['./create-user-vacation-modal.component.scss']
})
export class CreateUserVacationModalComponent {
  @Input() vacationForUserForm!: FormGroup;
  @Input() users: User[] = [];
  @Input() vacationTypes: any[] = [];
  @Input() vacationForUser: any = {};
  @Input() selectedPeriodForUser: string = 'week';
  @Input() availableWeeksUser: AvailableWeek[] = [];
  @Input() isLoading = false;
  @Input() isLoadingWeeks = false;

  @Output() close = new EventEmitter<void>();
  @Output() userSelect = new EventEmitter<void>();
  @Output() selectPeriod = new EventEmitter<string>();
  @Output() openWeekSelector = new EventEmitter<void>();
  @Output() openCheckLimits = new EventEmitter<void>();
  @Output() selectWeek = new EventEmitter<AvailableWeek>();
  @Output() submit = new EventEmitter<void>();

  weekPeriods: WeekPeriod[] = [
    { 
      id: 'week', 
      label: '1 неделя', 
      weeks: 1, 
      description: 'Стандартный отпуск (7 дней)', 
      icon: 'calendar-week',
      color: '#3b82f6'
    },
    { 
      id: 'two-weeks', 
      label: '2 недели', 
      weeks: 2, 
      description: 'Длительный отпуск (14 дней)', 
      icon: 'calendar-alt',
      color: '#10b981'
    }
  ];

  formatDisplayDate(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStartDate(): string {
    const startDate = this.vacationForUserForm.get('start_date')?.value;
    return startDate ? this.formatDisplayDate(new Date(startDate)) : '';
  }

  getEndDate(): string {
    const endDate = this.vacationForUserForm.get('end_date')?.value;
    return endDate ? this.formatDisplayDate(new Date(endDate)) : '';
  }

  getTotalDays(): number {
    return this.vacationForUserForm.get('total_days')?.value || 0;
  }

  onPeriodClick(periodId: string): void {
    this.selectPeriod.emit(periodId);
  }
}