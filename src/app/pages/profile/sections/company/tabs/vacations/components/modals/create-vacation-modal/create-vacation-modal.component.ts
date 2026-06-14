import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { VacationType } from '../../../vacation.interface.models';

@Component({
  selector: 'app-create-vacation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-vacation-modal.component.html',
  styleUrls: ['./create-vacation-modal.component.scss']
})
export class CreateVacationModalComponent {
  @Input() vacationForm!: FormGroup;
  @Input() vacationTypes: any[] = [];
  @Input() isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  getVacationTypes(): any[] {
    return this.vacationTypes || [];
  }
}