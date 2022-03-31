import { useRouter } from 'next/router';
import Gameboard from '../components/Game/Gameboard';
import { PiecePos, PieceType } from '../types/types';

export default function ActiveGame() {
  return (
    <Gameboard
      color="white"
      startingPos={[
        ...createStartingPos('white'),
        ...createStartingPos('black'),
      ]}
    />
  );
}

function createStartingPos(color: 'white' | 'black'): PiecePos[] {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const startRank = color === 'white' ? 1 : 8;
  const pawnRank = color === 'white' ? 2 : 7;

  const piecePosition: { [key: string]: PieceType } = {
    a: 'rook',
    b: 'knight',
    c: 'bishop',
    d: 'queen',
    e: 'king',
    f: 'bishop',
    g: 'knight',
    h: 'rook',
  };

  const pieces: PiecePos[] = cols.map((c) => {
    const square = c + startRank;
    const piece = piecePosition[c];

    return { square, piece, color };
  });

  const pawns: PiecePos[] = cols.map((c) => {
    const square = c + pawnRank;
    const piece = 'pawn';

    return { square, piece, color };
  });

  return [...pieces, ...pawns];
}
