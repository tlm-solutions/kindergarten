import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import Style from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import WebGLTileLayer from "ol/layer/WebGLTile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Overlay from "ol/Overlay";
import {
  RegionMapReportingPointInfoComponent
} from "../region-map-reporting-point-info/region-map-reporting-point-info.component";
import {ReportingPoint} from "../../../data/region/region.domain";
import {CommonModule} from "@angular/common";

const MARKER_STYLE = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({color: '#FFD700'}),
    stroke: new Stroke({color: '#DAA520'})
  }),
});

@Component({
  selector: 'app-region-map',
  templateUrl: './region-map.component.html',
  styleUrls: ['./region-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class RegionMapComponent implements OnInit, OnChanges {

  @Input()
  public markers: ReportingPoint[] = [];

  @Input()
  public lat = 0;
  @Input()
  public lon = 0;
  @Input()
  public zoom = 0;

  private features = new VectorSource();

  private map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 1,
    }),
    layers: [
      new WebGLTileLayer({source: new OSM()}),
      new VectorLayer({source: this.features}),
    ],
    target: this.hostElement.nativeElement
  });

  constructor(
    private readonly hostElement: ElementRef<HTMLElement>,
    private readonly viewContainerRef: ViewContainerRef,
  ) {
  }

  public ngOnInit(): void {
    const popupComponent = this.viewContainerRef.createComponent(RegionMapReportingPointInfoComponent);
    const popup = new Overlay({
      element: popupComponent.location.nativeElement,
      positioning: "top-center",
      offset: [0, 17],
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
        const reporting_point = feature.getId();
        const reportingPointRaw = this.markers.find(point => point.id === reporting_point);

        popupComponent.setInput("reportingPoint", reportingPointRaw)
      });

      if (!found) {
        popup.setPosition(undefined);
      }
    });

  }

  public ngOnChanges(changes: SimpleChanges): void {
    const view = this.map.getView();

    if (changes["lat"]) {
      const lat = changes["lat"].currentValue;
      view.setCenter([this.lon, lat]);

      const markerFeature = this.features.getFeatureById("marker");
      markerFeature?.setGeometry(new Point([this.lon, lat]));
    }

    if (changes["lon"]) {
      const lon = changes["lon"].currentValue;
      view.setCenter([lon, this.lat]);

      const markerFeature = this.features.getFeatureById("marker");
      markerFeature?.setGeometry(new Point([lon, this.lat]));
    }

    if (changes["zoom"]) {
      const zoom = changes["zoom"].currentValue;
      view.setZoom(zoom);
    }

    if (changes["markers"]) {
      const markers: ReportingPoint[] = changes["markers"].currentValue;

      this.features.addFeatures(markers.map(({id, lat, lon}) => {
        const feature = new Feature({geometry: new Point([lon, lat])});
        feature.setId(id);
        feature.setStyle(MARKER_STYLE);
        return feature;
      }));
    }
  }
}
