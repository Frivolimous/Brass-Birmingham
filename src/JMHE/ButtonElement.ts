import { PassiveElement } from './PassiveElement';

export class ButtonElement extends PassiveElement {
  declare public element: HTMLButtonElement;

  constructor(public label: string, htmlClass: string, public onClick: () => void) {
    super('button', htmlClass);
    this.element.innerHTML = label;
    this.element.onclick = onClick;
  }

  public toText() {
    return this.tabWrapText(this.label);
  }

  public updateListener(onClick: () => void) {
    this.onClick = onClick;
    this.element.onclick = onClick;
  }

  public updateLabel(label: string) {
    this.label = label;
    this.element.innerHTML = this.label;
    this.onElementChange();
  }
}
