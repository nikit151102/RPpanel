import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';
import { WorkingHour, WorkingHourCreateDto, ExceptionDay, ExceptionDayCreateDto, StoreScheduleCreateDto, StoreSchedule } from '../interfaces/schedule.interface';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = environment.apiUrlShops;

  constructor(private http: HttpClient) { }

  // Working Hours
  getWorkingHours(scheduleId: string): Observable<WorkingHour[]> {
    return this.http.get<WorkingHour[]>(`${this.apiUrl}/api/Entities/StoreScheduleWorkingHour`);
  }

  createWorkingHour(workingHour: WorkingHourCreateDto): Observable<WorkingHour> {
    return this.http.post<WorkingHour>(`${this.apiUrl}/api/Entities/StoreScheduleWorkingHour`, workingHour);
  }

  updateWorkingHour(id: string, workingHour: WorkingHourCreateDto): Observable<WorkingHour> {
    return this.http.put<WorkingHour>(`${this.apiUrl}/api/Entities/StoreScheduleWorkingHour/${id}`, workingHour);
  }

  deleteWorkingHour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Entities/StoreScheduleWorkingHour/${id}`);
  }

  // Exception Days
  getExceptionDays(storeId?: string): Observable<ExceptionDay[]> {
    const url = storeId
      ? `${this.apiUrl}/api/Entities/StoreScheduleExceptionDay?storeId=${storeId}`
      : `${this.apiUrl}/api/Entities/StoreScheduleExceptionDay`;
    return this.http.get<ExceptionDay[]>(url);
  }

  getAllExceptionDays(): Observable<ExceptionDay[]> {
    return this.http.get<ExceptionDay[]>(`${this.apiUrl}/api/Entities/StoreScheduleExceptionDay`);
  }


  createExceptionDay(exception: ExceptionDayCreateDto): Observable<ExceptionDay> {
    return this.http.post<ExceptionDay>(`${this.apiUrl}/api/Entities/StoreScheduleExceptionDay`, exception);
  }

  updateExceptionDay(id: string, exception: ExceptionDayCreateDto): Observable<ExceptionDay> {
    return this.http.put<ExceptionDay>(`${this.apiUrl}/api/Entities/StoreScheduleExceptionDay/${id}`, exception);
  }

  deleteExceptionDay(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Entities/StoreScheduleExceptionDay/${id}`);
  }

  // Store Schedules
  createStoreSchedule(schedule: StoreScheduleCreateDto): Observable<StoreSchedule> {
    return this.http.post<StoreSchedule>(`${this.apiUrl}/api/Entities/StoreSchedule`, schedule);
  }

  getStoreSchedule(id: string): Observable<StoreSchedule> {
    return this.http.get<StoreSchedule>(`${this.apiUrl}/api/Entities/StoreSchedule/${id}`);
  }

  deleteStoreSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Entities/StoreSchedule/${id}`);
  }
}