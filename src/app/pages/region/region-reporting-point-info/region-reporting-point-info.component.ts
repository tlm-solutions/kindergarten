import {Component, Input} from '@angular/core';
import {ReportingPointRaw} from "../../../data/region/region.domain";
import {User, UserId} from "../../../data/user/user.domain";
import {Observable} from "rxjs";
import {UserService} from "../../../data/user/user.service";

@Component({
  selector: 'app-region-reporting-point-info',
  templateUrl: './region-reporting-point-info.component.html',
  styleUrls: ['./region-reporting-point-info.component.scss']
})
export class RegionReportingPointInfoComponent {

  @Input()
  protected reportingPointRaw?: ReportingPointRaw;

  constructor(
    private readonly userService: UserService,
  ) {
  }

  protected getUser(id: UserId): Observable<User | undefined> {
    return this.userService.getCached(id);
  }
}
