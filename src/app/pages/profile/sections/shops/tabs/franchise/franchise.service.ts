import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface FranchiseRequest {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  ownership_type: string;
  planned_investments: string;
  premises_type: string;
  franchise_source: string;
  date_submitted?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FranchiseService {
  private apiUrl = `https://xn--o1ab.xn--80akonecy.xn--p1ai/apis/franchise`;
  access_token = '';
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.access_token}`
  });

  constructor(private http: HttpClient) { }

  loginSystem(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/token`, {
      "username": "root",
      "password": "nx35DZrQ8salPVSg"
    });
  }


  getFranchiseRequests(skip: number = 0, limit: number = 100000): Observable<FranchiseRequest[]> {
   console.log('this.headers ',this.headers )
    return this.http.get<FranchiseRequest[]>(`${this.apiUrl}/franchise-requests/?skip=${skip}&limit=${limit}`, 
    { headers: this.headers });
  }

  createFranchiseRequest(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/franchise-request-test/`, formData, 
    { headers: this.headers });
  }

  // createAllFranchiseRequest(): Observable<any> {
  //   return this.http.post<any>(`https://xn--o1ab.xn--80akonecy.xn--p1ai/apis/franchise/franchise-requests/bulk/`,
  //   { headers: this.headers });
  // }
  getFranchiseRequestById(requestId: string): Observable<FranchiseRequest> {
    return this.http.get<FranchiseRequest>(`${this.apiUrl}/franchise-request/${requestId}`, 
    { headers: this.headers });
  }

  updateFranchiseRequest(requestId: string, request: FranchiseRequest): Observable<FranchiseRequest> {
    return this.http.put<FranchiseRequest>(`${this.apiUrl}/franchise-request/${requestId}`, request, 
    { headers: this.headers });
  }

  deleteFranchiseRequest(requestId: string): Observable<FranchiseRequest> {
    return this.http.delete<FranchiseRequest>(`${this.apiUrl}/franchise-request/${requestId}`, 
    { headers: this.headers });
  }
  updateStatus(requestId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/franchise-request/${requestId}/status/?new_status=${status}`, {}, 
    { headers: this.headers });
  }

}
