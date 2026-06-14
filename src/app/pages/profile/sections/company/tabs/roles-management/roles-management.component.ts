import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolesManagementService } from './roles-management.service';
import { Action, Permission, Microfrontend, Tab, AccessService, Role } from './access.service';


@Component({
  selector: 'app-roles-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-management.component.html',
  styleUrl: './roles-management.component.scss'
})
export class RolesManagementComponent implements OnInit {
  activeTab: 'roles' | 'actions' | 'permissions' | 'microfrontends' | 'tabs' = 'roles';

  // Data
  roles: Role[] = [];
  actions: Action[] = [];
  permissions: Permission[] = [];
  microfrontends: Microfrontend[] = [];
  tabs: Tab[] = [];

  // Selected items
  selectedRole?: Role;
  selectedAction?: Action;
  selectedPermission?: Permission;
  selectedMicrofrontend?: Microfrontend;
  selectedTab?: Tab;

  // Forms
  newRole: Omit<Role, 'id'> = { name: '', description: '', parent_role_id: '' };
  newAction: { name: string } = { name: '' };
  newPermission: Omit<Permission, 'id'> = { name: '', description: '', scope: '', action_ids: [] };
  newMicrofrontend: Omit<Microfrontend, 'id'> = { name: '', url: '', route: '', is_active: true, priority: 0 };
  newTab: { name: string; parent_id?: string; route?: string; order?: number } = { name: '' };

  // Assignment
  selectedPermissionIds: string[] = [];
  selectedRoleId?: string;
  selectedActionIds: string[] = [];

  constructor(private authHubService: AccessService) { }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loadRoles();
    this.loadActions();
    this.loadPermissions();
    this.loadMicrofrontends();
  }

  // Roles
  loadRoles() {
    this.authHubService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (error) => console.error('Error loading roles:', error)
    });
  }

  createRole() {
    const roleData = {
      name: this.newRole.name,
      description: this.newRole.description,
      parent_role_id: this.newRole.parent_role_id || null
    }

    this.authHubService.createRole(roleData).subscribe({
      next: () => {
        this.loadRoles();
        this.newRole = { name: '', description: '', parent_role_id: '' };
      },
      error: (error) => console.error('Error creating role:', error)
    });
  }

  updateRole() {
    if (this.selectedRole) {
      this.authHubService.updateRole(this.selectedRole.id, this.newRole).subscribe({
        next: () => {
          this.loadRoles();
          this.selectedRole = undefined;
        },
        error: (error) => console.error('Error updating role:', error)
      });
    }
  }

  deleteRole(roleId: string) {
    this.authHubService.deleteRole(roleId).subscribe({
      next: () => this.loadRoles(),
      error: (error) => console.error('Error deleting role:', error)
    });
  }

  // Actions
  loadActions() {
    this.authHubService.getActions().subscribe({
      next: (actions: any) => this.actions = actions.data,
      error: (error) => console.error('Error loading actions:', error)
    });
  }

  createAction() {
    this.authHubService.createAction(this.newAction).subscribe({
      next: () => {
        this.loadActions();
        this.newAction = { name: '' };
      },
      error: (error) => console.error('Error creating action:', error)
    });
  }

  // Permissions
  loadPermissions() {
    this.authHubService.getPermissions().subscribe({
      next: (permissions) => this.permissions = permissions,
      error: (error) => console.error('Error loading permissions:', error)
    });
  }

  createPermission() {
    this.authHubService.createPermission(this.newPermission).subscribe({
      next: () => {
        this.loadPermissions();
        this.newPermission = { name: '', description: '', scope: '', action_ids: [] };
      },
      error: (error) => console.error('Error creating permission:', error)
    });
  }

  // Microfrontends
  loadMicrofrontends() {
    this.authHubService.getMicrofrontends().subscribe({
      next: (microfrontends) => this.microfrontends = microfrontends,
      error: (error) => console.error('Error loading microfrontends:', error)
    });
  }

  createMicrofrontend() {
    this.authHubService.createMicrofrontend(this.newMicrofrontend).subscribe({
      next: () => {
        this.loadMicrofrontends();
        this.newMicrofrontend = { name: '', url: '', route: '', is_active: true, priority: 0 };
      },
      error: (error) => console.error('Error creating microfrontend:', error)
    });
  }

  // Tabs
  loadTabs(microfrontendId: string) {
    this.authHubService.getMicrofrontendTabs(microfrontendId).subscribe({
      next: (tabs) => this.tabs = tabs,
      error: (error) => console.error('Error loading tabs:', error)
    });
  }

  createTab() {
    if (this.selectedMicrofrontend) {
      const tabData = {
        name: this.newTab.name,
        ...(this.newTab.parent_id && { parent_id: this.newTab.parent_id }),
        ...(this.newTab.route && { route: this.newTab.route }),
        ...(this.newTab.order && { order: this.newTab.order })
      };

      this.authHubService.createTab(this.selectedMicrofrontend.id, tabData).subscribe({
        next: () => {
          this.loadTabs(this.selectedMicrofrontend!.id);
          this.newTab = { name: '' };
        },
        error: (error) => console.error('Error creating tab:', error)
      });
    }
  }

  // Assignment methods
  assignPermissionToRole() {
    if (this.selectedRole && this.selectedPermissionIds.length > 0) {
      this.selectedPermissionIds.forEach(permissionId => {
        this.authHubService.assignPermissionToRole(this.selectedRole!.id, permissionId).subscribe();
      });
    }
  }

  assignPermissionsToMicrofrontend() {
    if (this.selectedMicrofrontend && this.selectedPermissionIds.length > 0) {
      this.authHubService.assignPermissionToMicrofrontend(this.selectedMicrofrontend.id, this.selectedPermissionIds).subscribe();
    }
  }

  selectTab(tab: any) {
    this.activeTab = tab;
  }

  selectItem(item: any, type: string) {
    switch (type) {
      case 'role':
        this.selectedRole = item;
        this.newRole = { ...item };
        break;
      case 'microfrontend':
        this.selectedMicrofrontend = item;
        this.loadTabs(item.id);
        break;
      case 'tab':
        this.selectedTab = item;
        this.newTab = { ...item };
        break;
    }
  }

  getTabLabel(tab: string): string {
    const labels = {
      'roles': 'Роли',
      'actions': 'Действия',
      'permissions': 'Разрешения',
      'microfrontends': 'Микрофронты',
      'tabs': 'Вкладки'
    };
    return labels[tab as keyof typeof labels] || tab;
  }

  togglePermissionSelection(permissionId: string, event: any) {
    if (event.target.checked) {
      this.selectedPermissionIds.push(permissionId);
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(id => id !== permissionId);
    }
  }

  toggleActionSelection(actionId: string, event: any) {
    if (event.target.checked) {
      this.newPermission.action_ids.push(actionId);
    } else {
      this.newPermission.action_ids = this.newPermission.action_ids.filter(id => id !== actionId);
    }
  }



  assignPermissionToTabs() {
    if (this.selectedTab && this.selectedPermissionIds.length > 0) {
      this.authHubService.assignPermissionsToTab(this.selectedTab!.id, this.selectedPermissionIds).subscribe();
    }
  }

}