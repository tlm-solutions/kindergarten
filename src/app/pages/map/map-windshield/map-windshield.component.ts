import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import {ActivatedRoute, Router} from "@angular/router";
import {concat, filter, forkJoin, from, interval, map, Subject, switchMap, takeUntil} from "rxjs";
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
import Overlay from "ol/Overlay";
import {MapVehicleInfoComponent} from "../map-vehicle-info/map-vehicle-info.component";
import {Type} from "../../../data/region/region.domain";
import {Source} from "../../../data/network/network.domain";

const BUS_ICONS = [
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus00.svg"),
  loadImage("assets/icons/vehicle/bus07.svg"),
  loadImage("assets/icons/vehicle/bus10.svg"),
  loadImage("assets/icons/vehicle/bus10.svg"),
  loadImage("assets/icons/vehicle/bus10.svg"),
  loadImage("assets/icons/vehicle/bus14.svg"),
  loadImage("assets/icons/vehicle/bus14.svg"),
  loadImage("assets/icons/vehicle/bus14.svg"),
  loadImage("assets/icons/vehicle/bus14.svg"),
];

const TRAM_ICONS = [
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram00.svg"),
  loadImage("assets/icons/vehicle/tram07.svg"),
  loadImage("assets/icons/vehicle/tram10.svg"),
  loadImage("assets/icons/vehicle/tram10.svg"),
  loadImage("assets/icons/vehicle/tram10.svg"),
  loadImage("assets/icons/vehicle/tram14.svg"),
  loadImage("assets/icons/vehicle/tram14.svg"),
  loadImage("assets/icons/vehicle/tram14.svg"),
  loadImage("assets/icons/vehicle/tram14.svg"),
];

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export function getImage<T>(imgs: T[], value: number, min: number, max: number): T {
  const v = (value - min) / (max - min);
  const u = Math.round(v * (imgs.length - 1));
  return imgs[u];
}

const IMG = loadImage("assets/icons/vehicle/unknown.svg");

const MAX_VEHICLE_AGE = 1000 * 60 * 5;

@Component({
  selector: 'app-map-windshield',
  templateUrl: './map-windshield.component.html',
  styleUrls: ['./map-windshield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapWindshieldComponent implements OnInit, OnDestroy {

  private readonly map = new Map({view: new View({center: [0, 0], zoom: 0})});

  private readonly vehicles = new VectorSource();

  private readonly destroy = new Subject<void>();

  constructor(
        private readonly hostElement: ElementRef<HTMLElement>,
        private readonly route: ActivatedRoute,
        private readonly regionService: RegionService,
        private readonly networkService: NetworkService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.map.setTarget(this.hostElement.nativeElement);
    this.map.addLayer(new WebGLTileLayer({source: new OSM()}));
    const vectorLayer = new VectorLayer({source: this.vehicles});
    this.map.addLayer(vectorLayer);
    this.map.addOverlay(new Overlay({}))

    const regionId = this.route.params.pipe(
      filter(({regionId}) => {
        const view = this.map.getView();
        const center = view.getCenter();
        return regionId && center?.[0] === 0 && center?.[1] === 0;
      }),
      map(({regionId}) => Number(regionId)),
    );

    const popupComponent = this.viewContainerRef.createComponent(MapVehicleInfoComponent);
    const popup = new Overlay({
      element: popupComponent.location.nativeElement,
      positioning: "top-center",
      offset: [0, 22],
      autoPan: {
        animation: {
          duration: 150,
        },
      },
    });

    this.map.addOverlay(popup);

    this.map.on('click', event => {
      let found = false;
      this.map.forEachFeatureAtPixel(event.pixel, feature => {
        found = true;
        const point = feature.getGeometry() as Point;
        popup.setPosition(point.getCoordinates());
        popup.set("feature_id", feature.getId(), true);
        const [line, run] = String(feature.getId()).split("_");

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {line, run},
          queryParamsHandling: "merge",
        });
      });

      if (!found) {
        popup.setPosition(undefined);
      }
    });

    regionId.pipe(
      switchMap(regionId => this.regionService.getCached(regionId)),
      filter(region => !!region),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map(region => region!),
      takeUntil(this.destroy)
    )
      .subscribe(region => {
        const view = this.map.getView();
        view.setCenter([region.lon, region.lat]);
        view.setZoom(region.zoom);
        this.map.addInteraction(new Link());
      });

    regionId.pipe(
      switchMap(regionId => forkJoin({
        _: this.regionService.loadRegion(regionId),
        data: concat(
          this.networkService.sync(regionId).pipe(switchMap(data => from(data))),
          this.networkService.sub(),
        )
      })),
      takeUntil(this.destroy)
    )
      .subscribe(({data}) => {
        const id = `${data.line}_${data.run}`;
        const vehicle = this.vehicles.getFeatureById(id);

        let icon;
        let offset;

        const line = this.regionService.lookupLine(data.line);

        const delay = data.delayed ?? 0;

        switch (line?.type) {
        case Type.TRAM:
          icon = new Icon({
            size: [40, 40],
            img: getImage(TRAM_ICONS, Math.round(delay / 60), -7, 7),
          });
          offset = -4;
          break;
        case Type.BUS:
          icon = new Icon({
            size: [40, 40],
            img: getImage(BUS_ICONS, Math.round(delay / 60), -7, 7),
          });
          offset = -4;
          break;
        default:
          icon = new Icon({
            size: [40, 40],
            img: IMG,
          });
          offset = -10;
        }

        if (vehicle) {
          const coords = [data.lon, data.lat];

          if (popup.get("feature_id") === id) {
            popup.setPosition(coords);
          }
          (vehicle.getStyle() as Style).setImage(icon);
          vehicle.setGeometry(new Point(coords));
          // @ts-ignore
          vehicle.getStyle().getText().getFill().setColor(data.source === Source.TrekkieGPS ? "#ef2149" : "#000");
        } else {
          const feature = new Feature({geometry: new Point([data.lon, data.lat]), last: Number(data.time)});
          feature.setId(id);
          feature.setStyle(new Style({
            image: icon,
            text: new Text({
              offsetY: offset,
              text: line?.name ?? `(${data.line})`,
              font: '500 11px "DM Sans"',
              fill: new Fill({color: data.source === Source.TrekkieGPS ? "#ef2149" : "#000"}),
            }),
          }));

          this.vehicles.addFeature(feature)
        }
      });

    interval(1000)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        const last = Date.now() - MAX_VEHICLE_AGE;

        const toRemove = this.vehicles.getFeatures()
          .filter(feature => feature.get("last") < last);

        toRemove.forEach(feature => {
          if (popup.get("feature_id") === feature.getId()) {
            popup.setPosition(undefined);
          }

          this.vehicles.removeFeature(feature)
        });
      })
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
