import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {ActivatedRoute} from "@angular/router";
import {filter, map, Subscription, switchMap} from "rxjs";
import {RegionService} from "../../../data/region/region.service";
import Link from "ol/interaction/Link";
import {NetworkService} from "../../../data/network/network.service";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Geometry from "ol/geom/Geometry";
import Feature from "ol/Feature";
import {Coordinate} from "ol/coordinate";
import VectorContext from "ol/render/VectorContext";
import RenderEvent from "ol/render/Event";
import {getVectorContext} from "ol/render";

export interface Vehicle<T extends Geometry> {
  id: string;
  last: number;
  feature: Feature<T>;

  move(coordinate: Coordinate, delay: number, last: number): void;

  update(ctx: VectorContext): void;
}

@Component({
  selector: 'app-map-windshield',
  templateUrl: './map-windshield.component.html',
  styleUrls: ['./map-windshield.component.scss']
})
export class MapWindshieldComponent implements OnInit, OnDestroy {

  private readonly map = new Map({view: new View({center: [0, 0], zoom: 0})});
  private readonly features = new VectorSource();

  private subscription: Subscription | undefined;

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly route: ActivatedRoute,
    private readonly regionService: RegionService,
    private readonly networkService: NetworkService,
  ) {
  }

  public ngOnInit(): void {
    this.map.setTarget(this.hostElement.nativeElement);
    this.map.addLayer(this.createOsmLightDarkLayer());
    const vectorLayer = new VectorLayer({source: this.features});
    this.map.addLayer(vectorLayer);

    vectorLayer.on("postrender", event => this.render(event));

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

    this.networkService.sub();

    this.networkService.getVehicles()
      .subscribe(vehicle => this.features.addFeature(vehicle.feature))
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private createOsmLightDarkLayer() {
    const tileLayer = new TileLayer({source: new OSM()});

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      tileLayer.on('prerender', event => {
        if (event.context) {
          const context = event.context as CanvasRenderingContext2D;
          context.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
          context.globalCompositeOperation = 'source-over';
        }
      });

      tileLayer.on('postrender', event => {
        if (event.context) {
          const context = event.context as CanvasRenderingContext2D;
          context.filter = 'none';
        }
      });
    }

    return tileLayer;
  }

  private render(event: RenderEvent): void {
    // this.removeOldVehicles();

    const ctx = getVectorContext(event);
    const frameState = event.frameState;

    for (const vehicle of this.networkService.getVehiclesNow()) {
      vehicle.update(ctx);
    }

    this.map?.render();
  }
}
