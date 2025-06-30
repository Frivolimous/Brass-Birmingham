import { Facade } from "../../../index";
import { CanvasPoint, CanvasRender } from "../../../services/CanvasRender";
import { FirebaseObject } from "../../../services/FBComm";
import { DraggableElement, IDraggableElement } from "./DraggableElement";

export interface IDraggableImage extends IDraggableElement {
  width: number;
  height: number;
  src: string;
}

export class DraggableImage extends DraggableElement {
  private image: HTMLImageElement;
  declare protected data: IDraggableImage;

    constructor (data: IDraggableImage, onUpdate: (data: IDraggableImage, instant: boolean) => void ) {
      super(data, onUpdate);
      this.image = new Image(data.width, data.height);
      this.image.src = data.src;
    }

  updateData = (data: IDraggableImage) => {
    this.data.x = data.x;
    this.data.y = data.y;
    this.data.width = data.width;
    this.data.height = data.height;
    this.data.src = data.src;
    this.data.reserved = data.reserved;
    this.data.lastUpdater = data.lastUpdater;

    this.image = new Image(data.width, data.height);
    this.image.src = data.src;

    this.disabled = data.reserved && data.lastUpdater !== Facade.firebaseManager.uid;
  }

  drawTo(renderer: CanvasRender) {
    if (this.disabled) {
      renderer.Graphic.globalAlpha = 0.5;
    }

    renderer.Graphic.drawImage(this.image, this.data.x - this.data.width / 2, this.data.y - this.data.height / 2, this.data.width, this.data.height);
    renderer.Graphic.globalAlpha = 1;
  }

  hitTest(p: CanvasPoint) {
    return (p.x > this.x - this.data.width / 2 && p.x < this.x + this.data.width / 2 && p.y > this.y - this.data.height / 2 && p.y < this.y + this.data.height / 2);
  }
}