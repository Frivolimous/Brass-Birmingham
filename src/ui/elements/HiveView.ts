import * as _ from 'lodash';
import { ResearchSlug } from '../../data/ResearchData';
import { FeatureType } from '../../data/SkillData';
import { GameHive } from '../../engine/GameHive';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CostButtonElement } from '../../JMHE/CostButtonElement';
import { CountElement } from '../../JMHE/CountElement';
import { GaugeElement } from '../../JMHE/GaugeElement';
import { InputElement } from '../../JMHE/InputElement';
import { TextElement } from '../../JMHE/TextElement';
import { Formula } from '../../services/Formula';
import { BeeLineElement } from './BeeLineElement';
import { BeeTypeView } from './BeeTypeView';
import { BuildView } from './BuildView';
import { ResearchView } from './ResearchView';

export class HiveView extends ContainerElement {
  public middlePart: BeeTypeView;
  public buildView: BuildView;
  public researchView: ResearchView;
  public beeLine: BeeLineElement;

  private leftPart: ContainerElement = new ContainerElement();
  private rightPart: ContainerElement = new ContainerElement();
  private topHalf: ContainerElement = new ContainerElement('div', 'hive-row');
  private bottomHalf: ContainerElement = new ContainerElement('div', 'hive-row');
  private nameElement: InputElement = new InputElement('Name', 'input-title');
  private beeCount: CountElement = new CountElement('Bees', 0);
  private beeCapacity: CountElement = new CountElement('Bee Capacity', 0);
  private honeyCount: CountElement = new CountElement('Honey', 0);
  private honeyRate: CountElement = new CountElement('Gathering Speed', 0);
  private honeyCapacity: CountElement = new CountElement('Honey Capacity', 0);
  private addBeeRow: ContainerElement = new ContainerElement('div', 'horizontal-stack');
  private addBeeText: TextElement = new TextElement('Add 1 Bee:');
  private addBeeButton: CostButtonElement;
  private addBeeTimer: GaugeElement = new GaugeElement();

  constructor(public hive: GameHive, research: {[key in ResearchSlug]?: number}) {
    super('div', 'hive-object');
    // console.log(hive);
    this.middlePart = new BeeTypeView(hive);
    this.buildView = new BuildView(hive);
    this.researchView = new ResearchView(hive, research);
    this.nameElement.updateText(hive.data.hiveName);
    this.nameElement.onTextChange = t => hive.data.hiveName = t;
    this.beeCount.count = hive.data.beeCount;
    this.beeCount.numberType = 'remainder-percent';
    this.beeCapacity.count = hive.beeCapacity;
    this.honeyCount.count = hive.data.honey;
    this.honeyRate.count = hive.cachedGatheringSpeed;
    this.addBeeButton = new CostButtonElement(`Honey`, 'cost-button', this.hive.tryBuyBee);
    this.addBeeButton.count = Formula.getBeeCostForHive(hive);
    this.beeLine = new BeeLineElement(this.hive.harvesters);

    this.beeCount.registerValue(hive.data, 'beeCount');
    this.beeCapacity.registerValue(hive, 'beeCapacity');
    this.honeyCount.registerValue(hive.data, 'honey');
    this.honeyCapacity.registerValue(hive, 'honeyCapacity');
    this.honeyCapacity.element.hidden = true;
    this.honeyRate.registerValue(hive, 'cachedGatheringSpeed');
    this.addBeeButton.registerFunction(this.getBeeCost);
    this.addBeeButton.disableCondition = () => !hive.canBuyBee();

    this.addBeeRow.addChildren(this.addBeeText, this.addBeeButton);
    this.addBeeRow.addChild(this.addBeeTimer);
    this.addBeeTimer.registerValue(hive, 'breedTime');

    this.addChildren(this.topHalf, this.bottomHalf);
    this.topHalf.addChildren(this.leftPart, this.middlePart, this.rightPart);
    this.bottomHalf.addChildren(this.buildView, this.researchView);

    this.leftPart.addChildren(this.nameElement, this.beeCount, this.beeCapacity, this.addBeeRow);
    this.rightPart.addChildren(this.honeyCount, this.beeLine, this.honeyCapacity, this.honeyRate);

    this.beeLine.fillParent();

    this.middlePart.refreshBeeTypes();
    this.buildView.refreshBuildings();
    this.buildView.element.hidden = true;
    this.researchView.element.hidden = true;
  }

  public get canBuyBee(): boolean {
    return false;
  }

  public getBeeCost = () => {
    return Formula.getBeeCostForHive(this.hive);
  }

  public unlockFeatures(features: FeatureType[]) {
    features.forEach(this.unlockFeature);
  }

  public unlockFeature = (feature: FeatureType) => {
    switch (feature) {
      case 'show-buildings': this.buildView.element.hidden = false; break;
      case 'show-thoughts': this.researchView.element.hidden = false; break;
      case 'show-honey-cap': this.honeyCapacity.element.hidden = false; break;
    }
  }
}
