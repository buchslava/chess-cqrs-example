import { EventEmitter } from 'events';
import { Cell } from './chess';

export const uiEvent = new EventEmitter();
export enum BoardUIEvents {
  REQUEST_PREV_STATE = 'request-prev-state',
  REQUEST_NEXT_STATE = 'request-next-state',
  GOT_PREV_STATE = 'got-prev-state',
  GOT_NEXT_STATE = 'got-next-state'
}
export interface UIResponse {
  moveNumber: number;
  board: Cell[][];
}
