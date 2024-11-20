import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {RegionService} from "../../../data/region/region.service";
import {map, Subscription, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {DropdownComponent} from "@feel/form";

@Component({
  selector: 'app-map-region-selector',
  templateUrl: './map-region-selector.component.html',
  styleUrls: ['./map-region-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRegionSelectorComponent implements OnInit, OnDestroy {

  protected readonly regions = this.regionService.findAll()
    .pipe(map(regions => regions.filter(region => !region.work_in_progress)));

  protected readonly form = new FormGroup({
    region: new FormControl<string>(this.router.url.match(/\/map\/(\d+)(?:\/.+)?/)?.[1] ?? "0")
  });
  private subscription: Subscription | undefined;

  constructor(
    private readonly regionService: RegionService,
    private readonly router: Router,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.form.valueChanges
      .pipe(switchMap(({region}) => this.router.navigateByUrl(`/map/${region}`)))
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
