function buildBasePath(service: string, version: number): string {
  return `https://${service}.staging.tlm.solutions/v${version}`;
}

export const DATACARE_BASE_PATH = buildBasePath("datacare", 1);
export const LIZARD_BASE_PATH = buildBasePath("lizard", 1);
export const SOCKET_BASE_PATH = "wss://socket.staging.tlm.solutions";

export interface IdHolder<I> {
  id: I;
}

export interface NameHolder {
  name: string;
}

export type WithoutId<T> = Omit<T, "id">;
