import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MailService } from './mail.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-mail',
  imports: [CommonModule, FormsModule, InfiniteScrollModule, EditorModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss'
})
export class MailComponent implements OnInit {
  emails: any[] = [];
  newEmail: string = '';
  emailId: string = '';
  editedEmail: string = '';
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  skip: number = 0;  
  limit: number = 50;
  isLoading: boolean = false; 
  scrollDistance: number = 1;
  editMail: boolean = false;
  taskId: string = 'unique-task-id';  
  messageLog: string[] = [];
  selectedFileName: string | null = null;
  isAscending: boolean = true;
  totalEmails: number = 0; 
  sortEmailsByDate(): void {
    this.isAscending = !this.isAscending; 

    this.emails.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return this.isAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }
  
  constructor(private mailService: MailService, private fb: FormBuilder) {
    this.standardMessageForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      min_interval: [33, [Validators.required, Validators.min(1)]],
      max_interval: [87, [Validators.required]], 
      emailsPerPage: [10, [Validators.required, Validators.min(1)]],  
      file: [null]
    });
    this.customMessageForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    if (this.isLoading) return; 
    this.isLoading = true;

    this.mailService.getMessages(this.skip, this.limit).subscribe(
      (data) => {
        this.totalEmails = data.total
        this.emails = [...this.emails, ...data.emails];  
        this.skip += this.limit; 
        this.isLoading = false;
      },
      (error) => {
        alert('Не удалось загрузить письма');
        this.isLoading = false;
      }
    );
  }

  onScroll(): void {
    this.loadMessages();
  }

  createEmail(): void {
    if (!this.newEmail) {
      alert('Пожалуйста, введите email');
      return;
    }
    this.mailService.createEmail(this.newEmail).subscribe(
      (response) => {
        this.loadMessages();
        this.newEmail = '';
        alert('Email успешно создан');
      },
      (error) => {
        alert('Не удалось создать email');
      }
    );
  }

  openEditDialog(email: any): void {
    this.isEditMode = true;
    this.emailId = email.id;
    this.editedEmail = email.email;
    this.displayDialog = true;
    this.editMail = true;
  }

  editEmail(): void {
    if (!this.editedEmail) {
      alert('Пожалуйста, введите email');
      return;
    }
    this.mailService.editEmail(this.emailId, this.editedEmail).subscribe(
      (response) => {
        this.loadMessages();
        this.displayDialog = false;
        this.editMail = false;
        alert('Email успешно обновлён');
      },
      (error) => {
        alert('Не удалось обновить email');
      }
    );
  }

  deleteEmail(id: string): void {
    this.mailService.deleteEmail(id, '').subscribe(
      (response) => {
        this.skip = 0;
        this.emails = this.emails.filter(email => email.id !== id);
      },
      (error) => {
        alert('Не удалось удалить email');
      }
    );
  }


  closeDialog(): void {
    this.displayDialog = false;
    this.editMail = false;
    this.onRemoveFile();
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Пожалуйста, выберите файл');
      return;
    }
    this.mailService.createAllEmail(this.selectedFile).subscribe(
      (response) => {
        this.skip = 0;
        this.emails = [];
        this.loadMessages();
        alert(`
         Файл успешно загружен!
          
          Детали:
          - Успешно загружено записей: ${response.loaded} 
          - Уже существующих в базе записей: ${response.skipped} 
          - Не валидных записей: ${response.invalid} 
          `);

      },
      (error) => {
        alert('Не удалось загрузить файл');
      }
    );
  }


  standardMessageForm!: FormGroup;
  customMessageForm!: FormGroup;
  isCustomMessageDialog: boolean = false;

  openStandardMessageDialog(): void {
    this.isCustomMessageDialog = false;  
    this.displayDialog = true;
  }

  openCustomMessageDialog(): void {
    this.isCustomMessageDialog = true;  
    this.displayDialog = true;
  }

  sendStandardMessage(): void {
    if (this.standardMessageForm.invalid) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const formData = this.standardMessageForm.value;
    if (this.selectedFile)
      this.mailService.sendMessages(formData, this.selectedFile).subscribe(
        (response) => {
          alert('Сообщение отправлено');
          this.displayDialog = false;
          this.standardMessageForm.reset();
        },
        (error) => {
          alert('Не удалось отправить сообщение');
        }
      );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file; 
      this.selectedFileName = file.name; 
    } else {
      this.selectedFile = null; 
      this.selectedFileName = null;
    }
  }

  onRemoveFile(): void {
    this.selectedFile = null; 
    this.selectedFileName = null; 
    const fileInput: HTMLInputElement | null = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  sendCustomMessage(): void {
    if (this.customMessageForm.invalid) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const { email, subject, message } = this.customMessageForm.value;
    if (this.selectedFile)
      this.mailService.sendCustomMessage(email, subject, message, this.selectedFile).subscribe(
        (response) => {
          alert('Кастомное сообщение отправлено');
          this.displayDialog = false;
          this.customMessageForm.reset();
          this.selectedFile = null;
          this.selectedFileName = null;
        },
        (error) => {
          alert('Не удалось отправить кастомное сообщение');
        }
      );
  }
}
