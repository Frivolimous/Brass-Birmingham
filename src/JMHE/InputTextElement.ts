import { PassiveElement } from './PassiveElement';

export class TextElement extends PassiveElement {

  constructor(public text: string, htmlClass?: string) {
    super('input', htmlClass);
  }

}
