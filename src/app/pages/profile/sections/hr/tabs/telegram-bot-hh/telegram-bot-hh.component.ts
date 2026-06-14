// telegram-bot-hh.component.ts
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../vacancies-jobs/truncate.pipe';
import { TestModalComponent } from './test-modal/test-modal.component';
import { HrResultsComponent } from './hr-results/hr-results.component';
import { ManagersComponent } from './managers/managers.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { environment } from '../../../../../../../evirement';

@Component({
  selector: 'app-telegram-bot-hh',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, TestModalComponent, HrResultsComponent, ManagersComponent, TestModalComponent, MeetingsComponent],
  templateUrl: './telegram-bot-hh.component.html',
  styleUrls: ['./telegram-bot-hh.component.scss']
})
export class TelegramBotHHComponent implements OnInit {
  @ViewChild('modal') modalComponent!: TestModalComponent;

  tests: any[] = [];
  activeTab: number = 0;
  showToast: boolean = false;

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    test: null as any
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.http.get<any[]>(`${environment.apiUrlHR}/tests/`).subscribe({
      next: (data) => {
        this.tests = data;
      },
      error: (err) => {
        console.error('Ошибка при получении тестов', err);
        this.showNotification('Ошибка загрузки тестов', 'error');
      }
    });
  }

  openMenu(event: MouseEvent, test: any): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.contextMenu = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      test: test
    };
  }

  @HostListener('document:click')
  closeContextMenu(): void {
    this.contextMenu.visible = false;
  }

  copyLink(testId: string): void {
    const url = `https://t.me/hrpaketon_bot?start=${testId}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
      this.contextMenu.visible = false;
    }).catch(err => {
      console.error('Ошибка при копировании ссылки:', err);
      this.showNotification('Ошибка копирования ссылки', 'error');
    });
  }

  deleteTest(testId: string): void {
    this.contextMenu.visible = false;
    
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;

    this.http.delete(`${environment.apiUrlHR}/tests/${testId}`).subscribe({
      next: () => {
        this.loadTests();
        this.showNotification('Тест успешно удален', 'success');
      },
      error: (err) => {
        console.error('Ошибка при удалении теста', err);
        this.showNotification('Ошибка удаления теста', 'error');
      }
    });
  }

  editTest(test: any): void {
    this.contextMenu.visible = false;
    this.modalComponent.openForEdit(test);
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    // Можно реализовать кастомные уведомления
    if (type === 'success') {
      console.log(`✅ ${message}`);
    } else {
      console.error(`❌ ${message}`);
    }
  }
}