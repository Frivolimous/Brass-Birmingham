import { IExtrinsicModel, ScoreSlug } from '../data/SaveData';
import { AchievementSlug, SkillData } from '../data/SkillData';
import { JMEventListener } from '../JMGE/events/JMEventListener';
import { InfoPopup } from '../JMHE/InfoPopup';
import { GameEvents, IActionLog } from '../services/GameEvents';
import { GameController } from './GameController';

let DEBUG_MODE = true;

export class GameKnowledge {
  public onAchievementUpdate = new JMEventListener<{slug: AchievementSlug, unlocked?: boolean, count?: string}>();

  private fpsCounter: number;
  private frames: number = 0;
  private fps: number = 0;

  private extrinsic: IExtrinsicModel;

  private totalBees = 0;
  private totalCapacity = 0;
  private totalPods = 0;
  private totalHoney = 0;
  private totalFlowers = 999;

  constructor(private gameC: GameController, extrinsic: IExtrinsicModel) {
    GameEvents.ACTION_LOG.addListener(this.onActionEvent);
    this.startFpsCounter();

    this.extrinsic = extrinsic;
  }

  public loadExtrinsic(extrinsic: IExtrinsicModel) {
    this.extrinsic = extrinsic;
  }

  public destroy() {
    window.clearTimeout(this.fpsCounter);
    GameEvents.ACTION_LOG.removeListener(this.onActionEvent);
  }

  public update() {
    this.totalBees = 0;
    this.totalCapacity = 0;
    this.totalPods = 0;
    this.totalHoney = 0;
    this.totalFlowers = 0;
    this.gameC.model.hives.forEach(hive => {
      this.totalBees += hive.data.beeCount;
      this.totalCapacity += hive.beeCapacity;
      this.totalPods += hive.data.buildings.pod || 0;
      this.totalHoney += hive.data.honey;
    });
    this.gameC.model.areas.forEach(area => {
      this.totalFlowers += area.data.flowerCount;
    });

    this.checkBeeCount(20, AchievementSlug.BEES_20);
    this.checkBeeCount(100, AchievementSlug.BEES_100);
    this.checkBeeCount(600, AchievementSlug.BEES_10000);
    this.checkBeeCapacity(500, AchievementSlug.CAPACITY_1000);
    this.checkPods(10, AchievementSlug.BUILD_MAX);
    this.checkHoney(1500000, AchievementSlug.HONEY_MAX);
    this.checkHoney(500000, AchievementSlug.HONEY_MID);
    this.checkFlowerMin(0, AchievementSlug.FLOWERS_0);
    this.checkBeeCount(100000, AchievementSlug.BEES_100000);
    this.checkBeeCount(1000000, AchievementSlug.BEES_1000000);
    this.checkBeeCount(50000000, AchievementSlug.BEES_50000000);
    this.checkScore(1000, 'dead', AchievementSlug.DEAD_BEES_1000);

    // this.checkScore(1000, 'dead', AchievementSlug.DEAD_BEES_1000);

    if (DEBUG_MODE) {
      this.achieveAchievement(AchievementSlug.FLOWERS_0);
      this.achieveAchievement(AchievementSlug.HONEY_MID);
      this.achieveAchievement(AchievementSlug.DEAD_BEES_1000);
    }

    this.frames++;
  }

  private onActionEvent(e: IActionLog) {
    // switch(e.action) {

    // }
  }

  private startFpsCounter() {
    this.fpsCounter = window.setTimeout(() => {
      this.fps = this.frames;
      this.frames = 0;
      this.startFpsCounter();
    }, 1000);
  }

  private achieveAchievement(slug: AchievementSlug) {
    if (!this.extrinsic.achievements[slug]) {
      this.extrinsic.achievements[slug] = true;
      let achievement = SkillData.achievements.find(data => data.slug === slug);
      this.gameC.applySkill(achievement);
      this.onAchievementUpdate.publish({slug, unlocked: true});

      if (!achievement.hidden) {
        new InfoPopup(`Achievement Unlocked: ${achievement.title}`);
      }
    }
  }

  private checkBeeCount = (n: number, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.totalBees >= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `Total Bees: ${Math.floor(this.totalBees).toLocaleString()} / ${n.toLocaleString()}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }

  private checkBeeCapacity = (n: number, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.totalCapacity >= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `Max Bees: ${Math.floor(this.totalCapacity).toLocaleString()} / ${n.toLocaleString()}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }

  private checkPods = (n: number, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.totalPods >= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `Total Pods: ${Math.floor(this.totalPods)} / ${n}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }

  private checkHoney = (n: number, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.totalHoney >= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `Honey: ${Math.floor(this.totalHoney).toLocaleString()} / ${n.toLocaleString()}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }

  private checkFlowerMin = (n: number, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.totalFlowers <= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `Flowers: ${Math.floor(this.totalFlowers).toLocaleString()} -> ${n.toLocaleString()}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }

  private checkScore = (n: number, score: ScoreSlug, slug: AchievementSlug) => {
    if (!this.extrinsic.achievements[slug]) {
      if (this.extrinsic.scores[score] >= n) {
        this.achieveAchievement(slug);
        return true;
      } else {
        let count = `score: ${Math.floor(this.extrinsic.scores[score])} / ${n}`;
        this.onAchievementUpdate.publish({slug, count});
        return false;
      }
    }
  }
}
