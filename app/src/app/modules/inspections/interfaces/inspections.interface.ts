export interface Inspection {
  id: number;
  date: string;
  id_inspection_type: string | number;
  inspection_type: string;
  details: string;
  vehicle_id: string;
  plate: string;
  owner_id: string | number;
  owner: string;
  status: 'PEN' | 'FIN' | 'SUS';
  can_edit: number;
  photos: string[];
  signature: string[];
  user: string;
}
