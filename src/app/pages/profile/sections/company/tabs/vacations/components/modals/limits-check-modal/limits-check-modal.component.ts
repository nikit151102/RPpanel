import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-limits-check-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './limits-check-modal.component.html',
  styleUrls: ['./limits-check-modal.component.scss']
})
export class LimitsCheckModalComponent {
  @Input() vacationLimitsCheck: any = null;
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() checkLimits = new EventEmitter<void>();
}