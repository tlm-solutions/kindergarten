import {IdHolder} from "../api.domain";

export type UserId = string;

export interface User extends IdHolder<UserId> {
  name: string;
  email: string;
  email_setting: number;
  deactivated: boolean;
}
