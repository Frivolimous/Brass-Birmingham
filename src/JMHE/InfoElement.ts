import { PassiveElement } from './PassiveElement';

export class InfoElement extends PassiveElement {
  private titleElement: HTMLSpanElement;

  private myObject: any;
  private objectProperty: string;
  private myFunc: () => string;

  constructor(text: string) {
    super('div', 'tooltip');
    this.element.innerHTML = '🛈';
    this.addTooltip(text);
  }

  public addTooltip(text: string) {
    this.element.classList.add('tooltip');
    this.titleElement = document.createElement('span');
    this.titleElement.classList.add('tooltiptext');
    this.titleElement.innerHTML = text;
    this.element.appendChild(this.titleElement);
  }

  public registerValue(object: any, property: string) {
    this.myObject = object;
    this.objectProperty = property;
  }

  public registerFunction(func: () => string) {
    this.myFunc = func;
    this.titleElement.innerHTML = func();
  }

  public update = () => {
    if (this.myObject) {
      let value = this.myObject[this.objectProperty];
      this.titleElement.innerHTML = value;
    } else if (this.myFunc) {
      let value = this.myFunc();
      this.titleElement.innerHTML = value;
    }
  }
}
