import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WholesaleOrderService, WholesaleOrderDetail } from './wholesale-order.service';

@Component({
  selector: 'app-wholesale-order',
  standalone: true,
  imports: [CommonModule], 
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

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    this.orderService.authenticate().subscribe((value: any) => {
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
    })

  }

  downloadDocument(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank'; 
    link.click();
  }

  
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