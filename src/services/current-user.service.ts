import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { environment, localStorageEnvironment, sessionStorageEnvironment } from '../evirement';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private readonly storageKey = 'currentUser';

  private currentUserSublect = new BehaviorSubject<any>('');
  currentUser$ = this.currentUserSublect.asObservable();

  setData(values:any){
    this.currentUserSublect.next(values);
  }

  getData(){
    return this.currentUserSublect.value
  }

  
  constructor(private http: HttpClient,
    private toastService: ToastService,
    private router: Router) { }

  saveUser(user: any): void {
    if (user) {
      sessionStorage.setItem(sessionStorageEnvironment.authToken.key, JSON.stringify(user));
    }
  }

  getUser(): any | null {
    const userData = sessionStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
  }

  hasUser(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null;
  }

  removeUser(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  updateUserBalance(newBalance: string): void {
    const user = this.getUser();
    if (user) {
      user.balance = newBalance; 
      this.saveUser(user);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(localStorageEnvironment.authToken.key);
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }

  getDataUser() {
    return this.http
      .get<any>(`${environment.apiAuthHubUrl}/users/me`, {
        headers: this.getAuthHeaders(),
      })
  }
  
  getUserData(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiAuthHubUrl}/users/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          localStorage.setItem('VXNlcklk', response.id);
          this.saveUser(response)
          this.setData(response)
          return response;
        }),
        catchError((error) => {
          // this.toastService.showError('Сеанс истёк', 'Пожалуйста, выполните повторный вход');
          localStorage.removeItem('YXV0aFRva2Vu');
          this.router.navigate(['/']);
          return this.handleError(error);
        })
      );
  }

  updateUserData(user: any): Observable<any> {
    return this.http
      .put<any>(`${environment.apiAuthHubUrl}/users/me`, user, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError))
  }

  deleteUser(): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiAuthHubUrl}/users/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public clearAuthData(): void {
    localStorage.removeItem('YXV0aFRva2Vu');
    localStorage.removeItem('Y29va2llQ29uc2VudA==');
    localStorage.removeItem('VXNlcklk');
  }

}
