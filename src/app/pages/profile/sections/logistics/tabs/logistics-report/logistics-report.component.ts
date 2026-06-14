import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../evirement';
import { NumberFormatPipe } from '../../../../../../pipes/number-format.pipe';


interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  rate: number;
  transport_company?: any
}

interface PointsCount {
  realizations: number;
  transfers: number;
  loadings: number;
}

interface DriverSummary {
  driver: Driver;
  total_active_minutes: number;
  total_earnings: number;
  points_count: PointsCount;
}

interface VehicleSummary {
  vehicle: string;
  total_active_minutes: number;
  total_earnings: number;
  points_count: PointsCount;
}

interface DailySummary {
  active_minutes: number;
  earnings: number;
  points: number;
}

interface RoutePoint {
  id: string;
  doc: string;
  address: string;
  arrival_time: string | null;
  departure_time: string | null;
  active_duration_minutes: number;
  payment: number;
  note: string;
  driver_earnings: number;
}

interface RouteStats {
  less_15: number;
  between_15_40: number;
  more_40: number;
  total_points: number;
}

interface Route {
  route_plan_id: string;
  type: string;
  vehicle: string;
  driver: Driver;
  start_datetime: string;
  end_datetime: string | null;
  points: RoutePoint[];
  stats: RouteStats;
  total_active_minutes: number;
  total_driver_earnings: number;
}

interface FinanceSummary {
  total_driver_earnings: number;
  total_active_minutes: number;
  avg_earning_per_hour: number;
}

interface AnalyticsData {
  period: {
    start_date: string;
    end_date: string;
  };
  driver_summary: DriverSummary[];
  vehicle_summary: VehicleSummary[];
  daily_summary: {
    [key: string]: DailySummary;
  };
  finance_summary: FinanceSummary;
  routes: Route[];
}

@Component({
  selector: 'app-logistics-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './logistics-report.component.html',
  styleUrls: ['./logistics-report.component.scss']
})
export class LogisticsReportComponent implements OnInit {
  // Data
  analyticsData: AnalyticsData | null = null;

  // Filters
  startDate: string = '';
  endDate: string = '';
  currentView: 'earnings' | 'activity' = 'earnings';
  selectedRouteType: string = 'all';
  selectedDriver: string = 'all';
  selectedCompany: string = 'all';
  filteredRoutes: any = [];
  companies: any = []
  // Expanded routes tracking
  expandedRoutes = new Set<string>();

  commonTotalPayment: any = 0;

  tabs: any[] = [];
  activeTab: 'dashboard' | 'detailRouters' | 'companyStats' = 'dashboard';

