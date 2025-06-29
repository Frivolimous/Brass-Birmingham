import { FeatureType } from '../../data/SkillData';
import { GameArea } from '../../engine/GameArea';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CountElement } from '../../JMHE/CountElement';

export class AreaView extends ContainerElement {
  public flowerCount: CountElement = new CountElement('Total Flowers', 0);
  public flowerCapacity: CountElement = new CountElement('Max Flowers', 0);
  public maxFlowerCapacity: CountElement = new CountElement('Area Size', 0);
  public flowerSeen: CountElement = new CountElement('Scouted Flowers', 0);
  public pollenCount: CountElement = new CountElement('Total Pollen', 0);
  public distanceOffset: CountElement = new CountElement('Flower Distance', 0);
  public flowerRate: CountElement = new CountElement('Flower Rate', 0);
  public pollenDelta: CountElement = new CountElement('Pollen Delta', 0);

  constructor(public area: GameArea) {
    super('div', 'area-object');
    this.flowerCount.registerValue(area.data, 'flowerCount');
    this.flowerCapacity.count = area.data.flowerCapacity;
    this.maxFlowerCapacity.count = area.data.maxFlowerCapacity;
    this.flowerSeen.registerValue(area, 'flowerSeen');
    this.pollenCount.registerValue(area.data, 'pollenCount');
    this.distanceOffset.registerValue(area.data, 'distanceOffset');
    this.flowerRate.registerValue(area.data, 'flowerRate');
    this.pollenDelta.registerValue(area, 'pollenDelta');
    this.element.hidden = true;

    this.addChildren(this.maxFlowerCapacity, this.flowerCapacity, this.flowerCount, this.flowerSeen, this.pollenCount, this.distanceOffset, this.flowerRate);
    this.addChild(this.pollenDelta);
  }

  public unlockFeature(feature: FeatureType) {
    switch (feature) {
      case 'show-area': this.element.hidden = false;
    }
  }
}
