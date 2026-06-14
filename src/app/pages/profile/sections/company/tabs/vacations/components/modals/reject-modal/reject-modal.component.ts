import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Vacation } from '../../../vacation.interface.models';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent {
  @Input() currentVacation: Vacation | null = null;
  @Input() rejectForm!: FormGroup;
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
}