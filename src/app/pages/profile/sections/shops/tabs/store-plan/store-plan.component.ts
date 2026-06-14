import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CreatePlanModalComponent } from './create-plan-modal/create-plan-modal.component';
import { FormsModule } from '@angular/forms';
import { StorePlanInstance, UserInstance, StorePlanType, FilterRequest } from '../../../../../../interfaces/store-plan.interface';
import { Store } from '../../../../../../interfaces/store.interface';
import { StorePlanService } from '../../../../../../services/store-plan.service';
import { StoreService } from '../../../../../../services/store.service';
import { CompanyRoutingModule } from "../../../company/company-routing.module";
import { SignatureService } from '../../../../../../services/signature.service';
import { ExcelService } from '../signature/excel/excel.service';
import { ManagerStatService } from '../../../sales-managers/tabs/manager-stat/manager-stat.service';
import { CurrentUserService } from '../../../../../../../services/current-user.service';

@Component({
  selector: 'app-store-plan',
  imports: [CommonModule, FormsModule, CreatePlanModalComponent, CompanyRoutingModule],
  templateUrl: './store-plan.component.html',
  styleUrl: './store-plan.component.scss'
})
export class StorePlanComponent implements OnInit {
  @ViewChild('planList') planList!: ElementRef;

  activeTab: 'plans' | 'analytics' = 'plans';
  plans: StorePlanInstance[] = [];
  selectedPlan: StorePlanInstance | null = null;
  searchQuery: string = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalCount = 0;
  totalPages = 0;
  isLoading = false;
  hasMore = true;

  // Filters
  filters = {
    storeId: '',
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    status: ''
  };

  // Months and years for selection
  months = [
    { value: 0, name: 'Январь' },
    { value: 1, name: 'Февраль' },
    { value: 2, name: 'Март' },
    { value: 3, name: 'Апрель' },
    { value: 4, name: 'Май' },
    { value: 5, name: 'Июнь' },
    { value: 6, name: 'Июль' },
    { value: 7, name: 'Август' },
    { value: 8, name: 'Сентябрь' },
    { value: 9, name: 'Октябрь' },
    { value: 10, name: 'Ноябрь' },
    { value: 11, name: 'Декабрь' }
  ];

  years: number[] = [];
  currentUser: any;
  // Reference data
  stores: Store[] = [];
  users: UserInstance[] = [];
  planTypes: StorePlanType[] = [];

  // Modals
  showCreatePlanModal = false;

  // Analytics
  analyticsPeriod = 'month';
  performanceData: any[] = [];
  topPerformers: any[] = [];
  planTypesDistribution: any[] = [];

