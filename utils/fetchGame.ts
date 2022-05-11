import axios from 'axios';
import React from 'react';
import urls from './urls';
import { Board as BoardType, Square } from 'crochess-api/dist/types/types';
import { AllPieceMap, CastleObj } from 'crochess-api/dist/types/interfaces';
import updateGameDetails from './updateGameDetails';
import {
  FetchGameGameDetails,
  FetchGameStateUpdaters,
} from '../types/interfaces';

export default async function fetchGame(
  gameId: string,
  gameDetails: FetchGameGameDetails,
  stateUpdaters: FetchGameStateUpdaters
) {
  try {
    if (!gameId) return;
    const res = await axios.get(`${urls.backend}/games/${gameId}`);
    if (!res || res.status !== 200 || res.statusText !== 'OK')
      throw new Error('something went wrong fetching game');

    const game = await res.data;

    updateGameDetails.onFetch(gameId, game, gameDetails, stateUpdaters);
  } catch (err) {
    console.log(err);
  }
}
