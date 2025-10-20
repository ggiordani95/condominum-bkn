export interface CreateVisitorDTO {
  name: string;
  document: string;
  vehicle_plate?: string;
  resident_id: string;
  time_limit: string;
  days_valid?: number;
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
  time_limit: string;
  created_at: Date;
  expires_at: Date;
  can_enter_now: boolean;
}

export interface VisitorListResponseDTO {
  id: string;
  name: string;
  document: string;
  vehicle_plate: string | null;
  resident_id: string;
  resident_unit_id: string;
  time_limit: string;
  created_at: Date;
  expires_at: Date;
  can_enter_now: boolean;
}

