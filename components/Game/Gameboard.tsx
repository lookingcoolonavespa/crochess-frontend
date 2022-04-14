import styles from '../../styles/Gameboard.module.scss';
import { PiecePos } from '../../types/types';
import Piece from './Piece';

const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const squares: string[] = cols.reduce((acc: string[], curr) => {
  rows.forEach((r) => acc.push(curr + r));
  return acc;
}, []);

interface GameboardProps {
  view: 'white' | 'black';
  pieceMap: PiecePos[];
  makeMove: () => void;
}

export default function Gameboard({
  view,
  pieceMap,
  makeMove,
}: GameboardProps) {
  return (
    <div className={`${styles.main} ${styles[view]}`}>
      {squares.map((s, i) => {
        const [col, row] = s.split('');

        // board needs to be flipped for black
        const evenColumn = cols.indexOf(col) % 2 === 0;
        const startRow = view === 'white' ? row === '1' : row === '8';
        const endCol = col === 'h';

        return (
          <div
            key={i}
            className={`${styles.boardSquare} ${
              evenColumn ? `${styles['col-even']}` : `${styles['col-odd']}`
            }`}
            style={{
              gridArea: s,
            }}
            onClick={makeMove}
          >
            {startRow && <div className={`${styles.file} label`}>{col}</div>}
            {endCol && <div className={`${styles.rank} label`}>{row}</div>}
          </div>
        );
      })}
      {
        // pieces
        pieceMap.map((p, i) => {
          return (
            <Piece key={i} color={p.color} square={p.square} type={p.piece} />
          );
        })
      }
    </div>
  );
}
