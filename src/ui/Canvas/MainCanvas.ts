import { Facade } from '../../index';
import { PassiveElement } from '../../JMHE/PassiveElement';
import {CanvasPoint, CanvasRender} from '../../services/CanvasRender';
import { DraggableElement } from './DraggableElements/DraggableElement';
import { DraggableImage, IDraggableImage } from './DraggableElements/DraggableImage';
import { DraggableToken, IDraggableToken } from './DraggableElements/DraggableToken';

export class MainCanvas extends PassiveElement {
  declare public element: HTMLCanvasElement;

  private backgroundElement: HTMLImageElement;

  private backgroundRect = {x: 0, y: 0, width: 1200, height: 1200};
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
    // this.renderer.onPointerUpAnywhere = this.onUp;

    this.backgroundElement = document.getElementById('beehive-image') as HTMLImageElement;

    Facade.firebaseManager.dbFetchObjects('BirminghamTokens').then((tokens: IDraggableToken[]) => {
      if (tokens.length === 0) {
        console.log("EMPTY");
      } else {
        console.log("FOUND");
        tokens.forEach(tokenData => {
          let data = tokenData;
          let obj = new DraggableToken(tokenData as IDraggableToken, (data, instant) => {
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

    Facade.firebaseManager.dbFetchObjects('BirminghamImages').then((tokens: IDraggableImage[]) => {
      if (tokens.length === 0) {
        console.log("EMPTY");
      } else {
        console.log("FOUND");
        tokens.forEach(tokenData => {
          let data = tokenData;
          let obj = new DraggableImage(tokenData, (data, instant) => {
            if (instant) {
              Facade.firebaseManager.updateObjectInstant(data, 'BirminghamImages');
            } else {
              Facade.firebaseManager.updateObject(data, 'BirminghamImages');
            }
          });
          this.tokens.push(obj);
          Facade.firebaseManager.dbRegisterObject(data, 'BirminghamImages', obj.updateData);

          // obj.x = Math.min(this.backgroundRect.width, Math.max(0, obj.x));
          // obj.y = Math.min(this.backgroundRect.height, Math.max(0, obj.y));
        });
        console.log("LOADED", tokens);
      }
    });

    (window as any).LoadImage = this.loadImage;
  }

  public loadImage = (url: string, width = 100, height = 100) => {
    console.log(url);

    var data: IDraggableImage = {
      __id: '',
      lastUpdater: '',
      reserved: false,
      x: 100,
      y: 100,
      width,
      height,
      src: url,
    }

    Facade.firebaseManager.addObject(data, 'BirminghamImages');

    let obj = new DraggableImage(data, (data, instant) => {
      if (instant) {
        Facade.firebaseManager.updateObjectInstant(data, 'BirminghamImages');
      } else {
        Facade.firebaseManager.updateObject(data, 'BirminghamImages');
      }
    });
    this.tokens.push(obj);
    Facade.firebaseManager.dbRegisterObject(data, 'BirminghamImages', obj.updateData);
  }

  public fillParent() {
    let parent = this.element.parentElement;

    let width = parent.offsetWidth;
    let height = parent.offsetHeight;
    console.log(width, height, this.element, parent);
  }

  public update = () => {
    this.renderer.clear();
    this.renderer.drawBackgroundImage(this.backgroundElement, this.backgroundRect.width, this.backgroundRect.height);

    this.tokens.forEach(token => token.drawTo(this.renderer));
  }

  onDown = (e: CanvasPoint) => {
    var candidate: DraggableElement;
    var candidateI: number;
    var maxDistance = 100;
    var currentDistance = Infinity;

    for (var i = this.tokens.length - 1; i >= 0; i--) {
      let distance = this.tokens[i].distanceTo(e);
      if (distance < maxDistance && !this.tokens[i].disabled && (candidate === null || distance < currentDistance)) {
        candidate = this.tokens[i];
        currentDistance = distance;
        candidateI = i;
      }
      // if (this.tokens[i].hitTest(e)) {
      //   if (this.tokens[i].startDrag()) {
      //     this.dragging = this.tokens[i];
      //     this.tokens.splice(i, 1);
      //     this.tokens.push(this.dragging);
      //   }
      //   return;
      // }
    }

    if (candidate && candidate.startDrag()) {
      this.dragging = candidate;
      this.tokens.splice(candidateI, 1);
      this.tokens.push(this.dragging);
    }
  }
  
  onUp = (e: CanvasPoint) => {
    this.dragging && this.dragging.endDrag();
    this.dragging = null;
  }
  
  onMove = (e: CanvasPoint) => {
    if (this.dragging) {
      this.dragging.x = Math.min(this.backgroundRect.width, Math.max(0, e.x));
      this.dragging.y = Math.min(this.backgroundRect.height, Math.max(0, e.y));
    }
  }
}
