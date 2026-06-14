import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import {
  Vacation,
  VacationCreate,
  VacationUpdate,
  VacationPlan,
  VacationTransfer,
  VacationBalance,
  CompanyHoliday,
  DashboardStats,
  VacationFilters,
  VacationStatus,
  VacationType,
  UserVacationSummary,
  QuickCheckResponse,
  CalendarAvailabilityResponse,
  UnavailablePeriodsResponse,
  User
} from './vacation.interface.models';
import { environment } from '../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private baseUrl = `${environment.apiAuthHubUrl}/vacations`;

  constructor(private http: HttpClient) { }

  // ========== ПОЛЬЗОВАТЕЛИ ==========
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiAuthHubUrl}/users/me`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiAuthHubUrl}/users/`);
  }

  // ========== ОТПУСКА ==========
  getVacations(filters?: VacationFilters): Observable<Vacation[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Vacation[]>(`${this.baseUrl}/`, { params });
  }

  getVacationById(id: string): Observable<Vacation> {
    return this.http.get<Vacation>(`${this.baseUrl}/${id}`);
  }

  createVacation(vacationData: VacationCreate): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/me`, vacationData);
  }

  createVacationForUser(userId: string, vacationData: VacationCreate): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${userId}`, vacationData);
  }

  updateVacation(id: string, vacationData: VacationUpdate): Observable<Vacation> {
    return this.http.put<Vacation>(`${this.baseUrl}/${id}`, vacationData);
  }

  deleteVacation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  approveVacation(id: string): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectVacation(id: string, rejectionReason: string): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/reject`, { rejection_reason: rejectionReason });
  }

  cancelVacation(id: string): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/cancel`, {});
  }

  checkVacationLimits(userId: string, vacationData: VacationCreate): Observable<any> {
    return this.http.post(`${this.baseUrl}/check-limits/${userId}`, vacationData);
  }

  // ========== АДМИНИСТРАТИВНЫЕ ФУНКЦИИ ==========
  getAllVacationsAdmin(filters?: any): Observable<Vacation[]> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<Vacation[]>(`${this.baseUrl}/admin/all`, { params });
  }

  getApprovalQueue(): Observable<Vacation[]> {
    return this.http.get<Vacation[]>(`${this.baseUrl}/admin/approval-queue`);
  }

  forceUpdateVacation(id: string, vacationData: VacationUpdate): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/admin/${id}/force-update`, vacationData);
  }

  getAdminDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/admin/dashboard`);
  }

  // ========== СТАТИСТИКА И ДАШБОРД ==========
  getVacationStats(year: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats?year=${year}`);
  }

  getUserVacationSummary(userId: string): Observable<UserVacationSummary> {
    const currentYear = new Date().getFullYear();

    return forkJoin({
      user: this.http.get<User>(`${environment.apiAuthHubUrl}/users/${userId}`),
      vacations: this.getVacations({
        user_id: userId,
        status: VacationStatus.APPROVED,
        year: currentYear
      }),
      pending: this.getVacations({
        user_id: userId,
        status: VacationStatus.PENDING
      })
    }).pipe(
      map(({ user, vacations, pending }) => ({
        user,
        used_days_current_year: vacations.reduce((sum, v) => sum + v.total_days, 0),
        planned_vacations: vacations,
        pending_approvals: pending
      }))
    );
  }

  // ========== ДОСТУПНОСТЬ ОТПУСКОВ ==========
  getUnavailablePeriods(
    startDate?: Date,
    endDate?: Date,
    userId?: string
  ): Observable<UnavailablePeriodsResponse> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('start_date', this.formatDateForApi(startDate));
    }

    if (endDate) {
      params = params.set('end_date', this.formatDateForApi(endDate));
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<UnavailablePeriodsResponse>(
      `${environment.apiAuthHubUrl}/vacationAvailability/unavailable-periods`,
      { params }
    );
  }

  // Получение магазинов пользователя
  getUserStores(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/stores?user_id=${userId}`);
  }

  // Быстрая проверка доступности
  quickAvailabilityCheck(startDate: Date, endDate: Date, userId?: string): Observable<any> {
    return this.http.get<any>(`${environment.apiAuthHubUrl}/vacationAvailability/quick-check`, {
      params: {
        start_date: this.formatDateForApi(startDate),
        end_date: this.formatDateForApi(endDate),
        ...(userId && { user_id: userId })
      }
    });
  }

  // Получение календаря доступности
  getCalendarAvailability(year: number, month: number, userId?: string): Observable<any> {
    return this.http.get<any>(`${environment.apiAuthHubUrl}/vacationAvailability/calendar/availability`, {
      params: {
        year: year.toString(),
        month: month.toString(),
        ...(userId && { user_id: userId })
      }
    });
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========
  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDisplayDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  calculateWorkDays(startDate: Date, endDate: Date): number {
    let workDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workDays;
  }

  calculateTotalDays(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  }

  getVacationTypes(): { value: VacationType; label: string }[] {
    return [
      { value: VacationType.ANNUAL, label: 'Ежегодный оплачиваемый' },
      { value: VacationType.UNPAID, label: 'Без сохранения заработной платы' },
      { value: VacationType.SICK, label: 'По болезни' },
      { value: VacationType.MATERNITY, label: 'Декретный' },
      { value: VacationType.STUDY, label: 'Учебный' },
      { value: VacationType.OTHER, label: 'Прочий' }
    ];
  }

  getVacationStatuses(): { value: VacationStatus; label: string }[] {
    return [
      { value: VacationStatus.DRAFT, label: 'Черновик' },
      { value: VacationStatus.PENDING, label: 'На согласовании' },
      { value: VacationStatus.APPROVED, label: 'Утвержден' },
      { value: VacationStatus.REJECTED, label: 'Отклонен' },
      { value: VacationStatus.CANCELLED, label: 'Отменен' },
      { value: VacationStatus.ACTIVE, label: 'Активный' },
      { value: VacationStatus.COMPLETED, label: 'Завершен' },
      { value: VacationStatus.TRANSFERRED, label: 'Перенесен' }
    ];
  }

  // Проверка доступности конкретных дат
  checkSpecificDatesAvailability(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/check-specific-dates`,
      {
        start_date: this.formatDateForApi(startDate),
        end_date: this.formatDateForApi(endDate),
        user_id: userId
      }
    );
  }

  // Получение рекомендаций по датам
  getDateRecommendations(
    durationDays: number,
    startMonth?: number | null,
    userId?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('duration_days', durationDays.toString());

    if (startMonth) {
      params = params.set('start_month', startMonth.toString());
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(
      `${this.baseUrl}/date-recommendations`,
      { params }
    );
  }

  // Проверка месячных ограничений (1-5 числа)
  checkMonthlyRestrictions(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/check-monthly-restrictions`,
      {
        start_date: this.formatDateForApi(startDate),
        end_date: this.formatDateForApi(endDate),
        user_id: userId
      }
    );
  }

  // Получение доступных периодов (не только недели)
  getAvailablePeriods(
    durationDays: number,
    startFrom?: Date,
    limit?: number,
    userId?: string
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('duration_days', durationDays.toString());

    if (startFrom) {
      params = params.set('start_from', this.formatDateForApi(startFrom));
    }

    if (limit) {
      params = params.set('limit', limit.toString());
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any[]>(
      `${this.baseUrl}/available-periods`,
      { params }
    );
  }

}