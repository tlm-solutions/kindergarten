import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {share, Subscription, switchMap} from "rxjs";
import {StationService} from "../../../data/station/station.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Antenna, Architecture, Device, Radio, StationId} from "../../../data/station/station.domain";
import {RegionId} from "../../../data/region/region.domain";
import {UserId} from "../../../data/user/user.domain";
import {NotificationService} from "../../../core/notification/notification.service";

@Component({
  selector: 'app-station-sidebar',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationEditComponent implements OnInit, OnDestroy {

  protected readonly form = new FormGroup({
    id: new FormControl<StationId | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    lat: new FormControl<number | null>(null, [Validators.required]),
    lon: new FormControl<number | null>(null, [Validators.required]),
    region: new FormControl<RegionId | null>(null, [Validators.required]),
    owner: new FormControl<UserId | null>(null, [Validators.required]),
    approved: new FormControl<boolean | null>(null, [Validators.required]),
    deactivated: new FormControl<boolean | null>(null, [Validators.required]),
    public: new FormControl<boolean | null>(null, [Validators.required]),
    radio: new FormControl<Radio | null>(null),
    architecture: new FormControl<Architecture | null>(null),
    device: new FormControl<Device | null>(null),
    elevation: new FormControl<number | null>(null),
    antenna: new FormControl<Antenna | null>(null),
    telegram_decoder_version: new FormControl<number[] | null>(null),
    notes: new FormControl<string | null>(null),
  });

  private readonly station = this.route.params.pipe(
    switchMap(({id}) => this.stationService.get(id)),
    share()
  );

  private stationsSubscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public ngOnInit(): void {
    this.stationsSubscription = this.station.subscribe(station => {
      this.form.setValue({
        id: station.id,
        name: station.name,
        lat: station.lat,
        lon: station.lon,
        region: station.region,
        owner: station.owner,
        approved: station.approved,
        deactivated: station.deactivated,
        public: station.public,
        radio: station.radio,
        architecture: station.architecture,
        device: station.device,
        elevation: station.elevation,
        telegram_decoder_version: station.telegram_decoder_version,
        antenna: station.antenna,
        notes: station.notes,
      });
    })
  }

  public ngOnDestroy(): void {
    this.stationsSubscription?.unsubscribe();
  }

  protected save(): void {
    if (!this.form.valid) {
      return;
    }

    const station = this.form.getRawValue();
    const id = station.id;

    if (!id) {
      throw new Error("station id is null??");
    }

    this.stationService.set(id, {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      antenna: station.antenna,
      approved: station.approved!,
      architecture: station.architecture,
      deactivated: station.deactivated!,
      device: station.device,
      elevation: station.elevation,
      lat: station.lat!,
      lon: station.lon!,
      name: station.name!,
      notes: station.notes,
      owner: station.owner!,
      public: station.public!,
      radio: station.radio,
      region: station.region!,
      telegram_decoder_version: station.telegram_decoder_version,
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    })
      .pipe(switchMap(station => this.router.navigate(['..'], {relativeTo: this.route}).then(() => station)))
      .subscribe({
        next: station => this.notificationService.success(`Station ${station.name} was successfully updated.`),
        error: err => {
          console.error(err);
          this.notificationService.error(`Failed to update station ${station.name}: ${err}`)
        }
      });
  }
}
