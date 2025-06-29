import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import { ActivatedRoute, Router } from "@angular/router";
import { concat, distinct, filter, forkJoin, from, interval, map, Subject, switchMap, takeUntil, tap } from "rxjs";
import { RegionService } from "../../../data/region/region.service";
import Link from "ol/interaction/Link";
import { NetworkService } from "../../../data/network/network.service";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Overlay from "ol/Overlay";
import { MapVehicleInfoComponent } from "../map-vehicle-info/map-vehicle-info.component";
import { Type } from "../../../data/region/region.domain";
import { Source } from "../../../data/network/network.domain";

import { LineString } from 'ol/geom';
import Stroke from 'ol/style/Stroke';
import { smooth } from '../../../core/utils';

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
    imports: []
})
export class MapWindshieldComponent implements OnInit, OnDestroy {

  private readonly map = new Map({ view: new View({ center: [0, 0], zoom: 0 }) });

  private readonly vehicleHistory = new VectorSource<Feature<LineString>>();
  private readonly vehicles = new VectorSource<Feature<Point>>();

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
    this.map.addLayer(new TileLayer({ source: new OSM() }));

    this.map.addLayer(new VectorLayer({ source: this.vehicleHistory }));
    this.map.addLayer(new VectorLayer({ source: this.vehicles }));
    this.map.addOverlay(new Overlay({}))

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

      const oldFeatureId = popup.get("feature_id");

      this.map.forEachFeatureAtPixel(event.pixel, feature => {
        found = true;
        const point = feature.getGeometry() as Point;
        popup.setPosition(point.getCoordinates());
        popup.set("feature_id", feature.getId(), true);
        const [line, run] = String(feature.getId()).split("_");

        if (oldFeatureId !== feature.getId()) {
          if (oldFeatureId) {
            const historyFeature = this.vehicleHistory.getFeatureById(oldFeatureId);
            if (historyFeature)
              (historyFeature.getStyle() as Style).getStroke()!.setColor("#ae8319");
          }
          (this.vehicleHistory.getFeatureById(feature.getId()!)!.getStyle() as Style).getStroke()!.setColor('#FFD700')
          this.vehicleHistory.changed();
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { line, run },
          queryParamsHandling: "merge",
        });
      });

      if (!found) {
        popup.set("feature_id", undefined);
        popup.setPosition(undefined);

        if (oldFeatureId) {
          const historyFeature = this.vehicleHistory.getFeatureById(oldFeatureId);
          if (historyFeature) {
            (historyFeature.getStyle() as Style).getStroke()!.setColor("#ae8319");
            this.vehicleHistory.changed();
          }
        }
      }
    });

    this.route.params.pipe(
      // filter(({regionId}) => {
      // const view = this.map.getView();
      // const center = view.getCenter();
      // return regionId && center?.[0] === 0 && center?.[1] === 0;
      // }),
      distinct(),
      map(({ regionId }) => Number(regionId)),
      switchMap(regionId => forkJoin({
        _a: this.regionService.getCached(regionId)
          .pipe(
            filter(region => !!region),
            map(region => region!),
            tap(region => {
              const view = this.map.getView();
              view.setCenter([region.lon, region.lat]);
              view.setZoom(region.zoom);
              view.setRotation(0);
              this.map.addInteraction(new Link());
            }),
          ),
        _b: this.regionService.loadRegion(regionId)
          .pipe(
            switchMap(() => concat(
              this.networkService.sync(regionId).pipe(switchMap(data => from(data))),
              this.networkService.sub(),
            )),
            tap(data => {
              const id = `${data.line}_${data.run}`;
              const vehicle = this.vehicles.getFeatureById(id);
              if (vehicle && !(vehicle instanceof Feature)) {
                throw new Error("new openlayers features are not implemented in kindergarten");
              }

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
                if (popup.get("feature_id") === id) {
                  popup.setPosition(data.coordinate);
                }

                vehicle.setGeometry(new Point(data.coordinate));
                (vehicle.getStyle() as Style).setImage(icon);
                // @ts-expect-error strange typing
                vehicle.getStyle().getText().getFill().setColor(data.source === Source.TrekkieGPS ? "#ef2149" : "#000");

                const vehicleHistory = this.vehicleHistory.getFeatureById(id);
                (vehicleHistory!.getGeometry() as LineString).setCoordinates(smooth(data.history, 10));

              } else {
                const feature = new Feature({
                  geometry: new Point(data.coordinate),
                  last: Number(data.time),
                });
                feature.setId(id);
                feature.setStyle(new Style({
                  image: icon,
                  text: new Text({
                    offsetY: offset,
                    text: line?.name ?? `(${data.line})`,
                    font: '500 11px "DM Sans"',
                    fill: new Fill({ color: data.source === Source.TrekkieGPS ? "#ef2149" : "#000" }),
                  }),
                }));

                this.vehicles.addFeature(feature)

                const historyFeature = new Feature({
                  geometry: new LineString(smooth(data.history, 10)),
                });
                historyFeature.setId(id);
                historyFeature.setStyle(new Style({
                  stroke: new Stroke({
                    color: '#DAA520',
                    width: 4,
                  }),
                }),);

                this.vehicleHistory.addFeature(historyFeature);
              }
            })
          )
      })),
      takeUntil(this.destroy),
    ).subscribe();

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
          this.vehicleHistory.removeFeature(this.vehicleHistory.getFeatureById(feature.getId()!)!);
        });
      })
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
