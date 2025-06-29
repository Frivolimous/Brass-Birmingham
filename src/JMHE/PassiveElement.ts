import * as _ from 'lodash';
import { ContainerElement } from './ContainerElement';

export class PassiveElement {
  private static AID = 0;

  public aID: number;
  public onChange: () => void;
  public htmlId: string;
  public parent: ContainerElement;
  public style: string;
  public element: HTMLElement;

  constructor(public elementType: ElementType, public htmlClass?: string) {
    this.aID = (PassiveElement.AID++);
    this.element = document.createElement(elementType);
    this.element.id = `JMHE${this.aID}`;

    if (htmlClass) {
      this.element.classList.add(htmlClass);
    }
  }

  public toText() {
    return this.tabWrapText('');
  }

  public setStyle(style: string) {
    this.style = style;
    this.onElementChange();
  }

  public tabWrapText(text: string) {
    let preTag = `<${this.elementType} id="JMHE${this.aID}" ${this.htmlClass ? `class="${this.htmlClass}"` : ''} ${(this.style && this.style.length > 0) ? `style="${this.style}"` : ''}>`;

    return preTag + text + `</${this.elementType}>`;
  }

  public getMyElement() {
    return document.getElementById(`JMHE${this.aID}`);
  }

  public onElementChange = () => {
    this.onChange && this.onChange();
  }

  public update = () => {};
}

export type ElementType = keyof HTMLElementTagNameMap;
