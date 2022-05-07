import { SquareObj } from 'crochess-api/dist/types/interfaces';
import { Board, Square } from 'crochess-api/dist/types/types';
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
