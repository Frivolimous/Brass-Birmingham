import * as _ from 'lodash';
import { BeeType } from '../../data/SaveData';
import { GameHive } from '../../engine/GameHive';
import { ButtonElement } from '../../JMHE/ButtonElement';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CountElement } from '../../JMHE/CountElement';

export class BeeTypeView extends ContainerElement {
  private rows: {property: BeeType, count: CountElement, buttonLeft: ButtonElement, buttonRight: ButtonElement}[] = [];

  constructor(private hive: GameHive) {
    super();
  }

  public makeBeeLine = (label: string, property: BeeType) => {
    let row = new ContainerElement('div', 'horizontal-stack');
    let count = new CountElement(_.upperFirst(label), this.hive.data.beeTypes[property]);

    count.registerValue(this.hive.data.beeTypes, property);

    let buttonLeft = new ButtonElement('-', 'small-cost-button', () => this.addType(property, -1));
    let buttonRight = new ButtonElement('+', 'small-cost-button', () => this.addType(property, 1));

    row.addChild(count);

    if (property !== 'harvester') row.addChildren(buttonLeft, buttonRight);
    this.addChild(row);

    this.rows.push({property, count, buttonLeft, buttonRight});
  }

  public addType = (prop: BeeType, amount = 1) => {
    if (amount < 0) {
      if (this.hive.data.beeTypes[prop] > 0) {
        this.hive.data.beeTypes[prop] += amount;
        this.hive.data.beeTypes.harvester -= amount;
      }
    } else if (amount > 0) {
      let harvesters = this.hive.data.beeTypes.harvester;
      if (harvesters >= amount) {
        this.hive.data.beeTypes.harvester -= amount;
        this.hive.data.beeTypes[prop] += amount;
      }
    }

  }

  public refreshBeeTypes() {
    this.removeAllChildren();
    this.rows = [];
    Object.keys(this.hive.data.beeTypes).forEach((key: BeeType) => this.makeBeeLine(key, key));
  }

  public update = () => {
    // super.update();
    this.children.forEach(child => child.update());

    this.rows.forEach(row => {
      if (row.property === 'harvester') return;

      let count = this.hive.data.beeTypes[row.property];
      row.buttonLeft.element.disabled = (count === 0);
      row.buttonRight.element.disabled = (this.hive.data.beeTypes.harvester === 0);
    });
  }
}
