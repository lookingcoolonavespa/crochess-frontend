import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Gameboard from '../components/Game/Gameboard';
import Interface from '../components/Game/Interface';
import { io } from 'socket.io-client';
import urls from '../utils/urls';
import axios from 'axios';
import { Gameboard as Board } from 'crochess-api';
import {
  Board as BoardType,
  Moves,
  Square,
} from 'crochess-api/dist/types/types';
import { AllPieceMap, CastleObj } from 'crochess-api/dist/types/interfaces';
import { convertPieceMapToArray, getActivePlayer } from '../utils/misc';

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

  const activePlayerRef = useRef<'white' | 'black' | null>(null);
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
  const [currentPieceMapIdx, setCurrentPieceMapIdx] = useState(0);
  const pieceMaps = useRef<AllPieceMap[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[][]>([]);
  const [gameOverDetails, setGameOverDetails] = useState<{
    winner: 'black' | 'white' | null;
    reason: string;
  }>();

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

          if (game.winner) {
            setGameOverDetails({
              winner: game.winner,
              reason: game.causeOfDeath,
            });
          }

          if (game.active) {
            startTimeRef.current = game[game.turn].timeLeft;
            turnStartRef.current = game.turnStart || Date.now();
          }

          activePlayerRef.current = getActivePlayer(
            gameId as string,
            game.white.player,
            game.black.player
          );
          setGameboardView(() => activePlayerRef.current || 'white');
          setBoardState({
            board: new Map(Object.entries(game.board)),
            checks: game.checks,
            castleRights: game.castle,
          });

          setMoveHistory(game.history);

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

            const res2 = await axios.get(
              `${urls.backend}/pieceMaps/${game.pieceMaps}`
            );
            if (!res2 || res2.status !== 200 || res2.statusText !== 'OK')
              throw new Error('something went wrong fetching piece maps');

            const oldPieceMaps = await res2.data;
            pieceMaps.current = oldPieceMaps.list;
            setCurrentPieceMapIdx(pieceMaps.current.length - 1);
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

        if (data.winner) {
          setGameOverDetails({
            winner: data.winner,
            reason: data.causeOfDeath,
          });
        }

        setBoardState({
          board: new Map(Object.entries(data.board)),
          checks: data.checks,
          castleRights: data.castle,
        });

        pieceMaps.current.push(
          Board(
            new Map(Object.entries(data.board)),
            data.checks,
            data.castle
          ).get.pieceMap()
        );
        setCurrentPieceMapIdx((prev) => {
          if (prev === pieceMaps.current.length - 2)
            return pieceMaps.current.length - 1;
          else return prev;
        });
        setMoveHistory(data.history);

        setWhiteTime(data.white.timeLeft);
        setBlackTime(data.black.timeLeft);
        if (data.active) {
          startTimeRef.current = data[turn].timeLeft;
          turnStartRef.current = data.turnStart;
        }
        setTurn(data.turn);
      });
    },
    [gameId]
  );

  const makeMove = useCallback(
    async (square: Square) => {
      if (gameOverDetails) return;
      if (!boardState || !pieceToMove) return;
      if (currentPieceMapIdx !== pieceMaps.current.length - 1) return;

      const gameboard = Board(
        boardState.board,
        boardState.checks,
        boardState.castleRights
      );

      if (gameboard.at(pieceToMove).piece?.color !== activePlayerRef.current)
        return;
      if (!gameboard.at(pieceToMove).getLegalMoves().includes(square)) return;
      if (activePlayerRef.current !== turn) return;

      try {
        gameboard.from(pieceToMove).to(square);
        setBoardState((prev) => ({ ...prev, board: gameboard.board }));

        await axios.put(
          `${urls.backend}/games/${gameId}`,
          {
            gameId,
            from: pieceToMove,
            to: square,
          },
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
        gameboard.from(square).to(pieceToMove);
        setBoardState((prev) => ({ ...prev, board: gameboard.board }));
      }
    },
    [gameId, turn, boardState, pieceToMove, gameOverDetails, currentPieceMapIdx]
  );

  const getLegalMoves = useCallback(
    (square: Square): Moves =>
      Board(boardState.board, boardState.checks, boardState.castleRights)
        .at(square)
        .getLegalMoves(),
    [boardState]
  );

  const piecePos = useMemo(() => {
    let pieceMap;
    if (
      currentPieceMapIdx === pieceMaps.current.length - 1 ||
      !pieceMaps.current.length
    )
      pieceMap = Board(
        boardState.board,
        boardState.checks,
        boardState.castleRights
      ).get.pieceMap();
    else pieceMap = pieceMaps.current[currentPieceMapIdx];
    return convertPieceMapToArray(pieceMap);
  }, [boardState, currentPieceMapIdx]);

  function goBackToStart() {
    if (!pieceMaps.current.length) return;
    setCurrentPieceMapIdx(0);
  }
  function goBackOneMove() {
    if (!pieceMaps.current.length) return;
    setCurrentPieceMapIdx((prev) => {
      if (prev === 0) return prev;
      return prev - 1;
    });
  }
  function goForwardOneMove() {
    if (!pieceMaps.current.length) return;
    setCurrentPieceMapIdx((prev) => {
      if (prev === pieceMaps.current.length - 1) return prev;
      return prev + 1;
    });
  }
  function goToCurrentMove() {
    if (!pieceMaps.current.length) return;
    setCurrentPieceMapIdx(pieceMaps.current.length - 1);
  }

  return (
    <>
      <main className="two-section-view">
        <Gameboard
          view={gameboardView}
          piecePos={piecePos}
          makeMove={makeMove}
          pieceToMove={pieceToMove}
          setPieceToMove={setPieceToMove}
          getLegalMoves={getLegalMoves}
          activePlayer={activePlayerRef.current}
        />
        <Interface
          gameOverDetails={gameOverDetails}
          whiteDetails={{
            startTime: startTimeRef.current,
            time: whiteTime,
            setTime: setWhiteTime,
            active: !gameOverDetails && turn === 'white',
          }}
          blackDetails={{
            startTime: startTimeRef.current,
            time: blackTime,
            setTime: setBlackTime,
            active: !gameOverDetails && turn === 'black',
          }}
          turnStart={turnStartRef.current}
          history={moveHistory}
          historyControls={{
            goBackToStart,
            goBackOneMove,
            goForwardOneMove,
            goToCurrentMove,
          }}
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

/* what is different if game is over 
- timers arent active
- theres a display box which displays game is over + reason
- cant make a move 

*/
