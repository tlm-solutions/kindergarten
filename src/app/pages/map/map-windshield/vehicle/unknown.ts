import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Text from "ol/style/Text";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import {Coordinate} from "ol/coordinate";
import VectorContext from "ol/render/VectorContext";
import {loadImage} from "./utils";
import {Vehicle} from "../map-windshield.component";

const IMG = loadImage("/assets/icons/vehicle/unknown.svg");

export class UnknownVehicle implements Vehicle<Point> {

  public readonly feature: Feature<Point>;
  private readonly style: Style;
  private changed = false;

  constructor(public readonly id: string, line: string, run: string, description: string | undefined, private coordinate: Coordinate, private last0: number) {
    this.feature = new Feature({
      id,
      geometry: new Point(this.coordinate),
    });

    this.style = new Style({
      image: new Icon({
        imgSize: [40, 40],
        img: IMG,
      }),
      text: new Text({
        offsetY: -10,
        text: `${line}_${run}`,
        font: 'DM Sans',
        fill: new Fill({color: "#000"}),
      }),
    });

    this.feature.setStyle(this.style);
  }

  get last(): number {
    return this.last0;
  }

  public move(coordinate: Coordinate, delay: number, last: number): void {
    this.coordinate = coordinate;
    this.changed = true;
    this.last0 = last;
  }

  public update(ctx: VectorContext): void {
    if (!this.changed) {
      return;
    }

    const geometry = this.feature.getGeometry();
    if (geometry) {
      geometry.setCoordinates(this.coordinate);
      // ctx.setStyle(this.style);
      // ctx.drawGeometry(geometry);
    }

    this.changed = false;
  }
}
