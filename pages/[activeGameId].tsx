import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Gameboard from '../components/Game/Gameboard';
import Interface from '../components/Game/Interface';
import { PiecePos, PieceType } from '../types/types';
import { io } from 'socket.io-client';
import urls from '../utils/urls';
import axios from 'axios';
import dayjs from 'dayjs';
import { formatTime } from '../utils/timerStuff';
import { Gameboard as Board, Castle } from 'crochess-api';
import {
  Board as BoardType,
  Moves,
  Square,
} from 'crochess-api/dist/types/types';
import {
  AllPieceMap,
  GameboardObj,
  CastleObj,
} from 'crochess-api/dist/types/interfaces';
import { getKeyByValue, convertPieceMapToArray } from '../utils/misc';

export default function ActiveGame() {
  const mounted = useRef(false);

  const [playerIds, setPlayerIds] = useState({
    white: 'id',
    black: 'id',
  });

  const startTimeRef = useRef(0);
  const turnStartRef = useRef<number>(0);
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [gameboardView, setGameboardView] = useState<'white' | 'black'>(
    'white'
  );

  const [boardState, setBoardState] = useState<{
    board: BoardType;
    checks: Square[];
    castleRights: CastleObj;
  }>({
    board: Board().board,
    checks: [],
    castleRights: {
      white: { kingside: false, queenside: false },
      black: { kingside: false, queenside: false },
    },
  });
  const [moveHistory, setMoveHistory] = useState([]);

  const [pieceToMove, setPieceToMove] = useState<Square | null>(null);

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
          turnStartRef.current = game.turnStart || Date.now();
          setGameboardView(() => {
            const user = sessionStorage.getItem('id');
            // check if user is a player or spectator
            if (user && Object.values(playerIds).includes(user))
              return game.white.player === user ? 'white' : 'black';
            else return 'white';
          });
          setBoardState({
            board: new Map(Object.entries(game.board)),
            checks: game.checks,
            castleRights: game.castle,
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
      let runCount = 0;
      const socket = io(`${urls.backend}/games`);

      if (gameId) socket.emit('joinRoom', gameId);

      socket.on('update', (data) => {
        const turn = data.turn;

        if (!mounted.current) return;

        setBoardState({
          board: new Map(Object.entries(data.board)),
          checks: data.checks,
          castleRights: data.castle,
        });

        setWhiteTime(data.white.timeLeft);
        setBlackTime(data.black.timeLeft);
        startTimeRef.current = data[turn].timeLeft;
        turnStartRef.current = data.turnStart;
        setTurn(data.turn);
      });
    },
    [gameId]
  );

  const makeMove = useCallback(
    async (square: Square) => {
      if (!boardState || !pieceToMove) return;

      const gameboard = Board(
        boardState.board,
        boardState.checks,
        boardState.castleRights
      );

      try {
        const user = sessionStorage.getItem('id');
        const activePlayer =
          user && Object.values(playerIds).includes(user) ? true : false;

        const activeTurn =
          activePlayer && getKeyByValue(playerIds, user) === turn;

        // const legalMoves = gameboard.at(pieceToMove).getLegalMoves();

        if (activeTurn) {
          gameboard.from(pieceToMove).to(square);
          console.log(gameboard.board);
          setBoardState((prev) => ({ ...prev, board: gameboard.board }));
        }
        await axios.put(`${urls.backend}/games/${gameId}`, {
          gameId,
          from: pieceToMove,
          to: square,
        });
      } catch (err) {
        console.log(err);
        gameboard.from(square).to(pieceToMove);
        setBoardState((prev) => ({ ...prev, board: gameboard.board }));
      }
    },
    [gameId, playerIds, turn, boardState, pieceToMove]
  );

  const getLegalMoves = useCallback(
    (square: Square): Moves =>
      Board(boardState.board, boardState.checks, boardState.castleRights)
        .at(square)
        .getLegalMoves(),
    [boardState]
  );

  const piecePos = useMemo(() => {
    return convertPieceMapToArray(
      Board(
        boardState.board,
        boardState.checks,
        boardState.castleRights
      ).get.pieceMap()
    );
  }, [boardState]);

  return (
    <>
      <main className="two-section-view">
        <Gameboard
          view={gameboardView}
          piecePos={piecePos}
          makeMove={makeMove}
          setPieceToMove={setPieceToMove}
          getLegalMoves={getLegalMoves}
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
