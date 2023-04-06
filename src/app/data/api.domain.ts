export const BASE_PATH = "https://datacare.staging.dvb.solutions";

export interface IdHolder<I> {
  id: I;
}

export interface NameHolder {
  name: string;
}

export type WithoutId<T> = Omit<T, "id">;
