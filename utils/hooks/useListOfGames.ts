import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import urls from '../socket/urls';
import { GameSeekInterface } from '../../types/interfaces';
import axios from 'axios';

export default function useListOfGames(
  init: GameSeekInterface[],
  setSeeker: React.Dispatch<React.SetStateAction<string>>
) {
  const [listOfGames, setListOfGames] = useState<GameSeekInterface[]>(init);

  useEffect(function getGamesOnMount() {
    (async () => {
      try {
        const res = await axios.get(urls.games);
        if (!res || res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching games');

        const games = await res.data;

        setListOfGames((prev) => [...prev, ...games]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(
    function connectToSocket() {
      const socket = io(urls.games);

      socket.on('connect', () => setSeeker(socket.id));

      socket.on('newGame', (game) => {
        setListOfGames((prev) => {
          const newList = [...prev, game].reduce((acc, curr) => {
            // push current seeker to top of the list
            if (curr.seeker === socket.id) acc.unshift(curr);
            else acc.push(curr);
            return acc;
          }, []);

          return newList;
        });
      });

      socket.on('deletedGame', (id) => {
        setListOfGames((prev) => prev.filter((g) => g._id !== id));
      });
    },
    [setSeeker]
  );

  return { listOfGames };
}
