import { JMTicker } from '../JMGE/events/JMTicker';
import { JMEventListener } from '../JMGE/events/JMEventListener';

export const GameEvents = {
  ticker: JMTicker,
  WINDOW_RESIZE: new JMEventListener<IResizeEvent>(),
  ACTION_LOG: new JMEventListener<IActionLog>(),
  APP_LOG: new JMEventListener<IAppLog>(),
};

export interface IResizeEvent {
  outerBounds: {x: number, y: number, width: number, height: number};
  innerBounds: {x: number, y: number, width: number, height: number};
}

export interface IActionLog {
  action: string;
  data: any;
  text: string;
}

export interface IAppLog {
  type: AppEvent;
  data?: any;
  text: string;
}

export type AppEvent = 'INITIALIZE' | 'SAVE' | 'NAVIGATE';
