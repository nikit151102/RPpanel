import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WholesalerService } from './wholesaler.service';

interface StatusOption {
  label: string;
  value: string;
}

interface WholesalerRequest {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  region: string;
  field_activity: string;
  date_submitted?: string;
  status?: string;
  operator?: string;
}

@Component({
  selector: 'app-wholesale-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wholesale-requests.component.html',
  styleUrls: ['./wholesale-requests.component.scss']
})
export class WholesaleRequestsComponent implements OnInit {
  wholesalerRequests: WholesalerRequest[] = [];
  filteredRequests: WholesalerRequest[] = [];
  selectedRequest: WholesalerRequest | null = null;
  
  newRequest: WholesalerRequest = {
    full_name: '',
    phone: '',
    email: '',
    region: '',
    field_activity: ''
  };

  visible: boolean = false;
  isEdit: boolean = false;

  statusOptions: StatusOption[] = [
    { label: 'Новая', value: 'Новая' },
    { label: 'В работе', value: 'В работе' },
    { label: 'Принята', value: 'Принята' },
    { label: 'Отказ', value: 'Отказ' },
    { label: 'Частное лицо (самозанятые)', value: 'частное лицо' }
  ];

  selectedStatuses: string[] = ['Новая'];

  constructor(private wholesalerService: WholesalerService) { }

  ngOnInit(): void {
    this.loadWholesalerRequests();
  }

  loadWholesalerRequests(): void {
    this.wholesalerService.getWholesalerRequests().subscribe((data) => {
      this.wholesalerRequests = data.map(request => ({
        ...request,
        status: request.status ?? 'Новая'  
      }));
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
      this.filteredRequests = [...this.wholesalerRequests];
    } else {
      this.filteredRequests = this.wholesalerRequests.filter(request =>
        this.selectedStatuses.includes(request.status ?? '')
      );
    }
  }

  showDialogCreate(visibleEdit: boolean, request: WholesalerRequest | null = null): void {
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

  createWholesalerRequest(): void {
    this.wholesalerService.createWholesalerRequest(this.newRequest).subscribe({
      next: (response: any) => {
        this.loadWholesalerRequests();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating request:', error);
        alert('Ошибка при создании заявки');
      }
    });
  }

  updateWholesalerRequest(): void {
    if (this.newRequest.id) {
      this.wholesalerService.updateWholesalerRequest(this.newRequest.id, this.newRequest).subscribe({
        next: (data) => {
          const index = this.wholesalerRequests.findIndex((req) => req.id === data.id);
          if (index !== -1) {
            this.wholesalerRequests[index] = data;
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

  onStatusChange(request: WholesalerRequest, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    
    if (newStatus && request.id) {
      request.status = newStatus;
      this.updateOperatorAndStatus(request);
    }
  }

  updateOperatorAndStatus(request: WholesalerRequest): void {
    if (request.id) {
      this.wholesalerService.updateStatusAndOperator(request.id, request.status || '', request.operator || '').subscribe({
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

  deleteWholesalerRequest(requestId: string | undefined): void {
    if (requestId && confirm('Вы уверены, что хотите удалить эту заявку?')) {
      this.wholesalerService.deleteWholesalerRequest(requestId).subscribe({
        next: () => {
          this.wholesalerRequests = this.wholesalerRequests.filter((req) => req.id !== requestId);
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
      region: '',
      field_activity: ''
    };
  }
}