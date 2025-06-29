import * as _ from 'lodash';
import { BuildingType } from '../../data/SkillData';
import { GameHive } from '../../engine/GameHive';
import { ButtonElement } from '../../JMHE/ButtonElement';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { CountElement } from '../../JMHE/CountElement';
import { InfoElement } from '../../JMHE/InfoElement';
import { DataFetcher } from '../../services/DataFetcher';

export class BuildView extends ContainerElement {
  // public onBuildingSelected: JMEventListener<{type: BuildingType}> = new JMEventListener();

  public selectedRow: {property: BuildingType, count: CountElement, buttonSelect: ButtonElement};
  private rows: {property: BuildingType, count: CountElement, buttonSelect: ButtonElement}[] = [];

  constructor(private hive: GameHive) {
    super('div', 'building-section');
  }

  public makeBuildLine(label: string, property: BuildingType) {
    let row = new ContainerElement('div', 'horizontal-stack');

    let count = new CountElement(_.upperFirst(label), this.hive.data.buildings[property]);
    count.numberType = 'remainder-percent';
    count.registerValue(this.hive.data.buildings, property);

    let buttonSelect = new ButtonElement('Build', 'build-button', () => this.selectBuilding(property));
    let tooltip = new InfoElement('Sample Tooltip');
    tooltip.registerFunction(() => this.getBuildingTooltip(property));
    row.addChild(tooltip);

    row.addChildren(count, buttonSelect);
    this.addChild(row);

    this.rows.push({property, count, buttonSelect});
  }

  public getBuildingTooltip(id: BuildingType) {
    let building = DataFetcher.getBuildingStats(id, this.hive.data.buildings[id]);

    return `${building.id} Level ${building.level}<br>Size: ${building.size}, Cost: ${Math.round(building.cost)} honey<br>${building.effects[0].key}: ${building.effects[0].value >= 0 ? '+' : ''}${building.effects[0].value}`;
  }

  public selectBuilding(property: BuildingType) {
    this.rows.forEach(row => {
      if (row.property === property) {
        row.buttonSelect.element.disabled = true;
        row.buttonSelect.updateLabel('Building...');
      } else {
        row.buttonSelect.element.disabled = false;
        row.buttonSelect.updateLabel('Build');
      }

      if (row.property === property) this.selectedRow = row;
    });

    this.hive.data.buildingSelected = property;

    // this.onBuildingSelected.publish({type: property});
  }

  public refreshBuildings() {
    this.removeAllChildren();

    let buildingCount = new CountElement('Buildings', 0);
    buildingCount.registerValue(this.hive, 'buildingCount');
    buildingCount.registerDivisor(this.hive, 'buildingCapacity');
    buildingCount.numberType = 'out-of';
    this.addChild(buildingCount);
    let buildingSpeed = new CountElement('Build Speed', 0);
    buildingSpeed.registerValue(this.hive, 'trueBuildSpeed');
    this.addChild(buildingSpeed);

    this.rows = [];

    this.hive.buildingTypes.forEach(type => this.makeBuildLine(type, type));
    this.selectBuilding(this.hive.data.buildingSelected);
  }
}
