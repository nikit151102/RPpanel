import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';


export interface IncidentReport {
  id: string;
  date: string;
  contractor: string;
  details: string;
  reason_type_id: string;
  manager_id: string;
  items: any[];
}


@Injectable({
  providedIn: 'root'
})


export class IncidentsService {
  private apiUrl = `${environment.apiUrlManager}/incident-reports`;  // Замените на ваш API URL

  constructor(private http: HttpClient) { }

  getIncidentsByManager(username: string): Observable<IncidentReport[]> {
    return this.http.get<IncidentReport[]>(`${this.apiUrl}/my_by_username/${username}`);
  }

  getAllIncidents(): Observable<IncidentReport[]> {
    return this.http.get<IncidentReport[]>(`${this.apiUrl}/`);
  }

  createIncident(data: IncidentReport): Observable<IncidentReport> {
    return this.http.post<IncidentReport>(`${this.apiUrl}/`, data);
  }

  updateIncident(incidentId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${incidentId}`, data);
  }

  deleteIncident(incidentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${incidentId}`);
  }

  searchProducts(query: string, page: number = 1, per_page: number = 20) {
    let params = `?page=${page}&per_page=${per_page}`;
    if (query) params += `&query=${encodeURIComponent(query)}`;
    return this.http.get(`${environment.apiUrlManager}/products/search/${params}`);
  }

  getReasonTypes(): Observable<any> {
    return this.http.get(`${environment.apiUrlManager}/incident-reason-types/`);
  }

  createProduct(data: { name: string; sku: string }): Observable<any> {
    return this.http.post(`${environment.apiUrlManager}/products/`, data);
  }

  getHistoryStatuses(incidentId: string): Observable<any> {
    return this.http.get(`${environment.apiUrlManager}/incident-status-logs/incident/${incidentId}`);
  }

  addLogStatus(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrlManager}/incident-status-logs/`, data);
  }

  getAvailableStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrlManager}/incident-statuses/?skip=0&limit=100`);
  }

}
