import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class ManagerStatService {
  private Url = environment.apiUrlManager;
  private baseUrl = `${environment.apiUrlManager}/statistics`;
  private ratingsUrl = `${environment.apiUrlManager}/ratings`;

  constructor(private http: HttpClient) { }

  // Получение сводной статистики
  getSummary(period: string, employeeId?: string): Observable<any> {

    let url = `${this.baseUrl}/summary?period=${period}`;
    if (employeeId) {
      url += `&employee_id=${employeeId}`;
    }
    return this.http.get(url);
  }

  getSalesByDay(days: number = 30, employeeId?: string): Observable<any> {
    let url = `${this.baseUrl}/sales-by-day?days=${days}`;
    if (employeeId) {
      url += `&employee_id=${employeeId}`;
    }
    return this.http.get(url);
  }


  // Получение рейтинга сотрудников по типам контрагентов
  getEmployeeRatings(days?: number): Observable<any> {
    let url = `${this.ratingsUrl}/employee`;
    if (days) {
      url += `?days=${days}`;
    }
    return this.http.get(url);
  }


  getEmployee(): Observable<any> {
    return this.http.get(`${this.Url}/employees/`);
  }

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const httpHeaders = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.get(`${environment.apiAuthHubUrl}/users/me`, { headers: httpHeaders });
  }

  getSummaryMonthly(startDate: Date | string, endDate: Date | string) {
    // Преобразуем в Date объекты, если это строки
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startStr = start.toISOString().split('T')[0]; // YYYY-MM-DD
    const endStr = end.toISOString().split('T')[0];     // YYYY-MM-DD

    return this.http.get(`${this.Url}/monthly-plans/summary/?start_date=${startStr}&end_date=${endStr}`);
  }


}
