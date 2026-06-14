import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Input() searchTerm = '';
  @Input() selectedStatus = '';
  @Input() selectedType = '';
  @Input() showCalendarView = false;
  @Input() vacationStatuses: any[] = [];
  @Input() vacationTypes: any[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() toggleView = new EventEmitter<boolean>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onStatusChange(value: string): void {
    this.statusChange.emit(value);
  }

  onTypeChange(value: string): void {
    this.typeChange.emit(value);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  onToggleView(isCalendar: boolean): void {
    this.toggleView.emit(isCalendar);
  }
}