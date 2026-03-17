import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, output, signal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PhotoGalleryDialogComponent } from '../photo-gallery-dialog/photo-gallery-dialog.component';

@Component({
  selector: 'app-camera-upload',
  standalone: false,
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      
      <div class="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        
        <div class="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          <div class="p-5 border-b border-slate-100 flex flex-col max-[430px]:items-start max-[430px]:gap-4 min-[431px]:flex-row min-[431px]:justify-between min-[431px]:items-center bg-slate-50/50 shrink-0">
            <div class="flex items-center gap-3">
              <div class="bg-primary-50 text-primary-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                <mat-icon>photo_camera</mat-icon>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg leading-tight">Captura de Fotos</h3>
                <p class="text-slate-500 text-sm font-medium mt-0.5">
                  <span [class]="photos().length > 0 ? 'text-primary-600' : ''">{{ photos().length }}</span> / {{ MAX_PHOTOS }} fotos capturadas
                </p>
              </div>
            </div>
            
            @if (photos().length < MAX_PHOTOS) {
              <button mat-stroked-button color="primary" class="rounded-lg h-10 border-primary-200! bg-white shadow-sm max-[430px]:w-full"
                      (click)="openGallery()">
                <div class="flex items-center justify-center">
                  <mat-icon class="mr-1 scale-90">collections</mat-icon>
                  Ver Galería 
                  @if (photos().length > 0) { 
                    <span class="bg-primary-100 text-primary-700 ml-2 min-w-[20px] h-[20px] inline-flex items-center justify-center rounded-full text-xs font-bold leading-none">{{ photos().length }}</span> 
                  }
                </div>
              </button>
            }
          </div>

          <div class="relative bg-black w-full flex-1 flex items-center justify-center overflow-hidden min-h-[400px]">
            @if (photos().length < MAX_PHOTOS) {
              <video #videoElement class="w-full h-full object-cover" autoplay playsinline></video>
              <canvas #canvasElement class="hidden"></canvas>
              
              @if (!isCameraReady()) {
                <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900 z-10 w-full h-full">
                  <div class="flex flex-col items-center justify-center">
                    <mat-icon style="width: 64px; height: 64px; font-size: 64px; display: flex; justify-content: center; align-items: center; margin: 0 0 16px 0; padding: 0;" class="animate-pulse">videocam</mat-icon>
                    <span class="text-center w-full">Iniciando cámara...</span>
                  </div>
                </div>
              }
              
              <div class="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>
              
              <!-- FOOLPROOF CENTERING CON BOTÓN TAILWIND PURO -->
              <div class="absolute bottom-8 left-0 w-full flex justify-center z-[100] pointer-events-none">
                <button class="pointer-events-auto flex items-center justify-center bg-primary-600 text-white w-[72px] h-[72px] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.6)] border-[4px] border-white/30 hover:border-white/60 hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                        (click)="takePhoto()" 
                        [disabled]="!isCameraReady()">
                  <mat-icon class="scale-150">camera_alt</mat-icon>
                </button>
              </div>
            } @else {
              <div class="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center text-center p-6 z-20">
                <div class="bg-emerald-100 text-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <mat-icon style="width: 48px; height: 48px; font-size: 48px; display: flex; justify-content: center; align-items: center; margin: 0; padding: 0;">check_circle</mat-icon>
                </div>
                <h3 class="text-2xl font-bold text-slate-800 mb-2">Límite alcanzado</h3>
                <p class="text-slate-500 mb-8 max-w-sm">Has capturado el máximo de {{ MAX_PHOTOS }} fotos permitidas para esta inspección.</p>
                
                <button mat-flat-button color="primary" class="rounded-lg h-12 px-8 text-base shadow-md"
                        (click)="openGallery()">
                  <div class="flex items-center">
                    <mat-icon class="mr-2">collections</mat-icon>
                    Ver Galería de Fotos 
                    <span class="bg-white/20 text-white ml-3 min-w-[24px] h-[24px] inline-flex items-center justify-center rounded-full text-xs font-bold leading-none">{{ photos().length }}</span>
                  </div>
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
        <button mat-stroked-button class="rounded-lg h-10 border-slate-300! text-slate-600!" (click)="cancel()">
          Cancelar
        </button>
        <button mat-flat-button color="primary" class="rounded-lg h-10 px-6" 
                [disabled]="photos().length === 0"
                (click)="finish()">
          Subir Fotos<mat-icon class="ml-1.5 scale-90">cloud_upload</mat-icon>
        </button>
      </div>

    </div>
  `
})
export class CameraUploadComponent implements AfterViewInit, OnDestroy {
  onCancel = output<void>();
  onFinish = output<string[]>();

  MAX_PHOTOS = 8;
  photos = signal<string[]>([]);
  isCameraReady = signal<boolean>(false);

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  private stream: MediaStream | null = null;
  private dialog = inject(MatDialog);

  constructor() {}

  async ngAfterViewInit() {
    await this.initCamera();
  }

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (this.videoElement && this.videoElement.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        
        // El evento onloadedmetadata nos asegura que el video tiene dimensiones reales
        this.videoElement.nativeElement.onloadedmetadata = () => {
          this.isCameraReady.set(true);
          this.videoElement.nativeElement.play().catch(e => console.error("Error playing video:", e));
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  takePhoto() {
    if (this.photos().length < this.MAX_PHOTOS && this.isCameraReady()) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        this.photos.update(curr => [...curr, dataUrl]);
      }
    }
  }

  openGallery() {
    this.dialog.open(PhotoGalleryDialogComponent, {
      width: '800px',
      panelClass: 'rounded-2xl',
      data: { 
        photos: [...this.photos()],
        onUpdate: (updatedPhotos: string[]) => {
          this.photos.set(updatedPhotos);
        }
      }
    });
  }

  cancel() {
    this.stopCamera();
    this.onCancel.emit();
  }

  finish() {
    this.stopCamera();
    this.onFinish.emit(this.photos());
  }
}
