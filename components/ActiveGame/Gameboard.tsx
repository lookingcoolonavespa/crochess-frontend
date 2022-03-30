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
        const evenColumn = cols.indexOf(s.charAt(0)) % 2 === 0;
        const startRow =
          color === 'white' ? s.charAt(1) === '1' : s.charAt(1) === '8';
        const startCol = s.charAt(0) === 'a';

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
            {startRow && <div className={styles.file}>{s.charAt(0)}</div>}
            {startCol && <div className={styles.rank}>{s.charAt(1)}</div>}
          </div>
        );
      })}
    </div>
  );
}
