import { ResearchSlug } from './ResearchData';
import { BeeType } from './SaveData';

export enum AchievementSlug {
  BEES_20,
  BEES_100,
  BEES_10000,
  CAPACITY_1000,
  BUILD_MAX,
  HONEY_MID,
  HONEY_MAX,
  FLOWERS_0,
  BEES_100000,
  DEAD_BEES_1000,
  BEES_1000000,
  BEES_50000000,
}

export const SkillData: ISkillData = {
  skills: [],
  achievements: [
    {
      slug: AchievementSlug.BEES_20,
      title: 'Eventuality',
      description: 'Requirement: Have 20 Bees<br>Reward: Unlock Breeders',
      effects: [{effectType: 'bee-type', value: 'breeder'}],
      // effects: [{effectType: 'currency', key: 'queens', valueType: 'additive', value: 1}],
    },
    {
      slug: AchievementSlug.BEES_100,
      title: 'Eventuality 2',
      description: 'Requirement: Have 100 Bees<br>Reward: Unlock Builders',
      effects: [{effectType: 'bee-type', value: 'builder'},
                {effectType: 'building-type', value: 'pod'},
                {effectType: 'feature-unlock', key: 'show-buildings'}],

      // effects: [{effectType: 'currency', key: 'queens', valueType: 'additive', value: 1}],
    },
    {
      slug: AchievementSlug.CAPACITY_1000,
      title: 'Built Up',
      description: 'Requirement: Have 500 Max Bees<br>Reward: Unlocks the Workshop and Hatchery',
      effects: [{effectType: 'building-type', value: 'workshop'},
                {effectType: 'building-type', value: 'hatchery'}],
    },
    {
      slug: AchievementSlug.BEES_10000,
      title: 'Promotion',
      description: 'Requirement: Have 600 Bees<br>Reward: +1 Queen',
      effects: [{effectType: 'currency', key: 'queens', valueType: 'additive', value: 1}],
    },
    {
      slug: AchievementSlug.BUILD_MAX,
      title: 'Expansionists',
      description: 'Requirement: Build 10 Pods<br>Reward: Unlocks Expansion',
      effects: [{effectType: 'building-type', value: 'expansion'}],
    },
    {
      slug: AchievementSlug.HONEY_MAX,
      title: 'Brain Food',
      description: 'Requirement: Have 1,500,000 total honey<br>Reward: Unlock Thinkers',
      effects: [{effectType: 'bee-type', value: 'thinker'},
        {effectType: 'feature-unlock', key: 'show-thoughts'}],
    },
    {
      slug: AchievementSlug.HONEY_MID,
      title: 'mid honey',
      hidden: true,
      description: 'need 500,000',
      effects: [{effectType: 'feature-unlock', key: 'show-honey-cap'}],
    },
    {
      slug: AchievementSlug.FLOWERS_0,
      title: 'Flowerless',
      description: 'Requirement: Have no more flowers available<br>Reward: Area View',
      effects: [{effectType: 'feature-unlock', key: 'show-area'}],
    },
    {
      slug: AchievementSlug.BEES_100000,
      title: 'good progress',
      hidden: true,
      description: 'hidden - 100000 bees',
      effects: [{effectType: 'feature-unlock', key: 'spawn-animals'}],
    },
    {
      slug: AchievementSlug.DEAD_BEES_1000,
      title: 'A Great Loss',
      description: 'Requirement: Lose 1,000 bees<br>Reward: Soldier Reseach',
      effects: [{effectType: 'research-unlock', value: ResearchSlug.SOLDIER_1}],
    },
    {
      slug: AchievementSlug.BEES_1000000,
      title: 'Budding Empire',
      description: 'Requirement: Have 1,000,000 Bees<br>Reward: +1 Queen',
      effects: [{effectType: 'currency', key: 'queens', valueType: 'additive', value: 1}],
    },
    {
      slug: AchievementSlug.BEES_50000000,
      title: 'Great Empire',
      description: 'Requirement: Have 50,000,000 Bees<br>Reward: +1 Queen',
      effects: [{effectType: 'currency', key: 'queens', valueType: 'additive', value: 1}],
    },

  //   BEES_100000,
  // DEAD_BEES_1000,
  // BEES_1000000,
  // BEES_50000000,

// 1,000 Dead Bees: Soldier Research
// 1,000,000 Bees: +1 Queen
// 50,000,000 Bees: +1 Queen
  ],
};
interface ISkillData {
  skills: ISkillConfig[];
  // skillExchange: number[];
  // skillTiers: string[][];
  achievements: IAchievement[];
}

export interface ISkillConfig {
  slug: string;
  title: string;
  description: string;
  cost: number;
  effects: ISkillEffect[];
  skillRequirements?: string[];
}

export interface IAchievement {
  slug: AchievementSlug;
  title: string;
  description: string;
  hidden?: boolean;
  effects: ISkillEffect[];
}

export type ISkillEffect = ISkillEffectCurrency | ISkillEffectBee | ISkillEffectHive | ISkillEffectFeature | ISkillEffectResearch | ISkillEffectBuilding;

export interface ISkillEffectHive {
  effectType: 'hive-stat';
  key: string;
  valueType: EffectValueType;
  value: any;
}

export interface ISkillEffectCurrency {
  effectType: 'currency';
  key?: string;
  valueType: EffectValueType;
  value: any;
}

export interface ISkillEffectBee {
  effectType: 'bee-type';
  value: BeeType;
}

export interface ISkillEffectFeature {
  effectType: 'feature-unlock';
  key: FeatureType;
}

export interface ISkillEffectResearch {
  effectType: 'research-unlock';
  value: ResearchSlug;
}

export interface ISkillEffectBuilding {
  effectType: 'building-type';
  value: BuildingType;
}

export type EffectValueType = 'additive' | 'multiplicative' | 'replace';
export type BuildingType = 'pod' | 'warehouse' | 'hatchery' | 'expansion' | 'workshop' | 'comms' | 'refinery';
export type FeatureType = 'show-buildings' | 'show-honey-cap' | 'show-area' | 'spawn-animals' | 'show-thoughts';
