import * as _ from 'lodash';
import { Fonts } from './data/Fonts';
import { GameUI } from './ui/GameUI';
// import { ATSManager } from './services/ATSManager';
import { FontLoader } from './JMGE/others/FontLoader';
import { GameEvents, IResizeEvent } from './services/GameEvents';
import { Debug } from './services/_Debug';
import { JMSaveManager } from './JMGE/others/JMSaveManager';
import { dExtrinsicModel, IExtrinsicModel } from './data/SaveData';
import { FirebaseManager, FirebaseObject } from './services/FBComm';
import { firebaseConfig } from './data/FirebaseConfig';

export let interactionMode: 'desktop'|'mobile' = 'desktop';
const CURRENT_VERSION = 1;

export let Facade = new class FacadeInner {
  private static exists = false;

  private element: HTMLDivElement;
  private previousResize: IResizeEvent;
  public firebaseManager: FirebaseManager;

  private gameUI: GameUI;

  private saveManager = new JMSaveManager<IExtrinsicModel>({
    initReset: false,
    currentVersion: CURRENT_VERSION,
    versionControl,
    defaultSave: dExtrinsicModel,
    saveLoc: 'local',
  });

  constructor() {
    if (FacadeInner.exists) throw new Error('Cannot instatiate more than one Facade Singleton.');
    FacadeInner.exists = true;
    try {
      document.createEvent('TouchEvent');
      interactionMode = 'mobile';
    } catch (e) {

    }

    this.firebaseManager = new FirebaseManager(firebaseConfig);

    Debug.initialize(null);
    this.element = document.getElementById('game-canvas') as HTMLDivElement;

    // Resize Event (for full screen mode / scaling)
    let finishResize = _.debounce(this.finishResize, 500);
    window.addEventListener('resize', finishResize);

    let fonts: string[] = _.map(Fonts);

    // load fonts then preloader!
    GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Primary Setup'});
    this.element.innerHTML = 'Loading...';
    // window.requestAnimationFrame(() => FontLoader.load(fonts).then(this.init));
    window.requestAnimationFrame(() => this.init());
    FontLoader.load(fonts);
  }

  public init = () => {
    // this will happen after 'preloader'
    GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Post-Loader'});
    this.saveManager.init().then(() => {
      GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Save Manager Initialized'});

      this.element.innerHTML = '';

      window.requestAnimationFrame(() => this.finishResize());
      this.registerUser();
    });
  }

  private finishResize = () => {
    GameEvents.WINDOW_RESIZE.publish(this.previousResize);
  }

  private registerUser = () => {
    this.firebaseManager.dbRegister().then(() => {
      GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Registered User'});
      this.gameUI = new GameUI(this.element, this.saveManager);
    });
  }
}();

function versionControl(version: number, extrinsic: any): IExtrinsicModel {
  // adjust the save between versions

  if (version < CURRENT_VERSION) {
    extrinsic = _.cloneDeep(dExtrinsicModel);
  }
  return extrinsic;
}
