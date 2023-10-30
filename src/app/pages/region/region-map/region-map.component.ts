import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import Style from "ol/style/Style";
import {Coordinate} from "ol/coordinate";
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
})
export class RegionMapComponent implements OnChanges {

  @Input()
  public markers: Coordinate[] = [];

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
  ) {
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
      const markers: Coordinate[] = changes["markers"].currentValue;

      this.features.addFeatures(markers.map(marker => {
        const feature = new Feature({geometry: new Point(marker)});
        feature.setStyle(MARKER_STYLE);
        return feature;
      }));
    }
  }
}
