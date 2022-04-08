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

export default function ActiveGame() {
  const startTimeRef = useRef({
    white: 0,
    black: 0,
  });
  const turnStartRef = useRef<number>(0);
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [gameboardView, setGameboardView] = useState<'white' | 'black'>(
    'white'
  );
  const [moveHistory, setMoveHistory] = useState([]);

  const router = useRouter();
  const { activeGameId: gameId } = router.query;
  // const gameId = '624ddfd99ce65c46beddcb84';

  useEffect(
    function fetchGame() {
      (async () => {
        try {
          if (!gameId) return;
          const res = await axios.get(`${urls.backend}/games/${gameId}`);
          if (!res || res.status !== 200 || res.statusText !== 'OK')
            throw new Error('something went wrong fetching game');

          const game = await res.data;
          startTimeRef.current.white = game.white.timeLeft;
          startTimeRef.current.black = game.black.timeLeft;

          turnStartRef.current = Date.now();

          setWhiteTime(game.white.timeLeft);
          setBlackTime(game.black.timeLeft);
          setTurn(game.turn);
        } catch (err) {
          console.log(err);
        }
      })();
    },
    [gameId]
  );

  useEffect(function connectToSocket() {
    const socket = io(`${urls.backend}/624ddfd99ce65c46beddcb84`);

    socket.on('update', (data) => {
      if (data['black.timeLeft']) {
        startTimeRef.current.black = data['black.timeLeft'];
        setBlackTime(data['black.timeLeft']);
      } else {
        startTimeRef.current.white = data['white.timeLeft'];
        setWhiteTime(data['white.timeLeft']);
      }
      startTimeRef.current;
      turnStartRef.current = data.turnStart;
      setTurn(data.turn);
    });
  }, []);

  function makeMove() {
    try {
      updateGame(gameId, { gameId });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <main className="two-section-view">
        <Gameboard
          view={gameboardView}
          startingPos={[
            ...createStartingPos('white'),
            ...createStartingPos('black'),
          ]}
          makeMove={makeMove}
        />
        <Interface
          whiteDetails={{
            startTime: startTimeRef.current.white,
            time: whiteTime,
            setTime: setWhiteTime,
            active: turn === 'white',
          }}
          blackDetails={{
            startTime: startTimeRef.current.black,
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
