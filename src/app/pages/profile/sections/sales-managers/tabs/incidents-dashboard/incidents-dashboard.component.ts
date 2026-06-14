// incidents-dashboard.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardMetrics {
  // Основные показатели
  totalIncidents: number;
  monthlyIncidents: number;
  avgIncidentsPerDay: number;
  avgIncidentsPerMonth: number;
  
  // Финансовые показатели
  totalAmount: number;
  avgAmountPerIncident: number;
  maxIncidentAmount: number;
  minIncidentAmount: number;
  
  // Менеджеры
  activeManagers: number;
  topManager: string;
  managersPerformance: ManagerPerformance[];
  
  // Статусы
  statusDistribution: StatusDistribution[];
  
  // Причины
  topReason: string;
  reasonDistribution: ReasonDistribution[];
  
  // Товары
  topProducts: ProductMetric[];
  uniqueProductsCount: number;
  
  // Контрагенты
  topContractors: ContractorMetric[];
  
  // Временные метрики
  weekdayDistribution: WeekdayMetric[];
  peakDay: string;
  avgStatusTime: number;
  statusChangeFrequency: number;
  resolutionRate: number;
}

interface ManagerPerformance {
  name: string;
  incidentsCount: number;
  coefficient: number;
  efficiencyScore: number;
}

interface StatusDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ReasonDistribution {
  name: string;
  count: number;
  percentage: number;
}

interface ProductMetric {
  name: string;
  incidentsCount: number;
  totalAmount: number;
  percentage: number;
}

interface ContractorMetric {
  name: string;
  incidentsCount: number;
  totalAmount: number;
}

