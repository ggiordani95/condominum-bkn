
export interface CreateResidentDTO {
  user_id: string;
  unit_id: string;
  role?: "owner" | "tenant" | "family";
}

export interface UpdateResidentDTO {
  unit_id?: string;
  role?: "owner" | "tenant" | "family";
  is_active?: boolean;
}

export interface ResidentResponseDTO {
  id: string;
  user_id: string;
  unit_id: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

