import type { RegisterData } from "../../auth/interfaces/auth";

export interface User extends Omit<RegisterData, "password"> {
  id: number;
  lat: number;
  lng: number;
  me?: boolean;
}
export interface UserResponse {
  users: User[];
}

export interface SingleUserResponse {
  user: User;
}