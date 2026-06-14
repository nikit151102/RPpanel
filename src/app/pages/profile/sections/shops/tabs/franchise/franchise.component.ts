import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FranchiseService } from './franchise.service';
import { HttpHeaders } from '@angular/common/http';

interface StatusOption {
  label: string;
  value: string;
}

interface FranchiseRequest {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  ownership_type: string;
  planned_investments: string;
  premises_type: string;
  franchise_source: string;
  date_submitted: string;
  status?: string;
}

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.scss']
})
export class FranchiseComponent implements OnInit {
  franchiseRequests: any[] = [];
  filteredFranchiseRequests: FranchiseRequest[] = [];
  selectedRequest: FranchiseRequest | null = null;
  
  newRequest: FranchiseRequest = {
    full_name: '',
    phone: '',
    email: '',
    ownership_type: '',
    planned_investments: '',
    premises_type: '',
    franchise_source: '',
    date_submitted: new Date().toISOString().split('T')[0]
  };

  visible: boolean = false;
  isEdit: boolean = false;

  statusOptions: StatusOption[] = [
    { label: 'Новая', value: 'Новая' },
    { label: 'В работе', value: 'В работе' },
    { label: 'Принята', value: 'Принята' },
    { label: 'Отказ', value: 'Отказ' },
    { label: 'Ожидание', value: 'Ожидание' },
    { label: 'На рассмотрении', value: 'На рассмотрении' },
    { label: 'Одобрена', value: 'Одобрена' },
    { label: 'Неодобрена', value: 'Неодобрена' },
    { label: 'Закрыта', value: 'Закрыта' },
    { label: 'Перенос', value: 'Перенос' },
    { label: 'Ошибка', value: 'Ошибка' },
    { label: 'Архивирована', value: 'Архивирована' }
  ];

  selectedStatuses: string[] = ['Новая'];

  constructor(private franchiseService: FranchiseService) { }

  ngOnInit(): void {
    this.franchiseService.loginSystem().subscribe((data) => {
      this.franchiseService.access_token = data.access_token;
      this.franchiseService.headers = new HttpHeaders({
        'Authorization': `Bearer ${data.access_token}`
      });
      this.loadFranchiseRequests();
    });
  }

  loadFranchiseRequests(): void {
    this.franchiseService.getFranchiseRequests().subscribe((data) => {
      this.franchiseRequests = data;
      this.filterRequests();
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
    this.filterRequests();
  }

  filterRequests(): void {
    if (this.selectedStatuses.length === 0) {
      this.filteredFranchiseRequests = [...this.franchiseRequests];
    } else {
      this.filteredFranchiseRequests = this.franchiseRequests.filter(request =>
        this.selectedStatuses.includes(request.status ?? '')
      );
    }
  }

  showDialogCreate(visibleEdit: boolean, request: FranchiseRequest | null = null): void {
    this.visible = true;
    this.isEdit = visibleEdit;
    
    if (visibleEdit && request) {
      this.newRequest = { ...request };
    } else {
      this.clearForm();
    }
  }

  closeModal(): void {
    this.visible = false;
    this.clearForm();
  }

  createFranchiseRequest(): void {
    const formData = new FormData();
    formData.append("full_name", this.newRequest.full_name);
    formData.append("phone", this.newRequest.phone);
    formData.append("email", this.newRequest.email);
    formData.append("ownership_type", this.newRequest.ownership_type);
    formData.append("planned_investments", this.newRequest.planned_investments);
    formData.append("premises_type", this.newRequest.premises_type);
    formData.append("franchise_source", this.newRequest.franchise_source);
    formData.append("date_submitted", this.newRequest.date_submitted);

    this.franchiseService.createFranchiseRequest(formData).subscribe({
      next: (response: any) => {
        this.loadFranchiseRequests();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating request:', error);
        alert('Ошибка при создании заявки');
      }
    });
  }

  updateFranchiseRequest(): void {
    if (this.newRequest.id) {
      this.franchiseService.updateFranchiseRequest(this.newRequest.id, this.newRequest).subscribe({
        next: (data) => {
          const index = this.franchiseRequests.findIndex((req) => req.id === data.id);
          if (index !== -1) {
            this.franchiseRequests[index] = data;
          }
          this.filterRequests();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating request:', error);
          alert('Ошибка при обновлении заявки');
        }
      });
    }
  }

  onStatusChange(request: FranchiseRequest, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    if (newStatus && request.id) {
      request.status = newStatus;
      this.updateOperatorAndStatus(request);
    }
  }

  updateOperatorAndStatus(request: FranchiseRequest): void {
    if (request.id) {
      this.franchiseService.updateStatus(request.id, request.status || '').subscribe({
        next: (value: any) => {
          // Status updated successfully
        },
        error: (error) => {
          console.error("Ошибка при обновлении:", error);
          alert("Произошла ошибка при обновлении статуса.");
        }
      });
    }
  }

  deleteFranchiseRequest(requestId: string | undefined): void {
    if (requestId && confirm('Вы уверены, что хотите удалить эту заявку?')) {
      this.franchiseService.deleteFranchiseRequest(requestId).subscribe({
        next: () => {
          this.franchiseRequests = this.franchiseRequests.filter((req) => req.id !== requestId);
          this.filterRequests();
        },
        error: (error) => {
          console.error('Error deleting request:', error);
          alert('Ошибка при удалении заявки');
        }
      });
    }
  }

  clearForm(): void {
    this.newRequest = {
      full_name: '',
      phone: '',
      email: '',
      ownership_type: '',
      planned_investments: '',
      premises_type: '',
      franchise_source: '',
      date_submitted: new Date().toISOString().split('T')[0]
    };
  }
}