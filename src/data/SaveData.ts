import * as _ from 'lodash';

export type CurrencySlug = 'queens' | 'thoughts' | 'money';
export type ScoreSlug = 'dead';

export interface IExtrinsicModel {
  achievements: boolean[];

  currency: {[key in CurrencySlug]?: number};
  scores: {[key in ScoreSlug]?: number};
}

export const dExtrinsicModel: IExtrinsicModel = {
  achievements: [],

  currency: {
    queens: 1,
    thoughts: 0,
  },

  scores: {
    dead: 0,
  },
};
