// drivers.component.ts
import { Component, OnInit } from '@angular/core';
import { DriversService } from '../../services/drivers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drivers',
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {

  users: any[] = [];
  selectedUser: any = {} as any;
  userDialog: boolean = false;
  userDialogTitle: string = '';
  
  // Пагинация
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private driversService: DriversService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.driversService.getUsers().subscribe((data: any) => {
      this.users = data;
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    });
  }

  // Инициалы для аватара
  getUserInitials(user: any): string {
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || 'U';
  }

  // Сортировка
  sortTable(field: string) {
    this.users.sort((a, b) => {
      const aVal = a[field] || '';
      const bVal = b[field] || '';
      return aVal.localeCompare(bVal);
    });
  }

  // Пагинация
  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // CRUD операции
  openNew() {
    this.selectedUser = {} as any;
    this.userDialogTitle = 'Новый водитель';
    this.userDialog = true;
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.userDialogTitle = 'Редактировать водителя';
    this.userDialog = true;
  }

  deleteUser(user: any) {
    if (confirm(`Вы уверены, что хотите удалить водителя ${user.username}?`)) {
      this.driversService.deleteUser(user.id).subscribe(() => this.loadUsers());
    }
  }

  hideDialog() {
    this.userDialog = false;
  }

  saveUser() {
    if (this.selectedUser.id) {
      this.driversService.updateUser(this.selectedUser).subscribe(() => this.loadUsers());
    } else {
      this.driversService.createUser(this.selectedUser).subscribe(() => this.loadUsers());
    }
    this.userDialog = false;
  }
}