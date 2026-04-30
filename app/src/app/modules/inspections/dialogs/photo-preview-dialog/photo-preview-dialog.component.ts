import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-preview-dialog',
  standalone: false,
  template: `
    <div class="flex flex-col bg-white overflow-hidden rounded-2xl">
      <div class="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 class="font-bold text-slate-800 text-lg">Vista Previa</h3>
        <button mat-icon-button mat-dialog-close class="text-slate-400 hover:bg-slate-50">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="bg-slate-900 p-4 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
        @if (data.photoUrl) {
          <img [src]="data.photoUrl" class="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border border-slate-700" alt="Vista previa de foto" />
        } @else {
          <div class="w-full h-full min-h-[300px] border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center bg-slate-800">
             <mat-icon class="!w-16 !h-16 text-[64px] text-slate-500">hide_image</mat-icon>
          </div>
        }
      </div>

      <div class="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
        <button mat-stroked-button mat-dialog-close class="rounded-lg border-slate-300! text-slate-600!">
          Cerrar
        </button>
        <button mat-flat-button color="warn" class="rounded-lg bg-rose-500! text-white" (click)="dialogRef.close(true)">
          <mat-icon class="mr-1 scale-90">delete</mat-icon> Eliminar
        </button>
      </div>
    </div>
  `
})
export class PhotoPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PhotoPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { photoUrl: string }
  ) {}
}
