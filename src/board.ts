import * as ipc from 'node-ipc';
import { BehaviorSubject } from 'rxjs';
import { last } from 'lodash';
import { showNewBoard, updateStatus } from './ui';
import { chessMoveHandler, MoveDescriptor, Cell, initBoard } from './chess';
import { uiEvent, BoardUIEvents } from './shared';

ipc.config.retry = 1500;
ipc.config.maxConnections = 1;
ipc.config.logger = () => { };

ipc.serveNet(() => {
    const denormalizedData = [];
    const denormalizedDataSubject = new BehaviorSubject(initBoard);

    let currentBoardIndex: number = NaN;

    denormalizedDataSubject.subscribe((newBoard: Cell[][]) => {
        denormalizedData.push(newBoard);
        showNewBoard(newBoard);
    });

    ipc.server.on('move', (data: MoveDescriptor) => {
        chessMoveHandler(data, last(denormalizedData), (newBoard) => denormalizedDataSubject.next(newBoard));
    });

    ipc.server.on('finish', () => {
        currentBoardIndex = denormalizedData.length - 1;
        updateStatus('Finished');
    });

    /*ipc.server.on('socket.disconnected', (data, socket) => {
        console.log('DISCONNECTED\n\n', arguments);
    });*/

    uiEvent.on(BoardUIEvents.REQUEST_PREV_STATE, () => {
        if (!isNaN(currentBoardIndex) && currentBoardIndex - 1 >= 0) {
            uiEvent.emit(BoardUIEvents.GOT_PREV_STATE, denormalizedData[--currentBoardIndex]);
        }
    });
    uiEvent.on(BoardUIEvents.REQUEST_NEXT_STATE, () => {
        if (!isNaN(currentBoardIndex) && currentBoardIndex + 1 < denormalizedData.length) {
            uiEvent.emit(BoardUIEvents.GOT_NEXT_STATE, denormalizedData[++currentBoardIndex]);
        }
    });
});

ipc.server.on('error', (err) => {
    console.log(err);
});

ipc.server.start();
