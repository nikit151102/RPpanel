import { Component, ElementRef, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ManagerStatService } from './manager-stat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminManagerComponent } from './admin-manager/admin-manager.component';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);



type Period = 'Месяц' | 'Квартал' | 'Полугодие' | 'Год';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { HttpClient } from '@angular/common/http';

registerLocaleData(localeRu);

interface EmployeeStats {
  volume_current: number;
  volume_last: number;
  growth_volume: number;
  growth_percentage: number;
  lead_count_current: number;
  lead_count_last: number;
  growth_leads: number;
  growth_leads_percentage: number;
  average_sales: number;
  average_sales_last: number;
  average_growth: number;
}

@Component({
  selector: 'app-manager-stat',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminManagerComponent],
  templateUrl: './manager-stat.component.html',
  styleUrls: ['./manager-stat.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }]
})
export class ManagerStatComponent implements OnInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  lineChart!: Chart;
  showAdminManager: boolean = false;

  periods: Period[] = ['Месяц', 'Квартал', 'Полугодие', 'Год'];
  selectedPeriod: Period = 'Месяц';

  summaryData: any = null;
  employee: any = null;
  employeeStats: EmployeeStats = {
    volume_current: 0,
    volume_last: 0,
    growth_volume: 0,
    growth_percentage: 0,
    lead_count_current: 0,
    lead_count_last: 0,
    growth_leads: 0,
    growth_leads_percentage: 0,
    average_sales: 0,
    average_sales_last: 0,
    average_growth: 0
  };

  monthlyPlan: number = 0;
  yearlyPlan: number = 0;

  // Для графиков
  lineChartData: any = { labels: [], datasets: [] };
  lineChartOptions: any = { responsive: true, maintainAspectRatio: false };

  constructor(private statisticsService: ManagerStatService, private http: HttpClient) { }
  employeeRatings: { [clientType: string]: any[] } = {};
  clientTypes: string[] = [];
  leadsByClientTypeCurrent: { client_type: string; leads: number }[] = [];
  leadsByClientTypePrevious: { client_type: string; leads: number }[] = [];
  doughnutChartData: any = [];
  selectedEmployee: any
  doughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  currentUser: any;

  ngOnInit(): void {
    this.statisticsService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      this.loadEmployee();
      this.loadSummaryMonthly();
    });
  }

  isAdmin() {
    const is_superuser = this.currentUser?.is_superuser;
    if (is_superuser === true) {
      return true
    } else {
      return false
    }
  }

  openAdminSettings() {
    this.showAdminManager = true;
  }

  onAdminManagerClosed() {
    this.showAdminManager = false;
  }

  ngAfterViewInit(): void {
    this.renderLineChart();
  }

  renderLineChart() {
    if (this.lineChart) this.lineChart.destroy(); // уничтожаем старый график
    this.lineChart = new Chart(this.lineChartRef.nativeElement, {
      type: 'line',
      data: this.lineChartData,
      options: this.lineChartOptions
    });
  }
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDate: Date = new Date();
  summaryMonthly: any[] = [];
  filteredSummary: any[] = [];
  selectedClientType: 'all' | 'new' | 'active' = 'all';
  summaryMonthlyDataPeriod: any

  loadSummaryMonthly() {
    // Копируем startDate и прибавляем 1 день
    const startDate = new Date(this.startDate);
    startDate.setDate(startDate.getDate());

    this.statisticsService.getSummaryMonthly(startDate, this.endDate).subscribe((values: any) => {
      this.summaryMonthly = values.data;
      this.summaryMonthlyDataPeriod = values.data_period;
      this.applyFilter();
    });
  }


  selectClientType(type: 'all' | 'new' | 'active') {
    this.selectedClientType = type;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedClientType === 'all') {
      // Суммируем все типы клиентов по каждому менеджеру
      const grouped: any = {};
      let totalPlan = 0;
      let totalFact = 0;

      this.summaryMonthly.forEach(item => {
        const key = item.employee_id;
        if (!grouped[key]) {
          grouped[key] = { ...item, plan: 0, fact: 0 };
        }
        grouped[key].plan += item.plan;
        grouped[key].fact += item.fact;

        totalPlan += item.plan;
        totalFact += item.fact;
      });

      this.filteredSummary = Object.values(grouped);

      // Добавляем итоговую строку
      this.filteredSummary.push({
        employee_name: 'Итого',
        plan: totalPlan,
        fact: totalFact,
        execution: (totalFact / totalPlan) * 100
      });
    } else {
      // Суммируем выбранный тип клиентов по менеджеру
      const typeName = this.selectedClientType === 'new' ? 'Новые' : 'Действующие';
      const filtered = this.summaryMonthly.filter(item => item.client_type_name === typeName);

      const grouped: any = {};
      let totalPlan = 0;
      let totalFact = 0;

      filtered.forEach(item => {
        const key = item.employee_id;
        if (!grouped[key]) {
          grouped[key] = { ...item, plan: 0, fact: 0 };
        }
        grouped[key].plan += item.plan;
        grouped[key].fact += item.fact;

        totalPlan += item.plan;
        totalFact += item.fact;
      });

      this.filteredSummary = Object.values(grouped);

      // Добавляем итоговую строку
      this.filteredSummary.push({
        employee_name: 'Итого',
        plan: totalPlan,
        fact: totalFact,
        execution: (totalFact / totalPlan) * 100
      });
    }
  }


  currentManager: any;
  loadEmployee() {
    this.statisticsService.getEmployee().subscribe((data: any) => {
      if (!data || data.length === 0) return;
      const isAdmin: boolean = this.isAdmin();
      if (isAdmin === true) {
        this.employee = data;

      } else {
        const currentUserId = this.currentUser.username
        this.employee = data.filter((emp: any) =>
          (emp?.username?.toLowerCase() || '') === currentUserId
        );

        this.currentManager = this.employee[0].id
      }

      if (this.employee.length > 0) {
        this.selectedEmployee = this.employee[0].id;
        this.loadSummary(this.selectedEmployee);
        this.statisticsService.getEmployeeRatings().subscribe((data: any) => {
          this.employeeRatings = data;
          this.clientTypes = Object.keys(data);
        });
        this.loadSalesByDay(30, this.selectedEmployee);
      }
    });
  }


  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.onPeriodChange(this.selectedEmployee);
  }

  getProgressClass(value: number | null): string {
    if (!value) return 'p-progressbar-danger';  // пустое или 0%
    if (value < 50) return 'p-progressbar-danger';
    if (value < 100) return 'p-progressbar-warning';
    return 'p-progressbar-success';
  }


  loadSummary(employeeId: string) {
    const periodMap: Record<Period, string> = {
      'Месяц': 'month',
      'Квартал': 'quarter',
      'Полугодие': 'half_year',
      'Год': 'year'
    };
    const apiPeriod = periodMap[this.selectedPeriod];

    this.statisticsService.getSummary(apiPeriod, employeeId).subscribe({
      next: (data) => {
        this.summaryData = data;
        this.leadsByClientTypeCurrent = data.current_period.leads_by_client_type;
        this.leadsByClientTypePrevious = data.previous_period.leads_by_client_type;

        // Для doughnut chart можно брать текущие данные
        this.doughnutChartData = {
          labels: this.leadsByClientTypeCurrent.map(c => c.client_type),
          datasets: [
            { data: this.leadsByClientTypeCurrent.map(c => c.leads), backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] }
          ]
        };
        this.updateMetrics();
      },
      error: (err) => console.error('Ошибка при загрузке данных', err)
    });
  }

  loadSalesByDay(days: number = 30, employeeId: any) {
    this.statisticsService.getSalesByDay(days, employeeId).subscribe((data: any[]) => {
      this.lineChartData = {
        labels: data.map(d => d.date),
        datasets: [
          { label: 'Продажи', data: data.map(d => d.revenue), borderColor: '#42A5F5', fill: false },
          { label: 'Лиды', data: data.map(d => d.leads), borderColor: '#66BB6A', fill: false }
        ]
      };

      this.lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      };

      this.renderLineChart();
    });
  }



  updateMetrics() {
    if (!this.summaryData) return;

    const curr = this.summaryData.current_period;
    const prev = this.summaryData.previous_period;

    this.employeeStats = {
      volume_current: Number(curr.total_revenue.toFixed(3)),
      volume_last: Number(prev.total_revenue.toFixed(3)),
      growth_volume: Number((curr.total_revenue - prev.total_revenue).toFixed(3)),
      growth_percentage: prev.total_revenue ? Number(((curr.total_revenue - prev.total_revenue) / prev.total_revenue * 100).toFixed(3)) : 0,
      lead_count_current: Number(curr.total_leads.toFixed(3)),
      lead_count_last: Number(prev.total_leads.toFixed(3)),
      growth_leads: Number((curr.total_leads - prev.total_leads).toFixed(3)),
      growth_leads_percentage: prev.total_leads ? Number(((curr.total_leads - prev.total_leads) / prev.total_leads * 100).toFixed(3)) : 0,
      average_sales: Number(curr.average_sale.toFixed(3)),
      average_sales_last: Number(prev.average_sale.toFixed(3)),
      average_growth: prev.average_sale ? Number(((curr.average_sale - prev.average_sale) / prev.average_sale * 100).toFixed(3)) : 0
    };


    this.leadsByClientTypeCurrent = curr.leads_by_client_type || [];
    this.leadsByClientTypePrevious = prev.leads_by_client_type || [];
    this.monthlyPlan = curr.monthly_plan;
    this.yearlyPlan = curr.yearly_plan;
  }
  getProgress(emp: any): number {
    if (!emp.revenue.year_plan) return 0;
    return Math.min((emp.revenue.fact / emp.revenue.year_plan) * 100, 100);
  }

  getProgressLabel(emp: any): string {
    if (!emp.revenue.year_plan) return '0%';
    return Math.round((emp.revenue.fact / emp.revenue.year_plan) * 100) + '%';
  }


  getVolumeProgress() {
    return Math.min((this.employeeStats.volume_current / this.monthlyPlan) * 100, 100);
  }

  getYearlyProgress() {
    return Math.min((this.employeeStats.volume_current / this.yearlyPlan) * 100, 100);
  }

  getAverageSalesProgress(): number {
    const value = (this.employeeStats.average_sales / (this.monthlyPlan / 10)) * 100;
    if (isNaN(value) || !isFinite(value)) {
      return 0;
    }
    return Math.min(value, 100);
  }


  onPeriodChange(selectedEmp?: any) {
    const employeeId = this.selectedEmployee || null;
    let days = 30;
    if (this.selectedPeriod === 'Квартал') days = 90;
    else if (this.selectedPeriod === 'Полугодие') days = 182;
    else if (this.selectedPeriod === 'Год') days = 365;

    this.loadSummary(employeeId);

    this.statisticsService.getEmployeeRatings(days).subscribe((data: any) => {
      this.employeeRatings = data;
      console.log('data', data)
      this.clientTypes = Object.keys(data);
    });

    this.loadSalesByDay(days, employeeId);
  }
  
}




