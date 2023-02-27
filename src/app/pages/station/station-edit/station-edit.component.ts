import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {map, share, Subscription, switchMap, tap} from "rxjs";
import {StationService} from "../../../data/station/station.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Antenna, Architecture, Device, Radio, StationId, StationWithoutId} from "../../../data/station/station.domain";
import {RegionId} from "../../../data/region/region.domain";
import {UserId} from "../../../data/user/user.domain";

@Component({
  selector: 'app-station-sidebar',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss']
})
export class StationEditComponent implements OnInit, OnDestroy {

  private readonly stationId = this.route.params.pipe(map(({id}) => id));
  private readonly station = this.stationId.pipe(switchMap(id => this.stationService.findById(id)), share());

  private stationsSubscription: Subscription | undefined;

  protected readonly form = new FormGroup({
    id: new FormControl<StationId | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    lat: new FormControl<number | null>(null, [Validators.required]),
    lon: new FormControl<number | null>(null, [Validators.required]),
    region: new FormControl<RegionId | null>(null),
    owner: new FormControl<UserId | null>(null),
    approved: new FormControl<boolean | null>(null, [Validators.required]),
    deactivated: new FormControl<boolean | null>(null, [Validators.required]),
    public: new FormControl<boolean | null>(null, [Validators.required]),
    radio: new FormControl<Radio | null>(null),
    architecture: new FormControl<Architecture | null>(null),
    device: new FormControl<Device | null>(null),
    elevation: new FormControl<number | null>(null),
    antenna: new FormControl<Antenna | null>(null),
    telegram_decoder_version: new FormControl<number[] | null>(null),
    // notes: new FormControl<string|null>(null),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
    private readonly router: Router,
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
        // notes:station.notes,
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

    // @ts-ignore
    this.stationService.update(id, station)
      .pipe(
        tap(console.log),
        switchMap(() => this.router.navigate(['..'])),
      )
      .subscribe()  }
}
