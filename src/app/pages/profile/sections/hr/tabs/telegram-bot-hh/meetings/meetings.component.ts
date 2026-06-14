import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';

import localeRu from '@angular/common/locales/ru';
import { environment } from '../../../../../../../../evirement';

registerLocaleData(localeRu, 'ru');

interface Meeting {
  id: number;
  meeting_date: string;
  start_time: string;
  end_time: string;
  admin_link?: string;
  user_link?: string;
  phone?: string;
  user?: any;
}

interface UnavailableSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[] = [];
  unavailableSlots: UnavailableSlot[] = [];
  meetingForm: FormGroup;
  slotForm: FormGroup;
  linksForm: FormGroup;
  activeTab: 'meetings' | 'slots' = 'meetings';
  isEditingMeeting = false;
  currentMeetingId: number | null = null;
  isEditingSlot = false;
  currentSlotId: number | null = null;
  urlLink = environment.apiUrlHR;

  defaultMeetingForm!: FormGroup;
  showDefaultMeetingModal = false;
  isEditMode = false;
  editingMeetingId: number | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.meetingForm = this.fb.group({
      meeting_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      admin_link: [''],
      user_link: ['']
    });

    this.defaultMeetingForm = this.fb.group({
      meeting_date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      phone: [''],
      last_name: [''],
      first_name: [''],
      middle_name: [''],
    });

    this.slotForm = this.fb.group({
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    });

    this.linksForm = this.fb.group({
      admin_link: [''],
      user_link: ['']
    });
  }

  ngOnInit(): void {
    this.loadMeetings();
    this.loadUnavailableSlots();
  }

  // Новые методы для улучшенного UI
  getUpcomingMeetingsCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.meetings.filter(meeting => meeting.meeting_date >= today).length;
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString();
  }

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { month: 'short' });
  }

  formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  refreshData(): void {
    if (this.activeTab === 'meetings') {
      this.loadMeetings();
    } else {
      this.loadUnavailableSlots();
    }
  }

  // Остальные методы остаются без изменений
  openDefaultMeetingModal(): void {
    this.showDefaultMeetingModal = true;
  }

  loadMeetings(): void {
    this.http.get<Meeting[]>(`${this.urlLink}/meetings/`).subscribe({
      next: (data) => {
        this.meetings = data
          .map(m => ({
            ...m,
            meeting_date: this.formatDateForDisplay(m.meeting_date),
            start_time: this.formatTimeForDisplay(m.start_time),
            end_time: this.formatTimeForDisplay(m.end_time)
          }))
          .sort((a, b) => {
            const dateCompare = b.meeting_date.localeCompare(a.meeting_date);
            if (dateCompare !== 0) {
              return dateCompare;
            }
            return a.start_time.localeCompare(b.start_time);
          });
      },
      error: (err) => console.error('Error loading meetings:', err)
    });
  }

  loadUnavailableSlots(): void {
    this.http.get<UnavailableSlot[]>(`${this.urlLink}/meetings/unavailable/`).subscribe({
      next: (data) => {
        this.unavailableSlots = data.map(s => ({
          ...s,
          date: this.formatDateForDisplay(s.date),
          start_time: this.formatTimeForDisplay(s.start_time),
          end_time: this.formatTimeForDisplay(s.end_time)
        }));
      },
      error: (err) => console.error('Error loading unavailable slots:', err)
    });
  }

  formatDateForDisplay(dateStr: string): string {
    return formatDate(dateStr, 'yyyy-MM-dd', 'en-US');
  }

  formatTimeForDisplay(timeStr: string): string {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  formatDateForApi(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
  }

  formatPhoneNumber(phone: any): string {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    } else if (cleaned.length === 10) {
      return `+7 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    }
    
    return phone;
  }






  onMeetingSubmit(): void {
    if (this.meetingForm.invalid) return;

    const formData = {
      ...this.meetingForm.value,
      meeting_date: this.formatDateForApi(this.meetingForm.value.meeting_date)
    };

    if (this.isEditingMeeting && this.currentMeetingId) {
      this.http.put<Meeting>(`${this.urlLink}/meetings/${this.currentMeetingId}/`, formData).subscribe({
        next: () => {
          this.loadMeetings();
          this.resetMeetingForm();
        },
        error: (err) => console.error('Error updating meeting:', err)
      });
    } else {
      this.http.post<Meeting>(`${environment.apiUrlHR}/meetings/`, formData).subscribe({
        next: () => {
          this.loadMeetings();
          this.resetMeetingForm();
        },
        error: (err) => console.error('Error creating meeting:', err)
      });
    }
  }

  onSlotSubmit(): void {
    if (this.slotForm.invalid) return;

    const formData = {
      ...this.slotForm.value,
      date: this.formatDateForApi(this.slotForm.value.date)
    };

    if (this.isEditingSlot && this.currentSlotId) {
      this.http.put<UnavailableSlot>(`${this.urlLink}/meetings/unavailable/${this.currentSlotId}/`, formData).subscribe({
        next: () => {
          this.loadUnavailableSlots();
          this.resetSlotForm();
        },
        error: (err) => console.error('Error updating slot:', err)
      });
    } else {
      this.http.post<UnavailableSlot>(`${this.urlLink}/meetings/unavailable/`, formData).subscribe({
        next: () => {
          this.loadUnavailableSlots();
          this.resetSlotForm();
        },
        error: (err) => console.error('Error creating slot:', err)
      });
    }
  }

  onUpdateLinks(meetingId: number): void {
    if (this.linksForm.invalid) return;

    this.http.patch<Meeting>(`${this.urlLink}/meetings/${meetingId}/links`, this.linksForm.value).subscribe({
      next: () => {
        this.loadMeetings();
        this.linksForm.reset();
      },
      error: (err) => console.error('Error updating links:', err)
    });
  }



  editSlot(slot: UnavailableSlot): void {
    this.isEditingSlot = true;
    this.currentSlotId = slot.id;
    this.slotForm.patchValue({
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time
    });
  }

  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.http.delete(`${environment.apiUrlHR}/meetings/${id}`).subscribe({
        next: () => this.loadMeetings(),
        error: (err) => console.error('Error deleting meeting:', err)
      });
    }
  }

  deleteSlot(id: number): void {
    if (confirm('Are you sure you want to delete this unavailable slot?')) {
      this.http.delete(`${environment.apiUrlHR}/meetings/unavailable/${id}`).subscribe({
        next: () => this.loadUnavailableSlots(),
        error: (err) => console.error('Error deleting slot:', err)
      });
    }
  }

  resetMeetingForm(): void {
    this.meetingForm.reset();
    this.isEditingMeeting = false;
    this.currentMeetingId = null;
  }

  resetSlotForm(): void {
    this.slotForm.reset();
    this.isEditingSlot = false;
    this.currentSlotId = null;
  }

  setActiveTab(tab: 'meetings' | 'slots'): void {
    this.activeTab = tab;
  }








  editMeeting(meeting: any): void {
    this.isEditMode = true;
    this.editingMeetingId = meeting.id;
    this.showDefaultMeetingModal = true;
    this.defaultMeetingForm.patchValue({
      meeting_date: meeting.meeting_date,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      last_name: meeting?.user?.last_name,
      first_name: meeting?.user?.first_name,
      middle_name: meeting?.user?.middle_name,
      phone: meeting?.phone,
    });

  }


  onSubmitMeeting(): void {
    if (this.defaultMeetingForm.invalid) return;

    const formData = {
      ...this.defaultMeetingForm.value,
      meeting_date: this.formatDateForApi(this.defaultMeetingForm.value.meeting_date)
    };

    if (this.isEditMode && this.editingMeetingId) {
      // === PUT для обновления ===
      this.http.put(`${this.urlLink}/meetings/default/${this.editingMeetingId}`, formData).subscribe({
        next: () => {
          this.loadMeetings();
          this.closeDefaultMeetingModal();
        },
        error: (err) => console.error('Ошибка при редактировании встречи:', err)
      });
    } else {
      // === POST для создания ===
      this.http.post(`${this.urlLink}/meetings/default`, formData).subscribe({
        next: () => {
          this.loadMeetings();
          this.closeDefaultMeetingModal();
        },
        error: (err) => console.error('Ошибка при создании встречи:', err)
      });
    }
  }

  closeDefaultMeetingModal(): void {
    this.showDefaultMeetingModal = false;
    this.isEditMode = false;
    this.editingMeetingId = null;
    this.defaultMeetingForm.reset();
  }

}