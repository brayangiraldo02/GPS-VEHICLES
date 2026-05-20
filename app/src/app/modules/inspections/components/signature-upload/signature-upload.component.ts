import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  output,
  signal,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-signature-upload',
  standalone: false,
  templateUrl: './signature-upload.component.html',
  styleUrl: './signature-upload.component.css',
})
export class SignatureUploadComponent implements AfterViewInit {
  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  onCancel = output<void>();
  onFinish = output<string>(); // Emite la firma en base64

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  hasSignature = signal<boolean>(false);

  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM se ha renderizado completamente
    setTimeout(() => {
      this.initCanvas();
    }, 150);
  }

  // Escucha cambios en la ventana para redimensionar el canvas
  @HostListener('window:resize')
  onResize() {
    this.initCanvas();
    this.clearSignature();
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // Igualar el tamaño interno del canvas al tamaño del contenedor en pantalla
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#1e293b'; // slate-800
  }

  // --- EVENTOS MOUSE ---
  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.hasSignature.set(true);
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.ctx.closePath();
  }

  // --- EVENTOS TOUCH (MÓVILES) ---
  startDrawingTouch(event: TouchEvent) {
    event.preventDefault(); // Evita scroll
    this.isDrawing = true;
    this.hasSignature.set(true);
    const pos = this.getTouchPos(event);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  drawTouch(event: TouchEvent) {
    if (!this.isDrawing) return;
    event.preventDefault();
    const pos = this.getTouchPos(event);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  private getTouchPos(event: TouchEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top,
    };
  }

  // --- ACCIONES ---
  clearSignature() {
    const canvas = this.canvasRef.nativeElement;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.hasSignature.set(false);
  }

  saveAndFinish() {
    const canvas = this.canvasRef.nativeElement;
    const base64Signature = canvas.toDataURL('image/png');
    this.onFinish.emit(base64Signature);
  }
}
