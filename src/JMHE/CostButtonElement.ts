import { PassiveElement } from './PassiveElement';

export class CostButtonElement extends PassiveElement {
  public disableCondition: () => boolean;

  private _Count = 0;
  private myObject: any;
  private objectProperty: string;
  private myFunc: () => number;

  constructor(public label: string, htmlClass: string, public onClick: () => void) {
    super('button', htmlClass);
    this.updateIH();
    this.element.onclick = onClick;
  }

  set count(count: number) {
    this._Count = count;
    this.updateIH();
    this.onElementChange();
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

  public toText() {
    return this.tabWrapText(`${this._Count} ${this.label}`);
  }

  public updateListener(onClick: () => void) {
    this.onClick = onClick;
    this.element.onclick = onClick;
  }

  public updateLabel(label: string) {
    this.label = label;
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

    if (this.disableCondition && this.disableCondition()) {
      // console.log("T");
      (this.element as HTMLButtonElement).disabled = true;
    } else if (this.disableCondition) {
      // console.log("F");
      (this.element as HTMLButtonElement).disabled = false;
    }
  }

  private updateIH() {
    this.element.innerHTML = `${this._Count} ${this.label}`;
  }
}
