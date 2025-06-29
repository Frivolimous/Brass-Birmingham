import * as _ from 'lodash';
import { ResearchSlug } from '../../data/ResearchData';
import { GameHive } from '../../engine/GameHive';
import { ButtonElement } from '../../JMHE/ButtonElement';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CountElement } from '../../JMHE/CountElement';
import { DividerElement } from '../../JMHE/DividerElement';
import { InfoElement } from '../../JMHE/InfoElement';
import { DataFetcher } from '../../services/DataFetcher';

export class ResearchView extends ContainerElement {
  // public onResearchSelected: JMEventListener<{type: ResearchSlug}> = new JMEventListener();

  public selectedRow: {property: ResearchSlug, count: CountElement, buttonSelect: ButtonElement};
  private rows: {property: ResearchSlug, count: CountElement, buttonSelect: ButtonElement}[] = [];

  constructor(private hive: GameHive, private researchLevels: {[key in ResearchSlug]?: number}) {
    super('div', 'building-section');

    this.refreshResearch();
  }

  public makeResearchLine(label: string, property: ResearchSlug) {
    if (this.researchLevels[property] >= 1) return;
    let row = new ContainerElement('div', 'horizontal-stack');

    if (property) {
      let data = DataFetcher.getResearchStats(property);

      let count = new CountElement(data.label, this.researchLevels[property]);
      count.numberType = 'percent';
      count.registerValue(this.researchLevels, property);

      let buttonSelect = new ButtonElement('Think', 'build-button', () => this.selectResearch(property));
      let tooltip = new InfoElement('Sample Tooltip');
      tooltip.registerFunction(() => this.getResearchTooltip(property));
      row.addChild(tooltip);

      row.addChildren(count, buttonSelect);
      this.addChild(row);

      this.rows.push({property, count, buttonSelect});
    } else {
      let count = new CountElement(_.upperFirst(label), null);
      count.numberType = 'none';
      count.count = 0;

      let buttonSelect = new ButtonElement('Think', 'build-button', () => this.selectResearch(property));
      let tooltip = new InfoElement('Sample Tooltip');
      tooltip.registerFunction(() => this.getResearchTooltip(property));
      row.addChild(tooltip);

      row.addChildren(count, buttonSelect);
      this.addChild(row);

      this.rows.push({property, count, buttonSelect});

    }
  }

  public getResearchTooltip(id: ResearchSlug) {
    if (id) {
      let research = DataFetcher.getResearchStats(id, this.researchLevels[id]);

      return research.desc;
    } else {
      return 'Generate Thoughts. these are needed to come up with ideas.';
    }

    // return `${building.id} Level ${building.level}<br>Size: ${building.size}, Cost: ${Math.round(building.cost)} honey<br>${building.effects[0].key}: ${building.effects[0].value >= 0 ? '+' : ''}${building.effects[0].value}`;
  }

  public selectResearch(property: ResearchSlug) {
    console.log(property, this.rows);
    console.log(!this.rows[0].property, !!property);
    this.rows.forEach(row => {
      if (row.property === property || (!row.property && !property)) {
        row.buttonSelect.element.disabled = true;
        row.buttonSelect.updateLabel('Thinking...');
        this.selectedRow = row;
      } else {
        row.buttonSelect.element.disabled = false;
        row.buttonSelect.updateLabel('Think');
      }
    });

    this.hive.data.researchSelected = property;

    // this.onResearchSelected.publish({type: property});
  }

  public refreshResearch(researchLevels?: {[key in ResearchSlug]?: number}) {
    this.researchLevels = researchLevels || this.researchLevels;

    this.removeAllChildren();
    this.rows = [];

    this.makeResearchLine('Think Thoughts', null);
    this.addChild(new DividerElement('faded-hr'));

    Object.keys(this.researchLevels).forEach((key: ResearchSlug) => {
      this.makeResearchLine(key, key);
    });

    this.selectResearch(this.hive.data.researchSelected);
  }
}
