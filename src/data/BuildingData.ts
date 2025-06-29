import { Utils } from '../JMGE/others/Utils';
import { BuildingType, ISkillEffect, ISkillEffectHive } from './SkillData';

const BuildingDataTSV = `Id	Unlocked	CanDestroy	Size	CostBase	CostExp	TimeBase	TimeExp	BonusType	BonusAmount	BonusIncType
pod	TRUE	TRUE	1	10	1.4	2	1.1	beeCapacity	5	additive
warehouse	FALSE	TRUE	2	10	2	10	2	honeyCapacity	10	mult
hatchery	FALSE	TRUE	3	10	10	10	5	breedSpeed	0.1	additive
expansion	FALSE	TRUE	0	10	1.4	4	1.05	buildingCapacity	5	additive
workshop	FALSE	TRUE	3	10	10	10	5	builderPower	0.1	additive
comms	FALSE	FALSE	10	10	10	10	5	queenCount	1	additive`;

// export const BuildingData = Utils.tsvToObject(BuildingDataTSV);

export const BuildingData: IBuildingData[] = [
  {id: 'pod', canDestroy: true, size: 1, cost: 0.00003, timeBase: 2000, timeExp: 1.1,
    effects: [{effectType: 'hive-stat', key: 'beeCapacity', value: 5, valueType: 'additive'}],
  },
  {id: 'warehouse', canDestroy: false, size: 2, cost: 0.0003, timeBase: 10000, timeExp: 1.4,
    effects: [{effectType: 'hive-stat', key: 'honeyCapacity', value: 1000000, valueType: 'additive'}],
  },
  // {id: 'refinery', canDestroy: false, size: 3, cost: 0.003 timeBase: 10, timeExp: 5,
  //   effects: [{effectType: 'hive-stat', key: 'honeyRate', value: 0.5, valueType: 'additive'}],
  // },
  {id: 'workshop', canDestroy: false, size: 3, cost: 0.0003, timeBase: 10000, timeExp: 1.6,
    effects: [{effectType: 'hive-stat', key: 'buildSpeed', value: 0.05, valueType: 'additive'}],
  },
  {id: 'hatchery', canDestroy: false, size: 3, cost: 0.0003, timeBase: 10000, timeExp: 1.4,
    effects: [{effectType: 'hive-stat', key: 'beeCostDivisor', value: 0.1, valueType: 'additive'}],
  },
  {id: 'expansion', canDestroy: false, size: 0, cost: 0.0003, timeBase: 4000, timeExp: 1.05,
    effects: [{effectType: 'hive-stat', key: 'buildingCapacity', value: 5, valueType: 'additive'}],
  },
];

export interface IBuildingData {
  id: BuildingType;
  canDestroy: boolean;
  size: number;
  cost: number;
  timeBase: number;
  timeExp: number;
  effects: ISkillEffectHive[];
}
