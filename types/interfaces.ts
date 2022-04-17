import { SquareObj } from 'crochess-api/dist/types/interfaces';
import { Board, Square } from 'crochess-api/dist/types/types';
import { GameType, ColorOptions } from './types';

export interface GameSeekInterface {
  color: ColorOptions;
  time: number;
  increment: number;
  gameType: GameType;
  seeker: string;
  _id: string;
}

export interface TimeObjInterface {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface ControlBtnObj {
  src?: string;
  alt?: string;
  text?: string;
  onClick?: () => void;
}

interface Player {
  player: string;
  time: number;
}
export interface ActiveGameInterface {
  white: Player;
  black: Player;
  // board: Board;
  // scoreSheet: string[];
  time: number;
  increment: number;
  turn: 'white' | 'black';
  turnStart: number;
}
