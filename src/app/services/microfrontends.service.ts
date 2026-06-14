import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../evirement';

@Injectable({
  providedIn: 'root'
})
export class MicrofrontendsService {

  private http = Inject(HttpClient);

  getMicrofrontends(): Observable<any> {
    return this.http.get(`${environment.apiAuthHubUrl}/microfrontends/my-microfrontends`, {})
  }
}
