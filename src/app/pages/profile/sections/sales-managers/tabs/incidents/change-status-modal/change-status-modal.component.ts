import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncidentsService } from '../incidents.service';

interface Status {
  id: string;
  name: string;
  description: string;
}

interface Incident {
  id: string;
  status_id: string;
  status_name: string;
}

@Component({
  selector: 'app-change-status-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-status-modal.component.html',
  styleUrl: './change-status-modal.component.scss'
})
export class ChangeStatusModalComponent implements OnInit {
  @Input() currentIncident: any;
  @Output() closed = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<any>();

  statusForm: FormGroup;
  availableStatuses: Status[] = [];
  selectedStatusDescription: string = '';
  showWarning: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentsService
  ) {
    this.statusForm = this.createForm();
  }

  ngOnInit() {
    this.loadAvailableStatuses();
  }

  createForm(): FormGroup {
    return this.fb.group({
      new_status_id: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  loadAvailableStatuses() {
    this.incidentService.getAvailableStatuses().subscribe({
      next: (statuses: Status[]) => {
        console.log('statuses', statuses)
        this.availableStatuses = statuses;
      },
      error: (error) => {
        console.error('Ошибка загрузки статусов:', error);
      }
    });
  }

  onStatusChange() {
    const selectedStatusId = this.statusForm.get('new_status_id')?.value;
    const selectedStatus = this.availableStatuses.find(s => s.id === selectedStatusId);

    this.selectedStatusDescription = selectedStatus?.description || '';

    // Показываем предупреждение для определенных статусов
    this.showWarning = selectedStatus?.name === 'Не отработана' ||
      selectedStatus?.name === 'Отложена';
  }

  getStatusClass(statusName: string | undefined): string {
    if (!statusName) {
      return 'unknown-status';
    }

    return statusName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё-]/gi, '');
  }

  onSubmit() {
    if (this.statusForm.valid && this.currentIncident) {
      this.isSubmitting = true;

      const formData = {
        incident_id: this.currentIncident.id,
        old_status_id: this.currentIncident.status_id,
        new_status_id: this.statusForm.get('new_status_id')?.value,
        comment: this.statusForm.get('comment')?.value
      };

      this.incidentService.addLogStatus(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.statusChanged.emit(response);
          this.closeModal();
        },
        error: (error) => {
          console.error('Ошибка изменения статуса:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.statusForm.controls).forEach(key => {
        this.statusForm.get(key)?.markAsTouched();
      });
    }
  }

  closeModal() {
    this.closed.emit();
  }
}