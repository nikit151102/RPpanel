import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkingHour } from '../../../../../../../../interfaces/schedule.interface';
import { ScheduleService } from '../../../../../../../../services/schedule.service';

@Component({
  selector: 'app-edit-schedule-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-schedule-modal.component.html',
  styleUrl: './edit-schedule-modal.component.scss'
})
export class EditScheduleModalComponent implements OnInit {
  @Input() storeId!: string;
  @Input() scheduleId!: string;
  @Input() existingHours: WorkingHour[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() scheduleSaved = new EventEmitter<WorkingHour[]>();

  weekDays = [
    { id: 1, name: 'Понедельник' },
    { id: 2, name: 'Вторник' },
    { id: 3, name: 'Среда' },
    { id: 4, name: 'Четверг' },
    { id: 5, name: 'Пятница' },
    { id: 6, name: 'Суббота' },
    { id: 0, name: 'Воскресенье' }
  ];

  workingHours: { [key: number]: WorkingHour } = {};
  isLoading = false;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.initializeWorkingHours();
  }

  initializeWorkingHours() {
    // Initialize with default values
    this.weekDays.forEach(day => {
      this.workingHours[day.id] = {
        id: '',
        dayOfWeek: day.id,
        openTime: '09:00',
        closeTime: '18:00',
        storeScheduleId: this.scheduleId
      };
    });

    // Override with existing data
    this.existingHours.forEach(hour => {
      this.workingHours[hour.dayOfWeek] = { ...hour };
    });
  }

  isDayClosed(dayOfWeek: number): boolean {
    const hour = this.workingHours[dayOfWeek];
    return !hour || !hour.openTime || !hour.closeTime;
  }

  toggleDay(dayOfWeek: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (!isChecked) {
      // Mark as closed
      this.workingHours[dayOfWeek].openTime = '';
      this.workingHours[dayOfWeek].closeTime = '';
    } else {
      // Set default working hours
      this.workingHours[dayOfWeek].openTime = '09:00';
      this.workingHours[dayOfWeek].closeTime = '18:00';
    }
  }

    onTimeChange(dayOfWeek: number, field: 'openTime' | 'closeTime', event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.workingHours[dayOfWeek]) {
      this.workingHours[dayOfWeek][field] = value;
    }
  }

  
  getOpenTime(dayOfWeek: number): string {
    return this.workingHours[dayOfWeek]?.openTime || '';
  }

  getCloseTime(dayOfWeek: number): string {
    return this.workingHours[dayOfWeek]?.closeTime || '';
  }

  closeModal() {
    this.closed.emit();
  }

  async saveSchedule() {
    this.isLoading = true;
    
    try {
      const hoursToSave = Object.values(this.workingHours).filter(hour => 
        hour.openTime && hour.closeTime
      );

      // Save each working hour
      const savedHours: WorkingHour[] = [];
      for (const hour of hoursToSave) {
        if (hour.id) {
          // Update existing
          const updated = await this.scheduleService.updateWorkingHour(hour.id, {
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime
          }).toPromise();
          savedHours.push(updated!);
        } else {
          // Create new
          const created = await this.scheduleService.createWorkingHour({
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime
          }).toPromise();
          savedHours.push(created!);
        }
      }

      this.scheduleSaved.emit(savedHours);
      this.closeModal();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Ошибка при сохранении расписания');
    } finally {
      this.isLoading = false;
    }
  }
}