import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StationService} from "../../../data/station/station.service";
import {map, share, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../data/user/user.service";

@Component({
  selector: 'app-station-view',
  templateUrl: './station-view.component.html',
  styleUrls: ['./station-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StationViewComponent {

  protected readonly station = this.route.params.pipe(
    map(({id}) => id),
    switchMap(id => this.stationService.findById(id)),
    share(),
  );

  protected readonly owner = this.station.pipe(
    switchMap(user => this.userService.findById(user.owner)),
    share(),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
    private readonly userService: UserService
  ) {
  }
}
