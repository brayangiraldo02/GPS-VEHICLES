import { Component, effect, HostListener, signal, viewChild } from '@angular/core';
import { INSPECTIONS_MOCK } from '../../consts/inspections.mock'; // Ajusta tus rutas si es necesario
import { Inspection } from '../../interfaces/inspections.interface'; // Ajusta tus rutas si es necesario
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-inspections',
  standalone: false,
  templateUrl: './table-inspections.component.html',
  styleUrl: './table-inspections.component.css',
})
export class TableInspectionsComponent {
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  pageSizeOptions = signal<number[]>([10, 20, 50]);

  displayedColumns: string[] = [
    'date',
    'type',
    'description',
    'unit',
    'plate',
    'owner',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Inspection>(INSPECTIONS_MOCK);

  readonly ROW_HEIGHT = 56;
  readonly HEADER_HEIGHT = 48; 
  readonly FIXED_SPACE_VERTICAL = 465;

  constructor() {
    effect(() => {
      if (this.paginator()) {
        this.dataSource.paginator = this.paginator()!;
        this.calculateDynamicPageSize();
      }
      if (this.sort()) {
        this.dataSource.sort = this.sort()!;
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateDynamicPageSize();
  }

  calculateDynamicPageSize() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.pageSizeOptions.set([10, 20, 50]);
      if (this.paginator()) {
        this.paginator()!.pageSize = 10;
        this.dataSource.paginator = this.paginator()!;
      }
      return;
    }

    const windowHeight = window.innerHeight;
    const availableHeight = windowHeight - this.FIXED_SPACE_VERTICAL;

    const rowsThatFit = Math.max(1, Math.floor(availableHeight / this.ROW_HEIGHT));

    if (this.paginator()) {
      const currentOptions = new Set([rowsThatFit, 10, 20, 50]);
      this.pageSizeOptions.set([...currentOptions].sort((a, b) => a - b));

      this.paginator()!.pageSize = rowsThatFit;
      this.dataSource.paginator = this.paginator()!;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'FINALIZADO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDIENTE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'SUSPENDIDO': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  getRowClass(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'bg-amber-50/60 hover:bg-amber-100/50';
      case 'SUSPENDIDO': return 'bg-rose-50/60 hover:bg-rose-100/50';
      default: return 'hover:bg-slate-50 transition-colors';
    }
  }

  search() { console.log('Buscando...'); }
  openOptions() { console.log('Opciones...'); }
  newInspection() { console.log('Nueva Inspección...'); }
}