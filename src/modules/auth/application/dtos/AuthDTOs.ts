import { UserResponseDTO } from "../../../user/application/dtos/UserDTOs";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserResponseDTO;
}
