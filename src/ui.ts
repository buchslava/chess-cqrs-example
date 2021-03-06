import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import { Cell, getBoardView } from './chess';
import { uiEvent, BoardUIEvents, UIResponse } from './shared';

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
chessScreen.key(['a'], () => uiEvent.emit('request-prev-state'));
chessScreen.key(['s'], () => uiEvent.emit('request-next-state'));
chessScreen.render();

uiEvent.on(BoardUIEvents.GOT_PREV_STATE, (moveDescriptor: UIResponse) => {
    showNewBoard(moveDescriptor.board);
    updateStatus(`Move ${moveDescriptor.moveNumber}`);
});
uiEvent.on(BoardUIEvents.GOT_NEXT_STATE, (moveDescriptor: UIResponse) => {
    showNewBoard(moveDescriptor.board);
    updateStatus(`Move ${moveDescriptor.moveNumber}`);
});

export function showNewBoard(newBoard: Cell[][]) {
    table.setData({ headers: [], data: getBoardView(newBoard) })
    chessScreen.render();
}

export function updateStatus(status) {
    inputBar.setValue(status);
    chessScreen.render();
}