  selectTab(tab: any) {
    this.activeTab = tab;
    if (tab == 'dashboard' || tab == 'detailRouters') {
      this.loadDataDashboardAndDetailRouters();
    }
    else {
      this.loadDataCompanyStats();
    }
  }
  // Color generator for drivers
  private driverColors = new Map<string, string>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setDefaultDateRange();
    this.loadDataDashboardAndDetailRouters();
    this.loadCompanies();
  }

  setDefaultDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadDataDashboardAndDetailRouters() {
    if (!this.startDate || !this.endDate) return;

    const url = `${environment.apiUrlDrivers}/split?start_date=${this.startDate}&end_date=${this.endDate}`;

    this.http.get<AnalyticsData>(url).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.filterRoutes();
        console.log('Analytics data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
      }
    });
  }

  companyStats: any = [];

  loadDataCompanyStats() {
    if (!this.startDate || !this.endDate) return;

    const url = `${environment.apiUrlDrivers}/companies-drivers-stats?start_date=${this.startDate}&end_date=${this.endDate}`;

    this.http.get<AnalyticsData>(url).subscribe({
      next: (data) => {
        this.companyStats = data;
        this.filteredRoutes = data;
        console.log('Analytics data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
      }
    });
  }

  filterCompany() {

    console.log('this.selectedCompany', this.selectedCompany)
    if (this.selectedCompany === 'all') {
      // Показываем все компании
      this.filteredRoutes = this.companyStats;
    } else {
      this.filteredRoutes = {
        ...this.companyStats,
        companies: this.companyStats.companies.filter(
          (companyData: any) => companyData.company.id === this.selectedCompany
        )
      };
    }
  }

  // Получить все даты из периода
  getAllDates(): string[] {
    const start = new Date(this.filteredRoutes.period.start_date);
    const end = new Date(this.filteredRoutes.period.end_date);
    const dates: string[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date).toISOString().split('T')[0]);
    }

    return dates;
  }

  // Получить статистику компании за конкретный день
  getCompanyDailyStats(companyData: any, date: string, statType: string): number {
    let total = 0;

    companyData.drivers.forEach((driver: any) => {
      if (driver.daily_stats && driver.daily_stats[date]) {
        total += driver.daily_stats[date][statType] || 0;
      }
    });
    console.log('total', total)
    return total;
  }

  // Получить статистику водителя за конкретный день
  getDriverDailyStats(driverData: any, date: string, statType: string): number {
    if (driverData.daily_stats && driverData.daily_stats[date]) {
      return driverData.daily_stats[date][statType] || 0;
    }
    return 0;
  }

  // Проверить есть ли маршруты у водителя на дату
  hasDriverRoutesOnDate(driverData: any, date: string): boolean {
    return driverData.daily_stats && driverData.daily_stats[date] &&
      driverData.daily_stats[date].routes > 0;
  }

  // Получить маршруты водителя на дату (заглушка - нужно адаптировать под вашу структуру данных)
  getDriverRoutesOnDate(driverData: any, date: string): any[] {
    // Здесь нужно вернуть реальные маршруты водителя за эту дату
    // Это зависит от структуры ваших данных о маршрутах
    return [];
  }

  // Получить сумму платежей компании за конкретный день
  getCompanyDailyPayment(companyData: any, date: string, operationType: string): number {
    if (!companyData || !companyData.drivers) {
      return 0;
    }

    let totalPayment = 0;

    companyData.drivers.forEach((driver: any) => {
      if (driver.daily_stats && driver.daily_stats[date]) {
        // Если в данных есть поле с суммой платежей
        if (operationType === 'realizations' && driver.daily_stats[date].realizations_payment) {
          totalPayment += driver.daily_stats[date].realizations_payment;
        }
        else if (operationType === 'transfers' && driver.daily_stats[date].transfers_payment) {
          totalPayment += driver.daily_stats[date].transfers_payment;
        }
      }
    });

    return totalPayment;
  }
  // Получить сумму платежей водителя за конкретный день
  getDriverDailyPayment(driverData: any, date: string, operationType: string): number {
    if (!driverData || !driverData.daily_stats || !driverData.daily_stats[date]) {
      return 0;
    }

    const stats = driverData.daily_stats[date];

    // Если в данных есть реальные суммы
    if (operationType === 'realizations' && stats.realizations_payment) {
      return stats.realizations_payment;
    }
    else if (operationType === 'transfers' && stats.transfers_payment) {
      return stats.transfers_payment;
    }

    return 0;
  }

  // Получить зарплату компании за конкретный день (сумма зарплат всех водителей)
  getCompanyDailySalary(companyData: any, date: string): number {
    if (!companyData || !companyData.drivers) {
      return 0;
    }

    let totalSalary = 0;

    companyData.drivers.forEach((driver: any) => {
      totalSalary += this.getDriverDailySalary(driver, date);
    });

    return totalSalary;
  }

  // Получить зарплату водителя за конкретный день (ставка × время)
  getDriverDailySalary(driverData: any, date: string): number {
    if (!driverData || !driverData.daily_stats || !driverData.daily_stats[date]) {
      return 0;
    }

    const stats = driverData.daily_stats[date];
    const workHours = stats['work_hours'] || 0;
    const rate = driverData.driver.rate || 0;

    // Зарплата = ставка в час × количество часов
    return workHours * rate;
  }

  // Метод который возвращает и процент и значение для классов
  getCompanyPercentageData(companyData: any, date: string): { percentage: number, value: number } {
    if (!companyData) {
      return { percentage: 0, value: 0 };
    }

    const salary = this.getCompanyDailySalary(companyData, date);
    const totalPayment = this.getCompanyDailyPayment(companyData, date, 'realizations') +
      this.getCompanyDailyPayment(companyData, date, 'transfers');

    if (totalPayment === 0) {
      return { percentage: 0, value: 0 };
    }

    const percentage = (salary / totalPayment) * 100;

    return {
      percentage: percentage,
      value: percentage
    };
  }

  // Общая сумма payment реализаций за период
  getTotalRealizationsPayment(): number {
    if (!this.filteredRoutes || !this.filteredRoutes.companies) {
      return 0;
    }

    let total = 0;
    this.filteredRoutes.companies.forEach((company: any) => {
      this.getAllDates().forEach(date => {
        total += this.getCompanyDailyPayment(company, date, 'realizations');
      });
    });
    return total;
  }

  // Общая сумма payment перемещений за период
  getTotalTransfersPayment(): number {
    if (!this.filteredRoutes || !this.filteredRoutes.companies) {
      return 0;
    }

    let total = 0;
    this.filteredRoutes.companies.forEach((company: any) => {
      this.getAllDates().forEach(date => {
        total += this.getCompanyDailyPayment(company, date, 'transfers');
      });
    });
    return total;
  }

  // Общая сумма payment за период
  getTotalPayment(): number {
    return this.getTotalRealizationsPayment() + this.getTotalTransfersPayment();
  }

  // Общая зарплата водителей за период
  getTotalSalary(): number {
    if (!this.filteredRoutes || !this.filteredRoutes.companies) {
      return 0;
    }

    let total = 0;
    this.filteredRoutes.companies.forEach((company: any) => {
      this.getAllDates().forEach(date => {
        total += this.getCompanyDailySalary(company, date);
      });
    });
    return total;
  }

  // Общий процент транспортных за период
  getTotalPercentage(): number {
    const totalPayment = this.getTotalPayment();
    if (totalPayment === 0) return 0;

    return (this.getTotalSalary() / totalPayment) * 100;
  }

  // Класс для цвета процента
  getTotalPercentageClass(): string {
    const percentage = this.getTotalPercentage();
    if (percentage <= 3) return 'green';
    if (percentage <= 4) return 'yellow';
    return 'red';
  }

  // Транспортные расходы (Перемещения × % транспортных)
  getTransportCost(): number {
    return this.getTotalTransfersPayment() * (this.getTotalPercentage() / 100);
  }

  // Чистая зарплата (Зарплата - Транспортные расходы)
  getNetSalary(): number {
    return this.getTotalSalary() - this.getTransportCost();
  }



  loadCompanies() {
    const url = `${environment.apiUrlDrivers}/transport-companies/`;

    this.http.get<AnalyticsData>(url).subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
      }
    });
  }


  // Getters for template
  get period() {
    return this.analyticsData?.period;
  }

  get financeSummary() {
    return this.analyticsData?.finance_summary;
  }

  get driverSummary() {
    return this.analyticsData?.driver_summary || [];
  }

  get vehicleSummary() {
    return this.analyticsData?.vehicle_summary || [];
  }

  get routes() {
    return this.analyticsData?.routes || [];
  }

  get dailySummary() {
    return this.analyticsData?.daily_summary || {};
  }

  getRouteTotalPayment(route: Route): number {
    const total = route.points.reduce((total, point) => total + (point.payment || 0), 0);
    return total;
  }

  getPercentageValue(route: Route): number {
    if (this.getRouteTotalPayment(route) === 0) return 0;
    return (route.total_driver_earnings / this.getRouteTotalPayment(route)) * 100;
  }
  // Helper methods
  getSortedDrivers(): DriverSummary[] {
    const drivers = [...this.driverSummary];
    if (this.currentView === 'earnings') {
      return drivers.sort((a, b) => b.total_earnings - a.total_earnings);
    } else {
      return drivers.sort((a, b) => b.total_active_minutes - a.total_active_minutes);
    }
  }

  getDriverRank(driver: DriverSummary): number {
    const sorted = this.getSortedDrivers();
    return sorted.findIndex(d => d.driver.id === driver.driver.id) + 1;
  }

  getDriverInitials(driver: Driver): string {
    const first = driver.first_name?.[0] || '';
    const last = driver.last_name?.[0] || '';
    return (first + last).toUpperCase() || '?';
  }

  getDriverColor(driverId: string): string {
    if (!this.driverColors.has(driverId)) {
      const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
      ];
      const color = colors[this.driverColors.size % colors.length];
      this.driverColors.set(driverId, color);
    }
    return this.driverColors.get(driverId)!;
  }

  getDriverPerformance(driver: DriverSummary): number {
    const maxEarnings = Math.max(...this.driverSummary.map(d => d.total_earnings));
    if (maxEarnings === 0) return 0;
    return Math.round((driver.total_earnings / maxEarnings) * 100);
  }

  getRouteTypeName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'realizations': 'Реализации',
      'transfers': 'Перемещения',
      'loadings': 'Погрузки'
    };
    return typeMap[type] || type;
  }

  getTotalPoints(): number {
    return this.driverSummary.reduce((total, driver) =>
      total + (driver.points_count?.realizations || 0) +
      (driver.points_count?.transfers || 0) +
      (driver.points_count?.loadings || 0), 0);
  }

  getTotalRealizations(): number {
    return this.driverSummary.reduce((total, driver) => total + (driver.points_count?.realizations || 0), 0);
  }

  getTotalTransfers(): number {
    return this.driverSummary.reduce((total, driver) => total + (driver.points_count?.transfers || 0), 0);
  }

  getTotalLoadings(): number {
    return this.driverSummary.reduce((total, driver) => total + (driver.points_count?.loadings || 0), 0);
  }

  getDailySummaryArray(): any[] {
    return Object.entries(this.dailySummary).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getDayPerformance(day: any): number {
    const maxEarnings = Math.max(...Object.values(this.dailySummary).map((d: any) => d.earnings));
    if (maxEarnings === 0) return 0;
    return (day.earnings / maxEarnings) * 100;
  }

  filterRoutes() {
    let filtered = this.routes;

    if (this.selectedRouteType !== 'all') {
      filtered = filtered.filter(route => route.type === this.selectedRouteType);
    }

    if (this.selectedDriver !== 'all') {
      filtered = filtered.filter(route => route.driver.id === this.selectedDriver);
    }

    if (this.selectedCompany !== 'all') {
      filtered = filtered.filter(route => route.driver.transport_company.id === this.selectedCompany);
    }


    this.filteredRoutes = filtered;
    const totalEarnings = filtered.reduce((sum, route) => {
      return sum + (route.total_driver_earnings || 0);
    }, 0);

    this.commonTotalPayment = totalEarnings;
  }

  toggleRouteDetails(route: Route) {
    const routeKey = route.route_plan_id + route.type;
    if (this.expandedRoutes.has(routeKey)) {
      this.expandedRoutes.delete(routeKey);
    } else {
      this.expandedRoutes.add(routeKey);
    }
  }

  toggleCompanyDetails(company: any) {
    const routeKey = company;
    if (this.expandedRoutes.has(routeKey)) {
      this.expandedRoutes.delete(routeKey);
    } else {
      this.expandedRoutes.add(routeKey);
    }
  }
  getSortedDates(dailyStats: any): string[] {
    return Object.keys(dailyStats).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    );
  }

  // Actions
  refreshData() {
    this.loadDataDashboardAndDetailRouters();
  }

  exportToExcel() {
    console.log('Exporting analytics to Excel...');
    // Implement Excel export logic
  }
}