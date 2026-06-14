import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class MonthlyPlansServiceService {

  private apiUrl = `${environment.apiUrlManager}/client-types`; // Укажите свой URL

  constructor(private http: HttpClient) {}

  // Получение месячных планов с коэффициентом
  getMonthlyPlansWithCoefficient(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly-plans-with-coefficient/?year=${year}`);
  }

  // Создание новых месячных планов на основе увеличенных данных
  createMonthlyPlansWithYearly(year: number, plans: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/monthly-plans/create-with-yearly/?year=${year}`, plans);
  }

}
