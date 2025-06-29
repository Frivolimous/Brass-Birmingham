import * as _ from 'lodash';
import { ResearchSlug } from './ResearchData';
import { BuildingType } from './SkillData';

export type CurrencySlug = 'queens' | 'thoughts' | 'money';
export type ScoreSlug = 'dead';

export interface IExtrinsicModel {
  achievements: boolean[];

  hives: IHive[];
  areas: IArea[];
  playTime: number;

  currency: {[key in CurrencySlug]?: number};
  scores: {[key in ScoreSlug]?: number};
  research: {[key in ResearchSlug] ?: number};
  completedResearch: ResearchSlug[];
}

export const dHive: IHive = {
  id: 0,
  hiveName: 'New Hive',
  beeCount: 1,
  beeCountTo: 1,
  honey: 0,
  areaId: 0,

  beeTypes: {
    harvester: 1,
  },

  buildings: {

  },

  buildingSelected: undefined,
  researchSelected: undefined,
};

export const dArea: IArea = {
  id: 0,
  flowerCount: 1000,
  flowerCapacity: 10000,
  maxFlowerCapacity: 30000,
  hiveFlowerSeen: [],
  pollenCount: 10000,

  distanceOffset: 0,

  flowerRate: 0.06,
  pollenPerFlower: 10,
};

export const dExtrinsicModel: IExtrinsicModel = {
  achievements: [],
  hives: [],
  areas: [_.cloneDeep(dArea)],
  playTime: 0,

  currency: {
    queens: 1,
    thoughts: 0,
  },

  scores: {
    dead: 0,
  },

  research: {
    [ResearchSlug.WAREHOUSE]: 0,
  },

  completedResearch: [],
};

export interface IHive {
  id: number;
  hiveName: string;
  beeCount: number;
  beeCountTo: number;
  honey: number;
  areaId: number;
  beeTypes: Partial<{[key in BeeType]: number}>;
  buildings: Partial<{[key in BuildingType]: number}>;
  buildingSelected: BuildingType;
  researchSelected: ResearchSlug;
}

export interface IArea {
  id: number;
  flowerCount: number;
  flowerCapacity: number;
  maxFlowerCapacity: number;
  hiveFlowerSeen: number[];
  pollenCount: number;

  distanceOffset: number;

  flowerRate: number;
  pollenPerFlower: number;
}

export type BeeType = 'harvester' | 'breeder' | 'soldier' | 'builder' | 'scout' | 'thinker' | 'manager' | 'negotiator';
