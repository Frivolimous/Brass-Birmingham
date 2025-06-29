import * as _ from 'lodash';
import { IExtrinsicModel } from '../data/SaveData';
import { FeatureType } from '../data/SkillData';
import { GameController } from '../engine/GameController';
import { GameHive } from '../engine/GameHive';
import { GameModel, modelEventType } from '../engine/GameModel';
import { JMSaveManager } from '../JMGE/others/JMSaveManager';
import { ContainerElement } from '../JMHE/ContainerElement';
import { CostButtonElement } from '../JMHE/CostButtonElement';
import { TextElement } from '../JMHE/TextElement';
import { Formula } from '../services/Formula';
import { GameEvents, IActionLog } from '../services/GameEvents';
import { AreaView } from '../ui/elements/AreaView';
import { HeaderView } from '../ui/elements/HeaderView';
import { HiveView } from '../ui/elements/HiveView';
import { SidebarUI } from '../ui/elements/SidebarUI';
import { MainCanvas } from './elements/MainCanvas';

export class GameUI {
  private main: ContainerElement;

  // private controller: GameController;
  // private model: GameModel;
  
  // private hives: HiveView[] = [];
  // private areas: AreaView[] = [];

  public mainCanvas: MainCanvas;
  
  private hiveContainer = new ContainerElement('div', 'hive-container');
  private addHiveButton: CostButtonElement;
  private addHiveRow: ContainerElement = new ContainerElement('div', 'horizontal-stack');


  constructor (renderElement: HTMLDivElement, saveManager: JMSaveManager<IExtrinsicModel>) {
    let extrinsic = saveManager.getExtrinsic();
    
    // this.model = new GameModel(extrinsic);
    // this.controller = new GameController(this.model, saveManager);
    
    this.main = new ContainerElement('div', 'inner-canvas');
    // this.addHiveButton = new CostButtonElement('Queen', 'cost-button', this.controller.tryBuyHive);
    
    renderElement.appendChild(this.main.element);
    // this.main.addChildren(this.hiveContainer);

    this.mainCanvas = new MainCanvas();
    this.main.addChild(this.mainCanvas);
    

    // this.addHiveRow.addChildren(new TextElement('Add 1 Hive:'), this.addHiveButton);
    
    GameEvents.ticker.add(this.onTick);
    GameEvents.ACTION_LOG.addListener(this.onGameAction);
    // this.model.modelEvent.addListener(this.onModelEvent);
    
    this.loadExtrinsic(extrinsic);
  }

  private loadExtrinsic(extrinsic: IExtrinsicModel) {
    // this.addHiveButton.registerFunction(() => Formula.getQueenCost(extrinsic.hives.length));
    this.updateDisplay();
  }

  private updateDisplay() {
    this.hiveContainer.removeAllChildren();
    
    // this.model.hives.forEach(hive => {
    //   this.addHive(hive);
    // });

    this.hiveContainer.addChild(this.addHiveRow);
    // this.model.areas.forEach(data => {
    //   let area = new AreaView(data);
    //   this.areas.push(area);
    //   this.hiveContainer.addChild(area);
    // });
  }

  private onTick = () => {
    // this.controller.onTick();
    this.main.update();
  }

  // private onModelEvent = (e: {type: modelEventType, property: string, value: any}) => {
  //   if (e.type === 'bee-type-added') {
  //     this.hives.forEach(hive => hive.middlePart.refreshBeeTypes());
  //   } else if (e.type === 'building-type-added') {
  //     this.hives.forEach(hive => hive.buildView.refreshBuildings());
  //   } else if (e.type === 'research-added') {
  //     this.hives.forEach(hive => hive.researchView.refreshResearch());
  //   } else if (e.type === 'load-game') {
  //     this.loadExtrinsic(e.value);
  //   } else if (e.type === 'research-complete') {
  //     console.log('COMPLETE');
  //     this.hives.forEach(hive => hive.researchView.refreshResearch());
  //   } else if (e.type === 'hive-added') {
  //     this.addHive(e.value);
  //   }
  // }

  private onGameAction = (e: IActionLog) => {
    if (e.action === 'feature-unlock') {
      // this.hives.forEach(hive => hive.unlockFeature(e.data));
      // this.areas.forEach(area => area.unlockFeature(e.data));
      switch(e.data as FeatureType) {
      }
    }
  }
}

