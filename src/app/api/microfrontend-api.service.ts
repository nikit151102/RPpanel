import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';

@Injectable({
  providedIn: 'root'
})
export class MicrofrontendApiService {

  constructor(private http: HttpClient) { }

  getMicrofrontendToRouter(route: any): Observable<any> {
    return this.http.get(`${environment.apiAuthHubUrl}/microfrontends/my-microfrontend/${route}`)
  }

}
