export interface LoginResponse {
  success: boolean;
  id: string;
  admin: boolean;
  name: string | null;
}
