import { PieceType } from '../../types/types';
import styles from '../../styles/Piece.module.scss';
import KingBlack from '../../public/icons/chess_pieces/king-b.svg';
import QueenBlack from '../../public/icons/chess_pieces/queen-b.svg';
import RookBlack from '../../public/icons/chess_pieces/rook-b.svg';
import BishopBlack from '../../public/icons/chess_pieces/bishop-b.svg';
import KnightBlack from '../../public/icons/chess_pieces/knight-b.svg';
import PawnBlack from '../../public/icons/chess_pieces/pawn-b.svg';
import KingWhite from '../../public/icons/chess_pieces/king-w.svg';
import QueenWhite from '../../public/icons/chess_pieces/queen-w.svg';
import RookWhite from '../../public/icons/chess_pieces/rook-w.svg';
import BishopWhite from '../../public/icons/chess_pieces/bishop-w.svg';
import KnightWhite from '../../public/icons/chess_pieces/knight-w.svg';
import PawnWhite from '../../public/icons/chess_pieces/pawn-w.svg';
import Image from 'next/image';

const piecesSVG = {
  white: {
    king: KingWhite,
    queen: QueenWhite,
    rook: RookWhite,
    bishop: BishopWhite,
    knight: KnightWhite,
    pawn: PawnWhite,
  },
  black: {
    king: KingBlack,
    queen: QueenBlack,
    rook: RookBlack,
    bishop: BishopBlack,
    knight: KnightBlack,
    pawn: PawnBlack,
  },
};

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
    >
      <Image src={piecesSVG[color][type]} alt={`${type} ${color}`} />
    </div>
  );
}
