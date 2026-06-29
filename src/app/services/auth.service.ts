import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://xn--80akonecy.xn--p1ai/api';
  private readonly TOKEN_KEY = 'nucheauthtoken';

  // Дефолтные учетные данные для автоматического входа
  private readonly DEFAULT_CREDENTIALS = {
    email: 'Admin1@gmail.com',
    password: 'QweQwe11'
  };

  constructor(private http: HttpClient) {}

  login(credentials?: { email: string; password: string }): Observable<any> {
    const creds = credentials || this.DEFAULT_CREDENTIALS;
    
    return this.http.post<any>(`${this.API_URL}/auth/authentication`, creds).pipe(
      tap(response => {
        if (response?.data?.token) {
          localStorage.setItem(this.TOKEN_KEY, response.data.token);
        }
      })
    );
  }

  loginWithDefaultCredentials(): Observable<any> {
    return this.login(this.DEFAULT_CREDENTIALS);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }
}