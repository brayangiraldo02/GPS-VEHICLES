import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PhotoPreviewDialogComponent } from '../photo-preview-dialog/photo-preview-dialog.component';

@Component({
  selector: 'app-photo-gallery-dialog',
  standalone: false,
  template: `
    <div class="flex flex-col h-[75vh] w-[800px] max-w-full bg-white overflow-hidden rounded-2xl">
      <div class="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-white">
        <div>
          <h3 class="font-bold text-slate-800 text-xl">Galería de Capturas</h3>
          <p class="text-slate-500 text-sm mt-1">Fotos tomadas durante la inspección</p>
        </div>
        <button mat-icon-button mat-dialog-close class="text-slate-400 hover:bg-slate-50">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 bg-slate-50">
        @if (data.photos.length > 0) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (photo of data.photos; track $index) {
              <div class="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-primary-400 transition-all bg-slate-800"
                   (click)="openPreview($index)">
                <img [src]="photo" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt="Foto">
                
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <mat-icon class="text-white">zoom_in</mat-icon>
                </div>
                
                <button mat-icon-button color="warn" class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white shadow-sm scale-75"
                        (click)="deletePhoto($event, $index)">
                  <mat-icon class="text-rose-500">delete</mat-icon>
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center h-full text-center">
            <mat-icon class="!w-16 !h-16 text-[64px] text-slate-300 mb-4">collections</mat-icon>
            <h4 class="text-lg font-bold text-slate-700">Galería vacía</h4>
            <p class="text-slate-500">Aún no has capturado ninguna foto.</p>
          </div>
        }
      </div>

      <div class="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
        <button mat-flat-button color="primary" mat-dialog-close class="rounded-lg px-6 h-10">
          Aceptar
        </button>
      </div>
    </div>
  `
})
export class PhotoGalleryDialogComponent {
  private dialog = inject(MatDialog);

  constructor(
    public dialogRef: MatDialogRef<PhotoGalleryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { photos: string[], onUpdate: (photos: string[]) => void }
  ) {}

  deletePhoto(event: Event, index: number) {
    event.stopPropagation();
    const updatedPhotos = this.data.photos.filter((_, i) => i !== index);
    this.data.photos = updatedPhotos;
    this.data.onUpdate(updatedPhotos);
  }

  openPreview(index: number) {
    const dialogRef = this.dialog.open(PhotoPreviewDialogComponent, {
      width: '700px',
      panelClass: 'rounded-2xl',
      data: { photoUrl: this.data.photos[index] }
    });

    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        const updatedPhotos = this.data.photos.filter((_, i) => i !== index);
        this.data.photos = updatedPhotos;
        this.data.onUpdate(updatedPhotos);
      }
    });
  }
}
