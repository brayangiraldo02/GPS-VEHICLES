export interface Inspection {
  id: number;
  date: string; 
  type: string; 
  description: string;
  unit: string; 
  plate: string;
  quota: string; 
  user: string; 
  owner: string; 
  status: 'FINALIZADO' | 'PENDIENTE' | 'SUSPENDIDO';
}