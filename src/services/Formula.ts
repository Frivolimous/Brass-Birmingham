import * as _ from 'lodash';
import { IArea, IHive } from '../data/SaveData';
import { GameHive } from '../engine/GameHive';
import { RandomSeed } from '../JMGE/others/RandomSeed';

const Constants = {
  BEE_COST_EXPO: 0.7,
};

export const Formula = {
  random: new RandomSeed('random'),
  diminish(a: number, level: number): number {
    return 1 - Math.pow(1 - a, level);
  },
  addMult(a: number, b: number): number {
    return (1 - (1 - a) * (1 - b));
  },
  subMult(t: number, a: number): number {
    return (1 - (1 - t) / (1 - a));
  },

  beeDim(count: number, dim: number): number {
    return Math.pow(count, dim);
  },

  getBeeCostForHive(hive: GameHive): number {
    let amount = Math.floor(Math.pow(hive.data.beeCountTo, Constants.BEE_COST_EXPO) / hive.beeCostDivisor);
    return amount;
  },

  getQueenCost(numHives: number): number {
    // return Math.pow((numHives + 1), 2);
    return 1;
  },

  getAreaRate(bees: number, hive: IHive, area: IArea): number {
    let flowers = area.hiveFlowerSeen[hive.id];
    let density = area.flowerCount / area.maxFlowerCapacity;
    let flowerTiles = Math.ceil(Math.min(flowers, bees) / density);

    let rate = flowers / bees * Math.pow(0.9, flowerTiles - 1);

    return rate || 0;
  },
};
