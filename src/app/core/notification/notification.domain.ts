import {IdHolder} from "../../data/base/data.domain";

export type NotificationFlavor = "info" | "success" | "error";

export interface Notification extends IdHolder<number> {
  text: string;
  flavor: NotificationFlavor;
  remainingDuration: number;
  initialDuration: number;
}

export const DEFAULT_NOTIFICATION_DURATION = 10; // sec
