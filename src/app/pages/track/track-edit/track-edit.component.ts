import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, combineLatest, filter, map, share, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../../core/notification/notification.service";
import {TrackService} from "../../../data/track/track.service";
import {Coordinate} from "ol/coordinate";
import {GpsEntry} from "../../../data/track/track.domain";

@Component({
  selector: 'app-track-edit',
  templateUrl: './track-edit.component.html',
  styleUrls: ['./track-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackEditComponent implements OnInit, OnDestroy {

  protected readonly form = new FormGroup({
    id: new FormControl<string | null>(null),
    start_time: new FormControl<Date | null>(null, [Validators.required]),
    end_time: new FormControl<Date | null>(null, [Validators.required]),
    line: new FormControl<number | null>(null, [Validators.required]),
    run: new FormControl<number | null>(null, [Validators.required]),
    region: new FormControl<number | null>(null, [Validators.required]),
    owner: new FormControl<string | null>(null, [Validators.required]),
    finished: new FormControl<boolean | null>(null, [Validators.required]),
    correlated: new FormControl<boolean | null>(null, [Validators.required]),

    trim_start: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    trim_end: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
  });

  private readonly track = this.route.params.pipe(
    switchMap(({id}) => this.trackService.get(id)),
    share()
  );

  protected readonly lines = new BehaviorSubject<Coordinate[][]>([]);
  protected readonly highlightedLines = new BehaviorSubject<Coordinate[][]>([]);

  private trackSubscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly trackService: TrackService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public ngOnInit(): void {
    this.trackSubscription = this.track.subscribe(track => {
      this.form.setValue({
        id: track.id,
        correlated: track.correlated,
        end_time: new Date(track.end_time),
        finished: track.finished,
        line: track.line,
        owner: track.owner,
        region: track.region,
        run: track.run,
        start_time: new Date(track.start_time),
        trim_start: track.gps.findIndex(entry => Date.parse(entry.time) > Date.parse(track.start_time)),
        trim_end: track.gps.length - track.gps.findIndex(entry => Date.parse(entry.time) > Date.parse(track.end_time)),
      });
    })

    combineLatest([this.form.controls.trim_start.valueChanges, this.track]).subscribe(([start, track]) => {
      this.form.controls.start_time.setValue(new Date(track.gps[(start ?? 0) - 1].time));
    });

    combineLatest([this.form.controls.trim_end.valueChanges, this.track]).subscribe(([end, track]) => {
      this.form.controls.end_time.setValue(new Date(track.gps[track.gps.length - (end ?? 0) - 1].time));
    });

    combineLatest([this.form.controls.start_time.valueChanges, this.form.controls.end_time.valueChanges, this.track])
      .pipe(filter(([start, end]) => !!start && !!end), map(([start, end, track]) => ({
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        start: start!.getTime(),
        end: end!.getTime(),
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        track
      })))
      .subscribe(({start, end, track}) => {
        this.form.patchValue({
          trim_start: track.gps.findIndex(entry => Date.parse(entry.time) > start),
          trim_end: track.gps.length - track.gps.findIndex(entry => Date.parse(entry.time) > end)
        }, {emitEvent: false});

        this.highlightedLines.next([this.convertToCoords(track.gps, start, end)]);
        this.lines.next([
          this.convertToCoordsBefore(track.gps, start),
          this.convertToCoordsAfter(track.gps, end),
        ]);
      });
  }

  private convertToCoords(gps: GpsEntry[], start: number, end: number): Coordinate[] {
    return gps.filter(gps => {
      const gpsTime = Date.parse(gps.time);
      return start <= gpsTime && gpsTime <= end
    })
      .map(gps => [gps.lon, gps.lat]);
  }

  private convertToCoordsBefore(gps: GpsEntry[], time: number) {
    return gps.filter(gps => Date.parse(gps.time) <= time)
      .map(gps => [gps.lon, gps.lat]);
  }

  private convertToCoordsAfter(gps: GpsEntry[], time: number) {
    return gps.filter(gps => time <= Date.parse(gps.time))
      .map(gps => [gps.lon, gps.lat]);
  }

  public ngOnDestroy(): void {
    this.trackSubscription?.unsubscribe();
  }

  protected save(): void {
    if (!this.form.valid) {
      return;
    }

    const track = this.form.getRawValue();
    const id = track.id;

    if (!id) {
      throw new Error("track id is null??");
    }

    this.trackService.set(id, {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      correlated: track.correlated!,
      end_time: track.end_time!.toISOString(),
      finished: track.finished!,
      gps: [],
      line: track.line!,
      owner: track.owner!,
      region: track.region!,
      run: track.run!,
      start_time: track.start_time!.toISOString(),
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    })
      .pipe(switchMap(station => this.router.navigate(['..'], {relativeTo: this.route}).then(() => station)))
      .subscribe({
        next: () => this.notificationService.success(`Track was successfully updated.`),
        error: err => {
          console.error(err);
          this.notificationService.error(`Failed to update track: ${err}`)
        }
      });
  }
}
