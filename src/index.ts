import * as ipc from 'node-ipc';
import { isEmpty } from 'lodash';

ipc.config.retry = 1500;
ipc.config.logger = () => { };

const moves = [
    { from: 'e2', to: 'e4' },
    { from: 'e7', to: 'e5' },
    { from: 'f1', to: 'c4' },
    { from: 'b8', to: 'c6' },
    { from: 'd1', to: 'h5' },
    { from: 'g8', to: 'f6' },
    { from: 'h5', to: 'f7' }
].reverse();

const eventStore = [];

ipc.connectToNet('world', () => {
    ipc.of.world.on('connect', () => {        
        const nextMove = () => {
            const move = moves.pop();

            eventStore.push(move);
            ipc.of.world.emit('move', move);

            if (isEmpty(moves)) {
                ipc.of.world.emit('finish', {});
                clearInterval(inter);
            }
        };

        const inter = setInterval(nextMove, 2000);
    });
    ipc.of.world.on('disconnect', () => {
        // ipc.log('disconnected from world');
    });
});
