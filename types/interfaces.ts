import { CastleObj, AllPieceMap } from 'crochess-api/dist/types/interfaces';
import { Board, Square, HistoryType } from 'crochess-api/dist/types/types';
import { GameType, ColorOptions } from './types';
import { Dispatch, SetStateAction, HTMLInputTypeAttribute } from 'react';

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
  timeLeft: number;
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

export interface FormProps {
  fields: FieldsInterface[];
  inputValues: { [key: string]: string | number };
  actionBtnText?: string;
  noCancelBtn: boolean;
  cancelBtnText?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  submitAction: (() => Promise<void>) | (() => void);
  cleanUp?: () => void;
  close: () => void;
  setError: Dispatch<SetStateAction<string>>;
}

export interface SelectOptionsInterface {
  value: string;
  display?: string;
}

export interface FieldsInterface {
  label: string;
  name: string;
  type: HTMLInputTypeAttribute | 'dropdown' | 'radioList';
  defaultValue?: string | number;
  options?: { value: string; display?: string }[];
  unitsDisplay?: {
    label?: string;
    name?: string;
    type?: 'text' | 'dropdown';
    options?: SelectOptionsInterface[];
  };
}

export interface GameInterface {
  white: Player;
  black: Player;
  board: Board;
  checks: Square[];
  castle: CastleObj;
  history: HistoryType;
  time: number;
  increment: number;
  turn: 'white' | 'black';
  turnStart?: number;
  active: boolean;
  winner: 'white' | 'black' | null;
  causeOfDeath: string;
  claimDraw: {
    white: boolean;
    black: boolean;
  };
}

export interface FetchGameStateUpdaters {
  setGameOverDetails: React.Dispatch<
    React.SetStateAction<
      | {
          winner: 'white' | 'black' | null;
          reason: string;
        }
      | undefined
    >
  >;

  setGameboardView: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
  setBoardState: React.Dispatch<
    React.SetStateAction<{
      board: Board;
      checks: Square[];
      castleRights: CastleObj;
    }>
  >;
  setMoveHistory: React.Dispatch<React.SetStateAction<string[][]>>;
  setWhiteTime: React.Dispatch<React.SetStateAction<number>>;
  setBlackTime: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPieceMapIdx: React.Dispatch<React.SetStateAction<number>>;
  setTurn: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
}

export interface FetchGameGameDetails {
  timeDetailsRef: React.MutableRefObject<{
    startTime: number;
    turnStart: number;
    maxTime: number;
  }>;
  activePlayerRef: React.MutableRefObject<'white' | 'black' | null>;
  pieceMapsRef: React.MutableRefObject<AllPieceMap[]>;
}

export interface UpdateGameGameDetails {
  timeDetailsRef: React.MutableRefObject<{
    startTime: number;
    turnStart: number;
    maxTime: number;
  }>;
  pieceMapsRef: React.MutableRefObject<AllPieceMap[]>;
}

export interface UpdateGameStateUpdaters {
  setGameOverDetails: React.Dispatch<
    React.SetStateAction<
      | {
          winner: 'white' | 'black' | null;
          reason: string;
        }
      | undefined
    >
  >;
  setBoardState: React.Dispatch<
    React.SetStateAction<{
      board: Board;
      checks: Square[];
      castleRights: CastleObj;
    }>
  >;
  setMoveHistory: React.Dispatch<React.SetStateAction<string[][]>>;
  setWhiteTime: React.Dispatch<React.SetStateAction<number>>;
  setBlackTime: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPieceMapIdx: React.Dispatch<React.SetStateAction<number>>;
  setTurn: React.Dispatch<React.SetStateAction<'white' | 'black'>>;
}

export interface GameOverDetailsInterface {
  winner: 'black' | 'white' | null;
  reason: string;
}
