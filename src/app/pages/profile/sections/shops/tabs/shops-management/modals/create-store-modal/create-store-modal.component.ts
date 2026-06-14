import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { StoreCreateDto } from '../../../../../../../../interfaces/store.interface';
import { StoreService } from '../../../../../../../../services/store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-store-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-store-modal.component.html',
  styleUrl: './create-store-modal.component.scss'
})
export class CreateStoreModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() storeCreated = new EventEmitter<any>();

  storeData: StoreCreateDto = {
    uuid1C: '',
    name1C: '',
    addressId: '',
    code: '',
    storeScheduleId: '',
    address: {
      address1c: '',
      country: 'Россия',
      region: '',
      area: '',
      city: '',
      street: '',
      house: '',
      housing: '',
      floorNumber: '',
      office: '',
      postIndex: '',
      latitude: 0,
      longitude: 0,
      system: 'manual'
    }
  };

  isLoading = false;

  constructor(private storeService: StoreService) {}

  closeModal() {
    this.closed.emit();
  }

  isFormValid(): boolean {
    return !!this.storeData.name1C && 
           !!this.storeData.code && 
           !!this.storeData.address.city && 
           !!this.storeData.address.street && 
           !!this.storeData.address.house;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      // Generate address1c from components
      this.storeData.address.address1c = this.generateAddress1C();
      
      this.storeService.createStore(this.storeData).subscribe({
        next: (store) => {
          this.isLoading = false;
          this.storeCreated.emit(store);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating store:', error);
          this.isLoading = false;
          alert('Ошибка при создании магазина');
        }
      });
    }
  }

  private generateAddress1C(): string {
    const parts = [
      this.storeData.address.country,
      this.storeData.address.region,
      this.storeData.address.city,
      this.storeData.address.street,
      this.storeData.address.house
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  }
}