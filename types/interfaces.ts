import { GameType, ColorOptions } from './types';

export interface GameInterface {
  color: ColorOptions;
  time: number;
  increment: number;
  gameType: GameType;
  _id: string;
}
