import * as ipc from 'node-ipc';
import { cloneDeep } from 'lodash';

const colors = require('colors/safe');

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

enum Types {
    king = '\u2654',
    queen = '\u2655',
    rook = '\u2656',
    bishop = '\u2657',
    knight = '\u2658',
    pawn = '\u2659',
    empty = ' '
};

enum Colors {
    WHITE, BLACK
}

interface MoveDescriptor {
    from: string;
    to: string;
}

interface Cell {
    t: Types;
    c?: Colors;
}

const emptyLine: Cell[] = [
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty },
    { t: Types.empty }
];

let board: Cell[][] = [
    [
        { t: Types.rook, c: Colors.BLACK },
        { t: Types.knight, c: Colors.BLACK },
        { t: Types.bishop, c: Colors.BLACK },
        { t: Types.queen, c: Colors.BLACK },
        { t: Types.king, c: Colors.BLACK },
        { t: Types.bishop, c: Colors.BLACK },
        { t: Types.knight, c: Colors.BLACK },
        { t: Types.rook, c: Colors.BLACK },
    ],
    [
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK },
        { t: Types.pawn, c: Colors.BLACK }
    ],
    cloneDeep(emptyLine), cloneDeep(emptyLine), cloneDeep(emptyLine), cloneDeep(emptyLine),
    [
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE },
        { t: Types.pawn, c: Colors.WHITE }
    ],
    [
        { t: Types.rook, c: Colors.WHITE },
        { t: Types.knight, c: Colors.WHITE },
        { t: Types.bishop, c: Colors.WHITE },
        { t: Types.queen, c: Colors.WHITE },
        { t: Types.king, c: Colors.WHITE },
        { t: Types.bishop, c: Colors.WHITE },
        { t: Types.knight, c: Colors.WHITE },
        { t: Types.rook, c: Colors.WHITE },
    ]
];

function getBoardView() {
    const boardView: string[][] = [[' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']];
    let rowNumber = 8;

    for (const row of board) {
        const rowLabel = (rowNumber--).toString();
        const rowData = row.map(cell => cell.c === Colors.BLACK ? colors.blue(cell.t) : colors.yellow(cell.t));
        boardView.push([rowLabel, ...rowData]);
    }

    return boardView;
}

table.setData({ headers: [], data: getBoardView() });

const inputBar = blessed.textbox({ bottom: 0, left: 0, height: 1, width: 20, style: { fg: 'white', bg: 'blue' } });

inputBar.setValue('Playing...');

screen.append(table);
screen.append(inputBar);

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.render()

function getBoardCoordinateByMove(chessPosition: string): number[] {
    const [chessColumn, chessRow] = chessPosition.split('');
    const boardColumn = chessColumn.charCodeAt(0) - 97;
    const boardRow = 8 - (+chessRow);

    return [boardRow, boardColumn];
}

ipc.serveNet(() => {
    ipc.server.on('move', (data: MoveDescriptor) => {
        const newBoard = cloneDeep(board);
        const fromBoardObj = getBoardCoordinateByMove(data.from);
        const toBoardObj = getBoardCoordinateByMove(data.to);

        newBoard[toBoardObj[0]][toBoardObj[1]] = cloneDeep(board[fromBoardObj[0]][fromBoardObj[1]]);
        newBoard[fromBoardObj[0]][fromBoardObj[1]] = cloneDeep(emptyLine[0]);

        board = newBoard;

        table.setData({ headers: [], data: getBoardView() })
        screen.render();
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
