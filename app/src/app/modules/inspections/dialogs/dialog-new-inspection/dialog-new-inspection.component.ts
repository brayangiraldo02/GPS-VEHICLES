import { Component, computed, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VEHICLES_MOCK } from '../../consts/new-inspection.mock';
import { Vehicle } from '../../interfaces/vehicles.interface';

@Component({
  selector: 'app-dialog-new-inspection',
  standalone: false,
  templateUrl: './dialog-new-inspection.component.html',
  styleUrls: ['./dialog-new-inspection.component.css'],
})
export class DialogNewInspectionComponent {
  // Lista de vehículos quemada
  vehicles = signal<Vehicle[]>(VEHICLES_MOCK);

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
        v.plate.toLowerCase().includes(query) ||
        v.unitId.toLowerCase().includes(query) ||
        v.owner.toLowerCase().includes(query),
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
      { label: 'Unidad', value: vehicle.unitId, icon: 'tag' },
      { label: 'Cupo', value: vehicle.quota, icon: 'confirmation_number' },
      { label: 'Propietario', value: vehicle.owner, icon: 'person' },
      { label: 'Marca', value: vehicle.brand, icon: 'branding_watermark' },
      { label: 'Modelo', value: vehicle.model, icon: 'model_training' },
      { label: 'Placa', value: vehicle.plate, icon: 'directions_car' },
      { label: 'Año', value: vehicle.year.toString(), icon: 'calendar_today' },
      { label: 'Motor', value: vehicle.engine, icon: 'engineering' },
      { label: 'VIN', value: vehicle.vin, icon: 'fingerprint' },
      { label: 'Dispositivo ID', value: vehicle.deviceId, icon: 'router' },
    ];
  });

  constructor(public dialogRef: MatDialogRef<DialogNewInspectionComponent>) {}

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
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
    console.log('Inspección terminada con fotos:', photos);
    this.dialogRef.close(true); // Cerramos el modal grande definitivamente
  }
}
