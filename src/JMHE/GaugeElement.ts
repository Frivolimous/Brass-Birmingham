import { PassiveElement } from './PassiveElement';

export class GaugeElement extends PassiveElement {
  private _Percent: number = 0;
  private myObject: any;
  private myFunc: () => number;

  private objectProperty: string;
  private maxWidth = 75;

  constructor() {
    super('div', 'thin-gauge');

  }

  public set percent(n: number) {
    this._Percent = n;
    this.element.style.width = `${this.maxWidth * n}px`;
  }

  public get percent() { return this._Percent; }

  public registerValue(object: any, property: string) {
    this.myObject = object;
    this.objectProperty = property;
  }

  public registerFunction(func: () => number) {
    this.myFunc = func;
  }

  public update = () => {
    if (this.myObject) {
      let value = this.myObject[this.objectProperty];
      this.percent = value;
    } else if (this.myFunc) {
      let value = this.myFunc();
      this.percent = value;
    }
  }
}
