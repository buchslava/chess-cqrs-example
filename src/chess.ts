import * as colors from 'colors/safe';
import { cloneDeep } from 'lodash';

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

export interface MoveDescriptor {
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

function getBoardCoordinateByMove(chessPosition: string): number[] {
    const [chessColumn, chessRow] = chessPosition.split('');
    const boardColumn = chessColumn.charCodeAt(0) - 97;
    const boardRow = 8 - (+chessRow);

    return [boardRow, boardColumn];
}

export function getBoardView() {
    const boardView: string[][] = [[' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']];
    let rowNumber = 8;

    for (const row of board) {
        const rowLabel = (rowNumber--).toString();
        const rowData = row.map(cell => cell.c === Colors.BLACK ? colors.blue(cell.t) : colors.yellow(cell.t));
        boardView.push([rowLabel, ...rowData]);
    }

    return boardView;
}

export function chessMoveHandler(data: MoveDescriptor, onChessMoveProessed: Function) {
    const newBoard = cloneDeep(board);
    const fromBoardObj = getBoardCoordinateByMove(data.from);
    const toBoardObj = getBoardCoordinateByMove(data.to);

    newBoard[toBoardObj[0]][toBoardObj[1]] = cloneDeep(board[fromBoardObj[0]][fromBoardObj[1]]);
    newBoard[fromBoardObj[0]][fromBoardObj[1]] = cloneDeep(emptyLine[0]);

    board = newBoard;

    onChessMoveProessed();
}