interface WeekdayMetric {
  name: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-incidents-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidents-dashboard.component.html',
  styleUrls: ['./incidents-dashboard.component.scss']
})
export class IncidentsDashboardComponent implements OnInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef;
  @ViewChild('trendChart') trendChartRef!: ElementRef;
  @ViewChild('reasonsChart') reasonsChartRef!: ElementRef;

  metrics: DashboardMetrics = {} as DashboardMetrics;
  selectedPeriod: string = 'month';
  trendView: 'daily' | 'monthly' = 'daily';

  private statusChart!: Chart;
  private trendChart!: Chart;
  private reasonsChart!: Chart;

  ngOnInit() {
    this.loadDemoData();
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  loadDemoData() {
    this.metrics = {
      // Основные показатели
      totalIncidents: 156,
      monthlyIncidents: 23,
      avgIncidentsPerDay: 5.2,
      avgIncidentsPerMonth: 156,
      
      // Финансовые показатели
      totalAmount: 2450000,
      avgAmountPerIncident: 15705,
      maxIncidentAmount: 125000,
      minIncidentAmount: 2500,
      
      // Менеджеры
      activeManagers: 8,
      topManager: 'Иванов А.В.',
      managersPerformance: [
        { name: 'Иванов А.В.', incidentsCount: 18, coefficient: 1.2, efficiencyScore: 21.6 },
        { name: 'Петрова М.С.', incidentsCount: 22, coefficient: 1.0, efficiencyScore: 22.0 },
        { name: 'Сидоров К.Л.', incidentsCount: 15, coefficient: 1.1, efficiencyScore: 16.5 },
        { name: 'Кузнецова О.П.', incidentsCount: 20, coefficient: 0.9, efficiencyScore: 18.0 },
        { name: 'Васильев Д.Н.', incidentsCount: 25, coefficient: 0.8, efficiencyScore: 20.0 }
      ],
      
      // Статусы
      statusDistribution: [
        { name: 'Новая', count: 12, percentage: 7.7, color: '#3b82f6' },
        { name: 'В работе', count: 45, percentage: 28.8, color: '#f59e0b' },
        { name: 'Отложена', count: 8, percentage: 5.1, color: '#ef4444' },
        { name: 'Решена', count: 78, percentage: 50.0, color: '#10b981' },
        { name: 'Не отработана', count: 13, percentage: 8.3, color: '#6b7280' }
      ],
      
      // Причины
      topReason: 'Несоответствие качества',
      reasonDistribution: [
        { name: 'Несоответствие качества', count: 45, percentage: 28.8 },
        { name: 'Ошибка доставки', count: 32, percentage: 20.5 },
        { name: 'Недостача', count: 28, percentage: 17.9 },
        { name: 'Просрочка', count: 25, percentage: 16.0 },
        { name: 'Прочее', count: 26, percentage: 16.7 }
      ],
      
      // Товары
      topProducts: [
        { name: 'Смартфон X200', incidentsCount: 15, totalAmount: 450000, percentage: 25 },
        { name: 'Ноутбук ProBook', incidentsCount: 12, totalAmount: 360000, percentage: 20 },
        { name: 'Планшет Tab 10', incidentsCount: 8, totalAmount: 240000, percentage: 15 },
        { name: 'Монитор 27"', incidentsCount: 6, totalAmount: 180000, percentage: 12 },
        { name: 'Клавиатура Mech', incidentsCount: 5, totalAmount: 75000, percentage: 8 }
      ],
      uniqueProductsCount: 47,
      
      // Контрагенты
      topContractors: [
        { name: 'ООО "ТехноПоставка"', incidentsCount: 28, totalAmount: 420000 },
        { name: 'ИП Сидоров', incidentsCount: 22, totalAmount: 330000 },
        { name: 'АО "Электроник"', incidentsCount: 18, totalAmount: 270000 },
        { name: 'ООО "ГаджетСтор"', incidentsCount: 15, totalAmount: 225000 }
      ],
      
      // Временные метрики
      weekdayDistribution: [
        { name: 'Понедельник', count: 18, percentage: 14.5 },
        { name: 'Вторник', count: 22, percentage: 17.7 },
        { name: 'Среда', count: 25, percentage: 20.2 },
        { name: 'Четверг', count: 24, percentage: 19.4 },
        { name: 'Пятница', count: 20, percentage: 16.1 },
        { name: 'Суббота', count: 12, percentage: 9.7 },
        { name: 'Воскресенье', count: 3, percentage: 2.4 }
      ],
      peakDay: 'Среда',
      avgStatusTime: 2.5,
      statusChangeFrequency: 3.2,
      resolutionRate: 78.5
    };
  }

  initCharts() {
    this.initStatusChart();
    this.initTrendChart();
    this.initReasonsChart();
  }

  initStatusChart() {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    
    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.metrics.statusDistribution.map(s => s.name),
        datasets: [{
          data: this.metrics.statusDistribution.map(s => s.count),
          backgroundColor: this.metrics.statusDistribution.map(s => s.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  initTrendChart() {
    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    
    const dailyData = [12, 18, 15, 22, 19, 25, 20, 17, 23, 19, 16, 21, 24, 18, 15];
    const monthlyData = [142, 156, 138, 167, 145, 156, 162, 148, 155, 161, 149, 156];
    
    this.trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.trendView === 'daily' 
          ? Array.from({length: 15}, (_, i) => `${i + 1} янв`)
          : ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        datasets: [{
          label: 'Количество инцидентов',
          data: this.trendView === 'daily' ? dailyData : monthlyData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  initReasonsChart() {
    const ctx = this.reasonsChartRef.nativeElement.getContext('2d');
    
    this.reasonsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.metrics.reasonDistribution.map(r => r.name),
        datasets: [{
          label: 'Количество',
          data: this.metrics.reasonDistribution.map(r => r.count),
          backgroundColor: [
            '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'
          ],
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45
            }
          }
        }
      }
    });
  }

  toggleTrendView() {
    this.trendView = this.trendView === 'daily' ? 'monthly' : 'daily';
    
    if (this.trendChart) {
      const dailyData = [12, 18, 15, 22, 19, 25, 20, 17, 23, 19, 16, 21, 24, 18, 15];
      const monthlyData = [142, 156, 138, 167, 145, 156, 162, 148, 155, 161, 149, 156];
      
      this.trendChart.data.labels = this.trendView === 'daily' 
        ? Array.from({length: 15}, (_, i) => `${i + 1} янв`)
        : ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      
      this.trendChart.data.datasets[0].data = this.trendView === 'daily' ? dailyData : monthlyData;
      this.trendChart.update();
    }
  }

  onPeriodChange() {
    console.log('Period changed to:', this.selectedPeriod);
    // Здесь можно добавить логику обновления данных по выбранному периоду
    this.refreshData();
  }

  refreshData() {
    console.log('Refreshing dashboard data...');
    // В реальном приложении здесь был бы API вызов
    this.loadDemoData();
    
    // Обновляем графики
    setTimeout(() => {
      if (this.statusChart) this.statusChart.update();
      if (this.trendChart) this.trendChart.update();
      if (this.reasonsChart) this.reasonsChart.update();
    }, 500);
  }

  exportChart(chartType: string) {
    console.log(`Exporting ${chartType}...`);
    // Реализация экспорта графика
  }

  ngOnDestroy() {
    if (this.statusChart) this.statusChart.destroy();
    if (this.trendChart) this.trendChart.destroy();
    if (this.reasonsChart) this.reasonsChart.destroy();
  }
}