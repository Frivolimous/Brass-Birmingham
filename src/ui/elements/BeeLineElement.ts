import { IHarvester } from '../../engine/GameHive';
import { PassiveElement } from '../../JMHE/PassiveElement';

export class BeeLineElement extends PassiveElement {
  declare public element: HTMLCanvasElement;
  public bees: IBeeView[] = [];

  private hiveElement: HTMLImageElement;
  private flowerElement: HTMLImageElement;
  private graphic: CanvasRenderingContext2D;

  constructor(private harvesters: IHarvester[]) {
    super('canvas', 'bee-line');
    this.graphic = this.element.getContext('2d');
    // let parent = this.element.parentElement;

    // let width = parent.offsetWidth;
    // let height = parent.offsetHeight;
    // console.log(width, height);
    this.element.width = 200;
    this.element.height = 20;

    for (let i = 0; i < harvesters.length; i++) {
      this.bees.push(this.newBee(i * this.element.height / 100, harvesters[i]));
    }
    // console.log(width, height);

    // this.drawBee(10, 10, 2);
    // this.drawBee(30, 10, 2);
    // this.drawBee(40, 30, 2);
    // this.drawBee(60, 5, 2);
    // // this.drawBee()

    this.hiveElement = document.getElementById('beehive-image') as HTMLImageElement;
    this.flowerElement = document.getElementById('flower-image') as HTMLImageElement;
  }

  public fillParent() {
    let parent = this.element.parentElement;

    let width = parent.offsetWidth;
    let height = parent.offsetHeight;
    console.log(width, height, this.element, parent);
  }

  public clear() {
    this.graphic.clearRect(0, 0, this.element.width, this.element.height);
  }

  public drawBee(x: number, y: number, size: number, exploring: boolean) {
    this.graphic.beginPath();
    this.graphic.arc(x, y, size, 0, 2 * Math.PI);
    if (exploring) {
      this.graphic.fillStyle = '#00ff00';
    } else {
      this.graphic.fillStyle = '#ffff00';
    }
    this.graphic.fill();
  }

  public update = () => {
    while (this.bees.length > this.harvesters.length) {
      this.bees.pop();
    }

    while (this.bees.length < this.harvesters.length) {
      this.bees.push(this.newBee(Math.random() * this.element.height, this.harvesters[this.bees.length]));
    }

    this.clear();

    this.graphic.drawImage(this.hiveElement, 0, 0, 20, 20);
    this.graphic.drawImage(this.flowerElement, this.element.width - 20, 0, 20, 20);

    this.bees.forEach(bee => {
      switch (bee.source.phase) {
        case 0: bee.x = 10 + (this.element.width - 20) * bee.source.percent; break;
        case 1: bee.x = this.element.width - 8 - Math.random() * 4; break;
        case 2: bee.x = 10 + (this.element.width - 20) * (1 - bee.source.percent); break;
        case 3: bee.x = 5 + Math.random() * 10; break;
      }

      bee.y += 0.1 * bee.speed * bee.directionY;
      if (bee.y > bee.trueY + 3) {
        bee.y = bee.trueY + 3;
        bee.directionY = -1;
      } else if (bee.y < bee.trueY - 3) {
        bee.y = bee.trueY - 3;
        bee.directionY = 1;
      }

      if (bee.source.exploring) {
        bee.x += bee.y - bee.trueY;
      }
      this.drawBee(bee.x, bee.y, 1, bee.source.exploring);
    });

  }

  public newBee(y: number, source: IHarvester) {
    let bee: IBeeView = {
      x: 0,
      y,
      directionY: Math.random() < 0.5 ? 1 : -1,
      speed: 1 + Math.random(),
      trueY: y,
      source,
    };

    // bee.x = source.phase === 0 ? 0 : source.phase === 2 ? this.element.width : source.phase === 1 ? this.element.width * source.percent : this.element.width * (1 - source.percent);

    return bee;
  }
}

interface IBeeView {
  x: number;
  y: number;
  directionY: number;
  speed: number;
  trueY: number;
  source: IHarvester;
}
