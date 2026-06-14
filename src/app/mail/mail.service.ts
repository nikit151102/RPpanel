import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) {

  }

  getMessages(skip: number, limit: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/email/?skip=${skip}&limit=${limit}`);
  }


  createEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/email/`, {
      "email": email
    });
  }

  createAllEmail(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/email/all`, formData);
  }


  editEmail(id: string, email: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/email/${id}`, {
      "email": email
    });
  }

  deleteEmail(id: string, email: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/email/${id}`,);
  }

  sendMessages(formData: { subject: string; message: string; file: File; min_interval: number; max_interval: number; emailsPerPage: number }, file: File): Observable<any> {
    const form = new FormData();
    form.append('subject', formData.subject);
    form.append('message', formData.message);
    form.append('file', file);
    form.append('min_interval', formData.min_interval.toString());
    form.append('max_interval', formData.max_interval.toString());
    form.append('emailsPerPage', formData.emailsPerPage.toString());

    return this.http.post(`${environment.apiUrl}/email/send-messages`, form);
  }

  scheduleSendMessages(formData: { subject: string; message: string; file: File; min_interval: number; max_interval: number; emailsPerPage: number }, file: File, send_date: Date): Observable<any> {
    const form = new FormData();
    form.append('subject', formData.subject);
    form.append('message', formData.message);
    form.append('file', file);
    form.append('min_interval', formData.min_interval.toString());
    form.append('max_interval', formData.max_interval.toString());
    form.append('emailsPerPage', formData.emailsPerPage.toString());
    form.append('send_date', send_date.toISOString());

    return this.http.post(`${environment.apiUrl}/email/send-messages`, form);
  }

  sendCustomMessage(email: string, subject: string, message: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    if (file) {
      formData.append('file', file);
    }

    return this.http.post(`${environment.apiUrl}/email/send-custom-message/`, formData);
  }


}
