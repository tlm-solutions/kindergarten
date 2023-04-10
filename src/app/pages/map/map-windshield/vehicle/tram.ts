import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Text from "ol/style/Text";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import {Coordinate} from "ol/coordinate";
import VectorContext from "ol/render/VectorContext";
import {getImage, loadImage} from "./utils";
import {Vehicle} from "../map-windshield.component";

const IMGS = [
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram00.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram07.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram10.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram10.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram10.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram14.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram14.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram14.svg")}),
  new Icon({imgSize: [40, 40], img: loadImage("/assets/icons/vehicle/tram14.svg")}),
];

export class TramVehicle implements Vehicle<Point> {

  public readonly feature: Feature<Point>;
  private readonly style: Style;
  private changed = false;

  constructor(public readonly id: string, line: string, description: string | undefined, private coordinate: Coordinate,delay:number,private last0: number) {
    this.feature = new Feature({
      id,
      geometry: new Point(this.coordinate),
    });

    this.style = new Style({
      image: IMGS[7],
      text: new Text({
        offsetY: -4,
        text: `${line}`,
        font: 'DM Sans',
        fill: new Fill({color: "#000"}),
      }),
    });

    this.changeDelay(delay);
    this.feature.setStyle(this.style);
  }

  get last() : number{
    return this.last0;
  }

  public move(coordinate: Coordinate, delay: number, last: number): void {
    this.coordinate = coordinate;
    this.changeDelay(delay);
    this.changed = true;
    this.last0 = last;
  }

  private changeDelay(delay: number):void {
    this.style.setImage(getImage(IMGS, delay, -7*60,7*60));
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
