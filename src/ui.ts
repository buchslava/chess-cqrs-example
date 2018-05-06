import * as blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import { Cell, getBoardView } from './chess';
import { 
    uiEvent,
    EVENT_GOT_PREV_STATE,
    EVENT_GOT_NEXT_STATE
} from './shared';

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

uiEvent.on(EVENT_GOT_PREV_STATE, (board: Cell[][]) => showNewBoard(board));
uiEvent.on(EVENT_GOT_NEXT_STATE, (board: Cell[][]) => showNewBoard(board));

export function showNewBoard(newBoard: Cell[][]) {
    table.setData({ headers: [], data: getBoardView(newBoard) })
    chessScreen.render();
}

export function updateStatus(status) {
    inputBar.setValue(status);
    chessScreen.render();
}