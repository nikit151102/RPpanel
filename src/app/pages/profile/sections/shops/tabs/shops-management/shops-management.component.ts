import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../../../../services/store.service';
import { ScheduleService } from '../../../../../../services/schedule.service';
import { Store } from '../../../../../../interfaces/store.interface';
import { CreateStoreModalComponent } from './modals/create-store-modal/create-store-modal.component';
import { EditScheduleModalComponent } from './modals/edit-schedule-modal/edit-schedule-modal.component';
import { ExceptionDayModalComponent } from './modals/exception-day-modal/exception-day-modal.component';
import { ExceptionDay, WorkingHour } from '../../../../../../interfaces/schedule.interface';

interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasException: boolean;
  exception?: ExceptionDay;
}

@Component({
  selector: 'app-shops-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CreateStoreModalComponent,
    EditScheduleModalComponent,
    ExceptionDayModalComponent
  ],
  templateUrl: './shops-management.component.html',
  styleUrl: './shops-management.component.scss'
})
export class ShopsManagementComponent implements OnInit {
  activeTab: 'stores' | 'schedules' | 'exceptions' = 'stores';
  stores: Store[] = [];
  filteredStores: Store[] = [];
  selectedStore: Store | null = null;
  searchQuery: string = '';

  // Modal states
  showCreateStoreModal = false;
  showEditScheduleModal = false;
  showExceptionModal = false;
  selectedException: ExceptionDay | null = null;
  selectedDateForException: string = '';

  // Schedules
  workingHours: WorkingHour[] = [];
  exceptionDays: ExceptionDay[] = [];
  allExceptionDays: ExceptionDay[] = [];
  weekDays = [
    { id: 1, name: 'Понедельник' },
    { id: 2, name: 'Вторник' },
    { id: 3, name: 'Среда' },
    { id: 4, name: 'Четверг' },
    { id: 5, name: 'Пятница' },
    { id: 6, name: 'Суббота' },
    { id: 0, name: 'Воскресенье' }
  ];

  // Calendar
  currentMonth: Date = new Date();
  calendarDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  calendarDates: CalendarDate[] = [];

  // Loading states
  isLoading = {
    stores: false,
    schedules: false,
    exceptions: false
  };

  constructor(
    private storeService: StoreService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.loadStores();
    this.generateCalendar();
  }

  // Navigation
  selectTab(tab: any) {
    this.activeTab = tab;
    if (tab === 'schedules' && this.selectedStore) {
      this.loadStoreSchedules();
    }
    if (tab === 'exceptions') {
      this.loadAllExceptions();
    }
  }

  getTabLabel(tab: string): string {
    const labels: { [key: string]: string } = {
      'stores': 'Магазины',
      'schedules': 'Расписания',
      'exceptions': 'Исключения'
    };
    return labels[tab] || tab;
  }

  // Modal handlers
  openCreateStoreModal() {
    this.showCreateStoreModal = true;
  }

  closeCreateStoreModal() {
    this.showCreateStoreModal = false;
  }

  onStoreCreated(store: Store) {
    this.stores.push(store);
    this.filteredStores = [...this.stores];
    this.selectedStore = store;
  }

  openEditScheduleModal() {
    if (this.selectedStore) {
      this.showEditScheduleModal = true;
    }
  }

  closeEditScheduleModal() {
    this.showEditScheduleModal = false;
  }

  onScheduleSaved(hours: WorkingHour[]) {
    this.workingHours = hours;
    // Reload store schedules to reflect changes
    this.loadStoreSchedules();
  }

  openCreateExceptionModal(date?: string) {
    if (this.selectedStore) {
      this.selectedDateForException = date || '';
      this.selectedException = null;
      this.showExceptionModal = true;
    }
  }

  openEditExceptionModal(exception: ExceptionDay) {
    this.selectedException = exception;
    this.showExceptionModal = true;
  }

  closeExceptionModal() {
    this.showExceptionModal = false;
    this.selectedException = null;
    this.selectedDateForException = '';
  }

  onExceptionSaved(exception: ExceptionDay) {
    const index = this.exceptionDays.findIndex(e => e.id === exception.id);
    if (index >= 0) {
      this.exceptionDays[index] = exception;
    } else {
      this.exceptionDays.push(exception);
    }
    this.exceptionDays = [...this.exceptionDays];
    
    // Update all exceptions for calendar
    this.updateAllExceptions();
  }

