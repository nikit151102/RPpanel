import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { VacationService } from './vacation.service';
import {
  Vacation,
  VacationCreate,
  VacationUpdate,
  VacationStatus,
  VacationType,
  User,
  UserVacationSummary
} from './vacation.interface.models';

// Компоненты
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentNavigationComponent } from './components/department-navigation/department-navigation.component';
import { FiltersComponent } from './components/filters/filters.component';
import { VacationsTableComponent } from './components/vacations-table/vacations-table.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';

// Модальные окна
import { CreateVacationModalComponent } from './components/modals/create-vacation-modal/create-vacation-modal.component';
import { CreateUserVacationModalComponent } from './components/modals/create-user-vacation-modal/create-user-vacation-modal.component';
import { ApproveModalComponent } from './components/modals/approve-modal/approve-modal.component';
import { RejectModalComponent } from './components/modals/reject-modal/reject-modal.component';
import { CancelModalComponent } from './components/modals/cancel-modal/cancel-modal.component';
import { TransferModalComponent } from './components/modals/transfer-modal/transfer-modal.component';
import { UserSummaryModalComponent } from './components/modals/user-summary-modal/user-summary-modal.component';
import { StoreSelectorModalComponent } from './components/modals/store-selector-modal/store-selector-modal.component';
import { WeekSelectorModalComponent } from './components/modals/week-selector-modal/week-selector-modal.component';
import { LimitsCheckModalComponent } from './components/modals/limits-check-modal/limits-check-modal.component';
import { DayDetailsModalComponent } from './components/modals/day-details-modal/day-details-modal.component';

// Интерфейсы
interface DepartmentVacations {
  name: string;
  icon: string;
  color: string;
  vacations: Vacation[];
  visible: boolean;
}

interface Store {
  id: string;
  name: string;
  address?: string;
  manager?: User;
  employeeCount: number;
}

interface AvailableWeek {
  startDate: Date;
  endDate: Date;
  weekNumber: number;
  isAvailable: boolean;
  availableSlots: number;
  totalSlots: number;
  departmentName?: string;
  isSelected?: boolean;
  vacationsInWeek?: Vacation[];
  reason?: string;
}

@Component({
  selector: 'app-vacation-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Компоненты
    NotificationsComponent,
    HeaderComponent,
    DashboardComponent,
    DepartmentNavigationComponent,
    FiltersComponent,
    VacationsTableComponent,
    CalendarViewComponent,
    // Модальные окна
    CreateVacationModalComponent,
    CreateUserVacationModalComponent,
    ApproveModalComponent,
    RejectModalComponent,
    CancelModalComponent,
    TransferModalComponent,
    UserSummaryModalComponent,
    StoreSelectorModalComponent,
    WeekSelectorModalComponent,
    LimitsCheckModalComponent,
    DayDetailsModalComponent
  ],
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.scss']
})
export class VacationManagementComponent implements OnInit, OnDestroy {
  // Данные
  currentUser: User | null = null;
  users: User[] = [];
  vacations: Vacation[] = [];
  allStores: Store[] = [];
  approvalQueue: Vacation[] = [];
  userStores: any[] = [];

  // Отделы
  departments: DepartmentVacations[] = [
    { name: 'Все магазины', icon: 'store', color: '#3b82f6', vacations: [], visible: true },
    { name: 'Офис', icon: 'building', color: '#10b981', vacations: [], visible: true },
    { name: 'Склад', icon: 'warehouse', color: '#f59e0b', vacations: [], visible: true }
  ];

  // Права доступа
  isDirector = false;
  isDeputyDirector = false;
  isStoreManager = false;
  isOfficeEmployee = false;
  userPermissionLevel: string = 'none';

  // Меняемый магазин для менеджера
  managedStore: string | null = null;
  managedStoreName: string = '';

  // Доступные недели для отпуска
  availableWeeksUser: AvailableWeek[] = [];
  selectedPeriodForUser: string = 'week';

  // Фильтры
  searchTerm = '';
  selectedStatus: string = '';
  selectedType: string = '';
  activeDepartment = 'Все магазины';

  // Визуальные настройки
  showCalendarView = true;
  isLoading = false;
  isLoadingWeeks = false;

