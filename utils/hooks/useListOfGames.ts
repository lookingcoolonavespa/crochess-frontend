import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import urls from '../urls';
import { GameSeekInterface } from '../../types/interfaces';
import axios from 'axios';

export default function useListOfGames(
  setUser: React.Dispatch<React.SetStateAction<string>>
) {
  const router = useRouter();
  const [listOfGames, setListOfGames] = useState<GameSeekInterface[]>([]);

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(function getGamesOnMount() {
    (async () => {
      try {
        const res = await axios.get(`${urls.backend}/gameSeeks`);
        if (!res || res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching games');

        const games = await res.data;

        setListOfGames(games);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(
    function connectToSocket() {
      const socket = io(`${urls.backend}/games`);

      socket.on('connect', () => {
        if (mounted.current) setUser(socket.id);
      });

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

      socket.on('startGame', (gameId) => {
        router.push(`/${gameId}`);
      });

      socket.on('deletedGame', (d) => {
        if (mounted.current)
          setListOfGames((prev) => prev.filter((g) => g._id !== d._id));
      });
    },
    [setUser, router]
  );

  return { listOfGames };
}
