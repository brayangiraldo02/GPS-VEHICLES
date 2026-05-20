import { Component, effect, HostListener, signal, viewChild, inject, OnInit, computed } from '@angular/core';
import { INSPECTIONS_MOCK } from '../../consts/inspections.mock'; // Ajusta tus rutas si es necesario
import { Inspection } from '../../interfaces/inspections.interface'; // Ajusta tus rutas si es necesario
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewInspectionComponent } from '../../dialogs/dialog-new-inspection/dialog-new-inspection.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ApiService } from '../../../../core/services/api.service';
import { Owner } from '../../interfaces/owners.interface';
import { FormControl } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { Vehicle } from '../../interfaces/vehicles.interface';

import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-table-inspections',
  standalone: false,
  templateUrl: './table-inspections.component.html',
  styleUrl: './table-inspections.component.css',
})
export class TableInspectionsComponent implements OnInit {
  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);
  readonly dialog = inject(MatDialog);
  readonly breakpointObserver = inject(BreakpointObserver);
  private apiService = inject(ApiService);

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

  // Autocomplete Clientes
  ownerControl = new FormControl('');
  owners = signal<Owner[]>([]);
  private owners$ = toObservable(this.owners);
  selectedOwnerId: string | null = null;

  filteredOwners: Observable<Owner[]> = combineLatest([
    this.owners$,
    this.ownerControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([owners, filterValue]) => {
      const filterStr = (filterValue || '').toLowerCase();
      return owners.filter((owner) => (owner.name || '').toLowerCase().includes(filterStr));
    })
  );

  // Autocomplete Vehículos
  vehicleControl = new FormControl('');
  vehicles = signal<Vehicle[]>([]);
  private vehicles$ = toObservable(this.vehicles);

  filteredVehicles: Observable<Vehicle[]> = combineLatest([
    this.vehicles$,
    this.vehicleControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([vehicles, filterValue]) => {
      const filterStr = (filterValue || '').toLowerCase();
      return vehicles.filter(
        (v) =>
          (v.plate || '').toLowerCase().includes(filterStr) ||
          (v.brand || '').toLowerCase().includes(filterStr) ||
          (v.id || '').toLowerCase().includes(filterStr)
      );
    })
  );

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

  ngOnInit(): void {
    this.loadOwners();
    this.loadVehicles();
  }

  private loadOwners(): void {
    this.apiService.get<Owner[]>('/owners').subscribe({
      next: (data) => {
        this.owners.set(data || []);
      },
      error: (error) => {
        console.error('Error loading owners:', error);
      },
    });
  }

  onOwnerSelected(event: MatOptionSelectionChange, owner: Owner): void {
    if (event.isUserInput) {
      this.selectedOwnerId = owner.id.toString();
      this.vehicleControl.setValue(''); // Reset vehículo al cambiar dueño
      this.loadVehicles(this.selectedOwnerId);
    }
  }

  onOwnerCleared(): void {
    if (!this.ownerControl.value || this.ownerControl.value.trim() === '') {
      this.selectedOwnerId = null;
      this.loadVehicles();
    }
  }

  private loadVehicles(ownerId: string | null = null): void {
    const endpoint = `/vehicles/vehicles-per-owner/${ownerId ? `?owner_id=${ownerId}` : ''}`;
    this.apiService.post<Vehicle[]>(endpoint, {}).subscribe({
      next: (data) => {
        this.vehicles.set(data || []);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.vehicles.set([]);
      },
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
      case 'FINALIZADO':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'SUSPENDIDO':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  getRowClass(status: string): string {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-amber-50/60 hover:bg-amber-100/50';
      case 'SUSPENDIDO':
        return 'bg-rose-50/60 hover:bg-rose-100/50';
      default:
        return 'hover:bg-slate-50 transition-colors';
    }
  }

  search() {
    console.log('Buscando...');
  }
  openOptions() {
    console.log('Opciones...');
  }

  newInspection() {
    const isXSmall = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    const isSmall = this.breakpointObserver.isMatched(Breakpoints.Small);
    const dialogWidth = isXSmall ? '100vw' : isSmall ? '95vw' : '1050px';

    this.dialog.open(DialogNewInspectionComponent, {
      width: dialogWidth,
      maxWidth: isXSmall ? '100vw' : '95vw',
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });
  }
}