  constructor(
    private storePlanService: StorePlanService,
    private storeService: StoreService,
    private excelService: ExcelService,
    private statisticsService: ManagerStatService,
    private signatureService: SignatureService,
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit() {
    this.currentUserService.getDataUser().subscribe((user: any) => {
      this.currentUser = user;
      console.log('user', user)
    });

    this.generateYears();
    this.loadReferenceData();
    this.loadPlans();
    this.loadAnalytics();
  }


  isDirectorOrChiefAccountant() {
    const is_superuser = this.currentUser?.is_superuser;
    if (is_superuser === true) {
      return true;
    }

    const userRoles = this.currentUser?.roles || [];
    const directorRoles = ['Директор', 'Главный бухгалтер'];

    return userRoles.some((role: any) =>
      directorRoles.includes(role.name)
    );
  }


  downloadTemplate() {
    const link = document.createElement('a');
    link.href = 'IpmortShopsPlans_Shablon.xlsx';
    link.download = 'IpmortShopsPlans_Shablon.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async exportExcel() {
    try {
      const data: any[] = [];
      const signatureDataURLs: string[] = [];

      const signaturePromises = this.plans.map(plan => {
        if (plan.documentSignature && plan.documentSignature.id) {
          return this.signatureService.setSignature(plan.documentSignature.id).toPromise()
            .then((response: any) => {
              data.push({
                city: plan.store?.address.city,
                shopAddress: `${plan.store?.address.street}, ${plan.store?.address.house}`,
                amount: plan.monthPlanAccountant,
                managerName: `${plan.userInstance?.lastName} ${plan.userInstance?.firstName} ${plan.userInstance?.middleName}`,
                signatureNote: ''
              });

              if (response?.data?.fileContent) {
                const signatureDataURL = `data:image/png;base64,${response.data.fileContent}`;
                signatureDataURLs.push(signatureDataURL);
              } else {
                signatureDataURLs.push('');
              }
            })
            .catch(error => {
              data.push({
                city: plan.store?.address.city,
                shopAddress: `${plan.store?.address.street}, ${plan.store?.address.house}`,
                amount: plan.monthPlanAccountant,
                managerName: `${plan.userInstance?.lastName} ${plan.userInstance?.firstName} ${plan.userInstance?.middleName}`,
                signatureNote: ''
              });
              signatureDataURLs.push('');
            });
        } else {
          data.push({
            city: plan.store?.address.city,
            shopAddress: `${plan.store?.address.street}, ${plan.store?.address.house}`,
            amount: plan.monthPlanAccountant,
            managerName: `${plan.userInstance?.lastName} ${plan.userInstance?.firstName} ${plan.userInstance?.middleName}`,
            signatureNote: ''
          });
          signatureDataURLs.push('');
          return Promise.resolve();
        }
      });

      await Promise.all(signaturePromises);

      await this.excelService.createExcelWithSignatures(data, signatureDataURLs, {
        fileName: `Плановые_показатели_${new Date().toLocaleDateString('ru-RU')}.xlsx`,
        sheetName: 'Плановые показатели'
      });

    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    // Generate years from current year - 2 to current year + 2
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  // Navigation
  selectTab(tab: any) {
    this.activeTab = tab;
    if (tab === 'analytics') {
      this.loadAnalytics();
    }
  }

  getTabLabel(tab: string): string {
    const labels: { [key: string]: string } = {
      'plans': 'Планы',
      'analytics': 'Аналитика'
    };
    return labels[tab] || tab;
  }

  loadReferenceData() {
    this.storeService.getStores().subscribe({
      next: (stores: any) => this.stores = stores.data,
      error: (error) => console.error('Error loading stores:', error)
    });

    this.storePlanService.getUserInstances().subscribe({
      next: (users: any) => this.users = users.data,
      error: (error) => console.error('Error loading users:', error)
    });

    this.storePlanService.getStorePlanTypes().subscribe({
      next: (types: any) => this.planTypes = types.data,
      error: (error) => console.error('Error loading plan types:', error)
    });
  }

  loadPlans(append = false) {
    if (this.isLoading) return;

    this.isLoading = true;

    const filterRequest: FilterRequest = {
      filters: this.buildFilters(),
      sorts: [{ field: 'BeginDateTime', direction: 'desc' }],
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.storePlanService.filterStorePlanInstances(filterRequest).subscribe({
      next: (response) => {
        if (append) {
          this.plans = [...this.plans, ...response.data];
        } else {
          this.plans = response.data;
        }

        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.hasMore = this.currentPage < this.totalPages - 1;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.isLoading = false;
      }
    });
  }

  loadAnalytics() {
    // Mock data for analytics - in real app would come from API
    this.performanceData = [
      { store: 'Магазин 1', plan: 1000000, actual: 950000, planPercent: 100, actualPercent: 95 },
      { store: 'Магазин 2', plan: 800000, actual: 820000, planPercent: 100, actualPercent: 102.5 },
      { store: 'Магазин 3', plan: 1200000, actual: 1100000, planPercent: 100, actualPercent: 91.7 },
      { store: 'Магазин 4', plan: 750000, actual: 780000, planPercent: 100, actualPercent: 104 },
    ];

    this.topPerformers = [
      { store: 'Магазин 4', completion: 104, value: 780000 },
      { store: 'Магазин 2', completion: 102.5, value: 820000 },
      { store: 'Магазин 1', completion: 95, value: 950000 },
      { store: 'Магазин 3', completion: 91.7, value: 1100000 },
    ];

    this.planTypesDistribution = [
      { name: 'Продажи', value: 2500000, percentage: 45 },
      { name: 'Прибыль', value: 1500000, percentage: 27 },
      { name: 'Трафик', value: 1000000, percentage: 18 },
      { name: 'Конверсия', value: 500000, percentage: 10 },
    ];
  }

  // Filters
  buildFilters() {
    const filters: any[] = [];

    if (this.filters.storeId) {
      filters.push({
        field: 'store.Id',
        value: this.filters.storeId,
        type: 0
      });
    }

    // Add month filter
    if (this.filters.selectedMonth !== null) {
      console.log('DEBUG - Selected values:', {
        selectedMonth: this.filters.selectedMonth,
        selectedYear: this.filters.selectedYear,
        selectedMonthType: typeof this.filters.selectedMonth,
        selectedYearType: typeof this.filters.selectedYear
      });

      // Проверяем корректность значений
      const month = Number(this.filters.selectedMonth);
      const year = Number(this.filters.selectedYear);

      if (isNaN(month) || month < 0 || month > 11) {
        console.error('Invalid month:', month);
        return filters;
      }

      if (isNaN(year) || year < 2000 || year > 2100) {
        console.error('Invalid year:', year);
        return filters;
      }

      // Для августа 2025: start = 2025-08-01T00:00:00.000Z, end = 2025-09-01T00:00:00.000Z
      const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
      startDate.setDate(endDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      console.log('Filter dates for:', month + 1, year);
      console.log('Start date (UTC):', startDate.toISOString());
      console.log('End date (UTC):', endDate.toISOString());

      filters.push({
        field: 'BeginDateTime',
        values: [startDate.toISOString(), endDate.toISOString()],
        type: 9 // greaterThanOrEqual
      });

      // filters.push({
      //   field: 'EndDateTime',
      //   values: [endDate.toISOString()],
      //   type: 7 // lessThan
      // });
    }


    if (this.filters.storeId) {
      filters.push({
        field: 'Store.Id',
        values: [this.filters.storeId],
        type: 10
      });
    }

    // if (this.searchQuery) {
    //   filters.push({
    //     field: 'number',
    //     values: this.searchQuery,
    //     type: 2
    //   });
    // }

    return filters;
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadPlans();
  }

  clearFilters() {
    this.filters = {
      storeId: '',
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      status: ''
    };
    this.searchQuery = '';
    this.applyFilters();
  }

  onSearch() {
    // Debounce search
    clearTimeout((this as any).searchTimeout);
    (this as any).searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  onMonthYearChange() {
    this.applyFilters();
  }

  // Scroll loading
  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    if (atBottom && this.hasMore && !this.isLoading) {
      this.currentPage++;
      this.loadPlans(true);
    }
  }

  // Plan management
  selectPlan(plan: StorePlanInstance) {
    this.storePlanService.getStorePlanInstance(plan.id).subscribe((data: any) => {
      this.selectedPlan = data.data;
    })

  }

  getPlanStatus(plan: StorePlanInstance): string {
    const endDate = new Date(plan.endDateTime);
    const today = new Date();

    if (endDate < today) return 'completed';
    if (endDate > today) return 'active';
    return 'draft';
  }

  // Modals
  openCreatePlanModal() {
    this.showCreatePlanModal = true;
  }

  closeCreatePlanModal() {
    this.showCreatePlanModal = false;
  }

  onPlanCreated(plan: StorePlanInstance) {
    this.storePlanService.createStorePlanInstance(plan).subscribe((data: any) => {
      this.plans.unshift(plan);
      this.totalCount++;
      this.selectedPlan = plan;
    })
  }

  editPlan(plan: StorePlanInstance) {
    // Implementation for edit modal
    console.log('Edit plan:', plan);
    this.showCreatePlanModal = true;
  }

  deletePlan(planId: string) {
    if (confirm('Вы уверены, что хотите удалить этот план?')) {
      this.storePlanService.deleteStorePlanInstance(planId).subscribe({
        next: () => {
          this.plans = this.plans.filter(p => p.id !== planId);
          this.totalCount--;
          if (this.selectedPlan?.id === planId) {
            this.selectedPlan = null;
          }
        },
        error: (error) => console.error('Error deleting plan:', error)
      });
    }
  }

  deleteSignature(signatureId: string) {
    if (confirm('Вы уверены, что хотите удалить этот план?')) {
      this.storePlanService.deleteStorePlanInstance(signatureId).subscribe({
        next: () => {
          // this.plans = this.plans.filter(p => p.id !== planId);
          // this.totalCount--;
          // if (this.selectedPlan?.id === planId) {
          //   this.selectedPlan = null;
          // }
        },
        error: (error) => console.error('Error deleting plan:', error)
      });
    }
  }

  importPlan() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.style.display = 'none';

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];

        if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
          alert('Пожалуйста, выберите файл с расширением .xlsx, .xls или .csv');
          return;
        }

        this.storePlanService.importPlanInstance(file).subscribe({
          next: () => {
            alert('Файл успешно импортирован');
          },
          error: (error) => {
            console.error('Ошибка импорта плана:', error);
            alert('Ошибка при импорте файла');
          }
        });
      }

      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  get activePlansCount(): number {
    return this.plans.filter(plan => this.getPlanStatus(plan) === 'active').length;
  }

  get totalPlanValue(): number {
    return this.plans.reduce((sum, plan) => sum + plan.monthPlan, 0);
  }

  get selectedPeriodDisplay(): string {
    const month = this.months.find(m => m.value === this.filters.selectedMonth);
    return month ? `${month.name} ${this.filters.selectedYear}` : 'Все периоды';
  }

  get monthlyDistribution() {
    // Mock monthly distribution
    return [
      { month: 'Янв', height: 80, status: 'completed' },
      { month: 'Фев', height: 90, status: 'completed' },
      { month: 'Мар', height: 75, status: 'completed' },
      { month: 'Апр', height: 95, status: 'completed' },
      { month: 'Май', height: 85, status: 'completed' },
      { month: 'Июн', height: 100, status: 'active' },
    ];
  }


}