import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserInstance, StorePlanType, StorePlanInstanceCreateDto } from '../../../../../../../interfaces/store-plan.interface';
import { Store } from '../../../../../../../interfaces/store.interface';

@Component({
  selector: 'app-create-plan-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-plan-modal.component.html',
  styleUrls: ['./create-plan-modal.component.scss']
})
export class CreatePlanModalComponent implements OnInit {
  @Input() stores: Store[] = [];
  @Input() planTypes: StorePlanType[] = [];
  @Input() users: UserInstance[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() planCreated = new EventEmitter<any>();

  newPlan: any = {
    dateTime: new Date().toISOString(),
    beginDateTime: '',
    endDateTime: '',
    storeId: '',
    monthPlan: 1,
    monthPlanAccountant: 1
  };

  isSubmitting = false;

  // Month and year selection
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  months = [
    { value: 0, name: 'Январь' },
    { value: 1, name: 'Февраль' },
    { value: 2, name: 'Март' },
    { value: 3, name: 'Апрель' },
    { value: 4, name: 'Май' },
    { value: 5, name: 'Июнь' },
    { value: 6, name: 'Июль' },
    { value: 7, name: 'Август' },
    { value: 8, name: 'Сентябрь' },
    { value: 9, name: 'Октябрь' },
    { value: 10, name: 'Ноябрь' },
    { value: 11, name: 'Декабрь' }
  ];

  years: number[] = [];

  ngOnInit() {
    this.generateYears();
    this.updateDates();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    // Generate years from current year - 2 to current year + 2
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  updateDates() {
    // Get first day of selected month at 00:00:00 local time
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1, 0, 0, 0, 0);
    // Get last day of selected month at 23:59:59 local time
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0, 23, 59, 59, 999);

    // Convert to ISO string without timezone adjustment
    this.newPlan.beginDateTime = this.formatDateToISO(firstDay);
    this.newPlan.endDateTime = this.formatDateToISO(lastDay);
  }

  // Format date to ISO string without timezone shift
  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  }

  // Alternative method using UTC to avoid timezone issues
  private formatDateToUTC(date: Date): string {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  onMonthYearChange() {
    this.updateDates();
  }

  closeModal() {
    this.closed.emit();
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Validate form
    if (!this.newPlan.storeId) {
      alert('Пожалуйста, выберите магазин');
      this.isSubmitting = false;
      return;
    }

    // Ensure dates are correctly formatted before submission
    this.finalizeDates();

    // Simulate API call
    setTimeout(() => {
      const createdPlan = {
        ...this.newPlan
      };

      this.planCreated.emit(createdPlan);
      this.isSubmitting = false;
      this.closeModal();
    }, 1000);
  }


  private generatePlanNumber(): void {
    const month = (this.selectedMonth + 1).toString().padStart(2, '0');
    const store = this.stores.find(s => s.id === this.newPlan.storeId);

    if (store?.code) {
      // Clean and validate store code
      const cleanCode = store.code.trim().toUpperCase().replace(/\s+/g, '');

      if (cleanCode && cleanCode.length > 0) {
        this.newPlan.number = `МП-${cleanCode}-${this.selectedYear}${month}`;
      } else {
        this.newPlan.number = `МП-${this.selectedYear}${month}`;
      }
    } else {
      this.newPlan.number = `МП-${this.selectedYear}${month}`;
    }
  }

  // Final date formatting before submission
  private finalizeDates() {
    // Use UTC dates to avoid timezone issues
    const firstDay = new Date(Date.UTC(this.selectedYear, this.selectedMonth, 1, 0, 0, 0, 0));
    const lastDay = new Date(Date.UTC(this.selectedYear, this.selectedMonth + 1, 0, 23, 59, 59, 999));

    this.newPlan.beginDateTime = firstDay.toISOString();
    this.newPlan.endDateTime = lastDay.toISOString();
  }

  getPeriodDisplay(): string {
    return `${this.months[this.selectedMonth].name} ${this.selectedYear}`;
  }

  // Helper method to get formatted date for display
  getFormattedBeginDate(): string {
    if (!this.newPlan.beginDateTime) return '';
    const date = new Date(this.newPlan.beginDateTime);
    return date.toLocaleDateString('ru-RU');
  }

  getFormattedEndDate(): string {
    if (!this.newPlan.endDateTime) return '';
    const date = new Date(this.newPlan.endDateTime);
    return date.toLocaleDateString('ru-RU');
  }

  // Helper method to get month name
  getMonthName(month: number): string {
    return this.months.find(m => m.value === month)?.name || '';
  }
}