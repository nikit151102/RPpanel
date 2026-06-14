// manage-roles-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-roles-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-roles-modal.component.html',
  styleUrl: './manage-roles-modal.component.scss' 
})
export class ManageRolesModalComponent {
  @Input() user: any;
  @Input() availableRoles: any[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() rolesUpdated = new EventEmitter<any>();

  selectedRoles: any[] = [];
  isSubmitting = false;

  ngOnInit() {
    if (this.user.roles) {
      this.selectedRoles = this.user.roles.map((role: any) => role.id);
    }
  }

  getUserInitials(): string {
    const first = this.user.first_name?.[0] || '';
    const last = this.user.last_name?.[0] || '';
    return (first + last).toUpperCase() || this.user.username[0].toUpperCase();
  }

  isRoleSelected(roleId: string): boolean {
    return this.selectedRoles.includes(roleId);
  }

  toggleRole(roleId: string) {
    const index = this.selectedRoles.indexOf(roleId);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(roleId);
    }
  }

  removeRole(roleId: string) {
    this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
  }

saveRoles() {
  this.isSubmitting = true;
  
  // Определяем какие роли добавить, а какие удалить
  const currentRoleIds = this.user.roles.map((role: any) => role.id);
  const rolesToAdd = this.selectedRoles.filter(roleId => !currentRoleIds.includes(roleId));
  const rolesToRemove = currentRoleIds.filter((roleId: any) => !this.selectedRoles.includes(roleId));

  const selectedRoleObjects = this.availableRoles.filter(role => 
    this.selectedRoles.includes(role.id)
  );
  
  this.rolesUpdated.emit({
    userId: this.user.id,
    roles: selectedRoleObjects,
    rolesToAdd: rolesToAdd,
    rolesToRemove: rolesToRemove
  });
  
  this.isSubmitting = false;
  this.closeModal();
}

  closeModal() {
    this.closed.emit();
  }
}