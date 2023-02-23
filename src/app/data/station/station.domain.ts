export type StationId = string;

export interface StationWithoutId {
  name: string,
  lat: number,
  lon: number,
  region: number,
  owner: string,
  approved: boolean,
  deactivated: boolean,
  public: boolean,

  // TODO:
  radio: null,
  architecture: null,
  device: null,
  elevation: null,
  telegram_decoder_version: null,
  antenna: null,
}

export type StationWithId = { id: StationId } & StationWithoutId;
export type StationColumn = keyof StationWithId;
