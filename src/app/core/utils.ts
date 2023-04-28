// in miliseconds
const UNITS: Record<string, number> = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

export function formatDuration(elapsed: number): string {
  for (const u in UNITS)
    if (Math.abs(elapsed) >= UNITS[u] || u === "second") {
      const number = Math.round(elapsed / UNITS[u]);

      switch (u) {
        case "year":
          return `${number} ${Math.abs(number) === 1 ? $localize`year` : $localize`years`}`
        case "month":
          return `${number} ${Math.abs(number) === 1 ? $localize`month` : $localize`months`}`
        case "day":
          return `${number} ${Math.abs(number) === 1 ? $localize`day` : $localize`days`}`
        case "hour":
          return `${number} ${Math.abs(number) === 1 ? $localize`hour` : $localize`hours`}`
        case "minute":
          return `${number} ${Math.abs(number) === 1 ? $localize`minute` : $localize`minutes`}`
        case "second":
          return `${number} ${Math.abs(number) === 1 ? $localize`second` : $localize`seconds`}`
      }
    }

  // unreachable
  return '';
}
