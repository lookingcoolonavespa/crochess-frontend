import { Gameboard } from 'crochess-api';
import { AllPieceMap } from 'crochess-api/dist/types/interfaces';
import { Board, HistoryType } from 'crochess-api/dist/types/types';
import { PiecePos } from '../types/types';
import { toMilliseconds } from './timerStuff';

export function createControlBtnObj(
  src?: string,
  alt?: string,
  text?: string,
  onClick?: () => void,
  className?: string
) {
  return { src, alt, text, onClick, className };
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
    if (color !== 'black' && color !== 'white') continue;
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
  document.cookie = `${gameId}(${color})=${id};max-age=${60 * 60 * 24};domain=${
    process.env.NEXT_PUBLIC_URL_BACKEND
  };samesite=none;secure`;
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

export function getAllBoardStates(history: HistoryType) {
  const gameboard = Gameboard();

  return history.map((m, i) => {
    const newHistory = history.slice(0, i + 1);
  });
}

export function getGameType(ms: number) {
  switch (true) {
    case toMilliseconds({ minutes: 2 }) >= ms:
      return 'bullet';

    case toMilliseconds({ minutes: 5 }) >= ms:
      return 'blitz';

    case toMilliseconds({ minutes: 30 }) >= ms:
      return 'rapid';

    default:
      return 'classical';
  }
}

export function getOppColor(color: 'white' | 'black') {
  return color === 'white' ? 'black' : 'white';
}
