import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment, localStorageEnvironment, sessionStorageEnvironment } from '../../../evirement';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // Сигналы для состояния аутентификации
  private isAuthenticatedSignal = signal<boolean>(this.hasToken());
  private currentUserSignal = signal<any | null>(this.getStoredUser());
  private userProfileSignal = signal<any | null>(this.getStoredProfile());

  // Computed сигналы для производных состояний
  public isAuthenticated = computed(() => this.isAuthenticatedSignal());
  public currentUser = computed(() => this.currentUserSignal());
  public userProfile = computed(() => this.userProfileSignal());
  public userDepartment = computed(() => this.currentUserSignal()?.department);

  // Проверка доступа к отделу
  public canAccessDepartment = (department: any) =>
    computed(() => {
      const user = this.currentUserSignal();
      return user?.department === department ||
        user?.roles?.includes('super_admin');
    });

  login(login: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${environment.apiAuthHubUrl}/auth/login`, {
      login,
      password
    }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token, rememberMe);
        this.setUserData(response.user, response.profile);
        this.isAuthenticatedSignal.set(true);
      })
    );
  }

  logout(): Observable<any> {
    // Получаем токен из localStorage или sessionStorage
    const token = localStorage.getItem(`${localStorageEnvironment.authToken.key}`) || sessionStorage.getItem(`${sessionStorageEnvironment.authToken.key}`);

    // Создаем заголовки с токеном
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${environment.apiAuthHubUrl}/auth/logout`, {}, { headers })
      .pipe(
        tap(() => {
          localStorage.removeItem('YXV0aFRva2Vu');
          sessionStorage.removeItem('YXV0aFRva2Vu');
          localStorage.removeItem('user_data');
          localStorage.removeItem('user_profile');

          this.isAuthenticatedSignal.set(false);
          this.currentUserSignal.set(null);
          this.userProfileSignal.set(null);
        })
      );
  }



  refreshUserData(): Observable<any> {
    return this.http.get(`${environment.apiAuthHubUrl}/auth/profile`).pipe(
      tap((userData: any) => {
        this.setUserData(userData.user, userData.profile);
      })
    );
  }

  private setToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(localStorageEnvironment.authToken.key, token);
      sessionStorage.removeItem(sessionStorageEnvironment.authToken.key);
    } else {
      sessionStorage.setItem(sessionStorageEnvironment.authToken.key, token);
      localStorage.removeItem(localStorageEnvironment.authToken.key);
    }
  }


  private setUserData(user: any, profile: any): void {
    this.currentUserSignal.set(user);
    this.userProfileSignal.set(profile);

    // Сохраняем только если пользователь явно выбрал "запомнить меня"
    const storage = localStorage.getItem('YXV0aFRva2Vu') ? localStorage : sessionStorage;
    storage.setItem('user_data', JSON.stringify(user));
    storage.setItem('user_profile', JSON.stringify(profile));
  }

  private hasToken(): boolean {
    return !!(localStorage.getItem('YXV0aFRva2Vu') || sessionStorage.getItem('YXV0aFRva2Vu'));
  }

  private getStoredUser(): any | null {
    try {
      const userData = localStorage.getItem('YXV0aFRva2Vu') || sessionStorage.getItem('YXV0aFRva2Vu');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      this.clearCorruptedData();
      return null;
    }
  }

  private getStoredProfile(): any | null {
    try {
      const profileData = localStorage.getItem('user_profile') || sessionStorage.getItem('user_profile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error parsing stored profile data:', error);
      this.clearCorruptedData();
      return null;
    }
  }

  private clearCorruptedData(): void {
    // Очищаем поврежденные данные
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_profile');
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('user_profile');
  }

  getToken(): string | null {
    return localStorage.getItem('YXV0aFRva2Vu') || sessionStorage.getItem('YXV0aFRva2Vu');
  }

  // Методы для проверки прав доступа
  hasPermission(permission: string): boolean {
    const user = this.currentUserSignal();
    return user?.permissions?.includes(permission) || false;
  }

  isInDepartment(department: any): boolean {
    return this.currentUserSignal()?.department === department;
  }

  // Инициализация сервиса
  initialize(): void {
    // Проверяем целостность данных при инициализации
    const token = this.getToken();
    const user = this.getStoredUser();

    if (token && !user) {
      // Есть токен, но нет данных пользователя - пытаемся обновить
      this.refreshUserData().subscribe({
        error: () => {
          // Если не удалось обновить - разлогиниваем
          this.logout();
        }
      });
    }
  }
}

