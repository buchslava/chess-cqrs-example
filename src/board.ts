import * as ipc from 'node-ipc';
import { getBoardView, chessMoveHandler, MoveDescriptor } from './chess';

ipc.config.retry = 1500;
ipc.config.maxConnections = 1;
ipc.config.logger = () => { };

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const screen = blessed.screen();

var table = contrib.table({
    fg: 'white',
    border: { type: "line", fg: "cyan" },
    columnSpacing: 2,
    columnWidth: [2, 2, 2, 2, 2, 2, 2, 2, 2],
    selectedFg: 'white',
    selectedBg: 'black'
});

table.focus()
table.setData({ headers: [], data: getBoardView() });

const inputBar = blessed.textbox({ bottom: 0, left: 0, height: 1, width: 20, style: { fg: 'white', bg: 'blue' } });

inputBar.setValue('Playing...');

screen.append(table);
screen.append(inputBar);

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.render()

ipc.serveNet(() => {
    ipc.server.on('move', (data: MoveDescriptor) => {
        chessMoveHandler(data, () => {
            table.setData({ headers: [], data: getBoardView() })
            screen.render();
        })
    });

    ipc.server.on('finish', () => {
        inputBar.setValue('Finished!!!');
        screen.render();
    });

    ipc.server.on('socket.disconnected', (data, socket) => {
        // console.log('DISCONNECTED\n\n', arguments);
    });
});

ipc.server.on('error', (err) => {
    console.log(err);
});

ipc.server.start();
