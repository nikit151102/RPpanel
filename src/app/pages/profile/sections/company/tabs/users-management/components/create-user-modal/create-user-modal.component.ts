// create-user-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user-modal.component.html',
  styleUrl: './create-user-modal.component.scss'
})
export class CreateUserModalComponent implements OnInit {
  @Input() user: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  userForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    if (this.user) {
      this.isEditMode = true;
      this.populateForm();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      is_active: [true],
      is_superuser: [false],
      locale: ['ru-RU'],
      timezone: ['Europe/Moscow']
    });
  }

  populateForm() {
    this.userForm.patchValue({
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      username: this.user.username,
      email: this.user.email,
      is_active: this.user.is_active,
      is_superuser: this.user.is_superuser,
      locale: this.user.locale || 'ru-RU',
      timezone: this.user.timezone || 'Europe/Moscow'
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        const formData = this.userForm.value;
        this.saved.emit(formData);
        this.isSubmitting = false;
        this.closeModal();
      }, 1000);
   
  }

  closeModal() {
    this.closed.emit();
  }
}