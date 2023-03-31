export type UserId = string;

export interface UserWithoutId {
  name: string;
  email: string;
  email_setting: number;
  deactivated: boolean;
}

export type UserWithId = { id: UserId } & UserWithoutId;
