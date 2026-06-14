import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-store-selector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './store-selector-modal.component.html',
  styleUrls: ['./store-selector-modal.component.scss']
})
export class StoreSelectorModalComponent {
  @Input() managerStoreSelectorForm!: FormGroup;
  @Input() userStores: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectStore = new EventEmitter<void>();
}