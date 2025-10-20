export interface CreateVisitorDTO {
  name: string;
  document: string;
  vehicle_plate?: string;
  resident_id: string;
}

export interface UpdateVisitorDTO {
  name?: string;
  vehicle_plate?: string;
}

export interface VisitorResponseDTO {
  id: string;
  name: string;
  document: string;
  vehicle_plate: string | null;
  resident_id: string;
  resident_unit_id: string;
  created_at: Date;
  expires_at: Date;
}

export interface VisitorListResponseDTO {
  id: string;
  name: string;
  document: string;
  vehicle_plate: string | null;
  resident_id: string;
  resident_unit_id: string;
  created_at: Date;
  expires_at: Date;
}

