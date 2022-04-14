import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Gameboard from '../components/Game/Gameboard';
import Interface from '../components/Game/Interface';
import { PiecePos, PieceType } from '../types/types';
import { ActiveGameUpdateInterface } from '../types/interfaces';
import { io } from 'socket.io-client';
import urls from '../utils/urls';
import axios from 'axios';
import dayjs from 'dayjs';
import { formatTime } from '../utils/timerStuff';
import { Gameboard as Board } from 'crochess-api';
import { getKeyByValue } from '../utils/misc';

export default function ActiveGame() {
  const mounted = useRef(false);

  const startTimeRef = useRef(0);
  const turnStartRef = useRef<number>(0);
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [gameboardView, setGameboardView] = useState<'white' | 'black'>(
    'white'
  );

  const [playerIds, setPlayerIds] = useState({
    white: 'id',
    black: 'id',
  });
  const [moveHistory, setMoveHistory] = useState([]);

  const router = useRouter();
  const { activeGameId: gameId } = router.query;
  // const gameId = '624ddfd99ce65c46beddcb84';

  useEffect(function setMounted() {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(
    function fetchGame() {
      (async () => {
        try {
          if (!gameId) return;
          const res = await axios.get(`${urls.backend}/games/${gameId}`);
          if (!res || res.status !== 200 || res.statusText !== 'OK')
            throw new Error('something went wrong fetching game');

          const game = await res.data;

          const playerIds = {
            white: game.white.player as string,
            black: game.black.player as string,
          };
          setPlayerIds(playerIds);
          startTimeRef.current = game[game.turn].timeLeft;
          turnStartRef.current = Date.now();
          setGameboardView(() => {
            const user = sessionStorage.getItem('id');
            // check if user is a player or spectator
            if (user && Object.values(playerIds).includes(user))
              return game.white.player === user ? 'white' : 'black';
            else return 'white';
          });

          if (game.turnStart) {
            // if fetch happens in middle of game
            const elapsedTime = Date.now() - game.turnStart;
            switch (game.turn) {
              case 'white':
                setWhiteTime(game.white.timeLeft - elapsedTime);
                setBlackTime(game.black.timeLeft);
                break;
              case 'black':
                setBlackTime(game.black.timeLeft - elapsedTime);
                setWhiteTime(game.white.timeLeft);
                break;
            }
          } else {
            setWhiteTime(game.white.timeLeft);
            setBlackTime(game.black.timeLeft);
          }

          setTurn(game.turn);
        } catch (err) {
          console.log(err);
        }
      })();
    },
    [gameId]
  );

  useEffect(
    function connectToSocket() {
      const socket = io(`${urls.backend}/games`);
      if (gameId) socket.emit('joinRoom', gameId);
      socket.on('update', (data) => {
        const turn = data.turn;

        if (!mounted.current) return;

        setWhiteTime(data.white.timeLeft);
        setBlackTime(data.black.timeLeft);
        startTimeRef.current = data[turn].timeLeft;
        turnStartRef.current = data.turnStart;
        setTurn(data.turn);
      });
    },
    [gameId]
  );

  function makeMove() {
    try {
      const user = sessionStorage.getItem('id');
      const activePlayer =
        user && Object.values(playerIds).includes(user) ? true : false;

      const activeTurn =
        activePlayer && getKeyByValue(playerIds, user) === turn;
      if (activeTurn) updateGame(gameId, { gameId });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <main className="two-section-view">
        <Gameboard
          view={gameboardView}
          pieceMap={[
            ...createStartingPos('white'),
            ...createStartingPos('black'),
          ]}
          makeMove={makeMove}
        />
        <Interface
          whiteDetails={{
            startTime: startTimeRef.current,
            time: whiteTime,
            setTime: setWhiteTime,
            active: turn === 'white',
          }}
          blackDetails={{
            startTime: startTimeRef.current,
            time: blackTime,
            setTime: setBlackTime,
            active: turn === 'black',
          }}
          turnStart={turnStartRef.current}
          history={[]}
          view={gameboardView}
          flipBoard={() =>
            setGameboardView((prev) => {
              return prev === 'white' ? 'black' : 'white';
            })
          }
        />
      </main>
    </>
  );
}

async function updateGame(
  gameId: string | string[] | undefined,
  updates: ActiveGameUpdateInterface
) {
  await axios.put(`${urls.backend}/games/${gameId}`, updates);
}

function createStartingPos(color: 'white' | 'black'): PiecePos[] {
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const startRank = color === 'white' ? 1 : 8;
  const pawnRank = color === 'white' ? 2 : 7;

  const piecePosition: { [key: string]: PieceType } = {
    a: 'rook',
    b: 'knight',
    c: 'bishop',
    d: 'queen',
    e: 'king',
    f: 'bishop',
    g: 'knight',
    h: 'rook',
  };

  const pieces: PiecePos[] = cols.map((c) => {
    const square = c + startRank;
    const piece = piecePosition[c];

    return { square, piece, color };
  });

  const pawns: PiecePos[] = cols.map((c) => {
    const square = c + pawnRank;
    const piece = 'pawn';

    return { square, piece, color };
  });

  return [...pieces, ...pawns];
}
