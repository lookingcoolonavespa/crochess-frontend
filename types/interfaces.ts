import { GameType, ColorOptions } from './types';

export interface GameSeekInterface {
  color: ColorOptions;
  time: number;
  increment: number;
  gameType: GameType;
  seeker: string;
  _id: string;
}
