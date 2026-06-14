import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExceptionDay } from '../../../../../../../../interfaces/schedule.interface';
import { ScheduleService } from '../../../../../../../../services/schedule.service';

@Component({
  selector: 'app-exception-day-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './exception-day-modal.component.html',
  styleUrl: './exception-day-modal.component.scss'
})
export class ExceptionDayModalComponent {
  @Input() storeId!: string;
  @Input() exception?: ExceptionDay | null;
  @Input() initialDate?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() exceptionSaved = new EventEmitter<ExceptionDay>();

  exceptionData: any = {
    date: '',
    isClosed: false,
    openTime: '09:00',
    closeTime: '18:00',
    storeId: ''
  };

  isLoading = false;
  minDate = new Date().toISOString().split('T')[0];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    if (this.initialDate) {
      this.exceptionData.date = this.initialDate;
    }
    
    if (this.exception) {
      this.exceptionData = { ...this.exception };
    }
    
    this.exceptionData.storeId = this.storeId;
  }

  closeModal() {
    this.closed.emit();
  }

  onClosedChange(event: Event) {
    const isClosed = (event.target as HTMLInputElement).checked;
    if (isClosed) {
      this.exceptionData.openTime = '';
      this.exceptionData.closeTime = '';
    } else {
      this.exceptionData.openTime = '09:00';
      this.exceptionData.closeTime = '18:00';
    }
  }

  isFormValid(): boolean {
    return !!this.exceptionData.date && !!this.exceptionData.storeId;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;

      const request = this.exception
        ? this.scheduleService.updateExceptionDay(this.exception.id, this.exceptionData)
        : this.scheduleService.createExceptionDay(this.exceptionData);

      request.subscribe({
        next: (exception) => {
          this.isLoading = false;
          this.exceptionSaved.emit(exception);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error saving exception:', error);
          this.isLoading = false;
          alert('Ошибка при сохранении дня исключения');
        }
      });
    }
  }
}
