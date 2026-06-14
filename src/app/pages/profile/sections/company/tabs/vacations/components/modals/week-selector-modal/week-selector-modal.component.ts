import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../vacation.interface.models';

interface AvailableWeek {
  startDate: Date;
  endDate: Date;
  weekNumber: number;
  isAvailable: boolean;
  availableSlots: number;
  totalSlots: number;
  reason?: string;
}

@Component({
  selector: 'app-week-selector-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-selector-modal.component.html',
  styleUrls: ['./week-selector-modal.component.scss']
})
export class WeekSelectorModalComponent {
  @Input() selectedUser: User | null = null;
  @Input() selectedPeriodForUser: string = 'week';
  @Input() availableWeeksUser: AvailableWeek[] = [];
  @Input() isLoadingWeeks = false;

  @Output() close = new EventEmitter<void>();
  @Output() selectWeek = new EventEmitter<AvailableWeek>();

  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onWeekSelect(week: AvailableWeek): void {
    if (week.isAvailable) {
      this.selectWeek.emit(week);
    }
  }
}