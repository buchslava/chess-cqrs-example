import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import { getBoardView } from './chess';

const chessScreen = blessed.screen();
const table = contrib.table({
    fg: 'white',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 2,
    columnWidth: [2, 2, 2, 2, 2, 2, 2, 2, 2],
    selectedFg: 'white',
    selectedBg: 'black'
});

table.focus();

const inputBar = blessed.textbox({ bottom: 0, left: 0, height: 1, width: 20, style: { fg: 'white', bg: 'blue' } });

inputBar.setValue('Playing...');

chessScreen.append(table);
chessScreen.append(inputBar);

chessScreen.key(['escape', 'q', 'C-c'], () => process.exit(0));
chessScreen.render();

export function showNewBoard(newBoard) {
    table.setData({ headers: [], data: getBoardView(newBoard) })
    chessScreen.render();
}

export function updateStatus(status) {
    inputBar.setValue(status);
    chessScreen.render();
}