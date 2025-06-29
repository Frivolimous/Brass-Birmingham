import { GameEvents } from './GameEvents';

export const DEBUG_MODE = true;
export const GOD_MODE = true;
export class Debug {
  public static initialize(data: any) {
    if (DEBUG_MODE) {
      GameEvents.ACTION_LOG.addListener(e => {
        console.log('ACTION:', e.text);
      });
      GameEvents.APP_LOG.addListener(e => {
        console.log('APP:', e.type, ' : ', e.text);
      });
    }
  }
}
