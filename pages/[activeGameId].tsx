import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Gameboard from '../components/Game/Gameboard';
import Interface from '../components/Game/Interface';
import { PiecePos, PieceType } from '../types/types';
import { io } from 'socket.io-client';
import urls from '../utils/urls';
import axios from 'axios';

export default function ActiveGame() {
  const [whiteTime, setWhiteTime] = useState(new Date());
  const [blackTime, setBlackTime] = useState(new Date());
  const [moveHistory, setMoveHistory] = useState([]);

  const gameId = '624ddfd99ce65c46beddcb84';

  useEffect(function fetchGame() {
    (async () => {
      try {
        const res = await axios.get(`${urls.backend}/games/${gameId}`);
        if (!res || res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching game');

        const game = await res.data;

        setWhiteTime(game.white.timeLeft);
        setBlackTime(game.black.timeLeft);
      } catch (err) {
        console.log(err);
      }
    })();
  });

  useEffect(function connectToSocket() {
    const socket = io(`${urls.backend}/624ddfd99ce65c46beddcb84`);
  });
  return (
    <>
      <Head>
        <html color-mode="light" />
      </Head>
      <main className="two-section-view">
        <Gameboard
          color="white"
          startingPos={[
            ...createStartingPos('white'),
            ...createStartingPos('black'),
          ]}
        />
        <Interface whiteTime={whiteTime} blackTime={blackTime} history={[]} />
      </main>
    </>
  );
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
