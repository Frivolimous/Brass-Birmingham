import { Facade } from "../../../index";
import { adjustSaturation, parseColorToString } from "../../../JMGE/others/Colors";
import { CanvasPoint, CanvasRender } from "../../../services/CanvasRender";
import { DraggableElement, IDraggableElement } from "./DraggableElement";

export interface IDraggableToken extends IDraggableElement {
  hex: boolean;
  color: string;
}

export class DraggableToken extends DraggableElement {
  private radius = 15;
  declare protected data: IDraggableToken;

  constructor (data: IDraggableToken, onUpdate: (data: IDraggableToken, instant: boolean) => void ) {
    super(data, onUpdate);
  }

  updateData = (data: IDraggableToken) => {
    this.data.x = data.x;
    this.data.y = data.y;
    this.data.reserved = data.reserved;
    this.data.lastUpdater = data.lastUpdater;

    this.disabled = data.reserved && data.lastUpdater !== Facade.firebaseManager.uid;
  }

  drawTo(renderer: CanvasRender) {
    var color = this.disabled ? parseColorToString(adjustSaturation(this.data.color, -50)) : this.data.color;
    var strokeColor = this.disabled ? '#999' : '#000';
    if (this.data.hex) {
      renderer.drawHexagon(this.x, this.y, this.radius, strokeColor, color, 1);
    } else {
      renderer.drawCircle(this.x, this.y, this.radius, strokeColor, color, 1);
    }
  }

  hitTest(p: CanvasPoint) {
    var dX = p.x - this.x;
    var dY = p.y - this.y;

    return Math.sqrt(dX * dX + dY * dY) <= this.radius;
  }
}