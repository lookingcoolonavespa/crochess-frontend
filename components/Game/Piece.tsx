import { PieceType } from '../../types/types';
import styles from '../../styles/Piece.module.scss';

interface PieceProps {
  type: PieceType;
  color: 'white' | 'black';
}

export default function Piece({ type, color }: PieceProps) {
  return (
    <div className={`${styles.main} ${styles[type]} ${styles[color]}`}></div>
  );
}
