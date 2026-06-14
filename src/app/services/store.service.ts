import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';
import { Store, StoreCreateDto } from '../interfaces/store.interface';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiUrlShops}/api/Entities/Store`;

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  getStore(id: string): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/${id}`);
  }

  createStore(store: StoreCreateDto): Observable<Store> {
    return this.http.post<Store>(this.apiUrl, store);
  }

  updateStore(id: string, store: StoreCreateDto): Observable<Store> {
    return this.http.put<Store>(`${this.apiUrl}/${id}`, store);
  }

  deleteStore(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAddresses(): Observable<any> {
    return this.http.get(`${environment.apiUrlShops}/api/Entities/Address`);
  }
}