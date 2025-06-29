import { IExtrinsicModel } from '../../data/SaveData';
import { AchievementSlug, SkillData } from '../../data/SkillData';
import { GameController } from '../../engine/GameController';
import { ButtonElement } from '../../JMHE/ButtonElement';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { PassiveElement } from '../../JMHE/PassiveElement';
import { AchievementPanel } from './AchievementPanel';

export class SidebarUI {
  private achievementB: ButtonElement;
  private logB: ButtonElement;
  private achieveElement: AchievementPanel;

  constructor(topElement: HTMLDivElement, private controller: GameController) {
    this.controller.knowledge.onAchievementUpdate.addListener(this.updateAchievement);

    this.achieveElement = new AchievementPanel([], SkillData.achievements);

    topElement.innerHTML = '';
    let tabContainer = new ContainerElement('div', 'tab-container');
    let line = new PassiveElement('hr', 'divisor');
    let nodeContainer = new ContainerElement('div', 'node-container');

    this.achievementB = new ButtonElement('Achieves', 'tab-button', () => this.changeTab('Achievements'));
    this.logB = new ButtonElement('Activities', 'tab-button', () => this.changeTab('Log'));

    topElement.appendChild(tabContainer.element);
    topElement.appendChild(line.element);
    topElement.appendChild(nodeContainer.element);
    tabContainer.addChildren(this.achievementB, this.logB);
    nodeContainer.addChild(this.achieveElement);
    this.changeTab('Achievements');
  }

  public loadExtrinsic(extrinsic: IExtrinsicModel) {
    this.achieveElement.reloadAchievements(extrinsic.achievements, SkillData.achievements);
  }

  public changeTab = (tab: SidebarTabs) => {
    switch (tab) {
      case 'Achievements':
        this.achievementB.element.disabled = true;
        this.logB.element.disabled = false;
        this.achieveElement.element.hidden = false;
        break;
      case 'Log':
        this.achievementB.element.disabled = false;
        this.logB.element.disabled = true;
        this.achieveElement.element.hidden = true;
        break;
    }
  }

  public updateAchievement = (e: {slug: AchievementSlug, unlocked?: boolean, count?: string}) => {
    if (e.unlocked) {
      this.achieveElement.toggleAchievement(e.slug, true);
    } else {
      this.achieveElement.updateAchievementCount(e.slug, e.count);
    }
  }
}

type SidebarTabs = 'Achievements' | 'Log';
