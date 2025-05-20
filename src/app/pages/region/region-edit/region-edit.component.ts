import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {share, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RegionService} from "../../../data/region/region.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Encoding, RegionId} from "../../../data/region/region.domain";
import {NotificationService} from "@feel/notification";
import {CommonModule} from '@angular/common';
import {ButtonComponent, CheckboxComponent, TextFieldComponent} from "@feel/form";
import {MapComponent} from "../../../core/components/map/map.component";

@Component({
    selector: 'app-region-edit',
    templateUrl: './region-edit.component.html',
    styleUrls: ['./region-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, TextFieldComponent, CheckboxComponent, ButtonComponent, MapComponent]
})
export class RegionEditComponent implements OnInit, OnDestroy {

  protected readonly form = new FormGroup({
    id: new FormControl<RegionId | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    transport_company: new FormControl<string | null>(null, [Validators.required]),
    regional_company: new FormControl<string | null>(null),
    frequency: new FormControl<string | null>(null),
    r09_type: new FormControl<number | null>(null),
    encoding: new FormControl<Encoding | null>(null),
    lat: new FormControl<number | null>(null, [Validators.required]),
    lon: new FormControl<number | null>(null, [Validators.required]),
    zoom: new FormControl<number | null>(null, [Validators.required]),
    work_in_progress: new FormControl<boolean | null>(null, [Validators.required]),
    deactivated: new FormControl<boolean | null>(null, [Validators.required]),
  });

  private readonly region = this.route.params.pipe(
    switchMap(({id}) => this.regionService.get(id)),
    share(),
  );
  private regionSubscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public ngOnInit(): void {
    this.regionSubscription = this.region.subscribe(region => this.form.setValue({
      deactivated: region.deactivated,
      encoding: region.encoding,
      frequency: region.frequency,
      id: region.id,
      lat: region.lat,
      lon: region.lon,
      name: region.name,
      r09_type: region.r09_type,
      regional_company: region.regional_company,
      transport_company: region.transport_company,
      work_in_progress: region.work_in_progress,
      zoom: region.zoom,
    }));
  }

  public ngOnDestroy(): void {
    this.regionSubscription?.unsubscribe();
  }

  protected save(): void {
    if (!this.form.valid) {
      return;
    }

    const region = this.form.getRawValue();

    const id = region.id;

    if (id == null) {
      throw new Error("region id is null??");
    }

    this.regionService.set(id, {
      deactivated: region.deactivated!,
      encoding: region.encoding,
      frequency: region.frequency,
      lat: region.lat!,
      lon: region.lon!,
      name: region.name!,
      r09_type: region.r09_type,
      regional_company: region.regional_company,
      transport_company: region.transport_company!,
      work_in_progress: region.work_in_progress!,
      zoom: region.zoom!,
    })
      .pipe(switchMap(region => this.router.navigate(['..'], {relativeTo: this.route}).then(() => region)))
      .subscribe({
        next: region => this.notificationService.success($localize`Region ${region.name} was successfully updated.`),
        error: err => {
          console.error(err);
          this.notificationService.error($localize`Failed to update region ${region.name}\: ${err}`)
        }
      });
  }
}
