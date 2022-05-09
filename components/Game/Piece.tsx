import { PieceType } from '../../types/types';
import styles from '../../styles/Piece.module.scss';

interface PieceProps {
  type: PieceType;
  color: 'white' | 'black';
  square?: string;
  onClick?: () => void;
}

export default function Piece({ type, color, square, onClick }: PieceProps) {
  return (
    <div
      className={`${styles.main} ${styles[type]} ${styles[color]}`}
      style={{ gridArea: square }}
      onClick={onClick}
    ></div>
  );
}