  // Модальные окна состояния
  modalState = {
    showCreateVacation: false,
    showCreateForUser: false,
    showApprove: false,
    showReject: false,
    showCancel: false,
    showTransfer: false,
    showWeekSelector: false,
    showWeekSelectorForUser: false,
    showUserSummary: false,
    showStoreSelector: false,
    showVacationLimits: false,
    showDayDetails: false,
    showStoreSelectorForManager: false
  };

  // Данные форм
  newVacation: VacationCreate = {
    vacation_type: VacationType.ANNUAL,
    start_date: '',
    end_date: '',
    total_days: 0,
    work_days: 0,
    comment: ''
  };

  vacationForUser: any = {
    user_id: '',
    user_name: '',
    vacation_type: VacationType.ANNUAL,
    start_date: '',
    end_date: '',
    total_days: 0,
    work_days: 0,
    comment: '',
    period_type: 'week'
  };

  currentVacation: Vacation | null = null;
  selectedUser: User | null = null;
  userVacationSummary: UserVacationSummary | null = null;
  vacationLimitsCheck: any = null;

  // Данные для модальных окон
  selectedDayVacations: Vacation[] = [];
  selectedDay: any = null;

  // Формы
  vacationForm!: FormGroup;
  vacationForUserForm!: FormGroup;
  rejectForm!: FormGroup;
  transferForm!: FormGroup;
  storeSelectorForm!: FormGroup;
  managerStoreSelectorForm!: FormGroup;

  // Подписки
  private subscriptions = new Subscription();

  // Уведомления
  notifications: { type: string; message: string; timestamp: Date }[] = [];

  // Вспомогательные
  vacationTypes: any;
  vacationStatuses: any;

