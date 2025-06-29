import { AchievementSlug, IAchievement } from '../../data/SkillData';
import { ContainerElement } from '../../JMHE/ContainerElement';
import { TextElement } from '../../JMHE/TextElement';

export class AchievementPanel extends ContainerElement {
  private achievements: {slug: AchievementSlug, element: ContainerElement, count: TextElement}[] = [];

  constructor(states: boolean[], private rawAchievements: IAchievement[]) {
    super('div', 'achievement-panel');

    this.reloadAchievements(states, rawAchievements);
  }

  public reloadAchievements(states: boolean[], rawAchievements: IAchievement[]) {
    this.removeAllChildren();
    this.achievements = [];

    let title = new TextElement('Achievements', 'achievement-title');

    this.addChild(title);
    rawAchievements.forEach(data => {
      if (data.hidden) return;

      let block = this.createAchievementBlock(data);
      this.addChild(block);

      if (states[data.slug]) {
        this.toggleAchievement(data.slug, true);
      }
    });
  }

  public toggleAchievement(slug: AchievementSlug, state: boolean = true) {
    let data = this.achievements.find(block => block.slug === slug);
    if (!data) return;

    if (state) {
      data.element.element.classList.add('highlight');
      data.count.updateText('');

    } else {
      data.element.element.classList.remove('highlight');
    }
  }

  public tA2(slug: AchievementSlug, state: boolean = true) {
    let data = this.achievements.find(block => block.slug === slug);
    if (!data) return;

    if (state) {
      data.element.element.classList.add('highlight');
      data.count.updateText('');

    } else {
      data.element.element.classList.remove('highlight');
    }
  }

  public updateAchievementCount(slug: AchievementSlug, count: string) {
    let data = this.achievements.find(block => block.slug === slug);

    data && data.count.updateText(count);
  }

  private createAchievementBlock(data: IAchievement): ContainerElement {
    let el = new ContainerElement('div', 'achievement-block');
    let title = new TextElement(data.title, 'achievement-block-title');
    let content = new TextElement(data.description, 'achievement-block-content');
    let count = new TextElement('', 'achievement-block-cost');
    el.addChildren(title, content, count);

    this.achievements.push({slug: data.slug, element: el, count});
    return el;
  }
}
