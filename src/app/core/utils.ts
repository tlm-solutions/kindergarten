// in miliseconds
const UNITS: Record<string, number> = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const FORMATTER = new Intl.RelativeTimeFormat("en", {numeric: "auto"});

export function formatRelativeTime(start: number, end?: number): string {
  const elapsed = start - (end ?? Date.now());

  for (const u in UNITS)
    if (Math.abs(elapsed) >= UNITS[u] || u === "second")
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return FORMATTER.format(Math.round(elapsed / UNITS[u]), u);

  // unreachable
  return '';
}

export function formatDuration(elapsed: number): string {
  for (const u in UNITS)
    if (Math.abs(elapsed) >= UNITS[u] || u === "second") {
      const number = Math.round(elapsed / UNITS[u]);
      return `${number} ${u}${Math.abs(number) !== 1 ? 's' : ''}`;
    }

  // unreachable
  return '';
}
