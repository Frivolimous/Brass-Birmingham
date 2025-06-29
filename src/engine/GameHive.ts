import * as _ from 'lodash';
import { IArea, IHive } from '../data/SaveData';
import { BuildingType, ISkillEffectHive } from '../data/SkillData';
import { DataFetcher } from '../services/DataFetcher';
import { Formula } from '../services/Formula';
import { GameArea } from './GameArea';

export class GameHive {
  public static topId: number = 0;

  public buildingTypes: BuildingType[] = [];
  public cachedGatheringSpeed: number = 0;
  public flyTime = 60;

  // builder stats
  public builderDim = 0.8;
  public buildSpeed = 1;
  public trueBuildSpeed = 1;
  public buildingCount: number = 0;
  public buildingCapacity: number = 10;

  // breeder stats
  public breederDim = 0.8;
  public beeRate =  0.001;
  public beeCapacity: number = 100;
  public birthRate = 0.01;
  public beeCostDivisor = 1;

  // harvester stats
  public harvestTimeHarvest = 60;
  public harvestTimeDeposit = 60;
  public harvestPower = 1;
  public honeyCapacity = 1000000;
  public honeyRate = 1;

  // thinker stats
  public thinkerDim = 0.8;
  public thoughtPower = 0.01;
  public thoughtApplyPower = 0.3;

  // scouter stats
  public exploreRate = 0.5;

  // manager stats
  public managerDim = 0.8;

  public breedTime: number = 0;

  public harvesters: IHarvester[] = [];

  constructor(public data: IHive, public area: GameArea) {
    GameHive.topId = Math.max(GameHive.topId, data.id);
    this.loadBuildings();

  }

  public loadBuildings() {
    Object.keys(this.data.buildings).forEach((key: BuildingType) => {
      let value = this.data.buildings[key];
      let building = DataFetcher.getBuildingStats(key, value);
      building.effects.forEach(effect => this.addHiveStat(effect));
      this.buildingCount += Math.floor(value) * building.size;
      // this.buildingTypes.push(key);
      // hive.data.buildings[type] = hive.data.buildings[type] || 0;
    });
  }

  public update = () => {
    // build bees
    if (this.data.beeCountTo > this.data.beeCount) {
      let nextCount = Math.min(this.data.beeCount + this.birthRate, this.data.beeCountTo);
      if (Math.floor(nextCount) > Math.floor(this.data.beeCount)) {
        this.data.beeTypes.harvester++;
      }
      this.data.beeCount = nextCount;
    } else if (this.data.beeTypes.breeder > 0 && this.canBuyBee()) {
      this.breedTime = Math.min(1, this.breedTime + Math.pow(this.data.beeTypes.breeder, this.breederDim) * this.beeRate);

      if (this.breedTime >= 1) {
        this.tryBuyBee();
      }
    }

    // build
    let builders = Math.pow(this.data.beeTypes.builder, this.builderDim);
    if (builders > 0 && this.data.buildingSelected) {
      // console.log("BUILD", this.data.buildingSelected)
      let data = DataFetcher.getBuildingStats(this.data.buildingSelected, this.data.buildings[this.data.buildingSelected]);
      let time = builders * this.buildSpeed / data.time;
      let cost = builders * data.cost * this.buildSpeed;
      this.trueBuildSpeed = builders * this.buildSpeed;
      // console.log(this.buildingCapacity, this.buildingCount, data.size, this.data.honey, cost);
      if (data.size <= (this.buildingCapacity - this.buildingCount) && this.data.honey >= cost) {
        // console.log("BUILD")
        let nextLevel = this.data.buildings[this.data.buildingSelected] + time;
        this.data.honey -= cost;
        if (Math.floor(nextLevel) > Math.floor(this.data.buildings[this.data.buildingSelected])) {
          this.data.buildings[this.data.buildingSelected] = Math.floor(nextLevel);
          this.buildingCount += data.size;
          data.effects.forEach(effect => this.removeHiveStat(effect));
          DataFetcher.getBuildingStats(this.data.buildingSelected, Math.floor(nextLevel)).effects.forEach(effect => this.addHiveStat(effect));
        } else {
          this.data.buildings[this.data.buildingSelected] += time;
        }
      }
    }

    // harvest honey
    this.harvestPollen(this.data.beeTypes.harvester);
  }

  public addHiveStat(effect: ISkillEffectHive) {
    DataFetcher.finishNumberEffect(this, effect);
  }

