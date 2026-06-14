import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as XLSX from 'xlsx';

declare const ymaps: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private placemarks: any[] = [];
  private deliveries: any[] = [];
  private geocodeQueue: any[] = [];
  private isGeocoding = false;
  private mapInitialized = false;

  private readonly YANDEX_GEOCODE_API_KEY = 'b278a6ee-1474-4d71-9bfb-bdf4354ac9b6';
  private readonly YANDEX_GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x/';

  // Цвета для водителей
  public driverColors: { [key: string]: string } = {};
  private colorPalette = [
    'islands#redStretchyIcon',
    'islands#blueStretchyIcon',
    'islands#greenStretchyIcon',
    'islands#orangeStretchyIcon',
    'islands#purpleStretchyIcon',
    'islands#pinkStretchyIcon',
    'islands#brownStretchyIcon',
    'islands#darkBlueStretchyIcon',
    'islands#darkGreenStretchyIcon',
    'islands#darkOrangeStretchyIcon'
  ];

  public isLoading = false;
  public loadStatus = '';
  public stats = { total: 0, found: 0, notFound: 0 };
  public deliveryPoints: any[] = [];
  public drivers: string[] = [];
  public selectedDriver: string = 'all';
  public groupedByDriver: { [driver: string]: any[] } = {};

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap() {
    if (typeof ymaps === 'undefined') {
      console.error('Яндекс Карты не загрузились, повторная попытка через 500ms');
      setTimeout(() => this.initMap(), 500);
      return;
    }

    ymaps.ready(() => {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Элемент #map не найден');
        return;
      }

      try {
        this.map = new ymaps.Map('map', {
          center: [53.346785, 83.776856],
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector']
        });

        this.mapInitialized = true;
        console.log('Карта успешно инициализирована');

      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
      }
    });
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isLoading = true;
    this.loadStatus = 'Чтение файла...';
    this.clearMap();

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);

      this.deliveries = rows;
      this.stats = { total: rows.length, found: 0, notFound: 0 };
      this.deliveryPoints = [];
      this.loadStatus = `Загружено ${rows.length} записей. Поиск координат...`;

      // Собираем уникальных водителей
      this.extractDrivers();

      this.processGeocodeQueue();
    };
    reader.readAsArrayBuffer(file);
  }

  // Извлечение уникальных водителей
  private extractDrivers() {
    const driverSet = new Set<string>();
    for (const delivery of this.deliveries) {
      const driver = delivery['Водитель'] || '';
      if (driver && driver.trim()) {
        driverSet.add(driver.trim());
      }
    }
    this.drivers = Array.from(driverSet).sort();

    // Назначаем цвета водителям
    this.driverColors = {};
    this.drivers.forEach((driver, index) => {
      this.driverColors[driver] = this.colorPalette[index % this.colorPalette.length];
    });
  }

  private clearMap() {
    if (this.map && this.mapInitialized) {
      this.placemarks.forEach(pm => this.map.geoObjects.remove(pm));
      this.placemarks = [];
    }
    this.deliveryPoints = [];
    this.stats = { total: 0, found: 0, notFound: 0 };
    this.groupedByDriver = {};
    this.selectedDriver = 'all';
  }

  private processGeocodeQueue() {
    this.geocodeQueue = [...this.deliveries];
    this.isGeocoding = false;
    this.processNextGeocode();
  }

  private processNextGeocode() {
    if (this.geocodeQueue.length === 0) {
      this.isLoading = false;
      this.loadStatus = `Готово. Найдено координат: ${this.stats.found} из ${this.stats.total}`;
      this.groupPointsByDriver();
      return;
    }

    if (this.isGeocoding) return;

    const delivery = this.geocodeQueue.shift();
    this.geocodeDelivery(delivery);
  }

  private prepareAddressForAPI(address: string): string {
    if (!address) return '';

    let cleanAddress = address
      .replace(/\s+/g, ' ')
      .replace(/[\n\r\t]/g, ' ')
      .trim();

    const stopPatterns = [
      /[,;]\s*(?:ДО|до|после|с|без|только|вход|звон|тел|коммент|склад|офис|этаж|каб|подъезд|домофон|рабочее|время|часов|утром|вечером|срочно|важно|дозаявка|салатный)/i,
      /\s+(?:ДО|до|после|с|без)\s+[\d:]+/i,
      /\s+[!?]+$/,
      /\s+\([^)]*\)$/,
      /\s+\[[^\]]*\]$/,
      /[\*\-_\|]{3,}/,
    ];

    for (const pattern of stopPatterns) {
      const match = cleanAddress.match(pattern);
      if (match && match.index) {
        cleanAddress = cleanAddress.substring(0, match.index);
        break;
      }
    }

    cleanAddress = cleanAddress.replace(/[;:].*$/, '');
    cleanAddress = cleanAddress.replace(/,,+.*$/, '');
    cleanAddress = cleanAddress.replace(/[!?]+$/, '');
    cleanAddress = cleanAddress.replace(/[,.\s]+$/, '');
    cleanAddress = cleanAddress.replace(/\+\d[\d\s\-\(\)]{7,}\d/g, '');
    cleanAddress = cleanAddress.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    cleanAddress = cleanAddress.replace(/\d{1,2}[:]\d{2}/g, '');

    cleanAddress = cleanAddress.replace(
      /(\d+)\s*(?:пом|офис|каб|кв|помещ|оф|кабинет)\s*([А-Яа-я0-9\-]+)/gi,
      '$1, помещение $2'
    );

    cleanAddress = cleanAddress.replace(/пр-кт/gi, 'проспект');
    cleanAddress = cleanAddress.replace(/пр-т/gi, 'проспект');

    cleanAddress = cleanAddress
      .replace(/\s+/g, ' ')
      .replace(/,\s*$/, '')
      .replace(/,\s*,/g, ',')
      .replace(/\.\s*$/, '')
      .replace(/^\s+/, '')
      .trim();

    const hasCity = /(г\.?|город|Барнаул|Новоалтайск|Бийск|Рубцовск|Заринск|Белокуриха|Славгород)/i.test(cleanAddress);

    if (!hasCity && cleanAddress.length > 0) {
      if (!cleanAddress.toLowerCase().startsWith('барнаул')) {
        cleanAddress = `Барнаул ${cleanAddress}`;
      }
    }

    cleanAddress = cleanAddress.replace(/^Барнаул\s+/i, 'Барнаул ');

    return cleanAddress;
  }

  private geocodeDelivery(delivery: any) {
    this.isGeocoding = true;

    let rawAddress = delivery['Торговая точка'] || delivery['Адрес'] || '';
    const address = this.prepareAddressForAPI(rawAddress);

    const driver = delivery['Водитель'] || '';
    const amount = delivery['Сумма документа'] || 0;
    const client = delivery['Контрагент'] || '';
    const comment = delivery['Комментарий'] || '';

    if (!address || address.trim() === '' || address === 'Барнаул') {
      this.addNotFoundPoint(rawAddress, driver, amount, client, 'Пустой адрес');
      this.isGeocoding = false;
      this.processNextGeocode();
      return;
    }

    const params = {
      apikey: this.YANDEX_GEOCODE_API_KEY,
      geocode: address,
      format: 'json',
      results: 1
    };

    const url = `${this.YANDEX_GEOCODE_URL}?${new URLSearchParams(params as any).toString()}`;

    this.http.get(url).subscribe({
      next: (response: any) => {
        try {
          const geoObject = response?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

          if (geoObject && geoObject.Point) {
            const pos = geoObject.Point.pos;
            const [longitude, latitude] = pos.split(' ').map(Number);
            const fullAddress = geoObject.name || geoObject.description || address;

            this.addPoint({
              ...delivery,
              _lat: latitude,
              _lon: longitude,
              _fullAddress: fullAddress,
              _requestAddress: address,
              _rawAddress: rawAddress,
              _driver: driver
            });
          } else {
            this.addNotFoundPoint(rawAddress, driver, amount, client, 'Адрес не найден в API');
          }
        } catch (error) {
          console.error('Ошибка парсинга ответа API:', error);
          this.addNotFoundPoint(rawAddress, driver, amount, client, 'Ошибка парсинга координат');
        }
        this.isGeocoding = false;
        this.processNextGeocode();
      },
      error: (error) => {
        console.error('Ошибка запроса к API Яндекс:', error);
        let errorMsg = `Ошибка API: ${error.status || 'неизвестная'}`;
        if (error.status === 403) {
          errorMsg = 'Ошибка API: неверный ключ или превышен лимит';
        } else if (error.status === 429) {
          errorMsg = 'Слишком много запросов, попробуйте позже';
        }
        this.addNotFoundPoint(rawAddress, driver, amount, client, errorMsg);
        this.isGeocoding = false;
        this.processNextGeocode();
      }
    });
  }

  // Группировка точек по водителям
  private groupPointsByDriver() {
    this.groupedByDriver = {};
    for (const point of this.deliveryPoints) {
      const driver = point.driver || 'Без водителя';
      if (!this.groupedByDriver[driver]) {
        this.groupedByDriver[driver] = [];
      }
      this.groupedByDriver[driver].push(point);
    }
  }

  // Фильтрация по водителю
  filterByDriver(driver: string) {
    this.selectedDriver = driver;

    // Скрываем все маркеры
    this.placemarks.forEach(pm => {
      pm.options.set('visible', false);
    });

    // Показываем маркеры выбранного водителя
    if (driver === 'all') {
      this.placemarks.forEach(pm => {
        pm.options.set('visible', true);
      });
    } else {
      const visiblePlacemarks = this.placemarks.filter(pm => {
        const pmDriver = pm.properties.get('driver');
        return pmDriver === driver;
      });
      visiblePlacemarks.forEach(pm => {
        pm.options.set('visible', true);
      });
    }
  }

  private addPoint(delivery: any) {
    this.stats.found++;

    const point = {
      id: Date.now() + Math.random(),
      address: delivery['Торговая точка'] || delivery['Адрес'],
      driver: delivery['Водитель'] || 'Без водителя',
      amount: delivery['Сумма документа'],
      client: delivery['Контрагент'],
      comment: delivery['Комментарий'],
      manager: delivery['Менеджер'],
      document: delivery['Документ'],
      status: delivery['Статус документа'],
      lat: delivery._lat,
      lng: delivery._lon,
      fullAddress: delivery._fullAddress,
      requestAddress: delivery._requestAddress
    };

    this.deliveryPoints.push(point);
    this.addMarkerToMap(point);
  }

  private addNotFoundPoint(address: string, driver: string, amount: number, client: string, reason: string) {
    this.stats.notFound++;

    this.deliveryPoints.push({
      id: Date.now() + Math.random(),
      address: address,
      driver: driver || 'Без водителя',
      amount: amount,
      client: client,
      lat: null,
      lng: null,
      notFoundReason: reason,
      status: 'не найден'
    });
  }

  private addMarkerToMap(point: any) {
    if (!this.map || !this.mapInitialized || !point.lat || !point.lng) return;

    const coordinates = [point.lat, point.lng];
    const driver = point.driver;

    // Получаем цвет для водителя
    const preset = this.driverColors[driver] || 'islands#grayStretchyIcon';

    const balloonContent = `
      <div style="max-width: 350px; font-family: Arial, sans-serif;">
        <b style="font-size: 14px;">${point.client || 'Нет данных'}</b><br/>
        <hr style="margin: 5px 0;"/>
        <strong>🚚 Водитель:</strong> ${driver}<br/>
        <strong>📍 Адрес:</strong> ${point.address}<br/>
        <strong>💰 Сумма:</strong> ${point.amount?.toLocaleString() || 0} руб.<br/>
        <strong>📄 Документ:</strong> ${point.document || '-'}<br/>
        ${point.comment ? `<strong>💬 Комментарий:</strong> <span style="color: #666;">${point.comment}</span><br/>` : ''}
        <hr style="margin: 5px 0;"/>
        <small>🔍 Запрос: ${point.requestAddress || point.address}</small>
      </div>
    `;

    const placemark = new ymaps.Placemark(
      coordinates,
      {
        balloonContent: balloonContent,
        hintContent: `${driver} - ${point.client} - ${point.amount?.toLocaleString()} руб.`,
        driver: driver // Сохраняем водителя в свойствах метки
      },
      {
        preset: preset,
        balloonMaxWidth: 400,
        balloonPanelMaxMapArea: 0
      }
    );

    this.map.geoObjects.add(placemark);
    this.placemarks.push(placemark);
  }

  centerOnPoint(point: any) {
    if (point.lat && point.lng && this.map && this.mapInitialized) {
      this.map.setCenter([point.lat, point.lng], 17, {
        duration: 500,
        delay: 0
      });

      const targetPlacemark = this.placemarks.find(pm => {
        const coords = pm.geometry.getCoordinates();
        return coords[0] === point.lat && coords[1] === point.lng;
      });
      if (targetPlacemark) {
        targetPlacemark.balloon.open();
      }
    }
  }

  // Получить отфильтрованные точки для отображения в списке
  getFilteredPoints(): any[] {
    if (this.selectedDriver === 'all') {
      return this.deliveryPoints;
    }
    return this.deliveryPoints.filter(p => p.driver === this.selectedDriver);
  }

  clearAll() {
    this.clearMap();
    this.deliveries = [];
    this.deliveryPoints = [];
    this.geocodeQueue = [];
    this.stats = { total: 0, found: 0, notFound: 0 };
    this.drivers = [];
    this.groupedByDriver = {};
    this.selectedDriver = 'all';
    this.isLoading = false;
    this.loadStatus = '';
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }


  getDriverColor(driver: string): string {
    const colorMap: { [key: string]: string } = {
      'islands#redStretchyIcon': '#e53e3e',
      'islands#blueStretchyIcon': '#3182ce',
      'islands#greenStretchyIcon': '#38a169',
      'islands#orangeStretchyIcon': '#dd6b20',
      'islands#purpleStretchyIcon': '#805ad5',
      'islands#pinkStretchyIcon': '#d53f8c',
      'islands#brownStretchyIcon': '#8b5a2b',
      'islands#darkBlueStretchyIcon': '#2c5282',
      'islands#darkGreenStretchyIcon': '#276749',
      'islands#darkOrangeStretchyIcon': '#c05621'
    };
    const preset = this.driverColors[driver];
    return colorMap[preset] || '#718096';
  }

  // Получить цвет для границы из preset
  public getDriverBorderColor(driver: string): string {
    const preset = this.driverColors[driver];
    if (!preset) return '#cbd5e0';
    return preset.replace('islands#', '').replace('StretchyIcon', '');
  }

  // Получить цвет для маркера из preset
  public getDriverMarkerColor(driver: string): string {
    const preset = this.driverColors[driver];
    if (!preset) return '#718096';

    const colorMap: { [key: string]: string } = {
      'islands#redStretchyIcon': '#e53e3e',
      'islands#blueStretchyIcon': '#3182ce',
      'islands#greenStretchyIcon': '#38a169',
      'islands#orangeStretchyIcon': '#dd6b20',
      'islands#purpleStretchyIcon': '#805ad5',
      'islands#pinkStretchyIcon': '#d53f8c',
      'islands#brownStretchyIcon': '#8b5a2b',
      'islands#darkBlueStretchyIcon': '#2c5282',
      'islands#darkGreenStretchyIcon': '#276749',
      'islands#darkOrangeStretchyIcon': '#c05621'
    };
    return colorMap[preset] || '#718096';
  }
}