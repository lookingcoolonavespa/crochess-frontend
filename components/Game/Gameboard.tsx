import { AllPieceMap, GameboardObj } from 'crochess-api/dist/types/interfaces';
import { Moves, Square } from 'crochess-api/dist/types/types';

import React, { useState } from 'react';
import styles from '../../styles/Gameboard.module.scss';
import { PiecePos } from '../../types/types';
import { convertPieceMapToArray } from '../../utils/misc';
import Piece from './Piece';

const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const squares: string[] = cols.reduce((acc: string[], curr) => {
  rows.forEach((r) => acc.push(curr + r));
  return acc;
}, []);

interface GameboardProps {
  view: 'white' | 'black';
  board?: GameboardObj;
  makeMove: (square: Square) => void;
  setPieceToMove: React.Dispatch<React.SetStateAction<Square | null>>;
}

export default React.memo(function Gameboard({
  view,
  board,
  makeMove,
  setPieceToMove,
}: GameboardProps) {
  const [highlightedSquares, setHighlightedSquares] = useState<Moves>([]);
  const piecePos =
    (board && convertPieceMapToArray(board.get.pieceMap())) || null;
  return (
    <div className={`${styles.main} ${styles[view]}`}>
      {squares.map((s, i) => {
        const [col, row] = s.split('');

        // board needs to be flipped for black
        const evenColumn = cols.indexOf(col) % 2 === 0;
        const startRow = view === 'white' ? row === '1' : row === '8';
        const endCol = col === 'h';

        const classNames = [styles.boardSquare];
        if (evenColumn) classNames.push(styles['col-even']);
        else classNames.push(styles['col-odd']);
        if (highlightedSquares.includes(s)) classNames.push(styles.active);

        return (
          <div
            key={i}
            className={classNames.join(' ')}
            style={{
              gridArea: s,
            }}
            onClick={() => {
              setPieceToMove(null);
              setHighlightedSquares([]);
              makeMove(s);
            }}
          >
            {startRow && <div className={`${styles.file} label`}>{col}</div>}
            {endCol && <div className={`${styles.rank} label`}>{row}</div>}
          </div>
        );
      })}
      {
        // pieces
        piecePos &&
          piecePos.map((p, i) => {
            return (
              <Piece
                key={i}
                color={p.color}
                square={p.square}
                type={p.piece}
                onClick={function displayLegalMoves() {
                  setPieceToMove(p.square);
                  setHighlightedSquares(
                    board?.at(p.square).getLegalMoves() as Moves
                  );
                }}
              />
            );
          })
      }
    </div>
  );
});
