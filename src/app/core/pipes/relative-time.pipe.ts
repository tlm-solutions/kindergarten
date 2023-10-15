import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true,
})
export class RelativeTimePipe implements PipeTransform {

  private readonly formatter;

  constructor(@Inject(LOCALE_ID) locale: string) {
    this.formatter = new Intl.RelativeTimeFormat(locale, {numeric: "auto"});
  }

  /**
   * The overridden `PipeTransform#transform` method.
   * Converts a datetime string into a relative time string.
   *
   * @author Tuhin Karmakar <tuhin@tuhinkarmakar.me>
   * @see https://github.com/tuhinkarmakar/ng-relative-time/blob/fac1247c97202a2d3f5da714dc89d3dcf76e301f/projects/relative-time/src/lib/pipes/relative-time.pipe.ts
   * @override
   * @param {string} value The datetime string to be formatted.
   * @returns {string} The formatted string.
   * @memberof RelativeTimePipe
   */
  public transform(value: string | number | Date): string {
    let date: number;
    if (typeof value === 'number') {
      date = value;
    } else if (typeof value === 'string') {
      date = Date.parse(value);
    } else {
      date = value.getTime();
    }

    const diffInMS = date - Date.now();
    const diffInSecs = Math.trunc(diffInMS / 1000)

    const absDiffInSecs = Math.abs(diffInSecs)

    if (absDiffInSecs < 5) {
      return $localize`now`;
    }

    if (absDiffInSecs < 60) {
      return this.formatter.format(diffInSecs, "second")
    }

    if (absDiffInSecs >= 60 && absDiffInSecs < 3600) {
      const minutes = Math.trunc(diffInSecs / 60)
      return this.formatter.format(minutes, "minute")
    }

    if (absDiffInSecs > 3600 && absDiffInSecs < 86400) {
      const hours = Math.trunc(diffInSecs / 3600)
      return this.formatter.format(hours, "hour")
    }

    if (absDiffInSecs >= 86400 && absDiffInSecs < 604800) {
      const days = Math.trunc(diffInSecs / 86400)
      return this.formatter.format(days, "day")
    }

    if (absDiffInSecs >= 604800 && absDiffInSecs < 2592000) {
      const weeks = Math.trunc(diffInSecs / 604800)
      return this.formatter.format(weeks, "week")
    }

    if (absDiffInSecs >= 2592000 && absDiffInSecs < 31536000) {
      const months = Math.trunc(diffInSecs / 2592000)
      return this.formatter.format(months, "month")
    }

    if (absDiffInSecs >= 31536000) {
      const years = Math.trunc(diffInSecs / 31536000)
      return this.formatter.format(years, "year")
    }

    return $localize`invalid data`;
  }
}
