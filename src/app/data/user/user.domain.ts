export type UserId = string;

export interface UserWithoutId {
  name: string;
}

export type UserWithId = { id: UserId } & UserWithoutId;
