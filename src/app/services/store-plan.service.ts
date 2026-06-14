import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  StorePlanInstance,
  StorePlanInstanceCreateDto,
  FilterRequest,
  PaginatedResponse,
  StorePlanType,
  UserInstance,
  DocumentSignature
} from '../interfaces/store-plan.interface';
import { environment } from '../../evirement';

@Injectable({
  providedIn: 'root'
})
export class StorePlanService {
  private apiUrl = environment.apiUrlShops;

  constructor(private http: HttpClient) {}

  // Store Plan Instances
  getStorePlanInstances(): Observable<StorePlanInstance[]> {
    return this.http.get<StorePlanInstance[]>(`${this.apiUrl}/api/Entities/StorePlanInstance`);
  }

  getStorePlanInstance(id: string): Observable<StorePlanInstance> {
    return this.http.get<StorePlanInstance>(`${this.apiUrl}/api/Entities/StorePlanInstance/${id}`);
  }

  createStorePlanInstance(plan: any): Observable<StorePlanInstance> {
    return this.http.post<StorePlanInstance>(`${this.apiUrl}/api/Entities/StorePlanInstance`, plan);
  }

  updateStorePlanInstance(id: string, plan: StorePlanInstanceCreateDto): Observable<StorePlanInstance> {
    return this.http.put<StorePlanInstance>(`${this.apiUrl}/api/Entities/StorePlanInstance/${id}`, plan);
  }

  deleteStorePlanInstance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Entities/StorePlanInstance/${id}`);
  }

  deleteSignaturePlanInstance(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/Entities/DocumentSignature/${id}`);
  }

importPlanInstance(file: File): Observable<void> {
  const formData = new FormData();
  formData.append('file', file); 
  
  return this.http.post<void>(
    `${this.apiUrl}/api/Entities/StorePlanInstance/UploadStorePlansFromExcel`,
    formData
  );
}


  filterStorePlanInstances(filter: FilterRequest): Observable<PaginatedResponse<StorePlanInstance>> {
    return this.http.post<PaginatedResponse<StorePlanInstance>>(
      `${this.apiUrl}/api/Entities/StorePlanInstance/Filter`,
      filter
    );
  }

  // filterStorePlanInstances(filter: FilterRequest): Observable<any> {
  //   return this.http.delete<any>(
  //     `${this.apiUrl}/project/EXECUTE_DATA_MIGRATION_BASA/qweasd09`
  //   );
  // }
  // Reference data
  getStorePlanTypes(): Observable<StorePlanType[]> {
    return this.http.get<StorePlanType[]>(`${this.apiUrl}/api/Entities/StorePlanType`);
  }

  getUserInstances(): Observable<UserInstance[]> {
    return this.http.get<UserInstance[]>(`${this.apiUrl}/api/Entities/UserInstance`);
  }

  getDocumentSignatures(): Observable<DocumentSignature[]> {
    return this.http.get<DocumentSignature[]>(`${this.apiUrl}/api/Entities/DocumentSignature`);
  }
}