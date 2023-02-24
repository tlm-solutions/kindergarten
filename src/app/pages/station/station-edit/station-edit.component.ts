import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, switchMap} from "rxjs";
import {StationService} from "../../../data/station/station.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-station-sidebar',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.scss']
})
export class StationEditComponent {

  private readonly station = this.route.params.pipe(
    map(({id}) => id),
    switchMap(this.stationService.findById)
  );

  protected readonly form = new FormGroup({
    name: new FormControl(),
    lat: new FormControl(),
    lon: new FormControl(),
    approved: new FormControl(),
    deactivated: new FormControl(),
    public: new FormControl(),
    radio: new FormControl(),
    architecture: new FormControl(),
    device: new FormControl(),
    elevation: new FormControl(),
    antenna: new FormControl(),
    telegram_decoder_version: new FormControl(),
    notes: new FormControl(),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly stationService: StationService,
  ) {
  }
}
