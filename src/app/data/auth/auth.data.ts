import {User} from "../user/user.domain";

export interface LoginResponse {
  success: boolean;
  id: string;
  admin: boolean;
  name: string | null;
}

export interface AuthResponse {
  user: User,
  roles: Record<string, undefined>,
}
