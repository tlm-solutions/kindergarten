import {UserId} from "../user/user.domain";

export type StationId = string;

export interface StationWithoutId {
  name: string,
  lat: number,
  lon: number,
  region: number,
  owner: UserId,
  approved: boolean,
  deactivated: boolean,
  public: boolean,
  radio: Radio | null,
  architecture: Architecture | null,
  device: Device | null,
  elevation: number | null,
  antenna: Antenna | null,
  telegram_decoder_version: number[] | null,
  notes: string | null,
}

export type StationWithId = { id: StationId } & StationWithoutId;

export enum Device {
  Other = 0,
  Raspberry3 = 1,
  Raspberry3b = 2,
  Raspberry3bPlus = 3,
  Raspberry4 = 4,
  OdroidC1 = 5,
  OdroidC2 = 6,
  OdroidC4 = 7,
  OdroidN2 = 8,
  OdroidU2 = 9,
  OdroidU3 = 10,
  PineH64 = 11,
  PineRock64 = 12,
  DellWyse3040 = 13,
}

export enum Radio {
  Other = 0,
  HackRf = 1,
  RTLSDR = 2,
  NESDR = 3,
}

export enum Architecture {
  Other = 0,
  X86 = 1,
  Aarch64 = 2,
}

export enum Antenna {
  Other = 0,
  Dipole = 1,
  GroundPlane = 2,
  Yagi = 3,
}
