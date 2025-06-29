import * as _ from 'lodash';
import { ResearchSlug } from '../data/ResearchData';
import { BeeType, IArea, IExtrinsicModel, IHive } from '../data/SaveData';
import { BuildingType, FeatureType, ISkillEffectHive } from '../data/SkillData';
import { JMEventListener } from '../JMGE/events/JMEventListener';
import { GameArea } from './GameArea';
import { GameHive } from './GameHive';

export class GameModel {
  public hives: GameHive[] = [];
  public areas: GameArea[] = [];
  public beeTypes: BeeType[] = ['harvester'];
  public buildings: BuildingType[] = [];
  public featuresUnlocked: FeatureType[] = [];
  public hiveEffects: ISkillEffectHive[] = [];

  public modelEvent: JMEventListener<{type: modelEventType, property: string, value: any}> = new JMEventListener();

  constructor(public data: IExtrinsicModel) {
    console.log(data);
    data.areas.forEach(area => this.areas.push(new GameArea(area)));
    data.hives.forEach(hive => this.hives.push(new GameHive(hive, this.areas.find(area => area.data.id === hive.areaId))));
  }

  public loadExtrinsic(data: IExtrinsicModel) {
    this.data = data;
    console.log(data);
    this.areas = [];
    this.hives = [];
    this.featuresUnlocked = [];
    this.beeTypes = ['harvester'];
    this.buildings = [];

    data.areas.forEach(area => this.areas.push(new GameArea(area)));
    data.hives.forEach(hive => this.hives.push(new GameHive(hive, this.areas.find(area => area.data.id === hive.areaId))));
  }

  public updateExtrinsic(data: IExtrinsicModel) {
    this.data = data;
  }

  public getNextHiveQueenCost() {
    let numHives = this.data.hives.length;

    return numHives + 1;
  }

  public addNewArea(area: IArea) {
    this.data.areas.push(area);
    let m = new GameArea(area);
    m.canAnimal = this.featuresUnlocked.includes('spawn-animals');

    this.areas.push(m);

    this.modelEvent.publish({type: 'area-added', property: 'area', value: area});
  }

  public addNewHive(hive: IHive) {
    this.data.hives.push(hive);
    let area = this.areas.find(el => el.data.id === hive.areaId);
    let m = new GameHive(hive, area);
    area.data.hiveFlowerSeen[hive.id] = 0;
    this.beeTypes.forEach(type => hive.beeTypes[type] = hive.beeTypes[type] || 0);

    this.hives.push(m);
    this.hiveEffects.forEach(effect => m.addHiveStat(effect));

    this.modelEvent.publish({type: 'hive-added', property: 'hive', value: m});

    return m;
  }

  public addBeeType(type: BeeType) {
    if (!this.beeTypes.includes(type)) {
      this.beeTypes.push(type);
      this.hives.forEach(hive => hive.data.beeTypes[type] = hive.data.beeTypes[type] || 0);

      this.modelEvent.publish({type: 'bee-type-added', property: 'type', value: type});
    }
  }

  public addBuilding(type: BuildingType) {
    if (!this.buildings.includes(type)) {
      this.buildings.push(type);
      this.hives.forEach(hive => {
        hive.buildingTypes.push(type);
        hive.data.buildings[type] = hive.data.buildings[type] || 0;
      });

      this.modelEvent.publish({type: 'building-type-added', property: 'type', value: type});
    }
  }

  public addResearch(type: ResearchSlug) {
    this.data.research[type] = this.data.research[type] || 0;

    this.modelEvent.publish({type: 'research-added', property: 'type', value: type});
  }
}

export type modelEventType = 'hive-added' | 'area-added' | 'bee-type-added' | 'building-type-added' | 'load-game' | 'research-added' | 'research-complete';
