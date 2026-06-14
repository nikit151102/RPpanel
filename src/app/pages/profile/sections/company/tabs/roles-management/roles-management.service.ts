import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class RolesManagementService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any>{
    return this.http.get(`${environment.apiAuthHubUrl}/roles/`)
  }

}