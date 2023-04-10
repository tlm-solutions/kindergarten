import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import {ActivatedRoute} from "@angular/router";
import {filter, interval, map, Subscription, switchMap} from "rxjs";
import {RegionService} from "../../../data/region/region.service";
import Link from "ol/interaction/Link";
import {NetworkService} from "../../../data/network/network.service";
import VectorSource from "ol/source/Vector";
import WebGLTileLayer from "ol/layer/WebGLTile";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

const IMG = loadImage("/assets/icons/vehicle/unknown.svg");

const MAX_VEHICLE_AGE = 4 * 60;

@Component({
  selector: 'app-map-windshield',
  templateUrl: './map-windshield.component.html',
  styleUrls: ['./map-windshield.component.scss']
})
export class MapWindshieldComponent implements OnInit, OnDestroy {

  private readonly map = new Map({view: new View({center: [0, 0], zoom: 0})});

  private readonly vehicles = new VectorSource();

  private subscription: Subscription | undefined;
  private subscriptionB: Subscription | undefined;
  private subscriptionC: Subscription | undefined;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
    private readonly networkService: NetworkService,
  ) {
  }

  public ngOnInit(): void {
    this.map.setTarget(this.hostElement.nativeElement);
    this.map.addLayer(new WebGLTileLayer({source: new OSM()}));
    const vectorLayer = new VectorLayer({source: this.vehicles});
    this.map.addLayer(vectorLayer);

    this.subscription = this.route.params
      .pipe(
        filter(data => {
          const view = this.map.getView();
          const center = view.getCenter();
          return data["regionId"] && center?.[0] === 0 && center?.[1] === 0;
        }),
        map(data => Number(data["regionId"])),
        switchMap(regionId => this.regionService.getCached(regionId)),
        filter(region => !!region),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        map(region => region!),
      )
      .subscribe(region => {
        const view = this.map.getView();
        view.setCenter([region.lon, region.lat]);
        view.setZoom(region.zoom);
        this.map.addInteraction(new Link());
      });

    this.subscriptionB = this.networkService.sub()
      .subscribe(data => {
        const id = `${data.line}_${data.run}`;
        const vehicle = this.vehicles.getFeatureById(id);

        if (vehicle) {
          vehicle.setGeometry(new Point([data.lon, data.lat]));
        } else {
          const feature = new Feature({geometry: new Point([data.lon, data.lat]), last: Number(data.time)});
          feature.setId(id);
          feature.setStyle(new Style({
            image: new Icon({
              imgSize: [40, 40],
              img: IMG,
            }),
            text: new Text({
              offsetY: -10,
              text: id,
              font: 'DM Sans',
              fill: new Fill({color: "#000"}),
            }),
          }));

          this.vehicles.addFeature(feature)
        }
      });

    this.subscriptionC = interval(1000)
      .subscribe(() => {
        const last = (Date.now() / 1000) - MAX_VEHICLE_AGE;

        const toRemove = this.vehicles.getFeatures()
          .filter(feature => feature.get("last") < last);
        toRemove.forEach(feature => this.vehicles.removeFeature(feature));
      })
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionB?.unsubscribe();
    this.subscriptionC?.unsubscribe();
  }
}
