import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { IncidentReport, IncidentsService } from './incidents.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

import { HistoryStatusModalComponent } from './history-status-modal/history-status-modal.component';
import { ChangeStatusModalComponent } from './change-status-modal/change-status-modal.component';
import { IncidentDialogComponent } from './incident-dialog/incident-dialog.component';
import { TooltipComponent } from '../../../../../../../ui-lib';
import { ManagerStatService } from '../manager-stat/manager-stat.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-incidents',
  imports: [CommonModule, TableModule, DialogModule, DropdownModule, ReactiveFormsModule, ButtonModule, InputTextModule, TooltipComponent, HistoryStatusModalComponent, ChangeStatusModalComponent, IncidentDialogComponent],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.scss'
})
export class IncidentsComponent implements OnInit {
  @Input() managerUsername: any;
  incidentForm: FormGroup;
  incidents: any[] = [];
  selectedIncident: any | null = null;
  isEditMode = false;
  isDialogVisible = false;
  isHistoryDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentsService,
    private messageService: MessageService,
    private router: Router,
    private statisticsService: ManagerStatService,
    private http: HttpClient
  ) {
    this.incidentForm = this.fb.group({
      date: [null, Validators.required],
      reason_type_id: [null, Validators.required],
      contractor: ['', Validators.required],
      details: ['', Validators.required],
      items: this.fb.array([])
    });
  }


  reasonTypes: any[] = [];
  products: any[] = [];
  productPerPage = 100;
  productQuery: string = '';
  currentUser: any;

  loadProducts(event: any) {
    const page = event.first ? Math.floor(event.first / event.rows) + 1 : 1;
    const per_page = event.rows || this.productPerPage;
    const query = event.filter?.trim() || '';

    this.incidentService.searchProducts(query, page, per_page).subscribe((res: any) => {
      let items = res.items || [];

      // Если есть фильтр и введённого значения нет в списке, добавляем его первым
      if (query && !items.some((p: any) => p.name.toLowerCase() === query.toLowerCase())) {
        items = [{ id: query, name: query }, ...items];
      }

      if (event.filter) {
        // Если фильтр — заменяем весь список
        this.products = items;
      } else {
        // Иначе добавляем к уже загруженному
        this.products = [...this.products, ...items];
      }
    });
  }

  isAdmin() {
    const is_superuser = this.currentUser?.is_superuser;
    if (is_superuser === true || this.currentUser?.username == 'zakupki') {
      return true
    } else {
      return false
    }
  }

  get items(): FormArray {
    return this.incidentForm.get('items') as FormArray;
  }

  addItem(product?: any) {
    this.items.push(
      this.fb.group({
        product_id: [product?.id || null, Validators.required],
        quantity: [product?.quantity || 0, [Validators.required, Validators.min(1)]],
        amount: [product?.amount || 0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  getTooltipContent(items: any[]): string {
    return items
      .map(i => `${i.product_name || i.product?.name || 'Товар'} — ${i.quantity} шт.`)
      .join(', ');
  }

  ngOnInit() {
    this.loadReasonTypes();
    this.checkViewport();
    this.statisticsService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.managerUsername = user.username;
      if (this.isAdmin()) {
        this.getAllIncidents();
      } else {
        this.getIncidents();
      }
    });
  }


  isMobileView = false;
  private mobileBreakpoint = 1299;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobileView = window.innerWidth <= this.mobileBreakpoint;
  }
  loadReasonTypes() {
    this.incidentService.getReasonTypes().subscribe(
      (res: any) => {
        this.reasonTypes = res;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить типы причин.' });
      }
    );
  }


  getStatusClass(statusName: string): string {
    if (!statusName) return 'unknown-status';

    return statusName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё-]/gi, '');
  }

  // Получаем инциденты для данного managerId
  getIncidents() {
    this.incidentService.getIncidentsByManager(this.managerUsername).subscribe(
      (data) => {
        console.log('getIncidentsByManager', data)
        this.incidents = data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить инциденты.' });
      }
    );
  }

  getAllIncidents() {
    this.incidentService.getAllIncidents().subscribe(
      (data) => {
        console.log('getIncidentsByManager', data)
        this.incidents = data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить инциденты.' });
      }
    );
  }

  getTotalAmount(incident: any): number {
    if (!incident.items) return 0;
    return incident.items.reduce((sum: number, item: any) => sum + (item.quantity * item.amount), 0);
  }

  onDialogSubmitted(data: any) {
    if (this.isEditMode && this.selectedIncident) {
      this.updateIncident(this.selectedIncident.id, data);
    } else {
      this.createIncident(data);
    }
  }

  onDialogCancelled() {
    this.onCancelEdit();
  }

  onDialogClosed() {
    this.onCancelEdit();
  }

  // Обрабатываем создание нового инцидента
  async onSubmit() {
    if (!this.incidentForm.valid) return;

    const formItems = this.items.controls.map(ctrl => ctrl.value);
    const updatedItems = [];

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    for (const item of formItems) {
      let productId = item.product_id?.id || item.product_id;

      if (typeof productId === 'string' && !uuidRegex.test(productId)) {
        try {
          const newProduct = await this.incidentService.createProduct({ name: productId, sku: '' }).toPromise();
          productId = newProduct.id;
        } catch (err) {
          console.error('Ошибка при создании товара:', productId, err);
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: `Не удалось создать товар "${productId}"` });
          return;
        }
      }

      updatedItems.push({
        product_id: productId,
        quantity: item.quantity,
        amount: item.amount
      });
    }

    const payload = {
      ...this.incidentForm.value,
      manager_id: this.managerUsername,
      items: updatedItems
    };

    if (this.isEditMode && this.selectedIncident) {
      this.updateIncident(this.selectedIncident.id, payload);
    } else {
      this.createIncident(payload);
    }
  }

  onCreateNewIncident() {
    this.isEditMode = false;
    this.selectedIncident = null;
    this.incidentForm.reset();
    this.isDialogVisible = true;
  }

  historyDataCurrentIncident: any[] = [];
  showHistoryModal = false;

  onHistoryIncident(incidentId: string) {
    this.incidentService.getHistoryStatuses(incidentId).subscribe((data: any) => {
      console.log('data', data);
      this.historyDataCurrentIncident = data;
      this.showHistoryModal = true;
    });
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
  }


  createIncident(data: any) {

    this.incidentService.createIncident(data).subscribe(
      (data) => {
        this.incidents.push(data);
        this.incidentForm.reset();
        this.isDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Инцидент успешно создан.' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать инцидент.' });
      }
    );
  }

  updateIncident(incidentId: string, updatedIncident: any) {

    this.incidentService.updateIncident(incidentId, updatedIncident).subscribe(
      (data) => {
        const index = this.incidents.findIndex((incident) => incident.id === incidentId);
        this.incidents[index] = data;
        this.incidentForm.reset();
        this.isEditMode = false;
        this.selectedIncident = null;
        this.isDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Инцидент успешно обновлен.' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить инцидент.' });
      }
    );
  }

  deleteIncident(incidentId: string) {
    this.incidentService.deleteIncident(incidentId).subscribe(
      () => {
        // Удаляем инцидент из массива
        this.incidents = this.incidents.filter((incident) => incident.id !== incidentId);
        this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Инцидент успешно удален.' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить инцидент.' });
      }
    );
  }


  // Выбираем инцидент для редактирования
  onSelectIncident(incident: any) {
    this.isEditMode = true;
    this.selectedIncident = incident;

    // Заполняем простые поля
    this.incidentForm.patchValue({
      date: incident.date,
      contractor: incident.contractor,
      details: incident.details,
      reason_type_id: incident.reason_type?.id
    });

    // Очищаем FormArray товаров
    this.items.clear();

    // Загрузим все товары, если они ещё не загружены
    if (!this.products.length) {
      this.loadProducts({ first: 0, rows: this.productPerPage, filter: '' });
    }

    // Добавляем товары в FormArray
    if (incident.items && incident.items.length) {
      incident.items.forEach((item: any) => {
        // Ищем объект продукта в products по id
        let productOption = this.products.find(p => p.id === item.product.id);

        // Если товар не найден, добавляем его в список
        if (!productOption) {
          productOption = item.product;  // fallback, если товар не найден в products
          this.products.push(productOption); // добавляем в список продуктов
        }

        this.items.push(
          this.fb.group({
            product_id: [productOption, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            amount: [item.amount, [Validators.required, Validators.min(0)]]
          })
        );
      });
    }

    this.isDialogVisible = true;
  }

  // Отменяем редактирование
  onCancelEdit() {
    this.isEditMode = false;
    this.selectedIncident = null;
    this.incidentForm.reset();
    this.isDialogVisible = false;
  }




  showStatusModal = false;

  onEditStatus(incident: any) {
    this.selectedIncident = incident;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedIncident = null;
  }

  onStatusChanged(response: any) {
    console.log('Статус изменен:', response);

    // Находим индекс инцидента в массиве
    const incidentIndex = this.incidents.findIndex(incident =>
      incident.id === response.incident_id
    );

    if (incidentIndex !== -1) {
      // Создаем обновленную копию инцидента
      const updatedIncident = {
        ...this.incidents[incidentIndex],
        status_id: response.new_status.id,
        status_name: response.new_status.name,
        last_status_log: {
          changed_at: response.changed_at,
          comment: response.comment,
          new_status: response.new_status.name

        }
      };

      // Обновляем массив incidents
      this.incidents = [
        ...this.incidents.slice(0, incidentIndex),
        updatedIncident,
        ...this.incidents.slice(incidentIndex + 1)
      ];

      console.log('Инцидент обновлен:', updatedIncident);
    } else {
      console.warn('Инцидент не найден в списке для обновления');
    }
  }


}