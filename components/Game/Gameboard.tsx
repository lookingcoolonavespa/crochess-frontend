import styles from '../../styles/Gameboard.module.scss';

const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const rows = [1, 2, 3, 4, 5, 6, 7, 8];
const squares: string[] = cols.reduce((acc: string[], curr) => {
  rows.forEach((r) => acc.push(curr + r));
  return acc;
}, []);

interface GameboardProps {
  color: 'white' | 'black';
}

export default function Gameboard({ color }: GameboardProps) {
  return (
    <div className={styles.main}>
      {squares.map((s, i) => {
        const [col, row] = s.split('');

        const evenColumn = cols.indexOf(col) % 2 === 0;
        const startRow = color === 'white' ? row === '1' : row === '8';
        const endCol = color === 'white' ? col === 'h' : col === 'a';

        return (
          <div
            key={i}
            className={`${styles.boardSquare} ${
              evenColumn ? `${styles['col-even']}` : `${styles['col-odd']}`
            }`}
            style={{
              gridArea: s,
            }}
          >
            {startRow && <div className={`${styles.file} label`}>{col}</div>}
            {endCol && <div className={`${styles.rank} label`}>{row}</div>}
          </div>
        );
      })}
    </div>
  );
}
