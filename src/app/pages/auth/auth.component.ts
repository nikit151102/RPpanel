import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule]
})
export class AuthComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, rememberMe } = this.loginForm.value;

      this.authService.login(email, password, rememberMe).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/profile']);
          // this.router.navigate([`/${response.userId}`]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);

          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Неверный логин или пароль';
    } else if (error.status === 0) {
      return 'Ошибка подключения к серверу';
    } else if (error.status >= 500) {
      return 'Внутренняя ошибка сервера';
    } else {
      return 'Произошла ошибка при входе';
    }
  }

}