  // Публичный доступ к сервису для дочерних компонентов
  constructor(
    public vacationService: VacationService, // Изменено на public
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ========== ИНИЦИАЛИЗАЦИЯ ФОРМ ==========

  private initForms(): void {
    this.vacationForm = this.fb.group({
      vacation_type: [VacationType.ANNUAL, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_days: [0, [Validators.required, Validators.min(1)]],
      work_days: [0, Validators.required],
      comment: ['']
    });

    this.vacationForUserForm = this.fb.group({
      user_id: ['', Validators.required],
      vacation_type: [VacationType.ANNUAL, Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_days: [0, [Validators.required, Validators.min(1)]],
      work_days: [0, Validators.required],
      comment: ['']
    });

    this.rejectForm = this.fb.group({
      rejection_reason: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.transferForm = this.fb.group({
      new_start_date: ['', Validators.required],
      new_end_date: ['', Validators.required],
      total_days: [0, [Validators.required, Validators.min(1)]],
      work_days: [0, Validators.required],
      transfer_reason: ['', Validators.required]
    });

    this.managerStoreSelectorForm = this.fb.group({
      store_id: ['', Validators.required]
    });
  }

  // ========== ЗАГРУЗКА ДАННЫХ ==========

  private loadCurrentUser(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.vacationService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.setUserPermissions(user);
          this.loadInitialData();
        },
        error: (err) => {
          console.error('Ошибка загрузки пользователя:', err);
          this.showNotification('error', 'Ошибка загрузки данных пользователя');
          this.isLoading = false;
        }
      })
    );
  }

  private setUserPermissions(user: User): void {
    const position = user.position?.toLowerCase() || '';
    
    this.isDirector = position.includes('директор') && !position.includes('заместитель');
    this.isDeputyDirector = position.includes('заместитель директора по сбыту');
    this.isStoreManager = position.includes('управляющий обособленным подразделением');
    this.isOfficeEmployee = !this.isDirector && !this.isDeputyDirector && !this.isStoreManager;
    
    if (this.isDirector) {
      this.userPermissionLevel = 'all';
    } else if (this.isDeputyDirector) {
      this.userPermissionLevel = 'all_stores';
    } else if (this.isStoreManager) {
      this.userPermissionLevel = 'store';
    } else {
      this.userPermissionLevel = 'own';
    }
  }

  private loadInitialData(): void {
    this.isLoading = true;

    // Загружаем типы и статусы
    this.vacationTypes = this.vacationService.getVacationTypes();
    this.vacationStatuses = this.vacationService.getVacationStatuses();

    const observables: Observable<any>[] = [
      this.vacationService.getAllUsers(),
      this.loadVacations()
    ];

    if (this.isStoreManager && this.currentUser) {
      observables.push(this.vacationService.getUserStores(this.currentUser.id));
    }

    if (this.isDirector || this.isDeputyDirector || this.isStoreManager) {
      observables.push(this.vacationService.getApprovalQueue());
    }

    this.subscriptions.add(
      forkJoin(observables).pipe(
        catchError(err => {
          console.error('Ошибка загрузки данных:', err);
          this.showNotification('error', 'Ошибка загрузки данных');
          this.isLoading = false;
          return of([[], [], [], []]);
        })
      ).subscribe({
        next: (results) => {
          let index = 0;
          
          this.users = results[index++] as User[];
          
          if (this.isStoreManager && results[index]) {
            this.userStores = results[index++] as any[];
            if (this.userStores.length > 0) {
              const firstStore = this.userStores[0];
              this.managedStore = firstStore.store_id;
              this.managedStoreName = `Магазин ${firstStore.store_id}`;
            }
          }
          
          if ((this.isDirector || this.isDeputyDirector || this.isStoreManager) && results[index]) {
            this.approvalQueue = results[index++] as Vacation[];
          }
          
          this.isLoading = false;
          this.separateVacationsByDepartment();
          this.showNotification('success', 'Данные успешно загружены');
        },
        error: (err) => {
          console.error('Ошибка в подписке:', err);
          this.showNotification('error', 'Ошибка загрузки данных');
          this.isLoading = false;
        }
      })
    );
  }

  private loadVacations(): any {
    return this.vacationService.getVacations().pipe(
      map(vacations => {
        this.vacations = vacations;
        this.separateVacationsByDepartment();
        return vacations;
      }),
      catchError(err => {
        console.error('Ошибка загрузки отпусков:', err);
        this.showNotification('error', 'Ошибка загрузки отпусков');
        return of([]);
      })
    );
  }

  // ========== ОТДЕЛЫ ==========

  private separateVacationsByDepartment(): void {
    this.departments.forEach(dept => {
      if (dept.name === 'Все магазины') {
        dept.vacations = this.vacations.filter(v =>
          v.user?.department?.toLowerCase().includes('магазин') ||
          v.user?.department?.toLowerCase().includes('store')
        );
      } else if (dept.name === 'Офис') {
        dept.vacations = this.vacations.filter(v =>
          v.user?.department?.toLowerCase().includes('офис') ||
          v.user?.department?.toLowerCase().includes('office')
        );
      } else if (dept.name === 'Склад') {
        dept.vacations = this.vacations.filter(v =>
          v.user?.department?.toLowerCase().includes('склад') ||
          v.user?.department?.toLowerCase().includes('warehouse')
        );
      }
    });
  }

  // ========== ФИЛЬТРАЦИЯ ==========

  onFilterChange(): void {
    // Логика фильтрации будет в дочерних компонентах
  }

  // ========== МОДАЛЬНЫЕ ОКНА ==========

  openCreateVacationModal(): void {
    // Вычисляем ближайший понедельник
    const nextMonday = this.getNextMonday(new Date());
    const endDate = this.calculateEndDate(nextMonday, 'week' as any);
    
    // Рассчитываем рабочие дни
    const workDays = this.vacationService.calculateWorkDays(nextMonday, endDate);
    const totalDays = 7;

    // Заполняем форму
    this.vacationForm.patchValue({
      vacation_type: VacationType.ANNUAL,
      start_date: this.formatDate(nextMonday),
      end_date: this.formatDate(endDate),
      total_days: totalDays,
      work_days: workDays,
      comment: ''
    });

    this.modalState.showCreateVacation = true;
  }

  openCreateForUserModal(): void {
    this.vacationForUser = {
      user_id: '',
      user_name: '',
      vacation_type: VacationType.ANNUAL,
      start_date: '',
      end_date: '',
      total_days: 0,
      work_days: 0,
      comment: '',
      period_type: 'week'
    };
    
    this.vacationForUserForm.reset({
      vacation_type: VacationType.ANNUAL,
      period_type: 'week'
    });
    
    this.modalState.showCreateForUser = true;
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ДЛЯ ФОРМ ==========

  onUserSelectForVacation(): void {
    const userId = this.vacationForUserForm.get('user_id')?.value;
    if (userId) {
      const selectedUser = this.users.find(u => u.id === userId);
      if (selectedUser) {
        this.vacationForUser.user_id = userId;
        this.vacationForUser.user_name = `${selectedUser.first_name} ${selectedUser.last_name}`;
        this.vacationForUserForm.patchValue({
          user_id: userId
        });
      }
    }
  }

  selectPeriodForUser(periodId: string): void {
    this.selectedPeriodForUser = periodId;
    this.vacationForUser.period_type = periodId;
  }

  openWeekSelectorForUser(): void {
    const userId = this.vacationForUserForm.get('user_id')?.value;
    if (!userId) {
      this.showNotification('warning', 'Выберите сотрудника');
      return;
    }

    this.selectedUser = this.users.find(u => u.id === userId) || null;
    if (!this.selectedUser) {
      this.showNotification('error', 'Сотрудник не найден');
      return;
    }

    this.loadAvailableWeeksForUser();
    this.modalState.showWeekSelectorForUser = true;
  }

  async loadAvailableWeeksForUser(): Promise<void> {
    if (!this.selectedUser) return;

    this.isLoadingWeeks = true;
    const year = new Date().getFullYear();
    const weeks: AvailableWeek[] = [];
    
    // Генерируем 12 недель вперед
    for (let i = 0; i < 12; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 7));
      
      // Начинаем с понедельника
      const day = startDate.getDay();
      const diff = day === 0 ? 1 : 8 - day;
      startDate.setDate(startDate.getDate() + diff);
      
      const endDate = new Date(startDate);
      const weeksCount = this.selectedPeriodForUser === 'week' ? 6 : 13;
      endDate.setDate(endDate.getDate() + weeksCount);
      
      const weekNumber = this.getWeekNumber(startDate);
      
      // Проверяем доступность через API
      try {
        const checkResult = await this.vacationService.quickAvailabilityCheck(
          startDate,
          endDate,
          this.selectedUser.id
        ).toPromise();
        
        weeks.push({
          startDate,
          endDate,
          weekNumber,
          isAvailable: checkResult.is_available,
          availableSlots: checkResult.is_available ? 1 : 0,
          totalSlots: 1,
          reason: !checkResult.is_available ? this.getReasonsFromCheck(checkResult) : undefined
        });
        
      } catch (error) {
        weeks.push({
          startDate,
          endDate,
          weekNumber,
          isAvailable: true, // По умолчанию доступно если ошибка
          availableSlots: 1,
          totalSlots: 1,
          reason: 'Ошибка проверки доступности'
        });
      }
    }
    
    this.availableWeeksUser = weeks;
    this.isLoadingWeeks = false;
  }

