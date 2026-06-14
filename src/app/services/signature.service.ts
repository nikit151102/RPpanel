import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  constructor(private http:HttpClient) { }

  setSignature(id: string): Observable<any>{
    return this.http.get(`${environment.apiUrlShops}/api/Entities/DocumentSignature/${id}`)
  }
}
