// routes.component.ts
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../../services/drivers.service';

@Component({
  selector: 'app-routes',
  imports: [CommonModule, FormsModule],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  // data
  routes: any[] = [];
  loading = false;

  // filters
  startDate: string = '';
  endDate: string = '';

  // UI state
  expandedRoute: any = null;
  selectedPoints: any[] = [];
  timeline: any[] = [];
  groupedTimeline: any[] = [];
  timelineDialogVisible = false;
  relocateDialogVisible = false;
  relocateTargetRouteId: string | null = null;
  selectedRouteForRelocate: any = null;
  uploadInProgress = false;
  uploadProgress = 0;
  drivers: any = [];

  // dialogs
  createDialogVisible = false;
  newRouteDate: string = '';
  newRouteUserId: string = '';
  newRouteNotes: string = '';

  addLoadingDialogVisible = false;
  selectedRouteForAddLoading: any = null;
  newLoading: any = {
    loading_place_name: '',
    address: '',
    start_time: '',
    end_time: '',
    doc_number: '',
    volume: null,
    weight: null,
    note: ''
  };

  // base url
  private baseUrl = 'https://xn--o1ab.xn--80akonecy.xn--p1ai/drivers';

  constructor(
    private http: HttpClient,
    private driversService: DriversService
  ) { }

  ngOnInit() {
    // load default (last 7 days)
    const now = new Date();
    this.endDate = this.formatDate(now);
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    this.startDate = this.formatDate(start);

    this.loadDrivers();
    this.loadRoutes();
  }

  loadDrivers() {
    this.driversService.getUsers().subscribe((data: any) => {
      this.drivers = data.map((u: any) => ({
        ...u,
        full_name: [u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ') || u.username
      }));
    });
  }

  // --- Helpers ---
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isoDate(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    // Здесь можно добавить реализацию тостов
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  getDriverInitials(driver: any): string {
    if (!driver) return '?';
    const firstName = driver.first_name?.charAt(0) || '';
    const lastName = driver.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || '?';
  }

  // --- Load routes with filter ---
  loadRoutes() {
    if (!this.startDate || !this.endDate) {
      this.showToast('Укажите дату начала и конца', 'warning');
      return;
    }

    this.loading = true;
    const params = new HttpParams()
      .set('start_date', this.startDate)
      .set('end_date', this.endDate);

    this.http.get<any[]>(`${this.baseUrl}/routes/filter`, { params })
      .subscribe({
        next: data => {
          this.routes = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.showToast('Ошибка загрузки маршрутов', 'error');
          this.loading = false;
        }
      });
  }



  deleteRoute(route: any) {
    // 1. Подтверждение удаления

    // Использование
    const date = new Date(route.date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    const isConfirmed = confirm(`Вы уверены, что хотите удалить маршрут "${route.vehicle?.owner?.last_name} ${route.vehicle?.owner?.first_name} ${route.vehicle?.owner?.middle_name}" за ${formattedDate}?`);
    if (!isConfirmed) {
      return;
    }

    const routeIndex = this.routes.findIndex(r => r.id === route.id);

    this.http.delete<any[]>(`${this.baseUrl}/routes/route_plans/${route.id}`)
      .subscribe({
        next: data => {

          if (routeIndex > -1) {
            this.routes.splice(routeIndex, 1);
          }

        },
        error: err => {
          console.error('Ошибка при удалении маршрута:', err);

          this.showToast('Ошибка при удалении маршрута', 'error');
        }
      });
  }


  // --- Expand route to show details ---
  toggleExpand(route: any) {
    if (this.expandedRoute && this.expandedRoute.id === route.id) {
      this.expandedRoute = null;
      return;
    }

    this.expandedRoute = {
      ...route,
      combinedPoints: this.getCombinedPoints(route)
    };
  }

  getCombinedPoints(route: any) {
    const points = route.points?.map((p: any) => ({
      ...p,
      type: 'point',
    })) || [];

    const loadings = route.loadings?.map((l: any) => ({
      ...l,
      type: 'loading',
      order: '-',
      doc: l.doc_number,
      counterparty: l.loading_place?.name,
      payment: '',
      address: { address_1c: l.address || l.loading_place?.address },
    })) || [];

    return [...loadings, ...points];
  }

  // --- Timeline ---
  openTimeline(route: any) {
    this.loading = true;
    this.http.get<any[]>(`${this.baseUrl}/routes/${route.id}/timeline`).subscribe({
      next: data => {
        this.timeline = data;
        this.groupedTimeline = this.groupByPoints(this.timeline);
        this.timelineDialogVisible = true;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.showToast('Не удалось загрузить timeline', 'error');
        this.loading = false;
      }
    });
  }

  groupByPoints(timeline: any[]) {
    const grouped = timeline.reduce((acc, item) => {
      if (!acc[item.name]) acc[item.name] = [];
      acc[item.name].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(grouped).map(([name, events]) => {
      // Явно указываем, что events это any[]
      const sortedEvents = (events as any[]).sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      for (let i = 1; i < sortedEvents.length; i++) {
        const prev = sortedEvents[i - 1];
        const current = sortedEvents[i];
        prev.duration = this.getDuration(prev.timestamp, current.timestamp);
      }

      return { name, events: sortedEvents };
    });
  }


  getDuration(start: string, end: string): string {
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    if (diffMs < 0) return '';
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${mins ? mins + ' мин ' : ''}${secs ? secs + ' сек' : ''}`;
  }

  getStatusClass(status: string): string {
    return status.replace(/\s+/g, '-').toLowerCase();
  }

  statusLabels: Record<string, string> = {
    planned: 'Запланирован',
    en_route: 'В пути',
    arrived: 'Прибыл',
    completed: 'Завершён',
    skipped: 'Пропущен',
    loading: 'Погрузка',
    loading_completed: 'Погрузка завершена'
  };

  getStatusLabel(status: string): string {
    return this.statusLabels[status] || status || '—';
  }

  closeTimeline() {
    this.timelineDialogVisible = false;
    this.timeline = [];
    this.groupedTimeline = [];
  }

  // --- Point selection ---
  onPointCheckboxChange(event: any, point: any) {
    const checked = event.target.checked;
    if (checked) {
      if (!this.selectedPoints.some(p => p.id === point.id)) {
        this.selectedPoints.push(point);
      }
    } else {
      this.selectedPoints = this.selectedPoints.filter(p => p.id !== point.id);
    }
  }

  isPointSelected(point: any): boolean {
    return this.selectedPoints.some(p => p.id === point.id);
  }

  areAllPointsSelected(): boolean {
    if (!this.expandedRoute?.combinedPoints?.length) return false;
    return this.expandedRoute.combinedPoints.every((point: any) =>
      this.selectedPoints.some(p => p.id === point.id)
    );
  }

  toggleAllPointsSelection() {
    const allSelected = this.areAllPointsSelected();

    if (allSelected) {
      // Deselect all
      this.selectedPoints = this.selectedPoints.filter(selectedPoint =>
        !this.expandedRoute.combinedPoints.some((point: any) => point.id === selectedPoint.id)
      );
    } else {
      // Select all
      this.expandedRoute.combinedPoints.forEach((point: any) => {
        if (!this.selectedPoints.some(p => p.id === point.id)) {
          this.selectedPoints.push(point);
        }
      });
    }
  }

  // --- Delete point ---
  confirmDeletePoint(point: any, route: any) {
    if (confirm(`Удалить точку ${point.doc || point.id}?`)) {
      this.deletePoint(point, route);
    }
  }

  deletePoint(point: any, route: any) {
    this.http.delete(`${this.baseUrl}/routes/route_points/${point.id}`).subscribe({
      next: () => {
        route.points = route.points.filter((p: any) => p.id !== point.id);
        if (this.expandedRoute && this.expandedRoute.id === route.id) {
          this.expandedRoute.combinedPoints = this.getCombinedPoints(route);
        }
        this.showToast('Точка удалена', 'success');
      },
      error: err => {
        console.error(err);
        this.showToast('Ошибка при удалении точки', 'error');
      }
    });
  }

  // --- Relocate points ---
  openRelocateDialog(route: any) {
    if (!route.points || route.points.length === 0) {
      this.showToast('У маршрута нет точек для перемещения', 'warning');
      return;
    }
    this.selectedRouteForRelocate = route;
    this.relocateTargetRouteId = null;
    this.relocateDialogVisible = true;
  }

  relocatePoints() {
    if (!this.selectedPoints.length) {
      this.showToast('Выберите точки для перемещения', 'warning');
      return;
    }
    if (!this.relocateTargetRouteId) {
      this.showToast('Выберите целевой маршрут', 'warning');
      return;
    }

    const body = this.selectedPoints.map(p => p.id);
    const params = new HttpParams().set('new_route_plan_id', this.relocateTargetRouteId);

    this.http.post(`${this.baseUrl}/routes/route_points/relocate`, body, { params }).subscribe({
      next: (res: any) => {
        this.selectedRouteForRelocate.points = this.selectedRouteForRelocate.points.filter((p: any) => !body.includes(p.id));
        if (this.expandedRoute && this.expandedRoute.id === this.selectedRouteForRelocate.id) {
          this.expandedRoute.combinedPoints = this.getCombinedPoints(this.selectedRouteForRelocate);
        }
        this.showToast(`Перемещено ${body.length} точек`, 'success');
        this.relocateDialogVisible = false;
        this.selectedPoints = [];
      },
      error: err => {
        console.error(err);
        this.showToast('Ошибка перемещения точек', 'error');
      }
    });
  }

  routeListForSelect(): { label: string, value: string }[] {
    return this.routes.map(r => ({
      label: `${r.id.slice(0, 8)} — ${r.vehicle?.plate_number || '—'} — ${r.date?.slice(0, 10) || ''}`,
      value: r.id
    }));
  }

  // --- Excel upload ---
  onExcelAllDriversSelected(fileInputEvent: any) {
    const file = fileInputEvent.target.files && fileInputEvent.target.files[0];
    if (!file) return;

    const routeDate = this.startDate || new Date().toISOString().split('T')[0];
    const fd = new FormData();
    fd.append('route_date', routeDate);
    fd.append('file', file, file.name);

    this.uploadInProgress = true;
    this.uploadProgress = 0;

    this.http.post(`${this.baseUrl}/routes/upload_excel`, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.uploadInProgress = false;
          this.uploadProgress = 0;
          this.showToast('Файл обработан', 'success');
          this.loadRoutes();
        }
      },
      error: err => {
        console.error(err);
        this.uploadInProgress = false;
        this.showToast('Ошибка загрузки файла', 'error');
      }
    });
  }

  uploadExcelForDriver(fileInputEvent: any, driverId: string, date: any) {
    const file = fileInputEvent.target.files && fileInputEvent.target.files[0];
    if (!file) return;

    const formattedDate = new Date(date).toISOString().split('T')[0];
    const fd = new FormData();
    fd.append('route_date', formattedDate);
    fd.append('file', file, file.name);
    fd.append('idUser', driverId);

    this.uploadInProgress = true;
    this.http.post(`${this.baseUrl}/routes/upload_excel_test`, fd, {
      observe: 'events',
      reportProgress: true
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          this.uploadInProgress = false;
          this.showToast('Файл обработан (водитель)', 'success');
          alert('Файл обработан')
          this.loadRoutes();
        }
      },
      error: err => {
        console.error(err);
        this.uploadInProgress = false;
        this.showToast('Ошибка загрузки файла', 'error');
      }
    });
  }

  // --- Create route ---
  openCreateDialog() {
    this.newRouteDate = this.formatDate(new Date());
    this.newRouteUserId = '';
    this.newRouteNotes = '';
    this.createDialogVisible = true;
  }

  addDays(date: string | Date, days: number): string {
    // если пришла строка, превращаем в Date
    const d = typeof date === 'string' ? new Date(date) : new Date(date);

    // прибавляем дни
    d.setDate(d.getDate() + days);

    // возвращаем в формате ISO без секунд: "YYYY-MM-DDTHH:MM"
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  createRoute() {
    if (!this.newRouteDate || !this.newRouteUserId) {
      this.showToast('Укажите дату и ID водителя', 'warning');
      return;
    }

    const nextDate = this.addDays(new Date(this.newRouteDate), 0);

    const params = new HttpParams()
      .set('date', nextDate)
      .set('user_id', this.newRouteUserId)
      .set('notes', this.newRouteNotes || '');

    this.http.post(`${this.baseUrl}/routes/`, {}, { params }).subscribe({
      next: (res: any) => {
        this.showToast('Маршрут создан', 'success');
        this.createDialogVisible = false;
        this.loadRoutes();
      },
      error: err => {
        console.error(err);
        this.showToast('Ошибка при создании маршрута', 'error');
      }
    });
  }

  // --- Add loading ---
  openAddLoadingDialog(route: any) {
    this.selectedRouteForAddLoading = route;
    this.newLoading = {
      loading_place_name: '',
      address: '',
      start_time: '',
      end_time: '',
      doc_number: '',
      volume: null,
      weight: null,
      note: ''
    };
    this.addLoadingDialogVisible = true;
  }

  saveLoading() {
    if (!this.selectedRouteForAddLoading) return;

    const routeId = this.selectedRouteForAddLoading.id;
    const params = new HttpParams()
      .set('loading_place_name', this.newLoading.loading_place_name || '')
      .set('address', this.newLoading.address || '')
      .set('start_time', this.newLoading.start_time || '')
      .set('end_time', this.newLoading.end_time || '')
      .set('doc_number', this.newLoading.doc_number || '')
      .set('volume', this.newLoading.volume?.toString() || '')
      .set('weight', this.newLoading.weight?.toString() || '')
      .set('note', this.newLoading.note || '');

    this.http.post(`${this.baseUrl}/loadings/${routeId}/loadings`, {}, { params }).subscribe({
      next: res => {
        this.showToast('Место погрузки добавлено', 'success');
        this.addLoadingDialogVisible = false;
        this.loadRoutes();
      },
      error: err => {
        console.error(err);
        this.showToast('Ошибка добавления погрузки', 'error');
      }
    });
  }




  // В компоненте
  addUnloadingDialogVisible: boolean = false;
  selectedRouteForAddUnloading: any = null;
  newUnloading: any = {
    counterparty: '',
    address: '',
    doc: '',
    payment: null,
    note: ''
  };
  isSaving: boolean = false;

  // Открытие диалога добавления точки разгрузки
  openAddUnloadingDialog(route: any) {
    this.selectedRouteForAddUnloading = route;
    this.newUnloading = {
      route_id: route.id,
      counterparty: '',
      address: '',
      doc: '',
      payment: null,
      note: ''
    };
    this.addUnloadingDialogVisible = true;
  }

  // Сохранение точки разгрузки
  saveUnloading() {
    if (!this.selectedRouteForAddUnloading) {
      this.showToast('Маршрут не выбран', 'error');
      return;
    }

    // Валидация обязательных полей
    if (!this.newUnloading.counterparty || !this.newUnloading.address ||
      !this.newUnloading.doc || this.newUnloading.payment === null) {
      this.showToast('Заполните все обязательные поля', 'error');
      return;
    }

    this.isSaving = true;

    const routeId = this.selectedRouteForAddUnloading.id;
    const params = new HttpParams()
      .set('route_id', this.newUnloading.route_id)
      .set('counterparty', this.newUnloading.counterparty)
      .set('address', this.newUnloading.address)
      .set('doc', this.newUnloading.doc)
      .set('payment', this.newUnloading.payment.toString())
      .set('note', this.newUnloading.note || '');

    this.http.post(`${this.baseUrl}/routes/${routeId}/points`, {}, { params }).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.showToast('Точка разгрузки добавлена', 'success');
        this.addUnloadingDialogVisible = false;
        this.loadRoutes(); // Перезагружаем список маршрутов
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Ошибка добавления точки разгрузки:', err);
        this.showToast('Ошибка добавления точки разгрузки', 'error');
      }
    });
  }



  routeTimes: Map<number, { startTime: string, endTime: string }> = new Map();

  saveTimes(route: any, index: number, type: any): void {
    const times = this.routeTimes.get(index);

    if (times) {
      if (type == 'start') {
        const startDateTimeISO = this.combineDateWithTime(route.date, times.startTime);
        const startDateTime = new Date(startDateTimeISO); // Преобразуем строку обратно в Date для фронтенда

        // Создаем объект для отправки на бэкенд
        const updateData = {
          start_datetime: startDateTimeISO // Отправляем ISO строку
        };
        route.start_datetime = startDateTime; // Для фронтенда сохраняем Date объект

        this.setTimesToBack(route.id, updateData);
      }

      if (type == 'end') {
        const endDateTimeISO = this.combineDateWithTime(route.date, times.endTime);
        const endDateTime = new Date(endDateTimeISO); // Преобразуем строку обратно в Date

        // Создаем объект для отправки на бэкенд
        const updateData = {
          end_datetime: endDateTimeISO // Отправляем ISO строку
        };
        route.end_datetime = endDateTime;
        console.log('endDateTime', endDateTime);

        this.setTimesToBack(route.id, updateData);
      }

      this.routeTimes.delete(index);
    }
  }

  setTimesToBack(route_id: string, updateData: any): void {
    this.http.patch(`${this.baseUrl}/routes/${route_id}/datetime`, updateData).subscribe({
      next: (res: any) => {
        console.log('Время маршрута обновлено:', res);
        this.showToast('Время маршрута обновлено', 'success');
      },
      error: err => {
        console.error('Ошибка при обновлении времени маршрута:', err);
        this.showToast('Ошибка при обновлении времени маршрута', 'error');
      }
    });
  }


  isTimeValid(index: number, type: any): boolean {
    const times = this.routeTimes.get(index);
    if (!times || !times.startTime || !times.endTime) return false;

    if (type == 'start' && times.startTime) return true;
    if (type == 'end' && times.endTime) return true;

    return false;
  }

  setStartTime(index: number, time: string): void {
    let times = this.routeTimes.get(index);
    if (!times) {
      times = { startTime: '', endTime: '' };
    }
    times.startTime = time;
    this.routeTimes.set(index, times);
  }

  // Методы для работы с временами конкретного route
  getStartTime(index: number): string {
    const times = this.routeTimes.get(index);
    return times ? times.startTime : '';
  }

  getEndTime(index: number): string {
    const times = this.routeTimes.get(index);
    return times ? times.endTime : '';
  }

  setEndTime(index: number, time: string): void {
    let times = this.routeTimes.get(index);
    if (!times) {
      times = { startTime: '', endTime: '' };
    }
    times.endTime = time;
    this.routeTimes.set(index, times);
  }

  private combineDateWithTime(dateString: string, timeString: string): string {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);

    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date.toISOString();
  }

}