  private getReasonsFromCheck(checkResult: any): string {
    const reasons: string[] = [];
    
    if (checkResult.department_check && !checkResult.department_check.allowed) {
      reasons.push('Ограничения отдела');
    }
    
    if (checkResult.store_check && !checkResult.store_check.allowed) {
      reasons.push('Ограничения магазина');
    }
    
    if (checkResult.seasonal_check && !checkResult.seasonal_check.allowed) {
      reasons.push('Сезонные ограничения');
    }
    
    if (checkResult.overlap_check && checkResult.overlap_check.has_overlap) {
      reasons.push('Пересечение с существующим отпуском');
    }
    
    return reasons.join(', ');
  }

  selectWeekForUser(week: AvailableWeek): void {
    if (!week.isAvailable) {
      this.showNotification('warning', `Неделя недоступна: ${week.reason}`);
      return;
    }

    const startDate = week.startDate;
    const endDate = new Date(startDate);
    const weeksCount = this.selectedPeriodForUser === 'week' ? 6 : 13;
    endDate.setDate(endDate.getDate() + weeksCount);

    const totalDays = this.selectedPeriodForUser === 'week' ? 7 : 14;
    const workDays = this.vacationService.calculateWorkDays(startDate, endDate);

    this.vacationForUserForm.patchValue({
      start_date: this.formatDate(startDate),
      end_date: this.formatDate(endDate),
      total_days: totalDays,
      work_days: workDays
    });

    this.modalState.showWeekSelectorForUser = false;
    this.showNotification('success', 'Неделя выбрана');
  }

  openApproveModal(vacation: Vacation): void {
    if (!this.canApproveVacation(vacation)) {
      this.showNotification('warning', 'У вас нет прав для утверждения этого отпуска');
      return;
    }
    
    this.currentVacation = vacation;
    this.modalState.showApprove = true;
  }

