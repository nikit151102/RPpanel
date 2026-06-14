// users-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { CreateUserModalComponent } from './components/create-user-modal/create-user-modal.component';
import { ManageRolesModalComponent } from './components/manage-roles-modal/manage-roles-modal.component';
import { UsersService } from './services/users.service';
import { environment } from '../../../../../../../evirement';
import { AccessService } from '../roles-management/access.service';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
  two_factor_enabled: boolean;
  account_locked: boolean;
  last_login: string;
  created_at: string;
  locale: string;
  timezone: string;
  roles: Role[];
}

interface Role {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationPopupComponent, CreateUserModalComponent, ManageRolesModalComponent],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  roles: Role[] = [];

  searchQuery: string = '';
  statusFilter: string = '';
  roleFilter: string = '';

  constructor(private http: HttpClient, private usersService: UsersService, private accessService: AccessService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }


  loadUsers() {
    this.usersService.getAll().subscribe((data: any) => {
      this.users = data;
      this.filteredUsers = data;
    });
  }

  loadRoles() {
    // Заглушка для демонстрации
    this.http.get<Role[]>(`${environment.apiAuthHubUrl}/roles/`).subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        // Тестовые роли
        this.roles = [
          { id: '1', name: 'Администратор', description: 'Полный доступ' },
          { id: '2', name: 'Менеджер', description: 'Ограниченный доступ' },
          { id: '3', name: 'Пользователь', description: 'Базовый доступ' }
        ];
      }
    });
  }

  // Метод для создания демо-данных
  private createDemoData() {
    this.users = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        first_name: 'Иван',
        last_name: 'Петров',
        is_active: true,
        is_superuser: true,
        two_factor_enabled: true,
        account_locked: false,
        last_login: '2024-01-15T10:30:00Z',
        created_at: '2024-01-01T00:00:00Z',
        locale: 'ru-RU',
        timezone: 'Europe/Moscow',
        roles: [{ id: '1', name: 'Администратор', description: 'Полный доступ' }]
      },
      {
        id: '2',
        username: 'manager',
        email: 'manager@company.com',
        first_name: 'Мария',
        last_name: 'Сидорова',
        is_active: true,
        is_superuser: false,
        two_factor_enabled: false,
        account_locked: false,
        last_login: '2024-01-14T15:45:00Z',
        created_at: '2024-01-02T00:00:00Z',
        locale: 'ru-RU',
        timezone: 'Europe/Moscow',
        roles: [{ id: '2', name: 'Менеджер', description: 'Ограниченный доступ' }]
      },
      {
        id: '3',
        username: 'user123',
        email: 'user@company.com',
        first_name: 'Алексей',
        last_name: 'Иванов',
        is_active: false,
        is_superuser: false,
        two_factor_enabled: false,
        account_locked: true,
        last_login: '2024-01-10T09:15:00Z',
        created_at: '2024-01-03T00:00:00Z',
        locale: 'en-US',
        timezone: 'UTC',
        roles: [{ id: '3', name: 'Пользователь', description: 'Базовый доступ' }]
      },
      {
        id: '4',
        username: 'test_user',
        email: 'test@company.com',
        first_name: 'Ольга',
        last_name: 'Кузнецова',
        is_active: true,
        is_superuser: false,
        two_factor_enabled: true,
        account_locked: false,
        last_login: '2024-01-16T08:20:00Z',
        created_at: '2024-01-05T00:00:00Z',
        locale: 'ru-RU',
        timezone: 'Europe/Moscow',
        roles: [
          { id: '2', name: 'Менеджер', description: 'Ограниченный доступ' },
          { id: '3', name: 'Пользователь', description: 'Базовый доступ' }
        ]
      }
    ];
    this.filteredUsers = this.users;
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.users;

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      switch (this.statusFilter) {
        case 'active':
          filtered = filtered.filter(user => user.is_active && !user.account_locked);
          break;
        case 'inactive':
          filtered = filtered.filter(user => !user.is_active);
          break;
        case 'locked':
          filtered = filtered.filter(user => user.account_locked);
          break;
      }
    }

    // Apply role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user =>
        user.roles.some(role => role.id === this.roleFilter)
      );
    }

    this.filteredUsers = filtered;
  }

  getUserInitials(user: User): string {
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return (first + last).toUpperCase() || user.username[0].toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Никогда';

    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Computed properties for statistics
  get activeUsersCount(): number {
    return this.users.filter(user => user.is_active && !user.account_locked).length;
  }

  get lockedUsersCount(): number {
    return this.users.filter(user => user.account_locked).length;
  }

  get adminUsersCount(): number {
    return this.users.filter(user => user.is_superuser).length;
  }




  showCreateModal = false;
  showRolesModal = false;
  showConfirmation = false;

  // Selected user for modals
  selectedUser: any = null;
  confirmationConfig: any = {};

  // Modal methods
  openCreateModal() {
    this.selectedUser = null;
    this.showCreateModal = true;
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.showCreateModal = true;
  }

  manageRoles(user: User) {
    this.selectedUser = user;
    this.showRolesModal = true;
  }

  resetPassword(user: User) {
    this.confirmationConfig = {
      title: 'Сброс пароля',
      message: `Вы уверены, что хотите сбросить пароль для пользователя ${user.username}?`,
      type: 'warning',
      confirmText: 'Сбросить пароль',
      onConfirm: () => this.performPasswordReset(user)
    };
    this.showConfirmation = true;
  }

  toggleLock(user: User) {
    const action = user.account_locked ? 'разблокировать' : 'заблокировать';
    this.confirmationConfig = {
      title: `${user.account_locked ? 'Разблокировка' : 'Блокировка'} аккаунта`,
      message: `Вы уверены, что хотите ${action} пользователя ${user.username}?`,
      type: user.account_locked ? 'success' : 'warning',
      confirmText: user.account_locked ? 'Разблокировать' : 'Заблокировать',
      confirmButtonClass: user.account_locked ? 'btn-success' : 'btn-danger',
      onConfirm: () => this.performToggleLock(user)
    };
    this.showConfirmation = true;
  }

  deleteUser(user: User) {
    this.confirmationConfig = {
      title: 'Удаление пользователя',
      message: `Вы уверены, что хотите удалить пользователя ${user.username}? Это действие нельзя отменить.`,
      type: 'danger',
      confirmText: 'Удалить',
      confirmButtonClass: 'btn-danger',
      onConfirm: () => this.performDeleteUser(user)
    };
    this.showConfirmation = true;
  }

  // Action performers
  private performPasswordReset(user: User) {
    console.log('Password reset for:', user.username);
    // API call here
  }

  private performToggleLock(user: User) {
    user.account_locked = !user.account_locked;
    this.applyFilters();
    console.log('Toggled lock for:', user.username);
  }

  private performDeleteUser(user: User) {

    this.usersService.deleteItem(user.id).subscribe((data: any) => {
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilters();
      console.log('Deleted user:', user.username);

    })
  }

  // Modal event handlers
  onUserSaved(userData: any) {
    if (this.selectedUser) {
      // Update existing user


      this.usersService.updateItem(this.selectedUser.id, userData).subscribe((data: any) => {
        const index = this.users.findIndex(u => u.id === this.selectedUser.id);
        if (index > -1) {
          this.users[index] = { ...this.users[index], ...userData };
        }
      })

    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        two_factor_enabled: false,
        account_locked: false,
        last_login: null,
        created_at: new Date().toISOString(),
        roles: []
      };
      this.usersService.setItem(newUser).subscribe((data: any) => {
        this.users.unshift(newUser);
      })

    }
    this.applyFilters();
  }

  onRolesUpdated(data: any) {
    const { userId, rolesToAdd, rolesToRemove } = data;

    // Создаем массив промисов для всех операций
    const operations: any = [];
    console.log('rolesToAdd', rolesToAdd)
    // Добавляем операции на добавление ролей
    rolesToAdd.forEach((roleId: any) => {
      console.log('roleId', roleId)
      operations.push(
        this.accessService.assignRoleToUser(roleId, userId).toPromise()
      );
    });

    // Добавляем операции на удаление ролей (если нужно)
    rolesToRemove.forEach((roleId: any) => {
      operations.push(
        this.accessService.removeRoleToUser(roleId, userId).toPromise()
      );
    });

    // Выполняем все операции последовательно
    this.executeOperationsSequentially(operations, userId);
  }

  // Метод для последовательного выполнения операций
  async executeOperationsSequentially(operations: Promise<any>[], userId: string) {
    for (let i = 0; i < operations.length; i++) {
      try {
        const result = await operations[i];
        console.log(`Operation ${i + 1} completed successfully`);

      } catch (error) {
        console.error(`Operation ${i + 1} failed:`, error);
        // Можно добавить обработку ошибок для каждой операции
      }
    }

    this.applyFilters();
  }


  onConfirmationConfirmed() {
    if (this.confirmationConfig.onConfirm) {
      this.confirmationConfig.onConfirm();
    }
    this.showConfirmation = false;

  }

  // Close modal methods
  closeCreateModal() {
    this.showCreateModal = false;
    this.selectedUser = null;
  }

  closeRolesModal() {
    this.showRolesModal = false;
    this.selectedUser = null;
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.confirmationConfig = {};
  }
}