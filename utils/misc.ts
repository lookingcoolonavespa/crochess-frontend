import { AllPieceMap } from 'crochess-api/dist/types/interfaces';
import { Board } from 'crochess-api/dist/types/types';
import { PiecePos } from '../types/types';

export function createControlBtnObj(
  src?: string,
  alt?: string,
  text?: string,
  onClick?: () => void
) {
  return { src, alt, text, onClick };
}

export function getKeyByValue(
  obj: {
    [key: string]: any;
  },
  val: any
) {
  return Object.keys(obj).find((key) => obj[key] === val);
}

export function convertPieceMapToArray(pieceMap: AllPieceMap) {
  let array: PiecePos[] = [];

  let color: keyof typeof pieceMap;
  for (color in pieceMap) {
    const map = pieceMap[color];

    let piece: keyof typeof map;
    for (piece in map) {
      const squares = map[piece];
      squares.forEach((s) => {
        const piecePos = {
          color,
          piece,
          square: s,
        };

        array.push(piecePos);
      });
    }
  }

  return array;
}

export function convertMapToObj(map: Board) {
  let obj: {
    [key: string]: any;
  } = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}