  openRejectModal(vacation: Vacation): void {
    if (!this.canApproveVacation(vacation)) {
      this.showNotification('warning', 'У вас нет прав для отклонения этого отпуска');
      return;
    }
    
    this.currentVacation = vacation;
    this.rejectForm.reset();
    this.modalState.showReject = true;
  }

  openCancelModal(vacation: Vacation): void {
    if (!this.canCancelVacation(vacation)) {
      this.showNotification('warning', 'У вас нет прав для отмены этого отпуска');
      return;
    }
    
    this.currentVacation = vacation;
    this.modalState.showCancel = true;
  }

  openTransferModal(vacation: Vacation): void {
    if (!this.canTransferVacation(vacation)) {
      this.showNotification('warning', 'У вас нет прав для переноса этого отпуска');
      return;
    }
    
    this.currentVacation = vacation;
    
    // Предлагаем новые даты (следующий месяц)
    const newStartDate = new Date(vacation.start_date);
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    
    const newEndDate = new Date(vacation.end_date);
    newEndDate.setMonth(newEndDate.getMonth() + 1);
    
    const totalDays = this.vacationService.calculateTotalDays(newStartDate, newEndDate);
    const workDays = this.vacationService.calculateWorkDays(newStartDate, newEndDate);
    
    this.transferForm.patchValue({
      new_start_date: this.formatDate(newStartDate),
      new_end_date: this.formatDate(newEndDate),
      total_days: totalDays,
      work_days: workDays,
      transfer_reason: ''
    });
    
    this.modalState.showTransfer = true;
  }

  onTransferDatesChange(): void {
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
  }

  openUserSummary(user: User): void {
    this.selectedUser = user;
    this.isLoading = true;

    this.subscriptions.add(
      this.vacationService.getUserVacationSummary(user.id).subscribe({
        next: (summary) => {
          this.userVacationSummary = summary;
          this.modalState.showUserSummary = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки сводки:', err);
          this.showNotification('error', 'Не удалось загрузить информацию о пользователе');
          this.isLoading = false;
        }
      })
    );
  }

  openStoreSelectorForManager(): void {
    if (!this.isStoreManager || this.userStores.length === 0) {
      this.showNotification('warning', 'У вас нет доступных магазинов');
      return;
    }
    
    this.managerStoreSelectorForm.patchValue({
      store_id: this.managedStore || this.userStores[0].store_id
    });
    
    this.modalState.showStoreSelectorForManager = true;
  }

  openCheckLimitsModal(vacation?: Vacation): void {
    this.currentVacation = vacation || null;
    this.vacationLimitsCheck = null;
    this.modalState.showVacationLimits = true;
  }

  openDayDetails(day: any): void {
    if (day.vacations.length === 0) return;
    
    this.selectedDay = day;
    this.selectedDayVacations = day.vacations;
    this.modalState.showDayDetails = true;
  }

  closeAllModals(): void {
    // Сброс всех модальных окон
    Object.keys(this.modalState).forEach(key => {
      (this.modalState as any)[key] = false;
    });

    this.currentVacation = null;
    this.selectedUser = null;
    this.userVacationSummary = null;
    this.vacationLimitsCheck = null;
    this.selectedDay = null;
    this.selectedDayVacations = [];

    this.vacationForm.reset();
    this.vacationForUserForm.reset();
    this.rejectForm.reset();
    this.transferForm.reset();
    this.storeSelectorForm?.reset();
    this.managerStoreSelectorForm.reset();
  }

  // ========== ДЕЙСТВИЯ ==========

