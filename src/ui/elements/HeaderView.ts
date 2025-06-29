import { IExtrinsicModel } from '../../data/SaveData';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CountElement } from '../../JMHE/CountElement';
import { TextElement } from '../../JMHE/TextElement';

export class HeaderView extends ContainerElement {
  public thoughtCount: CountElement = new CountElement('Thoughts', 0, 'header-item');
  private queenCount: CountElement = new CountElement('Queens', 0, 'header-item');
  private gameTime: CountElement = new CountElement('Time', 0, 'header-item');
  private pageTitle: TextElement = new TextElement('Bee Simulator', 'main-title');

  constructor(headerElement: HTMLDivElement) {
    super('div', 'main-header');

    headerElement.appendChild(this.element);

    this.gameTime.numberType = 'time';
    this.thoughtCount.numberType = 'integer';

    this.addChild(this.pageTitle);
    this.addChildren(this.gameTime, this.thoughtCount, this.queenCount);
    this.thoughtCount.element.hidden = true;
  }

  public loadExtrinsic(extrinsic: IExtrinsicModel) {
    this.gameTime.registerValue(extrinsic, 'playTime');
    this.queenCount.registerValue(extrinsic.currency, 'queens');
    this.thoughtCount.registerValue(extrinsic.currency, 'thoughts');
  }
}
