import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Добавлено для ngModel
import { ActivatedRoute } from '@angular/router';
import { WholesaleOrderService, WholesaleOrderDetail } from './wholesale-order.service';

@Component({
  selector: 'app-wholesale-order',
  standalone: true,
  imports: [CommonModule, FormsModule], // Добавлен FormsModule
  templateUrl: './wholesale-order.component.html',
  styleUrl: './wholesale-order.component.scss'
})
export class WholesaleOrderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(WholesaleOrderService);

  orderId: string = '';
  order: WholesaleOrderDetail | null = null;
  isLoading = true;
  isUploading = false;

  // Свойства для модального окна договора
  showContractModal = false;
  selectedViewPriceType: number | null = null;
  salePercentInput: number | null = null;
  contractFile: File | null = null;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.orderService.authenticate().subscribe(() => {
      this.orderService.getOrder(this.orderId).subscribe({
        next: (res) => {
          this.order = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки заявки', err);
          this.isLoading = false;
        }
      });
    });
  }

  downloadDocument(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank'; 
    link.click();
  }

  // --- Логика модального окна ---
  openContractModal(): void {
    this.showContractModal = true;
    this.selectedViewPriceType = null;
    this.salePercentInput = null;
    this.contractFile = null;
  }

  closeContractModal(): void {
    this.showContractModal = false;
  }

  onContractFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.contractFile = input.files[0];
    }
  }

  isFormValid(): boolean {
    return this.selectedViewPriceType !== null && 
           this.salePercentInput !== null && 
           this.salePercentInput >= 0 && 
           this.salePercentInput <= 8 && 
           this.contractFile !== null;
  }

  submitContract(): void {
    if (!this.isFormValid() || !this.contractFile) return;

    this.isUploading = true;
    // Конвертируем проценты в дробное число (например, 1.5% -> 0.015)
    const salePercentDecimal = Number((this.salePercentInput! / 100).toFixed(4)); 

    // 1. Обновляем данные заявки
    this.orderService.updateOrder(this.orderId, {
      id: this.orderId,
      viewPriceType: this.selectedViewPriceType!,
      salePercent: salePercentDecimal
    }).subscribe({
      next: () => {
        // 2. Если данные обновились, загружаем файл договора
        this.orderService.addDocuments(this.orderId, [this.contractFile!], [99]).subscribe({
          next: () => {
            alert('Договор успешно подписан и загружен!');
            this.closeContractModal();
            this.loadOrderDetails();
            this.isUploading = false;
          },
          error: (err) => {
            console.error('Ошибка загрузки файла', err);
            alert('Данные обновлены, но произошла ошибка при загрузке файла.');
            this.closeContractModal();
            this.isUploading = false;
          }
        });
      },
      error: (err) => {
        console.error('Ошибка обновления заявки', err);
        alert('Ошибка при обновлении данных заявки');
        this.isUploading = false;
      }
    });
  }

  // --- Загрузка других документов (например, СБ) ---
  uploadDocument(type: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.isUploading = true;

    this.orderService.addDocuments(this.orderId, files, [type]).subscribe({
      next: () => {
        alert('Документ успешно загружен!');
        this.loadOrderDetails(); 
        input.value = ''; 
        this.isUploading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки файла', err);
        alert('Ошибка при загрузке файла');
        this.isUploading = false;
      }
    });
  }

  activate(): void {
    if (!confirm('Вы уверены, что хотите разблокировать заявку?')) return;
    this.orderService.activateOrder(this.orderId).subscribe({
      next: () => {
        alert('Заявка разблокирована');
        this.loadOrderDetails();
      },
      error: (err) => console.error('Ошибка активации', err)
    });
  }

  deactivate(): void {
    if (!confirm('Вы уверены, что хотите ЗАБЛОКИРОВАТЬ заявку?')) return;
    this.orderService.deactivateOrder(this.orderId).subscribe({
      next: () => {
        alert('Заявка заблокирована');
        this.loadOrderDetails();
      },
      error: (err) => console.error('Ошибка деактивации', err)
    });
  }

  getFullName(): string {
    if (!this.order?.userInstance) return '';
    const u = this.order.userInstance;
    return `${u.lastName} ${u.firstName} ${u.middleName}`.trim();
  }
}