  public removeHiveStat(effect: ISkillEffectHive) {
    DataFetcher.reverseNumberEffect(this, effect);
  }

  public harvestPollen = (harvesters: number) => {
    let flowers = Math.floor(this.area.data.hiveFlowerSeen[this.data.id]);
    let explorers = 0;
    if (harvesters > flowers) {
      explorers = harvesters - flowers;
      // activeBees -= explorers;
      // activeBees = flowers;
      // harvesters = flowers;
      // this.exploreArea(explorers * 0.5);
    }

    let count = Math.min(harvesters, 100);
    let perCount = harvesters / count;
    let averageDistance = 1; // + ((harvesters - 1) / this.area.getFlowerDensity()) / 2 + this.area.data.distanceOffset;
    let timeTaken = averageDistance * this.flyTime;

    while (this.harvesters.length < count) {
      this.harvesters.push({phase: Math.floor(Math.random() * 4), percent: Math.random(), rate: 0.9 + Math.random() * 0.2});
    }

    while (this.harvesters.length > count) {
      this.harvesters.pop();
    }

    this.harvesters.forEach((harvester, i) => {
      if (this.data.honey >= (this.honeyCapacity - i * this.harvestPower * perCount)) return;

      switch (harvester.phase) {
        case 0: // Fly To Flower
                harvester.percent += 1 / timeTaken * harvester.rate;
                if (harvester.percent >= 1) {
                  harvester.percent = 0;
                  harvester.phase++;
                }
                break;
        case 1: // harvest
                harvester.percent += 1 / this.harvestTimeHarvest;
                if (harvester.percent >= 1) {
                  harvester.percent = 0;
                  harvester.phase++;
                  this.area.consumePollen(this, this.harvestPower * perCount);
                }
                break;
        case 2: // fly back
                harvester.percent += 1 / timeTaken * harvester.rate;
                if (harvester.percent >= 1) {
                  harvester.percent = 0;
                  harvester.phase++;
                }
                break;
        case 3: // deposit honey
                harvester.percent += 1 / this.harvestTimeDeposit;
                if (harvester.percent >= 1) {
                  harvester.percent = 0;
                  this.data.honey += this.harvestPower * this.honeyRate * perCount;

                  harvester.phase = 0;
                  if (explorers > 0) {
                    explorers--;
                    harvester.exploring = true;
                  } else {
                    this.area.data.hiveFlowerSeen[this.data.id]--;
                    harvester.exploring = false;
                  }
                }
                break;
      }
    });
  }

  public harvestPollenAverage = (harvesters: number) => {
    let averageDistance = ((harvesters - 1) / this.area.getFlowerDensity()) / 2 + this.area.data.distanceOffset;
    let timeTaken = 2 * averageDistance / this.flyTime + this.harvestTimeHarvest + this.harvestTimeDeposit;
    let harvestAmount = harvesters * this.harvestPower / timeTaken;

    this.cachedGatheringSpeed = harvestAmount * 100;

    this.data.honey = Math.min(this.data.honey + harvestAmount * this.honeyRate, this.honeyCapacity);
    // console.log(this.data.honey, this.honeyCapacity);
    this.area.consumePollen(this, harvestAmount);
  }

  public exploreArea(explorers: number) {
    let density = this.area.getFlowerDensity();
    let remaining = 1 - this.area.data.hiveFlowerSeen[this.data.id] / this.area.data.flowerCount;
    let exploration = density * remaining * explorers * this.exploreRate;
    if (Math.floor(this.area.data.hiveFlowerSeen[this.data.id]) < Math.floor(this.area.data.hiveFlowerSeen[this.data.id] + exploration)) {
      this.area.data.hiveFlowerSeen[this.data.id] = Math.floor(this.area.data.hiveFlowerSeen[this.data.id] + exploration);
    } else {
      this.area.data.hiveFlowerSeen[this.data.id] += exploration;
    }
  }

  public tryBuyBee = () => {
    if (this.canBuyBee()) {
      let beeCost = Formula.getBeeCostForHive(this);

      this.breedTime = 0;
      this.data.honey -= beeCost;
      this.data.beeCountTo += 1;
    }
  }

  public canBuyBee = () => {
    // return false;
    return (this.data.beeCountTo === this.data.beeCount && this.data.beeCountTo + 1 <= this.beeCapacity && this.data.honey >= Formula.getBeeCostForHive(this));
  }
}

export interface IHarvester {
  phase: number;
  percent: number;
  rate: number;
  exploring?: boolean;
}
