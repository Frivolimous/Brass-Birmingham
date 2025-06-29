import { PassiveElement } from './PassiveElement';

export class DividerElement extends PassiveElement {
  declare public element: HTMLHRElement;
  constructor(className: string = 'basic-hr') {
    super('hr', className);
  }
}
