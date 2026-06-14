import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrClientService {


  private apiUrl = 'https://xn--o1ab.xn--80akonecy.xn--p1ai/qr';

  constructor(private http: HttpClient) { }

  // GET /users — Получить всех пользователей
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // PATCH /status/{user_id} — Обновить статус пользователя
  updateUserStatus(userId: number, newStatus: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/status/${userId}`, { new_status: newStatus });
  }

  // DELETE /user/{user_id} — Удалить пользователя
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/${userId}`);
  }

  downloadfile(file_name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/download_file/${file_name}`, { responseType: 'blob' });
  }

  updateUserQr(userId: number, newQr: string) {
  return this.http.patch<any>(`${this.apiUrl}/qr/${userId}`, { new_qr: newQr });
}


}
