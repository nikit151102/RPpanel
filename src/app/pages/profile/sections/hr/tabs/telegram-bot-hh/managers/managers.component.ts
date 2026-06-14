import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Manager, ManagersService } from './managers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-managers',
  imports: [CommonModule, FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ManagersComponent implements OnInit {
  managers: Manager[] = [];
  managerDialog = false;
  manager: Manager = { name: '' };
  isEdit = false;
  submitted = false;

  constructor(
    private managerService: ManagersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadManagers();
  }

  loadManagers() {
    this.managerService.getManagers().subscribe(data => {
      this.managers = data;
    });
  }

  openNew() {
    this.manager = { name: '' };
    this.submitted = false;
    this.isEdit = false;
    this.managerDialog = true;
  }

  editManager(manager: Manager) {
    this.manager = { ...manager };
    this.isEdit = true;
    this.managerDialog = true;
  }

  deleteManager(manager: Manager) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${manager.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (manager.id) {
          this.managerService.deleteManager(manager.id).subscribe(() => {
            this.managers = this.managers.filter(m => m.id !== manager.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Manager Deleted', life: 3000 });
          });
        }
      }
    });
  }

  hideDialog() {
    this.managerDialog = false;
    this.submitted = false;
  }

  saveManager() {
    this.submitted = true;
    if (!this.manager.name.trim()) {
      return;
    }

    if (this.isEdit && this.manager.id) {
      this.managerService.updateManager(this.manager).subscribe(updated => {
        const index = this.managers.findIndex(m => m.id === updated.id);
        this.managers[index] = updated;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Manager Updated', life: 3000 });
        this.managerDialog = false;
      });
    } else {
      this.managerService.createManager(this.manager).subscribe(created => {
        this.managers.push(created);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Manager Created', life: 3000 });
        this.managerDialog = false;
      });
    }
  }
}