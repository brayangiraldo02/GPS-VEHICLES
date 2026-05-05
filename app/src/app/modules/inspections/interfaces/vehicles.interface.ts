export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  owner_name?: string;
  // Campos adicionales usados en mocks o info detallada
  unitId?: string;
  owner?: string;
  quota?: string;
  vin?: string;
  engine?: string;
  year?: number;
  deviceId?: string;
  color?: string;
  vehicle_type?: string;
  status?: string;
  gps_serial?: string;
}
