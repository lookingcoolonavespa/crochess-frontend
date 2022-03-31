export type GameType = 'blitz' | 'bullet' | 'rapid' | 'classical';

export type ColorOptions = 'black' | 'white' | 'random';

export type PieceType =
  | 'king'
  | 'queen'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'pawn';

export type PiecePos = {
  piece: PieceType;
  square: string;
  color: 'white' | 'black';
};
