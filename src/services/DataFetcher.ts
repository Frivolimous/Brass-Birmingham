import { BuildingData, IBuildingData } from '../data/BuildingData';
import { IResearchData, ResearchData, ResearchSlug } from '../data/ResearchData';
import { BuildingType, ISkillEffect, ISkillEffectCurrency, ISkillEffectHive } from '../data/SkillData';

export const DataFetcher = {
  getBuildingStats(building: BuildingType, level: number): IBuilding {
    level = Math.floor(level);
    let base = BuildingData.find(el => el.id === building);

    return {
      id: building,
      level,
      canDestroy: base.canDestroy,
      size: base.size,
      cost: base.cost,
      time: base.timeBase * Math.pow(base.timeExp, level),
      effects: base.effects.map(effect => ({effectType: effect.effectType, key: effect.key, value: effect.valueType === 'additive' ? effect.value * level : Math.pow(effect.value, level), valueType: effect.valueType })),
    };
  },

  getResearchStats(research: ResearchSlug, percent?: number): IResearchData {
    // console.log(ResearchData, research);
    return ResearchData.find(el => el.id === research);
  },

  finishNumberEffect(config: any, effect: ISkillEffectCurrency | ISkillEffectHive) {
    if (effect.valueType === 'additive') {
      config[effect.key] += effect.value;
    } else if (effect.valueType === 'multiplicative') {
      config[effect.key] *= effect.value;
    } else if (effect.valueType === 'replace') {
      config[effect.key] = effect.value;
    }
  },
  reverseNumberEffect(config: any, effect: ISkillEffectCurrency | ISkillEffectHive) {
    if (effect.valueType === 'additive') {
      config[effect.key] -= effect.value;
    } else if (effect.valueType === 'multiplicative') {
      config[effect.key] /= effect.value;
    } else if (effect.valueType === 'replace') {
      config[effect.key] = effect.value;
    }
  },

  finishArrayEffect(config: any, effect: ISkillEffectCurrency | ISkillEffectHive) {
    if (effect.key) {
      if (!config[effect.key]) {
        config[effect.key] = [];
      }
      config = config[effect.key];
    }
    if (effect.valueType === 'additive') {
      config.push(effect.value);
    } else if (effect.valueType === 'replace') {
      config = [effect.value];
    }
  },
};

export interface IBuilding {
  id: BuildingType;
  level: number;
  canDestroy: boolean;
  size: number;
  cost: number;
  time: number;
  effects: ISkillEffectHive[];
}
