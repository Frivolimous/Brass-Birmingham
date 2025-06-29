import { Facade } from '../../index';
import { adjustLightness, adjustSaturation, colorLuminance, parseColorToString } from '../../JMGE/others/Colors';
import { PassiveElement } from '../../JMHE/PassiveElement';
import {CanvasPoint, CanvasRender} from '../../services/CanvasRender';
import { FirebaseObject } from '../../services/FBComm';

export class MainCanvas extends PassiveElement {
  declare public element: HTMLCanvasElement;

  private backgroundElement: HTMLImageElement;

  private renderer: CanvasRender;

  public tokens: DraggableElement[] = [];
  private dragging: DraggableElement;

  constructor() {
    super('canvas', 'main-canvas-element');
    this.element.width = 1200;
    this.element.height = 1200;

    this.renderer = new CanvasRender(1200, 1200, this.element);

    this.renderer.onPointerDown = this.onDown;
    this.renderer.onPointerUp = this.onUp;
    this.renderer.onPointerMove = this.onMove;

    this.backgroundElement = document.getElementById('beehive-image') as HTMLImageElement;

    // this.tokens.push(new DraggableToken(15, 680, '#ff0000'));
    // this.tokens.push(new DraggableToken(15, 1115, '#ff0000', true));
    Facade.firebaseManager.dbFetchObjects('BirminghamTokens').then((tokens: DraggableElementData[]) => {
      if (tokens.length === 0) {
        console.log("EMPTY");
      } else {
        console.log("FOUND");
        tokens.forEach(tokenData => {
          let data = tokenData;
          let obj = new DraggableToken(tokenData, (data, instant) => {
            if (instant) {
              Facade.firebaseManager.updateObjectInstant(data, 'BirminghamTokens');
            } else {
              Facade.firebaseManager.updateObject(data, 'BirminghamTokens');
            }
          });
          this.tokens.push(obj);
          Facade.firebaseManager.dbRegisterObject(data, 'BirminghamTokens', obj.updateData);
        });
        console.log("LOADED", tokens);
      }
    });
  }

  public fillParent() {
    let parent = this.element.parentElement;

    let width = parent.offsetWidth;
    let height = parent.offsetHeight;
    console.log(width, height, this.element, parent);
  }

  public update = () => {
    this.renderer.clear();
    this.renderer.drawBackgroundImage(this.backgroundElement, 1200, 1200);

    this.tokens.forEach(token => token.drawTo(this.renderer));
  }

  onDown = (e: CanvasPoint) => {
    for (var i = this.tokens.length - 1; i >= 0; i--) {
      if (this.tokens[i].hitTest(e)) {
        if (this.tokens[i].startDrag()) {
          this.dragging = this.tokens[i];
          this.tokens.splice(i, 1);
          this.tokens.push(this.dragging);
        }
        return;
      }
    }
  }
  
  onUp = (e: CanvasPoint) => {
    this.dragging && this.dragging.endDrag();
    this.dragging = null;
    console.log("UP", e);
  }
  
  onMove = (e: CanvasPoint) => {
    if (this.dragging) {
      this.dragging.x = e.x;
      this.dragging.y = e.y;
    }
  }
}


interface DraggableElement {
  x: number;
  y: number;

  drawTo: (renderer: CanvasRender) => void;
  hitTest: (p: CanvasPoint) => boolean;
  startDrag: () => boolean;
  endDrag: () => void;
}

export class DraggableElementData implements FirebaseObject {
  __id: string;
  lastUpdater: string;
  reserved: boolean;
  x: number;
  y: number;
  hex: boolean;
  color: string;
}

export class DraggableToken implements DraggableElement {
  private radius = 15;
  private _Disabled = false;

  constructor (private data: DraggableElementData, private onUpdate: (data: DraggableElementData, instant: boolean) => void ) {

  }

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

  updateData = (data: DraggableElementData) => {
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