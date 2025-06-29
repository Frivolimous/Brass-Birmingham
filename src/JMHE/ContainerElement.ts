import * as _ from 'lodash';
import { ElementType, PassiveElement } from './PassiveElement';

export class ContainerElement extends PassiveElement {
  public children: PassiveElement[] = [];

  constructor(elementType: ElementType = 'div', htmlClass?: string) {
    super(elementType, htmlClass);
  }

  public addChild(child: PassiveElement) {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    this.children.push(child);
    child.onChange = this.onElementChange;
    child.parent = this;

    this.onChange && this.onChange();
    this.element.appendChild(child.element);
  }

  public addChildBefore(child: PassiveElement, anchor: PassiveElement) {
    if (this.children.includes(anchor)) {
      if (child.parent) {
        child.parent.removeChild(child);
      }

      let index = this.children.indexOf(anchor);
      this.children.splice(index - 1, 0, child);
      child.parent = this;

      this.element.insertBefore(child.element, anchor.element);

      this.onChange && this.onChange();
    } else {
      this.addChild(child);
    }
  }

  public removeChild(child: PassiveElement) {
    if (child.parent === this) {
      _.pull(this.children, child);
      child.onChange = null;
      child.parent = null;
    }

    this.onChange && this.onChange();
    this.element.removeChild(child.element);
  }

  public addChildren(...children: PassiveElement[]) {
    children.forEach(child => {
      if (child.parent) {
        child.parent.removeChild(child);
      }

      this.children.push(child);
      child.onChange = this.onElementChange;
      child.parent = this;
      this.element.appendChild(child.element);
    });

    this.onChange && this.onChange();
  }

  public removeAllChildren() {
    while (this.children.length > 0) {
      let child = this.children.shift();
      child.onChange = null;
      child.parent = null;
      this.element.removeChild(child.element);
    }

    this.onChange && this.onChange();
  }

  public toText() {
    let inner = ``;
    this.children.forEach(el => inner += el.toText());

    return this.tabWrapText(inner);
  }

  public update = () => {
    this.children.forEach(child => child.update());
  }
}
