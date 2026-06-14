import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Status {
  id: string;
  name: string;
  description: string;
}

interface HistoryItem {
  id: string;
  incident_id: string;
  old_status_id: string | null;
  new_status_id: string;
  changed_at: string;
  comment: string;
  old_status: Status | null;
  new_status: Status;
}

@Component({
  selector: 'app-history-status-modal',
  imports: [CommonModule],
  templateUrl: './history-status-modal.component.html',
  styleUrl: './history-status-modal.component.scss'
})
export class HistoryStatusModalComponent {
  @Input() historyData: HistoryItem[] = [];
  @Output() closed = new EventEmitter<void>();

  closeModal() {
    this.closed.emit();
  }

  getStatusClass(statusName: string): string {
    // Приводим имя статуса к формату класса CSS
    return statusName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё-]/gi, '');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
