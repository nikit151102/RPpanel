import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { FileUpload } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { MonthlyPlansServiceService } from './monthly-plans-service.service';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { environment } from '../../../../../../../../evirement';

registerLocaleData(localeRu);

@Component({
  selector: 'app-admin-manager',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, TabViewModule, TableModule, DialogModule,
    FormsModule, InputTextModule, InputNumberModule, DropdownModule, CardModule,
    FileUploadModule, CalendarModule,
  ],
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit {
  @Input() dialogVisible: boolean = false;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  employees: any[] = [];
  yearlyPlans: any[] = [];
  monthlyPlans: any[] = [];

  employeeForm: any = {};
  yearlyForm: any = {};
  monthlyForm: any = {};

  editingEmployee: any = null;
  editingYearly: any = null;
  editingMonthly: any = null;

  selectedYearly: any = null;
  activeTab: number = 0;

  clientTypes = [
    { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Действующие' },
    { id: '9c858901-8a57-4791-81fe-4c455b099bc9', name: 'Новые' }
  ];

  apiUrl = environment.apiUrlManager;

  constructor(private http: HttpClient, private monthlyPlansService: MonthlyPlansServiceService) { }

  ngOnInit() {
    this.loadAll();
    this.getMonthlyPlans();
  }

  closeDialog() {
    this.dialogVisible = false;
    this.dialogVisibleChange.emit(this.dialogVisible);
    this.closed.emit();
  }


  loadAll() {
    this.http.get<any[]>(`${this.apiUrl}/employees/`).subscribe(res => this.employees = res);
    this.http.get<any[]>(`${this.apiUrl}/yearly-plans/`).subscribe(res => this.yearlyPlans = res);
  }

  // ---------- EMPLOYEES ----------
  saveEmployee() {
    if (this.editingEmployee) {
      this.http.put(`${this.apiUrl}/employees/${this.editingEmployee.id}`, this.employeeForm)
        .subscribe(() => this.reloadEmployees());
    } else {
      this.http.post(`${this.apiUrl}/employees/`, this.employeeForm)
        .subscribe(() => this.reloadEmployees());
    }
  }

  editEmployee(emp: any) {
    this.editingEmployee = emp;
    this.employeeForm = { ...emp };
  }

  deleteEmployee(id: string) {
    this.http.delete(`${this.apiUrl}/employees/${id}`).subscribe(() => this.reloadEmployees());
  }

  reloadEmployees() {
    this.employeeForm = {};
    this.editingEmployee = null;
    this.http.get<any[]>(`${this.apiUrl}/employees/`).subscribe(res => this.employees = res);
  }

  // ---------- YEARLY ----------
  saveYearly() {
    if (this.editingYearly) {
      this.http.put(`${this.apiUrl}/yearly-plans/${this.editingYearly.id}`, this.yearlyForm)
        .subscribe(() => this.reloadYearly());
    } else {
      this.http.post(`${this.apiUrl}/yearly-plans/`, this.yearlyForm)
        .subscribe(() => this.reloadYearly());
    }
  }

  editYearly(plan: any) {
    this.editingYearly = plan;
    this.yearlyForm = { ...plan };
  }

  deleteYearly(id: string) {
    this.http.delete(`${this.apiUrl}/yearly-plans/${id}`).subscribe(() => this.reloadYearly());
  }

  reloadYearly() {
    this.yearlyForm = {};
    this.editingYearly = null;
    this.selectedYearly = null;
    this.monthlyPlans = [];
    this.http.get<any[]>(`${this.apiUrl}/yearly-plans/`).subscribe(res => this.yearlyPlans = res);
  }

  selectYearly(plan: any) {
    this.selectedYearly = plan;
    this.editingMonthly = null;
    this.monthlyForm = {
      employee_id: plan.employee_id, // подтягиваем сотрудника из годового плана
      yearly_plan_id: plan.id         // подтягиваем id годового плана
    };
    this.http.get<any[]>(`${this.apiUrl}/monthly-plans/by-yearly/${plan.id}`)
      .subscribe(res => this.monthlyPlans = res);
  }

  // ---------- MONTHLY ----------
  saveMonthly() {
    this.monthlyForm.yearly_plan_id = this.selectedYearly.id;
    if (this.editingMonthly) {
      this.http.put(`${this.apiUrl}/monthly-plans/${this.editingMonthly.id}`, this.monthlyForm)
        .subscribe(() => this.reloadMonthly());
    } else {
      this.http.post(`${this.apiUrl}/monthly-plans/`, this.monthlyForm)
        .subscribe(() => this.reloadMonthly());
    }
  }

  editMonthly(plan: any) {
    this.editingMonthly = plan;
    this.monthlyForm = { ...plan };
  }

  deleteMonthly(id: string) {
    this.http.delete(`${this.apiUrl}/monthly-plans/${id}`).subscribe(() => this.reloadMonthly());
  }

  reloadMonthly() {
    this.monthlyForm = {};
    this.editingMonthly = null;
    if (this.selectedYearly) {
      this.http.get<any[]>(`${this.apiUrl}/monthly-plans/by-yearly/${this.selectedYearly.id}`)
        .subscribe(res => this.monthlyPlans = res);
    }
  }










  // Новые поля
  uploadedFile: File | null = null;
  selectedYear: any | null = null;


  // Метод для выбора файла
  uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  // метод импорта
  importMonthlyPlan() {
    if (!this.uploadedFile || !this.selectedYear) {
      alert("Выберите файл и год!");
      console.log('this.uploadedFile', this.uploadedFile)
      console.log('this.selectedYear', this.selectedYear)
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    // Если selectedYear — это объект Date, берём только год
    const year = this.selectedYear instanceof Date ? this.selectedYear.getFullYear() : this.selectedYear;

    this.http.post(`${this.apiUrl}/client-types/upload-plans/?year=${year}`, formData)
      .subscribe(() => {
        this.reloadMonthly();
        alert("Файл успешно загружен!");
        this.uploadedFile = null;
        this.selectedYear = null;
      });
  }














  oldMonthlyPlans: any[] = []; // Массив для хранения планов



  // Получаем месячные планы через API
  getMonthlyPlans() {
    const previousYear = new Date().getFullYear() - 1; // Получаем текущий год
    console.log('previousYear', previousYear)
    this.monthlyPlansService.getMonthlyPlansWithCoefficient(previousYear).subscribe(
      (plans) => {
        // Увеличиваем прибыль с коэффициентом
        this.oldMonthlyPlans = plans;
        console.log('oldMonthlyPlans', this.oldMonthlyPlans)
      },
      (error) => {
        console.error('Error fetching monthly plans:', error);
      }
    );
  }

  // Получаем имя месяца
  getMonthName(month: number): string {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[month - 1];
  }

  // Создаем новый план на основе увеличенных данных
  createNewPlan() {
    const year = new Date().getFullYear(); // Текущий год
    this.monthlyPlansService.createMonthlyPlansWithYearly(year, this.oldMonthlyPlans).subscribe(
      (response) => {
        console.log('New monthly plans created:', response);
        alert('Новый план успешно создан!');
      },
      (error) => {
        console.error('Error creating new plans:', error);
        alert('Ошибка при создании нового плана');
      }
    );
  }













  //Дневной факт
  // component.ts
  uploadedDayFile: File | null = null;
  selectedDate: Date | null = null;

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedDayFile = file;
    }
  }


uploadFileAndDate() {
  if (!this.uploadedDayFile || !this.selectedDate) {
    alert('Выберите дату и файл!');
    return;
  }

  const formData = new FormData();
  formData.append('file', this.uploadedDayFile);

  // Преобразуем дату в формат YYYY-MM-DD с проверкой типа
  let dateStr: string;
  
  if (this.selectedDate instanceof Date) {
    dateStr = this.selectedDate.toISOString().split('T')[0];
  } else if (typeof this.selectedDate === 'string') {
    // Если это строка, пробуем создать объект Date
    const dateObj = new Date(this.selectedDate);
    if (!isNaN(dateObj.getTime())) {
      dateStr = dateObj.toISOString().split('T')[0];
    } else {
      alert('Некорректный формат даты');
      return;
    }
  } else {
    alert('Некорректный формат даты');
    return;
  }

  this.http.post(`${this.apiUrl}/client-types/process-managers-to-db?date=${dateStr}`, formData)
    .subscribe({
      next: (res) => {
        alert('Файл успешно загружен!');
        this.uploadedDayFile = null;
        this.selectedDate = null;
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при загрузке файла');
      }
    });
}

}
