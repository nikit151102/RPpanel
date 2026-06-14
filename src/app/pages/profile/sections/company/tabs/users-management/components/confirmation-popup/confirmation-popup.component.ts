// confirmation-popup.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss' 
})
export class ConfirmationPopupComponent {
  @Input() title: string = 'Подтверждение действия';
  @Input() message: string = 'Вы уверены, что хотите выполнить это действие?';
  @Input() type: 'warning' | 'danger' | 'success' | 'info' = 'warning';
  @Input() confirmText: string = 'Подтвердить';
  @Input() cancelText: string = 'Отмена';
  @Input() showCancel: boolean = true;
  @Input() confirmButtonClass: string = 'btn-primary';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  get iconSize(): number {
    return this.type === 'danger' ? 20 : 24;
  }

  confirm() {
    this.confirmed.emit();
  }

  close() {
    this.canceled.emit();
  }
}