  // Stores Management
  loadStores() {
    this.isLoading.stores = true;
    this.storeService.getStores().subscribe({
      next: (stores: any) => {
        this.stores = stores.data;
        this.filteredStores = stores.data;
        this.isLoading.stores = false;
        
        // Select first store by default
        if (stores.length > 0 && !this.selectedStore) {
          this.selectedStore = stores[0];
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.isLoading.stores = false;
      }
    });
  }

  selectStore(store: Store) {
    this.selectedStore = store;
    if (this.activeTab === 'schedules') {
      this.loadStoreSchedules();
    }
  }

  filterStores() {
    if (!this.searchQuery) {
      this.filteredStores = this.stores;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredStores = this.stores.filter(store =>
      store.name1C?.toLowerCase().includes(query) ||
      store.code?.toLowerCase().includes(query) ||
      store.address?.city?.toLowerCase().includes(query) ||
      store.address?.street?.toLowerCase().includes(query) ||
      store.address?.region?.toLowerCase().includes(query)
    );
  }

  editStore(store: Store) {
    // Implementation for store editing
    console.log('Edit store:', store);
    // You can implement edit modal similar to create modal
  }

  deleteStore(storeId: string) {
    if (confirm('Вы уверены, что хотите удалить этот магазин?')) {
      this.storeService.deleteStore(storeId).subscribe({
        next: () => {
          this.stores = this.stores.filter(s => s.id !== storeId);
          this.filteredStores = this.filteredStores.filter(s => s.id !== storeId);
          if (this.selectedStore?.id === storeId) {
            this.selectedStore = this.stores.length > 0 ? this.stores[0] : null;
          }
        },
        error: (error) => console.error('Error deleting store:', error)
      });
    }
  }

  // Statistics
  get activeStoresCount(): number {
    return this.stores.filter(store => store.isActive).length;
  }

  get storesWithScheduleCount(): number {
    return this.stores.filter(store => store.storeScheduleId).length;
  }

  // Schedules Management
  loadStoreSchedules() {
    if (!this.selectedStore) return;

    this.isLoading.schedules = true;

    // Load working hours if schedule exists
    if (this.selectedStore.storeScheduleId) {
      this.scheduleService.getWorkingHours(this.selectedStore.storeScheduleId).subscribe({
        next: (hours: any) => {
          this.workingHours = hours.data;
          this.isLoading.schedules = false;
        },
        error: (error) => {
          console.error('Error loading working hours:', error);
          this.isLoading.schedules = false;
        }
      });
    } else {
      this.workingHours = [];
      this.isLoading.schedules = false;
    }

    // Load exception days
    this.scheduleService.getExceptionDays(this.selectedStore.id).subscribe({
      next: (exceptions) => {
        this.exceptionDays = exceptions;
      },
      error: (error) => console.error('Error loading exception days:', error)
    });
  }

  getDaySchedule(dayOfWeek: number): WorkingHour | null {
    return this.workingHours.find(hour => hour.dayOfWeek === dayOfWeek) || null;
  }

  createScheduleForStore() {
    if (this.selectedStore) {
      this.scheduleService.createStoreSchedule({
        storeId: this.selectedStore.id
      }).subscribe({
        next: (schedule) => {
          // Update store with new schedule ID
          this.selectedStore!.storeScheduleId = schedule.id;
          this.showEditScheduleModal = true;
        },
        error: (error) => console.error('Error creating schedule:', error)
      });
    }
  }

  // Exception Days Management
  deleteException(exceptionId: string) {
    if (confirm('Вы уверены, что хотите удалить этот день исключения?')) {
      this.scheduleService.deleteExceptionDay(exceptionId).subscribe({
        next: () => {
          this.exceptionDays = this.exceptionDays.filter(e => e.id !== exceptionId);
          this.updateAllExceptions();
        },
        error: (error) => console.error('Error deleting exception:', error)
      });
    }
  }

  loadAllExceptions() {
    this.isLoading.exceptions = true;
    this.scheduleService.getAllExceptionDays().subscribe({
      next: (exceptions) => {
        this.allExceptionDays = exceptions;
        this.generateCalendar();
        this.isLoading.exceptions = false;
      },
      error: (error) => {
        console.error('Error loading all exceptions:', error);
        this.isLoading.exceptions = false;
      }
    });
  }

  updateAllExceptions() {
    // Reload all exceptions to keep calendar updated
    this.loadAllExceptions();
  }

  // Calendar Management
  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay() + (startDate.getDay() === 0 ? -6 : 1));
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.calendarDates = [];
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const date = new Date(currentDate);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Check if this date has any exceptions
      const hasException = this.allExceptionDays.some(exception => {
        const exceptionDate = new Date(exception.date);
        return exceptionDate.toDateString() === date.toDateString();
      });
      
      const exception = this.allExceptionDays.find(e => {
        const exceptionDate = new Date(e.date);
        return exceptionDate.toDateString() === date.toDateString();
      });
      
      this.calendarDates.push({
        date: new Date(date),
        isCurrentMonth,
        isToday,
        hasException,
        exception
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  onCalendarDateClick(date: CalendarDate) {
    if (date.hasException && date.exception) {
      this.openEditExceptionModal(date.exception);
    } else {
      const dateString = date.date.toISOString().split('T')[0];
      this.openCreateExceptionModal(dateString);
    }
  }

  // Helper methods
  getStoreAddress(store: Store): string {
    if (!store.address) return 'Адрес не указан';
    
    const parts = [
      store.address.city,
      store.address.street,
      store.address.house
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ') || 'Адрес не указан';
  }

  getStoreName(storeId: string): string {
    const store = this.stores.find(s => s.id === storeId);
    return store?.name1C || 'Неизвестный магазин';
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  }

  get upcomingExceptions(): ExceptionDay[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.allExceptionDays
      .filter(exception => {
        const exceptionDate = new Date(exception.date);
        return exceptionDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }
}