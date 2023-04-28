import {Pipe, PipeTransform} from '@angular/core';
import {formatDuration} from "../utils";

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {

  /**
   * Outputs a duration in a human-readable form.
   * @param value duration in miliseconds.
   */
  public transform(value: number): unknown {
    return formatDuration(value);
  }
}
