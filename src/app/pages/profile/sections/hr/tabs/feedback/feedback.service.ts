import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getFeedback(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/feedback/`);
  }

  setStatusFeedback(id: string, value: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/feedback/${id}/status?status=${value}`, {});
  }

}
