import * as ipc from 'node-ipc';
import { BehaviorSubject } from 'rxjs';
import { last } from 'lodash';
import { showNewBoard, updateStatus } from './ui';
import { chessMoveHandler, MoveDescriptor, initBoard } from './chess';

ipc.config.retry = 1500;
ipc.config.maxConnections = 1;
ipc.config.logger = () => { };

ipc.serveNet(() => {
    const denormalizedData = [];
    const bs = new BehaviorSubject(initBoard);

    bs.subscribe(newBoard => {
        denormalizedData.push(newBoard);
        showNewBoard(newBoard);
    });

    bs.next(initBoard);

    ipc.server.on('move', (data: MoveDescriptor) => {
        chessMoveHandler(data, last(denormalizedData), (newBoard) => {
            bs.next(newBoard);
        });
    });

    ipc.server.on('finish', () => updateStatus('Finished'));

    ipc.server.on('socket.disconnected', (data, socket) => {
        // console.log('DISCONNECTED\n\n', arguments);
    });
});

ipc.server.on('error', (err) => {
    console.log(err);
});

ipc.server.start();
