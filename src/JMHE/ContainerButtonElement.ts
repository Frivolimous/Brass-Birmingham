import { ContainerElement } from './ContainerElement';

export class ContainerButtonElement extends ContainerElement {
  constructor(htmlClass: string, public onClick: () => void) {
    super('button', htmlClass);
    this.element.onclick = onClick;
  }

  public updateListener(onClick: () => void) {
    this.onClick = onClick;
    this.element.onclick = onClick;
  }
}
