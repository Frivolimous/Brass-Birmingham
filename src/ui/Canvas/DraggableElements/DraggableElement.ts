import { Facade } from "../../../index";
import { CanvasPoint, CanvasRender } from "../../../services/CanvasRender";
import { FirebaseObject } from "../../../services/FBComm";

export interface IDraggableElement extends FirebaseObject{
  __id: string;
  lastUpdater: string;
  reserved: boolean;

  x: number;
  y: number;
}

// export interface DraggableElement {
//   x: number;
//   y: number;

//   drawTo: (renderer: CanvasRender) => void;
//   hitTest: (p: CanvasPoint) => boolean;
//   startDrag: () => boolean;
//   endDrag: () => void;
// }

export abstract class DraggableElement {
  private _Disabled = false;

  constructor (protected data: IDraggableElement, protected onUpdate: (data: IDraggableElement, instant: boolean) => void ) {}

  set x(n: number) {
    this.data.x = n;
    this.onUpdate(this.data, false);
  }

  get x() : number {
    return this.data.x;
  }

  set y(n: number) {
    this.data.y = n;
    this.onUpdate(this.data, false);
  }

  get y(): number {
    return this.data.y;
  }

  set disabled(b: boolean) {
    this._Disabled = b;
  }

  get disabled(): boolean {
    return this._Disabled;
  }

  updateData = (data: IDraggableElement) => {
    this.data.x = data.x;
    this.data.y = data.y;
    this.data.reserved = data.reserved;
    this.data.lastUpdater = data.lastUpdater;

    this.disabled = data.reserved && data.lastUpdater !== Facade.firebaseManager.uid;
  }

  startDrag = () => {
    if (!this._Disabled) {
      this.data.reserved = true;
      this.onUpdate(this.data, true);
      return true;
    }

    return false;
  }

  endDrag = () => {
    this.data.reserved = false;
    this.onUpdate(this.data, true);
  }

  drawTo(renderer: CanvasRender) {
    if (this.disabled) {
      renderer.drawHexagon(this.x, this.y, 15, '#999', '#bbb', 1);
    } else {
      renderer.drawHexagon(this.x, this.y, 15, '#000', '#fff', 1);
    }
  }

  hitTest(p: CanvasPoint) {
    var dX = p.x - this.x;
    var dY = p.y - this.y;

    return Math.sqrt(dX * dX + dY * dY) <= 15;
  }

  distanceTo(p: CanvasPoint) {
    var dX = p.x - this.x;
    var dY = p.y - this.y;

    return Math.sqrt(dX * dX + dY * dY);
  }
}