import * as _ from 'lodash';
import { IResearchData, ResearchData, ResearchSlug } from '../data/ResearchData';
import { dHive, IArea, IExtrinsicModel, IHive } from '../data/SaveData';
import { IAchievement, ISkillConfig, ISkillEffect, SkillData } from '../data/SkillData';
import { JMSaveManager } from '../JMGE/others/JMSaveManager';
import { InfoPopup } from '../JMHE/InfoPopup';
import { GameUI } from '../ui/GameUI';
import { DataFetcher } from '../services/DataFetcher';
import { Formula } from '../services/Formula';
import { GameEvents } from '../services/GameEvents';
import { GameHive } from './GameHive';
import { GameKnowledge } from './GameKnowledge';
import { GameModel } from './GameModel';

export class GameController {
  public knowledge: GameKnowledge;
  public gameSpeed = 1;

  private paused = false;

  constructor(public model: GameModel, private saveManager: JMSaveManager<IExtrinsicModel>) {
    this.knowledge = new GameKnowledge(this, model.data);

    window.setInterval(this.autosave, 5  * 60 * 1000);

    let extrinsic = model.data;
    // this.tempMig(extrinsic);

    this.knowledge.loadExtrinsic(extrinsic);
    this.initAchievements(extrinsic.achievements);
    this.initResearch(extrinsic.completedResearch);

    this.addHotkeys();
  }

  public tempMig(extrinsic: IExtrinsicModel) {
    Object.keys(extrinsic.research).forEach((key: ResearchSlug) => {
      let percent = extrinsic.research[key];
      if (percent >= 1) {
        delete extrinsic.research[key];
        extrinsic.completedResearch.push(key);
      }
    });
  }

  public resetGame() {
    this.saveManager.resetData()();
    let extrinsic = this.saveManager.getExtrinsic();

    this.knowledge.loadExtrinsic(extrinsic);
    this.initAchievements(extrinsic.achievements);
    this.initResearch(extrinsic.completedResearch);

    this.model.loadExtrinsic(extrinsic);
    this.model.modelEvent.publish({type: 'load-game', property: 'reset', value: extrinsic});
  }

  public onTick = () => {
    if (this.paused) return;

    for (let i = 0; i < this.gameSpeed; i++) {
      this.model.hives.forEach(hive => hive.update());
      this.model.areas.forEach(area => area.update());
      this.updateResearch();
    }

    this.saveManager.getExtrinsic().playTime += this.gameSpeed;
    this.knowledge.update();
  }

  public tryBuyHive = () => {
    let hiveCost = Formula.getQueenCost(this.model.data.hives.length);

    if (this.model.data.currency.queens < hiveCost) return false;
    this.model.data.currency.queens -= hiveCost;

    let newHive = _.cloneDeep(dHive);
    newHive.id = GameHive.topId++;

    this.model.addNewHive(newHive);
  }

  public initAchievements(achievements: boolean[]) {
    achievements.forEach((state, slug) => {
      if (state) {
        let data = SkillData.achievements.find(a => a.slug === slug);
        this.applySkill(data, true);
      }
    });
  }

  public initResearch(research: ResearchSlug[]) {
    research.forEach(researchId => {
      let data = ResearchData.find(el => el.id === researchId);
      this.applySkill(data, true);
    });

    this.checkResearchUnlocks();
  }

  public applySkill = (skill: ISkillConfig | IAchievement | IResearchData, onInit = false) => {
    skill.effects.forEach(effect => {
      if (effect.effectType === 'currency') {
        if (onInit) return;
        DataFetcher.finishNumberEffect(this.saveManager.getExtrinsic().currency, effect);
      } else if (effect.effectType === 'bee-type') {
        this.model.addBeeType(effect.value);
      } else if (effect.effectType === 'building-type') {
        this.model.addBuilding(effect.value);
      } else if (effect.effectType === 'research-unlock') {
        this.model.addResearch(effect.value);
      } else if (effect.effectType === 'feature-unlock') {
        this.model.featuresUnlocked.push(effect.key);
        GameEvents.ACTION_LOG.publish({action: 'feature-unlock', data: effect.key, text: effect.key});
        this.model.areas.forEach(area => area.canAnimal = true);
      } else if (effect.effectType === 'hive-stat') {
        this.model.hives.forEach(hive => hive.addHiveStat(effect));
        this.model.hiveEffects.push(effect);
      }
    });
  }

  private updateResearch() {
    this.model.hives.forEach(hive => {
      let thinkers = Math.pow(hive.data.beeTypes.thinker, hive.thinkerDim);
      if (thinkers > 0) {
        let researchSlug = hive.data.researchSelected;
        if (researchSlug) {
          let amount = Math.min(thinkers * hive.thoughtApplyPower, this.model.data.currency.thoughts);
          this.model.data.currency.thoughts -= amount;
          let researchData = DataFetcher.getResearchStats(researchSlug);
          this.model.data.research[researchSlug] += amount / researchData.researchCost;
          if (this.model.data.research[researchSlug] >= 1) {
            delete this.model.data.research[researchSlug];
            this.model.data.completedResearch.push(researchSlug);
            this.model.modelEvent.publish({type: 'research-complete', property: 'research', value: hive.data.researchSelected});
            hive.data.researchSelected = null;
            this.applySkill(researchData);
            this.checkResearchUnlocks();
          }
        } else {
          this.model.data.currency.thoughts += thinkers * hive.thoughtPower;
        }
      }
    });
  }

  private checkResearchUnlocks() {
    let research = this.model.data.research;
    ResearchData.forEach(data => {
      if (data.requirement && !research[data.id] && !this.model.data.completedResearch.includes(data.id) && this.model.data.completedResearch.includes(data.requirement)) {
        research[data.id] = 0;
      }
    });
  }

  private autosave = () => {
    this.saveManager.saveCurrent();
    new InfoPopup('Saved!');
  }

  private addHotkeys() {
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case 'P': this.paused = !this.paused; break;
        case '1': this.model.hives[0].tryBuyBee(); break;
        case '2': this.model.hives[1].tryBuyBee(); break;
        case 'S': this.saveManager.saveCurrent(); new InfoPopup('SAVED!'); break;
        case '=': this.gameSpeed *= 10; break;
        case '-': this.gameSpeed /= 10; break;
        case 'R': this.resetGame(); break;
      }
    });
  }
}
