import { AllPieceMap } from 'crochess-api/dist/types/interfaces';
import { Board } from 'crochess-api/dist/types/types';
import { PiecePos } from '../types/types';
import urls from './urls';

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

export function setIdToCookie(
  gameId: string,
  color: 'white' | 'black',
  id: string
) {
  document.cookie = `${gameId}(${color})=${id}; max-age=${60 * 60 * 24};`;
}

export function parseCookies(cookie: string): { [key: string]: string } {
  const cookies = cookie.split('; ');
  return cookies
    .map((c) => c.split('='))
    .reduce<{ [key: string]: string }>((acc, curr) => {
      const [key, value] = curr;
      acc[key] = value;
      return acc;
    }, {});
}

export function getActivePlayer(
  gameId: string,
  whiteId: string,
  blackId: string
) {
  const cookieObj = parseCookies(document.cookie);

  switch (true) {
    case cookieObj[`${gameId}(white)`] === whiteId &&
      cookieObj[`${gameId}(black)`] === blackId: {
      const user = sessionStorage.getItem(gameId);
      console.log(user);
      if (user === whiteId) return 'white';
      if (user === blackId) return 'black';
      return null;
      break;
    }
    case cookieObj[`${gameId}(white)`] === whiteId: {
      return 'white';
    }
    case cookieObj[`${gameId}(black)`] === blackId: {
      return 'black';
    }
    default:
      return null;
  }
}
