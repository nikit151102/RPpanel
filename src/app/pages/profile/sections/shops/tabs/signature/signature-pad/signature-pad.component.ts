import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  imports: [CommonModule],
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss']
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signatureSaved = new EventEmitter<string>();
  
  private signaturePad!: SignaturePad;
  private canvas!: HTMLCanvasElement;
  private isInitialized = false;

  ngAfterViewInit(): void {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      this.initializeSignaturePad();
    } else {
      console.error('Canvas element not found');
    }
  }

  ngOnDestroy(): void {
    // Очистка event listeners
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
  }

  private initializeSignaturePad(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.setupCanvas();
    this.setupSignaturePad();
    this.isInitialized = true;
  }

  private setupCanvas(): void {
    // Устанавливаем размеры canvas
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = 200;
    } else {
      this.canvas.width = 400;
      this.canvas.height = 200;
    }
    
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private setupSignaturePad(): void {
    this.signaturePad = new SignaturePad(this.canvas, {
      minWidth: 1,
      maxWidth: 3,
      penColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)'
    });

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    if (!this.isInitialized) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = this.canvas.offsetWidth * ratio;
    this.canvas.height = this.canvas.offsetHeight * ratio;
    
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
    }
    
    // Восстанавливаем подпись после ресайза
    if (!this.signaturePad.isEmpty()) {
      const data = this.signaturePad.toData();
      this.signaturePad.clear();
      this.signaturePad.fromData(data);
    }
  }

  // Очистка подписи
  clear(): void {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  // Сохранение как PNG
  saveSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      alert('Пожалуйста, поставьте подпись');
      return;
    }

    const dataURL = this.signaturePad.toDataURL('image/png');
    this.signatureSaved.emit(dataURL);
  }

  // Отмена подписи
  cancel(): void {
    this.clear();
    this.signatureSaved.emit('');
  }

  // Проверка, есть ли подпись
  isEmpty(): boolean {
    return this.signaturePad ? this.signaturePad.isEmpty() : true;
  }
}