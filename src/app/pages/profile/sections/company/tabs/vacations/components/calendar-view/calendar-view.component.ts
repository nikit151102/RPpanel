import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacation, VacationStatus, VacationType, User } from '../../vacation.interface.models';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
  isOtherMonth: boolean;
  vacations: Vacation[];
  vacationCount: number;
}

interface CalendarWeek {
  days: CalendarDay[];
}

interface CalendarMonth {
  weeks: CalendarWeek[];
  month: number;
  year: number;
  monthName: string;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  @Input() vacations: Vacation[] = [];
  @Input() vacationStatuses: any[] = [];
  @Input() vacationTypes: any[] = [];
  @Input() currentUser: User | null = null;
  @Input() isDirector = false;
  @Input() isDeputyDirector = false;
  @Input() isStoreManager = false;
  @Input() managedStore: string | null = null;

  @Output() openDayDetails = new EventEmitter<CalendarDay>();
  @Output() openApproveModal = new EventEmitter<Vacation>();

  VacationStatus = VacationStatus;
  daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  daysOfWeekFull = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  calendar: CalendarMonth = {
    weeks: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    monthName: ''
  };

  viewMode: 'month' | 'week' = 'month';
  showWeekends = true;
  selectedDayInfo: CalendarDay | null = null;
  isInfoPanelOpen = false;

  // Для отслеживания свайпов
  private touchStartX = 0;
  private touchEndX = 0;
  private readonly SWIPE_THRESHOLD = 50;

  ngOnInit(): void {
    this.generateCalendar(this.calendar.month, this.calendar.year);
  }

