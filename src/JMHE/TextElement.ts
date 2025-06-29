import { PassiveElement } from './PassiveElement';

export class TextElement extends PassiveElement {
  constructor(public text: string, htmlClass?: string) {
    super('div', htmlClass);
    this.element.innerHTML = text;
  }

  public toText() {
    return this.tabWrapText(this.text);
  }

  public updateText(text: string) {
    this.text = text;
    this.element.innerHTML = text;
    this.onElementChange();
  }
}
