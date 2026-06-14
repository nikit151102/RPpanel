import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../evirement';

export interface Manager {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManagersService {
  private apiUrl = `${environment.apiUrlHR}/managers/`;

  constructor(private http: HttpClient) {}

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(this.apiUrl);
  }

  createManager(manager: Manager): Observable<Manager> {
    return this.http.post<Manager>(this.apiUrl, manager);
  }

  updateManager(manager: Manager): Observable<Manager> {
    return this.http.put<Manager>(`${this.apiUrl}${manager.id}`, manager);
  }

  deleteManager(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
