import { ISkillEffect } from './SkillData';

export enum ResearchSlug {
  SOLDIER_1 = 'soldiers',
  WAREHOUSE = 'warehouse',
  SCOUT_1 = 'scouts',
  HONEY_1 = 'honeyrate1',
}

const ResearchDataTSV = `Id	Name	Requirement	ResearchCost	RewardCategory	RewardType	RewardAmount
Warehouse	Warehouse	Default	500	BuildingType	Warehouse	TRUE
Soldiers	Soldiers	Achievement:10	500	BeeType	Soldier	TRUE
Scouts	Scouts	Default	1000	BeeType	Scout	TRUE
AnimalID	Animal Tracking	Research:Soldiers	500	Feature	AnimalID	TRUE
AnimalPrio	Animal Tactics	Research:AnimalID	500	Feature	AnimalPrio	TRUE
SoldierTactics	Superior Warfare	Research:AnimalID	500	Feature	SoldierTactics	TRUE
HoneyRate1	Filtration System	Research:Warehouse	1500	GlobalHiveStat	HarvestEff	0.1
BuildRate1	Reinforcement	Research:HoneyRate1	1500	GlobalHiveStat	BuilderPower	0.1
AttackRate1	Quicker Combat	Research:Soldiers	1500	GlobalHiveStat	SoldierRate	0.1
Pollination1	Pollination	Research:Scouts	1500	GlobalHiveStat	PollinationRate	0.1
ScoutPollination	Scout Pollination	Research:Pollination1	3000	Feature	ScoutPollination	TRUE
HoneyRate2	Advanced Filtration	Research:HoneyRate1	3000	GlobalHiveStat	HarvestEff	0.1
BuildRate2	Solid Honey	Research:BuildRate1	3000	GlobalHiveStat	BuilderPower	0.1
AttackRate1	Battle Supremacy	Research:AttackRate1	3000	GlobalHiveStat	SoldierRate	0.1
Pollination1	Superior Transfer	Research:ScoutPollination	4500	GlobalHiveStat	PollinationRate	0.1
Queens1	Almost a Republic	Research:HoneyRate2	4500	Currency	Queens	1
Queens2	Almost an Empire	Research:Queens1	6000	Currency	Queens	1`;

export const ResearchData: IResearchData[] = [
  {
    id: ResearchSlug.WAREHOUSE,
    label: 'Unlock Warehouse',
    desc: 'Unlocks the Warehouse building which increases your max honey.',
    researchCost: 500,
    effects: [{effectType: 'building-type', value: 'warehouse'}],
  },
  {
    id: ResearchSlug.SOLDIER_1,
    label: 'Unlock Soldiers',
    desc: 'Unlocks the Soldier Bee Type which defends against animal attacks.',
    researchCost: 500,
    effects: [{effectType: 'bee-type', value: 'soldier'}],
  },
  {
    id: ResearchSlug.SCOUT_1,
    label: 'Unlock Scouts',
    desc: 'Unlocks the Scout Bee Type which helps locate more flowers.',
    requirement: ResearchSlug.SOLDIER_1,
    researchCost: 1000,
    effects: [{effectType: 'bee-type', value: 'scout'}],
  },
  {
    id: ResearchSlug.HONEY_1,
    label: 'Improve Honey',
    desc: 'Improves your honey rate by a lot.',
    requirement: ResearchSlug.SCOUT_1,
    researchCost: 1000,
    effects: [{effectType: 'hive-stat', key: 'honeyRate', value: 0.1, valueType: 'additive'}],
  },
];

export interface IResearchData {
  id: ResearchSlug;
  label: string;
  desc: string;
  requirement?: ResearchSlug;
  researchCost: number;
  effects: ISkillEffect[];
}
