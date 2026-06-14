import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, Vacation } from '../../vacation.interface.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() currentUser!: User | null;
  @Input() isDirector = false;
  @Input() isDeputyDirector = false;
  @Input() isStoreManager = false;
  @Input() managedStoreName = '';
  @Input() approvalQueue: Vacation[] = [];
  @Input() userStores: any[] = [];
  @Input() isLoading = false;

  @Output() openCreateVacationModal = new EventEmitter<void>();
  @Output() openCreateForUserModal = new EventEmitter<void>();
  @Output() openStoreSelectorForManager = new EventEmitter<void>();
  @Output() refreshData = new EventEmitter<void>();
}