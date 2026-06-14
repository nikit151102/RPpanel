import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrClientService } from './qr-client.service';

interface StatusOption {
  label: string;
  value: string;
}

interface User {
  id: number;
  fio: string;
  phone: string;
  email: string;
  city: string;
  qr: string;
  document_path: string;
  status: StatusOption;
}

@Component({
  selector: 'app-discount-qr',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-qr.component.html',
  styleUrls: ['./discount-qr.component.scss']
})
export class DiscountQrComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  errorMessage: string = '';

  statusOptions: StatusOption[] = [
    { label: 'Активен', value: 'active' },
    { label: 'Не активен', value: 'inactive' },
    { label: 'Новая', value: 'новая' }
  ];

  selectedStatuses: string[] = ['новая'];

  editingQrUser: number | null = null;
  editingQrValue: string = '';

  constructor(private qrClientService: QrClientService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.qrClientService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map(user => ({
          ...user,
          status: this.statusOptions.find(s => s.value === user.status) ||
            { label: 'Активен', value: 'active' }
        }));
        this.filterUsers();
      },
      error: (err) => {
        this.errorMessage = 'Не удалось загрузить пользователей';
        console.error(err);
      }
    });
  }

  isStatusSelected(status: StatusOption): boolean {
    return this.selectedStatuses.includes(status.value);
  }

  toggleStatus(status: StatusOption): void {
    const index = this.selectedStatuses.indexOf(status.value);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status.value);
    }
    this.filterUsers();
  }

  filterUsers(): void {
    if (this.selectedStatuses.length === 0) {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      this.selectedStatuses.includes(user.status.value)
    );
  }

  editQr(user: User): void {
    this.editingQrUser = user.id;
    this.editingQrValue = user.qr;
  }

  saveQr(user: User): void {
    if (!this.editingQrValue.trim()) {
      alert('QR код не может быть пустым');
      return;
    }

    this.qrClientService.updateUserQr(user.id, this.editingQrValue).subscribe({
      next: (updatedUser) => {
        user.qr = updatedUser.qr;
        this.editingQrUser = null;
        this.editingQrValue = '';
      },
      error: (err) => {
        this.errorMessage = 'Не удалось обновить QR код';
        console.error(err);
      }
    });
  }

  cancelEdit(): void {
    this.editingQrUser = null;
    this.editingQrValue = '';
  }

  onStatusChange(user: User, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatusValue = selectElement.value;
    const newStatus = this.statusOptions.find(s => s.value === newStatusValue);

    if (newStatus) {
      this.updateStatus(user.id, newStatus);
    }
  }

  updateStatus(userId: number, newStatus: StatusOption): void {
    this.qrClientService.updateUserStatus(userId, newStatus.value).subscribe({
      next: () => {
        // Обновляем статус локально
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = newStatus;
        }
        this.filterUsers(); // Перефильтровываем список
      },
      error: (err) => {
        this.errorMessage = 'Не удалось обновить статус';
        console.error(err);
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      this.qrClientService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filterUsers();
        },
        error: (err) => {
          this.errorMessage = 'Не удалось удалить пользователя';
          console.error(err);
        }
      });
    }
  }

  downloadFile(file_name: string): void {
    this.qrClientService.downloadfile(file_name).subscribe({
      next: (data: Blob) => {
        const blobUrl = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file_name;
        link.click();
        URL.revokeObjectURL(blobUrl);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка при скачивании файла';
        console.error('Error downloading file', error);
      }
    });
  }
}