  @HostListener('window:resize')
  onResize(): void {
    // Перегенерируем календарь при изменении размера окна
    this.generateCalendar(this.calendar.month, this.calendar.year);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > this.SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Свайп влево - следующий месяц
        this.nextMonth();
      } else {
        // Свайп вправо - предыдущий месяц
        this.prevMonth();
      }
    }
  }

  generateCalendar(month: number, year: number): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.monthName = this.months[month];
    
    const weeks: CalendarWeek[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Начинаем с понедельника
    let startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -5 : 2 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diff);
    
    // Определяем количество строк в зависимости от вида
    const rows = this.viewMode === 'month' ? 6 : 1;
    
    for (let week = 0; week < rows; week++) {
      const days: CalendarDay[] = [];
      
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7 + day));
        
        const dayNumber = currentDate.getDate();
        const isToday = this.isSameDay(currentDate, new Date());
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const isOtherMonth = currentDate.getMonth() !== month;
        
        const dayVacations = this.getVacationsForDate(currentDate);
        
        days.push({
          date: currentDate,
          dayNumber,
          isToday,
          isWeekend,
          isOtherMonth,
          vacations: dayVacations,
          vacationCount: dayVacations.length
        });
      }
      
      weeks.push({ days });
    }
    
    this.calendar.weeks = weeks;
  }

  private getVacationsForDate(date: Date): Vacation[] {
    return this.vacations.filter(vacation => {
      const startDate = new Date(vacation.start_date);
      const endDate = new Date(vacation.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      
      return date >= startDate && date <= endDate;
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  prevMonth(): void {
    if (this.calendar.month === 0) {
      this.calendar.month = 11;
      this.calendar.year--;
    } else {
      this.calendar.month--;
    }
    this.generateCalendar(this.calendar.month, this.calendar.year);
    this.selectedDayInfo = null;
  }

  nextMonth(): void {
    if (this.calendar.month === 11) {
      this.calendar.month = 0;
      this.calendar.year++;
    } else {
      this.calendar.month++;
    }
    this.generateCalendar(this.calendar.month, this.calendar.year);
    this.selectedDayInfo = null;
  }

  goToToday(): void {
    const today = new Date();
    this.calendar.month = today.getMonth();
    this.calendar.year = today.getFullYear();
    this.generateCalendar(this.calendar.month, this.calendar.year);
    this.selectedDayInfo = null;
    this.scrollToToday();
  }

  scrollToToday(): void {
    const todayElement = document.querySelector('.today');
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getVacationStatusClass(status: VacationStatus): string {
    switch(status) {
      case VacationStatus.APPROVED: return 'approved';
      case VacationStatus.PENDING: return 'pending';
      case VacationStatus.ACTIVE: return 'active';
      case VacationStatus.REJECTED: return 'rejected';
      case VacationStatus.CANCELLED: return 'cancelled';
      default: return '';
    }
  }

  getStatusColor(status: VacationStatus): string {
    const colors: { [key: string]: string } = {
      [VacationStatus.DRAFT]: '#9ca3af',
      [VacationStatus.PENDING]: '#ffd166',
      [VacationStatus.APPROVED]: '#06d6a0',
      [VacationStatus.REJECTED]: '#ef476f',
      [VacationStatus.CANCELLED]: '#6c757d',
      [VacationStatus.ACTIVE]: '#4361ee',
      [VacationStatus.COMPLETED]: '#8b5cf6',
      [VacationStatus.TRANSFERRED]: '#fbbf24'
    };
    return colors[status] || '#9ca3af';
  }

  getStatusLabel(status: VacationStatus): string {
    const statusObj = this.vacationStatuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
  }

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

  getFullDayName(shortName: string): string {
    const index = this.daysOfWeek.indexOf(shortName);
    return index >= 0 ? this.daysOfWeekFull[index] : shortName;
  }

  getVacationTooltip(vacation: Vacation): string {
    return `${vacation.user?.first_name} ${vacation.user?.last_name}\n` +
           `${this.getTypeLabel(vacation.vacation_type)}\n` +
           `${this.formatDisplayDate(vacation.start_date)} - ${this.formatDisplayDate(vacation.end_date)}\n` +
           `Статус: ${this.getStatusLabel(vacation.status)}`;
  }

  getVacationStatuses(): any[] {
    return this.vacationStatuses || [];
  }

  getVacationsByStatus(status: VacationStatus): Vacation[] {
    return this.vacations.filter(v => v.status === status);
  }

  getVacationsInMonth(): Vacation[] {
    const startOfMonth = new Date(this.calendar.year, this.calendar.month, 1);
    const endOfMonth = new Date(this.calendar.year, this.calendar.month + 1, 0);
    
    return this.vacations.filter(vacation => {
      const startDate = new Date(vacation.start_date);
      const endDate = new Date(vacation.end_date);
      
      return (startDate >= startOfMonth && startDate <= endOfMonth) ||
             (endDate >= startOfMonth && endDate <= endOfMonth) ||
             (startDate <= startOfMonth && endDate >= endOfMonth);
    });
  }

  getActiveVacationsCount(): number {
    const today = new Date();
    return this.getVacationsInMonth().filter(v => {
      const start = new Date(v.start_date);
      const end = new Date(v.end_date);
      return v.status === VacationStatus.ACTIVE || 
             (v.status === VacationStatus.APPROVED && today >= start && today <= end);
    }).length;
  }

  getUpcomingVacationsCount(): number {
    const today = new Date();
    return this.getVacationsInMonth().filter(v => {
      const start = new Date(v.start_date);
      return v.status === VacationStatus.APPROVED && start > today;
    }).length;
  }

  getBusiestDay(): CalendarDay | null {
    let busiestDay: CalendarDay | null = null;
    
    this.calendar.weeks.forEach(week => {
      week.days.forEach(day => {
        if (!busiestDay || day.vacationCount > busiestDay.vacationCount) {
          busiestDay = day;
        }
      });
    });
    
    return busiestDay;
  }

  getMonthProgress(): number {
    const today = new Date();
    if (today.getMonth() === this.calendar.month && today.getFullYear() === this.calendar.year) {
      const daysInMonth = this.getDaysInMonth();
      const currentDay = today.getDate();
      return (currentDay / daysInMonth) * 100;
    }
    return 0;
  }

  getDaysInMonth(): number {
    return new Date(this.calendar.year, this.calendar.month + 1, 0).getDate();
  }

  getCurrentDayOfMonth(): number {
    const today = new Date();
    if (today.getMonth() === this.calendar.month && today.getFullYear() === this.calendar.year) {
      return today.getDate();
    }
    return 0;
  }

  getApprovedCount(day: CalendarDay): number {
    return day.vacations.filter(v => v.status === VacationStatus.APPROVED).length;
  }

  getPendingCount(day: CalendarDay): number {
    return day.vacations.filter(v => v.status === VacationStatus.PENDING).length;
  }

  canApproveVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;

    if (this.isDirector) return true;

    if (this.isDeputyDirector) {
      const userDepartment = vacation.user?.department?.toLowerCase() || '';
      const isStoreEmployee = userDepartment.includes('магазин') || userDepartment.includes('store');
      return isStoreEmployee;
    }

    if (this.isStoreManager && this.managedStore) {
      const userDepartment = vacation.user?.department?.toLowerCase() || '';
      const isStoreEmployee = userDepartment.includes('магазин') || userDepartment.includes('store');
      const sameStore = vacation.user?.store_id === this.managedStore;
      return isStoreEmployee && sameStore;
    }

    return false;
  }

  exportCalendar(): void {
    const calendarData = {
      month: this.calendar.monthName,
      year: this.calendar.year,
      vacations: this.getVacationsInMonth()
    };
    
    const dataStr = JSON.stringify(calendarData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `отпуски_${this.calendar.monthName}_${this.calendar.year}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  printCalendar(): void {
    window.print();
  }

  toggleWeekends(): void {
    this.showWeekends = !this.showWeekends;
  }

  onDayClick(day: CalendarDay): void {
    this.selectedDayInfo = day;
    this.isInfoPanelOpen = true;
    this.openDayDetails.emit(day);
  }
}