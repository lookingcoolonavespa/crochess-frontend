import { GameType, ColorOptions } from './types';

export interface GameInterface {
  color: ColorOptions;
  timeControl: string;
  gameType: GameType;
  _id: string;
}
