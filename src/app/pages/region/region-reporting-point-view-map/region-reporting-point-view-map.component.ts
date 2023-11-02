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
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import View from "ol/View";
import WebGLTileLayer from "ol/layer/WebGLTile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Overlay from "ol/Overlay";
import {RegionReportingPointInfoComponent} from "../region-reporting-point-info/region-reporting-point-info.component";
import {ReportingPointRaw} from "../../../data/region/region.domain";

const MARKER_STYLE = new Style({
  image: new Circle({
    radius: 6,
    fill: new Fill({color: '#FFD700'}),
    stroke: new Stroke({color: '#DAA520'})
  }),
});

@Component({
  selector: 'app-region-reporting-point-view-map',
  templateUrl: './region-reporting-point-view-map.component.html',
  styleUrls: ['./region-reporting-point-view-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionReportingPointViewMapComponent implements OnInit, OnChanges {

  @Input()
  public markers: ReportingPointRaw[] = [];

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
    const popupComponent = this.viewContainerRef.createComponent(RegionReportingPointInfoComponent);
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
        const reporting_point = feature.get('reporting_point');
        const reportingPointRaw = this.markers.find(point => point.reporting_point === reporting_point);

        popupComponent.setInput("reportingPointRaw", reportingPointRaw)
      });

      if (!found) {
        popup.setPosition(undefined);
      }
    });

  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["markers"]) {
      const markers: ReportingPointRaw[] = changes["markers"].currentValue;

      this.features.addFeatures(markers.map(marker => {
        const feature = new Feature({geometry: new Point([marker.lon, marker.lat])});
        feature.setId(marker.id)
        feature.set("reporting_point", marker.reporting_point);
        feature.setStyle(MARKER_STYLE);
        return feature;
      }));

      if (markers.length === 1) {
        const view = this.map.getView();
        view.setCenter([markers[0].lon, markers[0].lat]);
        view.setZoom(15);
      } else {
        this.map.getView().fit(this.features.getExtent(), {padding: [10, 10, 10, 10], maxZoom: 20});
      }
    }
  }
}
