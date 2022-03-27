import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import urls from '../socket/urls';
import { GameInterface } from '../../types/interfaces';
import axios from 'axios';

export default function useListOfGames(init: GameInterface[]) {
  const [listOfGames, setListOfGames] = useState<GameInterface[]>(init);

  useEffect(function getGamesOnMount() {
    (async () => {
      try {
        const res = await axios.get(urls.games);
        if (!res || res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching games');

        const games = await res.data;
        setListOfGames(games);
      } catch (error) {
        console.log(error);
      }
    })();
  });

  useEffect(function connectToSocket() {
    const socket = io(urls.games);

    socket.on('newGame', (game) => {
      setListOfGames([...listOfGames, game]);
    });

    socket.on('deletedGame', (id) => {
      setListOfGames(listOfGames.filter((g) => g._id !== id));
    });
  });

  return { listOfGames };
}
