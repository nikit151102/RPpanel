import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

export interface WholesalerRequest {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  region: string;
  field_activity: string;
  date_submitted?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})

export class WholesalerService {
private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getWholesalerRequests(skip: number = 0, limit: number = 100000): Observable<WholesalerRequest[]> {
    return this.http.get<WholesalerRequest[]>(`${this.apiUrl}/wholesalers/?skip=${skip}&limit=${limit}`);
  }

  createWholesalerRequest(newRequest: WholesalerRequest ): Observable<WholesalerRequest>  {
    const params = new HttpParams()
      .set("full_name", newRequest.full_name)
      .set("phone", newRequest.phone)
      .set("email", newRequest.email)
      .set("region", newRequest.region)
      .set("field_activity", newRequest.field_activity);
  
      return this.http.post<any>(`${this.apiUrl}/wholesalers/`, {}, { params });
  }

  getWholesalerRequestById(requestId: string): Observable<WholesalerRequest> {
    return this.http.get<WholesalerRequest>(`${this.apiUrl}/wholesalers/${requestId}`);
  }

  updateWholesalerRequest(requestId: string, request: WholesalerRequest): Observable<WholesalerRequest> {
    const params = new HttpParams()
      .set("full_name", request.full_name)
      .set("phone", request.phone)
      .set("email", request.email)
      .set("region", request.region)
      .set("field_activity", request.field_activity);
    return this.http.put<WholesalerRequest>(`${this.apiUrl}/wholesalers/${requestId}`, {}, { params });
  }

  deleteWholesalerRequest(requestId: string): Observable<WholesalerRequest> {
    return this.http.delete<WholesalerRequest>(`${this.apiUrl}/wholesalers/${requestId}`);
  }

  updateStatusAndOperator(requestId: string, status: string, operator: string): Observable<WholesalerRequest> {
    return this.http.put<any>(`${this.apiUrl}/wholesalers/${requestId}/update_operator_status?operator=${operator}&status=${status}`, {});
  }


}
