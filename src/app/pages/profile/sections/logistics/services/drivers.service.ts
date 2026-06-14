import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  private apiUrl = `${environment.apiUrlDrivers}/users`

  constructor(private http: HttpClient) { }

  // Получить всех пользователей
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // Создать нового пользователя
  createUser(user: any): Observable<any> {
    // API ожидает пароль при создании
    const payload = { ...user, password: user.password || 'defaultPassword' };
    return this.http.post<any>(`${this.apiUrl}/`, payload);
  }

  // Обновить существующего пользователя
  updateUser(user: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${user.id}`, user);
  }

  // Удалить пользователя
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

}
