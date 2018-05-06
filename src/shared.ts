import { EventEmitter } from 'events';

export const uiEvent = new EventEmitter();
export const EVENT_REQUEST_PREV_STATE = 'request-prev-state';
export const EVENT_REQUEST_NEXT_STATE = 'request-next-state';
export const EVENT_GOT_PREV_STATE = 'got-prev-state';
export const EVENT_GOT_NEXT_STATE = 'got-next-state';
