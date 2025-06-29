import { PassiveElement } from './PassiveElement';

export class CountElement extends PassiveElement {
  public numberType: 'basic' | 'out-of' | 'percent' | 'remainder-percent' | 'time' | 'none' | 'integer' = 'basic';

  private myObject: any;
  private objectProperty: string;
  private divisorObject: any;
  private divisorProperty: string;
  private myFunc: () => number;
  private divisor = 0;

  constructor(public text: string, private _Count: number, htmlClass?: string) {
    super('div', htmlClass);
    this.updateIH();
  }

  set count(count: number) {
    this._Count = count;
    this.updateIH();
    this.onChange && this.onChange();
  }

  get count() {
    return this._Count;
  }

  public registerValue(object: any, property: string) {
    this.myObject = object;
    this.objectProperty = property;
  }

  public registerFunction(func: () => number) {
    this.myFunc = func;
  }

  public registerDivisor(object: any, property: string) {
    this.divisorObject = object;
    this.divisorProperty = property;
  }

  public toText() {
    return this.tabWrapText(`${this.text}: ${this.count}`);
  }

  public updateText(text: string) {
    this.text = text;
    this.updateIH();
    this.onElementChange();
  }

  public setDivisor(divisor: number) {
    this.divisor = divisor;
    this.updateIH();
    this.onElementChange();
  }

  public update = () => {
    if (this.myObject) {
      let value = this.myObject[this.objectProperty];
      this.count = value;
    } else if (this.myFunc) {
      let value = this.myFunc();
      this.count = value;
    }
    if (this.divisorObject) {
      let value = this.divisorObject[this.divisorProperty];
      this.divisor = value;
    }
  }

  private updateIH() {
    switch (this.numberType) {
      case 'basic':
        // this.element.innerHTML = `${this.text}: ${(Math.round(this._Count * 100) / 100)}`;
        this.element.innerHTML = `${this.text}: ${(Math.round(this._Count * 100) / 100).toLocaleString()}`;
        // let str: string;
        // let num = 10000;
        // str = num.toLocaleString(null, {notation: 'scientific'});
        break;
      case 'out-of':
        this.element.innerHTML = `${this.text}: ${Math.floor(this._Count)} / ${this.divisor}`;
        break;
      case 'percent':
        this.element.innerHTML = `${this.text}: ${Math.round(this._Count * 100)}%`;
        break;
      case 'remainder-percent':
        let rounded = Math.floor(this._Count);
        let remainder = this._Count - rounded;
        this.element.innerHTML = `${this.text}: ${rounded} ${remainder > 0 ? `(${Math.round(remainder * 100)}%)` : ``}`;
        break;
      case 'time':
        let s = Math.floor(this._Count / 60);
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        s -= m * 60;
        m -= h * 60;
        this.element.innerHTML = `${this.text}: ${(h < 10 ? '0' : '') + h}:${(m < 10 ? '0' : '') + m}:${(s < 10 ? '0' : '') + s}`;
        break;
      case 'none':
        this.element.innerHTML = `${this.text}`;
        break;
      case 'integer':
        this.element.innerHTML = `${this.text}: ${Math.floor(this._Count)}`;

    }
  }
}
