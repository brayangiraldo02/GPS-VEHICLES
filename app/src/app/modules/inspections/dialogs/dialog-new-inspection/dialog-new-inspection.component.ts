import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../interfaces/vehicles.interface';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-dialog-new-inspection',
  standalone: false,
  templateUrl: './dialog-new-inspection.component.html',
  styleUrls: ['./dialog-new-inspection.component.css'],
})
export class DialogNewInspectionComponent implements OnInit {
  private apiService = inject(ApiService);

  // Lista de vehículos
  vehicles = signal<Vehicle[]>([]);

  // Estado de búsqueda
  searchQuery = signal<string>('');

  // Vehículo seleccionado (null si no hay selección)
  selectedVehicle = signal<Vehicle | null>(null);

  // CONTROL DEL WIZARD (Pasos)
  currentStep = signal<number>(1);

  // NUEVAS VARIABLES PARA EL TIPO DE INSPECCIÓN
  selectedInspectionType = signal<string | null>(null);
  inspectionTypes = [
    'INGRESO POR INSTALACION',
    'REVISION GPS',
    'REVISION SIM CARD',
    'CAMBIO DE GPS',
    'CAMBIO DE SIM CARD',
    'RETIRO DE GPS Y SIM CARD'
  ];

  // COMPUTED: Filtrado Local Ultra-Rápido con Protección de DOM
  filteredVehicles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    // 1. ESTADO INICIAL: Si no hay búsqueda, mostramos los primeros 10
    if (!query) {
      return this.vehicles().slice(0, 10);
    }

    // 2. BÚSQUEDA: Filtramos todo el array en memoria
    const results = this.vehicles().filter(
      (v) =>
        (v.plate || '').toLowerCase().includes(query) ||
        (v.unitId || '').toLowerCase().includes(query) ||
        (v.owner || '').toLowerCase().includes(query) ||
        (v.owner_name || '').toLowerCase().includes(query),
    );

    // 3. PROTECCIÓN DEL HTML: Sin importar cuántos coincidan, solo renderizamos 10
    return results.slice(0, 10);
  });

  // Computed: Array de detalles del vehículo seleccionado para el Grid
  selectedVehicleDetails = computed(() => {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return [];

    // Mapeamos los datos para iterar fácilmente en el HTML
    return [
      { label: 'Unidad', value: vehicle.unitId || 'N/A', icon: 'tag' },
      { label: 'Cupo', value: vehicle.quota || 'N/A', icon: 'confirmation_number' },
      { label: 'Propietario', value: vehicle.owner || vehicle.owner_name || 'N/A', icon: 'person' },
      { label: 'Marca', value: vehicle.brand, icon: 'branding_watermark' },
      { label: 'Modelo', value: vehicle.model, icon: 'model_training' },
      { label: 'Placa', value: vehicle.plate, icon: 'directions_car' },
      { label: 'Año', value: vehicle.year?.toString() || 'N/A', icon: 'calendar_today' },
      { label: 'Motor', value: vehicle.engine || 'N/A', icon: 'engineering' },
      { label: 'VIN', value: vehicle.vin || 'N/A', icon: 'fingerprint' },
      { label: 'Dispositivo ID', value: vehicle.deviceId || vehicle.gps_serial || 'N/A', icon: 'router' },
    ];
  });

  constructor(public dialogRef: MatDialogRef<DialogNewInspectionComponent>) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles() {
    this.apiService.post<Vehicle[]>('/vehicles/vehicles-per-owner/', {}).subscribe({
      next: (data) => {
        this.vehicles.set(data || []);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    
    // Buscar info detallada por placa
    this.apiService.post<Vehicle>(`/vehicles/info/?vehicle_plate=${vehicle.plate}`, {}).subscribe({
      next: (fullInfo) => {
        if (fullInfo) {
          // Combinamos la info previa con la nueva
          this.selectedVehicle.set({ ...vehicle, ...fullInfo });
        }
      },
      error: (error) => {
        console.error('Error loading vehicle details:', error);
      }
    });

    // Opcional: Limpiar búsqueda al seleccionar
    this.searchQuery.set('');
  }

  changeVehicle() {
    this.selectedVehicle.set(null);
    this.selectedInspectionType.set(null); // Importante: Limpiamos el tipo si cambia de carro
    this.currentStep.set(1);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  nextStep() {
    // Verificamos que ambas cosas estén seleccionadas
    if (this.selectedVehicle() && this.selectedInspectionType()) {
      console.log('Procediendo con vehículo:', this.selectedVehicle()?.plate);
      console.log('Tipo de Inspección:', this.selectedInspectionType());
      this.currentStep.set(2);
    }
  }

  prevStep() {
    this.currentStep.set(1);
  }

  finishInspection() {
    // Cambiamos al Paso 3 (Pantalla de Carga)
    this.currentStep.set(3);

    // Simulamos la petición al backend (espera de 2 segundos)
    setTimeout(() => {
      // Avanzamos al Paso 4 (Cámara)
      this.currentStep.set(4);
    }, 2000);
  }

  // Se llama cuando la cámara termina de subir todo
  completeWizard(photos: string[]) {
    console.log('Fotos subidas:', photos);
    // Cambiamos al Paso 5 (Pantalla de Carga para la firma)
    this.currentStep.set(5);

    // Simulamos la carga de fotos (espera de 2 segundos)
    setTimeout(() => {
      // Avanzamos al Paso 6 (Firma)
      this.currentStep.set(6);
    }, 2000);
  }

  onSignatureFinish(signature: string) {
    console.log('Inspección terminada con firma:', signature);
    this.dialogRef.close(true); // Cerramos el modal grande definitivamente
  }
}
