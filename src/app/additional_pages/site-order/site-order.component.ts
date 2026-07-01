import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderApiService, OrderDetail } from './order-api.service';

export interface StatusOption {
  value: number;
  label: string;
  icon: string;
  description: string;
  isDestructive: boolean;
}

@Component({
  selector: 'app-site-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site-order.component.html',
  styleUrls: ['./site-order.component.scss']
})
export class SiteOrderComponent implements OnInit {
  orderId: string = '';
  order: OrderDetail | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  statuses: { [key: number]: { label: string; icon: string; description: string; isDestructive: boolean } } = {
    0: { label: 'Черновик', icon: '📝', description: 'Заказ создан, но не отправлен', isDestructive: false },
    1: { label: 'Обработка', icon: '⚙️', description: 'Заказ находится в обработке', isDestructive: false },
    2: { label: 'Подтвержден', icon: '✅', description: 'Заказ принят в работу и подтвержден', isDestructive: false },
    3: { label: 'В сборке', icon: '📦', description: 'Товары собираются для заказа', isDestructive: false },
    4: { label: 'Передан в доставку', icon: '🚚', description: 'Заказ передан курьеру', isDestructive: false },
    5: { label: 'На доработке', icon: '🔧', description: 'Заказ требует доработки', isDestructive: false },
    6: { label: 'Зарезервирован', icon: '🔒', description: 'Заказ зарезервирован', isDestructive: false },
    8: { label: 'Готов к выдаче', icon: '🎁', description: 'Заказ готов и ждет клиента', isDestructive: false },
    9: { label: 'Завершен', icon: '🏁', description: 'Заказ успешно завершен', isDestructive: false },
    10: { label: 'Отложен', icon: '⏸️', description: 'Заказ временно отложен', isDestructive: false },
    11: { label: 'Отменен пользователем', icon: '❌', description: 'Заказ отменен клиентом', isDestructive: true },
    12: { label: 'Отменен администратором', icon: '🚫', description: 'Отменить заказ от имени администратора', isDestructive: true }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderApi: OrderApiService
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrder();
    } else {
      this.errorMessage = 'ID заказа не указан';
      this.isLoading = false;
    }
  }

  loadOrder(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderApi.getOrder(this.orderId).subscribe({
      next: (response) => {
        try {
          const data = typeof response === 'string' ? JSON.parse(response) : response;
          this.order = data.data || data;
        } catch (e) {
          this.errorMessage = 'Ошибка обработки данных заказа';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка загрузки заказа: ' + (error.message || 'Неизвестная ошибка');
        this.isLoading = false;
      }
    });
  }

  getAvailableStatuses(): StatusOption[] {
    if (!this.order) return [];

    const currentStatus = this.order.orderStatus;
    const availableValues: number[] = [];

    switch (currentStatus) {
      case 0: availableValues.push(1); break;
      case 1: availableValues.push(2); break;
      case 2: availableValues.push(3); break;
      case 3: availableValues.push(8); break;
      case 8: availableValues.push(9); break;
    }

    if (currentStatus !== 12 && currentStatus !== 11 && currentStatus !== 9) {
      availableValues.push(12);
    }

    return availableValues.map(value => ({
      value,
      label: this.statuses[value].label,
      icon: this.statuses[value].icon,
      description: this.statuses[value].description,
      isDestructive: this.statuses[value].isDestructive
    }));
  }

  isStatusAvailable(statusValue: number): boolean {
    return this.getAvailableStatuses().some(s => s.value === statusValue);
  }

  changeStatus(newStatus: number): void {
    if (!this.order || !this.isStatusAvailable(newStatus)) return;

    const statusInfo = this.statuses[newStatus];
    const confirmText = statusInfo.isDestructive
      ? `Вы уверены, что хотите ОТМЕНИТЬ заказ? Это действие нельзя будет отменить.`
      : `Изменить статус на "${statusInfo.label}"?`;

    if (!confirm(confirmText)) return;

    this.isSaving = true;
    this.orderApi.changeOrderStatus(this.orderId, newStatus).subscribe({
      next: () => {
        this.order!.orderStatus = newStatus;
        this.successMessage = `Статус успешно изменен на "${statusInfo.label}"`;
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка изменения статуса: ' + (error.message || 'Неизвестная ошибка');
        this.isSaving = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveOrder(): void {
    if (!this.order) return;

    this.isSaving = true;
    const updateDto = {
      id: this.orderId,
      consultation: this.order.consultation,
      paymentType: this.order.paymentType,
      contactType: this.order.contactType
    };

    this.orderApi.updateOrder(this.orderId, updateDto).subscribe({
      next: () => {
        this.successMessage = 'Заказ успешно сохранен';
        this.isEditing = false;
        this.isSaving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Ошибка сохранения: ' + (error.message || 'Неизвестная ошибка');
        this.isSaving = false;
      }
    });
  }

  getStatusName(status: number): string {
    return this.statuses[status]?.label || this.orderApi.getStatusName(status);
  }

  getStatusColor(status: number): string {
    return this.orderApi.getStatusColor(status);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(price || 0);
  }

  getPaymentTypeName(type: number): string {
    const types: { [key: number]: string } = {
      0: 'Не указан',
      1: 'Наличные',
      2: 'Карта',
      3: 'Безналичный расчет'
    };
    return types[type] || 'Не указан';
  }

  getContactTypeName(type: number): string {
    const types: { [key: number]: string } = {
      0: 'Не указан',
      1: 'Телефон',
      2: 'Email',
      3: 'Мессенджер'
    };
    return types[type] || 'Не указан';
  }

  printOrder(): void {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}