import {UserWithId} from "../user/user.domain";

export interface LoginResponse {
  success: boolean;
  id: string;
  admin: boolean;
  name: string | null;
}

export interface AuthResponse {
  user: UserWithId,
  roles: Record<string, undefined>,
}
