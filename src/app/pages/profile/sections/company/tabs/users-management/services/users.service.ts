import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${environment.apiAuthHubUrl}/users/`)
  }

  updateItem(userId: string, data: any): Observable<any> {
    return this.http.put(`${environment.apiAuthHubUrl}/users/${userId}`, data)
  }

  setItem(data: any): Observable<any> {
    return this.http.post(`${environment.apiAuthHubUrl}/users/`, data)
  }

  deleteItem(id: any): Observable<any> {
    return this.http.delete(`${environment.apiAuthHubUrl}/users/${id}`)
  }

}