  approveVacation(): void {
    if (!this.currentVacation) return;

    this.isLoading = true;
    this.subscriptions.add(
      this.vacationService.approveVacation(this.currentVacation.id).subscribe({
        next: () => {
          this.modalState.showApprove = false;
          this.loadVacations();
          this.currentVacation = null;
          this.showNotification('success', 'Отпуск успешно утвержден');
        },
        error: (err) => {
          console.error('Ошибка утверждения отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка утверждения отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  rejectVacation(): void {
    if (!this.currentVacation || this.rejectForm.invalid) {
      this.showNotification('error', 'Укажите причину отклонения');
      return;
    }

    this.isLoading = true;
    const rejectionReason = this.rejectForm.get('rejection_reason')?.value;

    this.subscriptions.add(
      this.vacationService.rejectVacation(this.currentVacation.id, rejectionReason).subscribe({
        next: () => {
          this.modalState.showReject = false;
          this.loadVacations();
          this.currentVacation = null;
          this.rejectForm.reset();
          this.showNotification('success', 'Отпуск отклонен');
        },
        error: (err) => {
          console.error('Ошибка отклонения отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка отклонения отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  cancelVacation(): void {
    if (!this.currentVacation) return;

    this.isLoading = true;
    this.subscriptions.add(
      this.vacationService.cancelVacation(this.currentVacation.id).subscribe({
        next: () => {
          this.modalState.showCancel = false;
          this.loadVacations();
          this.currentVacation = null;
          this.showNotification('success', 'Отпуск отменен');
        },
        error: (err) => {
          console.error('Ошибка отмены отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка отмены отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  transferVacation(): void {
    if (!this.currentVacation || this.transferForm.invalid) {
      this.showNotification('error', 'Заполните все поля');
      return;
    }

    this.isLoading = true;
    const updateData: VacationUpdate = {
      start_date: this.transferForm.get('new_start_date')?.value,
      end_date: this.transferForm.get('new_end_date')?.value,
      total_days: this.transferForm.get('total_days')?.value,
      work_days: this.transferForm.get('work_days')?.value,
      comment: this.transferForm.get('transfer_reason')?.value
    };

    this.subscriptions.add(
      this.vacationService.updateVacation(this.currentVacation.id, updateData).subscribe({
        next: () => {
          this.modalState.showTransfer = false;
          this.loadVacations();
          this.currentVacation = null;
          this.transferForm.reset();
          this.showNotification('success', 'Отпуск перенесен');
        },
        error: (err) => {
          console.error('Ошибка переноса отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка переноса отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  createVacation(): void {
    if (this.vacationForm.invalid) {
      this.markFormGroupTouched(this.vacationForm);
      this.showNotification('error', 'Заполните все обязательные поля');
      return;
    }

    this.isLoading = true;
    const vacationData: VacationCreate = this.vacationForm.value;

    this.subscriptions.add(
      this.vacationService.createVacation(vacationData).subscribe({
        next: (createdVacation) => {
          this.modalState.showCreateVacation = false;
          this.loadVacations();
          this.vacationForm.reset();
          this.showNotification('success', 'Отпуск успешно создан');
        },
        error: (err) => {
          console.error('Ошибка создания отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка создания отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  createVacationForUser(): void {
    if (this.vacationForUserForm.invalid) {
      this.markFormGroupTouched(this.vacationForUserForm);
      this.showNotification('error', 'Заполните все обязательные поля');
      return;
    }

    const userId = this.vacationForUserForm.get('user_id')?.value;
    if (!userId) {
      this.showNotification('error', 'Выберите сотрудника');
      return;
    }

    this.isLoading = true;
    const vacationData: VacationCreate = {
      ...this.vacationForUserForm.value,
      user_id: userId
    };

    this.subscriptions.add(
      this.vacationService.createVacationForUser(userId, vacationData).subscribe({
        next: () => {
          this.modalState.showCreateForUser = false;
          this.loadVacations();
          this.vacationForUserForm.reset();
          this.showNotification('success', 'Отпуск успешно создан');
        },
        error: (err) => {
          console.error('Ошибка создания отпуска:', err);
          const errorMsg = err.error?.detail || err.error?.message || 'Ошибка создания отпуска';
          this.showNotification('error', errorMsg);
          this.isLoading = false;
        }
      })
    );
  }

  selectStoreForManager(): void {
    const storeId = this.managerStoreSelectorForm.get('store_id')?.value;
    if (storeId) {
      this.managedStore = storeId;
      const store = this.userStores.find(s => s.store_id === storeId);
      this.managedStoreName = store ? `Магазин ${store.store_id}` : `Магазин ${storeId}`;
      this.modalState.showStoreSelectorForManager = false;
      this.loadVacations();
      this.showNotification('success', `Выбран магазин: ${this.managedStoreName}`);
    }
  }

  checkVacationLimits(): void {
    const userId = this.vacationForUserForm.get('user_id')?.value;
    const startDate = this.vacationForUserForm.get('start_date')?.value;
    const endDate = this.vacationForUserForm.get('end_date')?.value;
    
    if (!userId || !startDate || !endDate) {
      this.showNotification('warning', 'Заполните данные об отпуске');
      return;
    }

    this.isLoading = true;
    const vacationData: VacationCreate = {
      user_id: userId,
      vacation_type: this.vacationForUserForm.get('vacation_type')?.value,
      start_date: startDate,
      end_date: endDate,
      total_days: this.vacationForUserForm.get('total_days')?.value,
      work_days: this.vacationForUserForm.get('work_days')?.value,
      comment: this.vacationForUserForm.get('comment')?.value
    };

    this.subscriptions.add(
      this.vacationService.checkVacationLimits(userId, vacationData).subscribe({
        next: (result) => {
          this.vacationLimitsCheck = result;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка проверки ограничений:', err);
          this.showNotification('error', 'Ошибка проверки ограничений');
          this.isLoading = false;
        }
      })
    );
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

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

  canCancelVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;
    
    if (vacation.user_id === this.currentUser.id) {
      return vacation.status === VacationStatus.PENDING || vacation.status === VacationStatus.APPROVED;
    }
    
    return this.canApproveVacation(vacation);
  }

  canTransferVacation(vacation: Vacation): boolean {
    if (!this.currentUser) return false;
    
    if (vacation.status !== VacationStatus.APPROVED) return false;
    
    if (vacation.user_id === this.currentUser.id) return true;
    
    return this.canApproveVacation(vacation);
  }

  // Вспомогательные методы для дат
  private getNextMonday(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? 1 : 8 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  private calculateEndDate(startDate: Date, period: string): Date {
    const endDate = new Date(startDate);
    const days = period === 'week' ? 6 : 13;
    endDate.setDate(endDate.getDate() + days);
    return endDate;
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getStatusColor(status: VacationStatus): string {
    const colors: { [key: string]: string } = {
      [VacationStatus.DRAFT]: '#9ca3af',
      [VacationStatus.PENDING]: '#f59e0b',
      [VacationStatus.APPROVED]: '#10b981',
      [VacationStatus.REJECTED]: '#ef4444',
      [VacationStatus.CANCELLED]: '#6b7280',
      [VacationStatus.ACTIVE]: '#3b82f6',
      [VacationStatus.COMPLETED]: '#8b5cf6',
      [VacationStatus.TRANSFERRED]: '#fbbf24'
    };
    return colors[status] || '#9ca3af';
  }

  getTypeLabel(type: VacationType): string {
    const typeObj = this.vacationTypes?.find((t: any) => t.value === type);
    return typeObj?.label || type;
  }

  getStatusLabel(status: VacationStatus): string {
    const statusObj = this.vacationStatuses?.find((s: any) => s.value === status);
    return statusObj?.label || status;
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // ========== УВЕДОМЛЕНИЯ ==========

  private showNotification(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    this.notifications.unshift({
      type,
      message,
      timestamp: new Date()
    });
    
    setTimeout(() => {
      if (this.notifications.length > 0) {
        this.notifications.pop();
      }
    }, 5000);
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }

  // ========== ОБНОВЛЕНИЕ ДАННЫХ ==========

  refreshData(): void {
    this.isLoading = true;
    this.loadInitialData();
    this.showNotification('info', 'Обновление данных...');
  }

  // ========== GETTERS ==========

  get approvedVacationsCount(): number {
    return this.vacations.filter(v => v.status === VacationStatus.APPROVED).length;
  }

  get pendingVacationsCount(): number {
    return this.vacations.filter(v => v.status === VacationStatus.PENDING).length;
  }

  get activeVacationsCount(): number {
    return this.vacations.filter(v => v.status === VacationStatus.ACTIVE).length;
  }

  get filteredVacations(): Vacation[] {
    const department = this.departments.find(d => d.name === this.activeDepartment);
    let filtered = department ? [...department.vacations] : [...this.vacations];
    
    if (this.selectedStatus) {
      filtered = filtered.filter(v => v.status === this.selectedStatus);
    }
    
    if (this.selectedType) {
      filtered = filtered.filter(v => v.vacation_type === this.selectedType);
    }
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        (v.user?.first_name?.toLowerCase() || '').includes(term) ||
        (v.user?.last_name?.toLowerCase() || '').includes(term) ||
        (v.user?.department?.toLowerCase() || '').includes(term) ||
        (v.user?.position?.toLowerCase() || '').includes(term) ||
        (v.comment?.toLowerCase() || '').includes(term)
      );
    }
    
    return filtered;
  }
}