import { PassiveElement } from './PassiveElement';

export class InputElement extends PassiveElement {
  declare public element: HTMLInputElement;
  public onTextChange: (text: string) => void;

  constructor(public text: string, htmlClass?: string) {
    super('input', htmlClass);
    this.element.innerHTML = text;
    this.element.addEventListener('change', e => console.log(e));
    this.element.oninput = this.onInput;
  }

  public onInput = (e: Event) => {
    let value = this.element.value;

    this.onTextChange && this.onTextChange(value);
  }

  public toText() {
    return this.tabWrapText(this.text);
  }

  public updateText(text: string) {
    this.text = text;
    this.element.value = text;
    this.onElementChange();
  }
}
