import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Vacation,
  VacationCreate,
  VacationUpdate,
  VacationPlan,
  VacationPlanCreate,
  VacationTransfer,
  VacationTransferCreate,
  VacationBalance,
  CompanyHoliday,
  CompanyHolidayCreate,
  CompanyHolidayUpdate,
  DashboardStats,
  VacationFilters,
  VacationStatus,
  QuickCheckResponse,
  CalendarAvailabilityResponse,
  UnavailablePeriodsResponse
} from './vacation.interface.models';
import { environment } from '../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private baseUrl = `http://localhost:5011/vacations`;

  constructor(private http: HttpClient) {}

  // Основные отпуска
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
    return this.http.post<Vacation>(`${this.baseUrl}/`, vacationData);
  }

  updateVacation(id: string, vacationData: VacationUpdate): Observable<Vacation> {
    return this.http.put<Vacation>(`${this.baseUrl}/${id}`, vacationData);
  }

  deleteVacation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Действия с отпуском
  approveVacation(id: string, rejection_reason?: string): Observable<Vacation> {
    const body = rejection_reason ? { rejection_reason } : {};
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/approve`, body);
  }

  rejectVacation(id: string, rejection_reason: string): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/reject`, { rejection_reason });
  }

  cancelVacation(id: string): Observable<Vacation> {
    return this.http.post<Vacation>(`${this.baseUrl}/${id}/cancel`, {});
  }

  // Планы отпусков
  getVacationPlans(userId?: string, year?: number, confirmed?: boolean): Observable<VacationPlan[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user_id', userId);
    if (year) params = params.set('year', year.toString());
    if (confirmed !== undefined) params = params.set('confirmed', confirmed.toString());
    
    return this.http.get<VacationPlan[]>(`${this.baseUrl}/plans/`, { params });
  }

  createVacationPlan(planData: VacationPlanCreate): Observable<VacationPlan> {
    return this.http.post<VacationPlan>(`${this.baseUrl}/plans/`, planData);
  }

  updateVacationPlan(id: string, planData: any): Observable<VacationPlan> {
    return this.http.put<VacationPlan>(`${this.baseUrl}/plans/${id}`, planData);
  }

  confirmVacationPlan(id: string): Observable<VacationPlan> {
    return this.http.post<VacationPlan>(`${this.baseUrl}/plans/${id}/confirm`, {});
  }

  // Переносы отпусков
  getVacationTransfers(userId?: string, status?: VacationStatus): Observable<VacationTransfer[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user_id', userId);
    if (status) params = params.set('status', status);
    
    return this.http.get<VacationTransfer[]>(`${this.baseUrl}/transfers/`, { params });
  }

  createVacationTransfer(transferData: VacationTransferCreate): Observable<VacationTransfer> {
    return this.http.post<VacationTransfer>(`${this.baseUrl}/transfers/`, transferData);
  }

  approveVacationTransfer(id: string): Observable<VacationTransfer> {
    return this.http.post<VacationTransfer>(`${this.baseUrl}/transfers/${id}/approve`, {});
  }

  // Баланс отпускных дней
  getVacationBalance(userId?: string, year?: number): Observable<VacationBalance[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user_id', userId);
    if (year) params = params.set('year', year.toString());
    
    return this.http.get<VacationBalance[]>(`${this.baseUrl}/balance/`, { params });
  }

  calculateVacationBalance(userId: string, year: number): Observable<VacationBalance> {
    return this.http.post<VacationBalance>(`${this.baseUrl}/balance/calculate/${userId}`, { year });
  }

  // Корпоративные праздники
  getCompanyHolidays(year?: number, isDayOff?: boolean): Observable<CompanyHoliday[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (isDayOff !== undefined) params = params.set('is_day_off', isDayOff.toString());
    
    return this.http.get<CompanyHoliday[]>(`${this.baseUrl}/holidays/`, { params });
  }

  createCompanyHoliday(holidayData: CompanyHolidayCreate): Observable<CompanyHoliday> {
    return this.http.post<CompanyHoliday>(`${this.baseUrl}/holidays/`, holidayData);
  }

  updateCompanyHoliday(id: string, holidayData: CompanyHolidayUpdate): Observable<CompanyHoliday> {
    return this.http.put<CompanyHoliday>(`${this.baseUrl}/holidays/${id}`, holidayData);
  }

  deleteCompanyHoliday(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/holidays/${id}`);
  }

  // Статистика и отчеты
  getVacationStats(year: number, department?: string): Observable<DashboardStats> {
    let params = new HttpParams().set('year', year.toString());
    if (department) params = params.set('department', department);
    
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats/`, { params });
  }

  getVacationCalendar(year: number, month: number, department?: string): Observable<any[]> {
    let params = new HttpParams();
    if (department) params = params.set('department', department);
    
    return this.http.get<any[]>(`${this.baseUrl}/calendar/${year}/${month}`, { params });
  }

  // Административные эндпоинты
  getAllVacationsAdmin(filters?: VacationFilters): Observable<Vacation[]> {
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

  forceDeleteVacation(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/${id}/force-delete`);
  }

  getAdminDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/admin/dashboard`);
  }

  // Вспомогательные методы
  getVacationTypes(): { value: string; label: string }[] {
    return [
      { value: 'annual', label: 'Основной оплачиваемый' },
      { value: 'unpaid', label: 'За свой счет' },
      { value: 'sick', label: 'Больничный' },
      { value: 'maternity', label: 'Декретный' },
      { value: 'study', label: 'Учебный' },
      { value: 'other', label: 'Прочий' }
    ];
  }

  getVacationStatuses(): { value: string; label: string; color: string }[] {
    return [
      { value: 'draft', label: 'Черновик', color: 'gray' },
      { value: 'pending', label: 'На согласовании', color: 'orange' },
      { value: 'approved', label: 'Утвержден', color: 'green' },
      { value: 'rejected', label: 'Отклонен', color: 'red' },
      { value: 'cancelled', label: 'Отменен', color: 'gray' },
      { value: 'active', label: 'В процессе', color: 'blue' },
      { value: 'completed', label: 'Завершен', color: 'purple' },
      { value: 'transferred', label: 'Перенесен', color: 'yellow' }
    ];
  }

  getStatusColor(status: VacationStatus): string {
    const statusMap: { [key: string]: string } = {
      'draft': '#9CA3AF',
      'pending': '#F59E0B',
      'approved': '#10B981',
      'rejected': '#EF4444',
      'cancelled': '#6B7280',
      'active': '#3B82F6',
      'completed': '#8B5CF6',
      'transferred': '#FBBF24'
    };
    return statusMap[status] || '#6B7280';
  }

  calculateWorkDays(startDate: Date, endDate: Date): number {
    // Простая реализация расчета рабочих дней
    // В реальном проекте нужно учитывать праздники и выходные
    let workDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // 0 = воскресенье, 6 = суббота
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workDays;
  }


    // ========== ПРОВЕРКА ДОСТУПНОСТИ ОТПУСКОВ ==========

  /**
   * Получить занятые периоды для отпуска
   */
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

  /**
   * Получить календарь доступности по месяцам
   */
  getCalendarAvailability(
    year: number,
    month: number,
    userId?: string
  ): Observable<CalendarAvailabilityResponse> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    if (userId) {
      params = params.set('user_id', userId);
    }
    
    return this.http.get<CalendarAvailabilityResponse>(
      `${environment.apiAuthHubUrl}/vacationAvailability/calendar/availability`,
      { params }
    );
  }

  /**
   * Быстрая проверка доступности дат
   */
  quickAvailabilityCheck(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Observable<QuickCheckResponse> {
    let params = new HttpParams()
      .set('start_date', this.formatDateForApi(startDate))
      .set('end_date', this.formatDateForApi(endDate));
    
    if (userId) {
      params = params.set('user_id', userId);
    }
    
    return this.http.get<QuickCheckResponse>(
      `${environment.apiAuthHubUrl}/vacationAvailability/quick-check`,
      { params }
    );
  }

  /**
   * Проверка ограничений отдела
   * (Внутренний метод для использования в компонентах)
   */
  checkDepartmentLimits(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Observable<any> {
    return this.quickAvailabilityCheck(startDate, endDate, userId);
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}