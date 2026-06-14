import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelService } from './excel/excel.service';
import { TableData } from './excel/excel.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { StorePlanService } from '../../../../../../services/store-plan.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../../evirement';
import { catchError, Observable } from 'rxjs';
import { SignatureService } from '../../../../../../services/signature.service';
import { CurrentUserService } from '../../../../../../../services/current-user.service';


@Component({
  selector: 'app-signature',
  imports: [CommonModule, FormsModule],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.scss'
})
export class SignatureComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  signaturePad!: SignaturePad;
  private canvas!: HTMLCanvasElement;
  savedSignature: string = '';
  private isSignaturePadInitialized: boolean = false;
  // Данные документа
  currentDate: string = new Date().toLocaleDateString('ru-RU');
  documentNumber: string = Math.floor(100000 + Math.random() * 900000).toString();
  shopName: string = 'paketon.ru';
  shopAddress: string = 'г. Барнаул, Попова 165Б';
  managerName: string = '';
  signatureId: any;
  signatureData: any = null;

  currentMonthPlan: number = 2850000;
  dailyPlan: number = 0;

  constructor(private excelService: ExcelService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private storePlanService: StorePlanService,
    private signatureService: SignatureService,
        private currentUserService: CurrentUserService) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.signatureId = params.get('id') || '';
      console.log('Получен ID:', this.signatureId);

      // Здесь можно загрузить данные по этому ID
      this.loadSignatureData(this.signatureId);
    });

    
    this.currentUserService.getDataUser().subscribe((user: any) => {
      this.managerName = `${user.last_name} ${user.first_name}`;
      console.log('user', user)
    });

  }

  fileContent: any;
  private loadSignatureData(id: string): void {
    if (!id) return;
    this.storePlanService.getStorePlanInstance(id).subscribe((data: any) => {
      this.signatureData = data.data;
      this.calculatePlans();
      if (data.data.documentSignature != null) {
        this.signatureService.setSignature(data.data.documentSignature.id).subscribe((data: any) => {
          this.fileContent = data.data.fileContent;
        });
      } else {
        this.initializeSignaturePad();
      }
    })

  }

  private initializeSignaturePad(): void {
    // Используем setTimeout для гарантии, что DOM обновился
    setTimeout(() => {
      if (this.canvasRef?.nativeElement && !this.isSignaturePadInitialized) {
        this.canvas = this.canvasRef.nativeElement;
        this.setupCanvas();
        this.setupSignaturePad();
        this.isSignaturePadInitialized = true;
        console.log('Signature pad initialized successfully');
      } else {
        console.warn('Canvas element not found or already initialized');
      }
    });
  }

  private calculatePlans(): void {
    if (this.signatureData.monthPlan && this.signatureData.beginDateTime) {
      this.dailyPlan = this.calculateDailyPlan(
        this.signatureData.monthPlan,
        this.signatureData.beginDateTime
      );
    }
  }

  // В компоненте добавьте метод
  getDaysInMonth(year: number, month: number): number {
    // month: 0-11 (январь-декабрь)
    return new Date(year, month + 1, 0).getDate();
  }

  // Метод для вычисления дневного плана
  calculateDailyPlan(monthPlan: number, beginDateTime: string): number {
    if (!beginDateTime) return 0;

    const startDate = new Date(beginDateTime);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();

    const daysInMonth = this.getDaysInMonth(year, month);

    // Округляем до 2 знаков после запятой
    return Math.round((monthPlan / daysInMonth) * 100) / 100;
  }

  ngAfterViewInit(): void {

  }

  private setupCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    this.canvas.width = rect.width * ratio;
    this.canvas.height = rect.height * ratio;
    this.canvas.getContext('2d')?.scale(ratio, ratio);

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  private setupSignaturePad(): void {
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.signaturePad = new SignaturePad(this.canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: 'rgba(20, 62, 126, 1)',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      throttle: 16,
      velocityFilterWeight: 0.7
    });

    this.addSignatureEventListeners();
  }

  private addSignatureEventListeners(): void {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    });
  }

  // Очистка подписи
  clear(): void {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }


  private dataURLtoBlob(dataURL: string): Blob {
    // Разделяем DataURL на части
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  private signDocument(documentId: string, signatureImage: string): Observable<any> {
    const blob = this.dataURLtoBlob(signatureImage);
    const formData = new FormData();

    const now = new Date();
    const dateTime = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')

    const fileName = `signature_${dateTime}.png`;

    formData.append('documentId', documentId);
    formData.append('signImage', blob, fileName);

    return this.http.post(
      `${environment.apiUrlShops}/api/Entities/DocumentSignature/SignDocumentAsync`,
      formData
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error:', error);

        // Если есть response body, попробуем его прочитать
        if (error.error && typeof error.error === 'object') {
          console.error('Error details:', error.error);
        }

        throw error;
      })
    );
  }

  // Сохранение как PNG и создание Excel
  async saveAsPNG(): Promise<void> {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      alert('Пожалуйста, поставьте подпись');
      return;
    }


    const dataURL = this.signaturePad.toDataURL('image/png');
    this.savedSignature = dataURL;

    this.signDocument(this.signatureId, dataURL).subscribe({
      next: (response) => {

        this.loadSignatureData(this.signatureId);
      },
      error: (error) => {
        console.error('Ошибка при подписании документа:', error);
        alert('Ошибка при подписании документа');
      }
    });
  }


  cancel(): void {
    this.clear();
    this.savedSignature = '';
  }



}