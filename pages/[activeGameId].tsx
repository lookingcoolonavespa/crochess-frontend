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
import styles from '../styles/ActiveGame.module.scss';
import fetchGame from '../utils/fetchGame';
import updateGameDetails from '../utils/updateGameDetails';

export default function ActiveGame() {
  const mounted = useRef(false);

  const timeDetailsRef = useRef({
    startTime: 0,
    turnStart: 0,
    maxTime: 0,
  });
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
  const pieceMapsRef = useRef<AllPieceMap[]>([]);
  const [moveHistory, setMoveHistory] = useState<string[][]>([]);
  const [gameOverDetails, setGameOverDetails] = useState<{
    winner: 'black' | 'white' | null;
    reason: string;
  }>();

  const [pieceToMove, setPieceToMove] = useState<Square | null>(null);
  const [promotePopupSquare, setPromotePopupSquare] = useState<Square | null>(
    null
  );

  const router = useRouter();
  const { activeGameId: gameId } = router.query;

  useEffect(function setMounted() {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(
    function () {
      if (!gameId) return;
      (async () => {
        await fetchGame(
          gameId as string,
          {
            timeDetailsRef,
            activePlayerRef,
            pieceMapsRef,
          },
          {
            setGameOverDetails,
            setGameboardView,
            setBoardState,
            setMoveHistory,
            setWhiteTime,
            setBlackTime,
            setCurrentPieceMapIdx,
            setTurn,
          }
        );
      })();
    },
    [gameId]
  );

  useEffect(
    function connectToSocket() {
      const socket = io(`${urls.backend}/games`);

      if (gameId) socket.emit('joinRoom', gameId);

      socket.on('update', (data) => {
        updateGameDetails.onUpdate(
          data,
          {
            timeDetailsRef,
            pieceMapsRef,
          },
          {
            setGameOverDetails,
            setBoardState,
            setMoveHistory,
            setWhiteTime,
            setBlackTime,
            setCurrentPieceMapIdx,
            setTurn,
          }
        );
      });
    },
    [gameId]
  );

  const gameboard = useMemo(
    () => Board(boardState.board, boardState.checks, boardState.castleRights),
    [boardState]
  );

  const validateMove = useCallback(
    (square: Square) => {
      if (gameOverDetails) return false;
      if (!boardState || !pieceToMove) return false;
      if (currentPieceMapIdx !== pieceMapsRef.current.length - 1) return false;

      if (gameboard.at(pieceToMove).piece?.color !== activePlayerRef.current)
        return false;
      if (!gameboard.validate.move(pieceToMove, square)) return false;
      if (activePlayerRef.current !== turn) return false;

      return true;
    },
    [
      gameboard,
      boardState,
      currentPieceMapIdx,
      gameOverDetails,
      pieceToMove,
      turn,
    ]
  );

  const checkPromotion = useCallback(
    (square: Square) => {
      return gameboard.validate.promotion(pieceToMove as string, square);
    },
    [gameboard.validate, pieceToMove]
  );

  const makeMove = useCallback(
    async (
      to: Square,
      promote: 'queen' | 'rook' | 'knight' | 'bishop' | '' = ''
    ) => {
      /* start of main function */
      const valid = validateMove(to);
      if (!valid) return;
      if (promote && !checkPromotion(to)) return;

      updatePieceMaps();

      try {
        await sendMove(to, promote);
      } catch (err) {
        console.log(err);
      }
      /* end of main function */

      // helper functions
      async function sendMove(
        to: Square,
        promote: 'queen' | 'rook' | 'knight' | 'bishop' | '' = ''
      ) {
        const res = await axios.put(
          `${urls.backend}/games/${gameId}`,
          {
            gameId,
            to,
            promote,
            from: pieceToMove,
          },
          {
            withCredentials: true,
          }
        );

        if (!res || res.status !== 200 || res.statusText !== 'OK')
          throw new Error('something went wrong fetching game');
        const elapsed = await res.data;
        console.log(elapsed);
      }

      function updatePieceMaps() {
        const gameboard = Board(new Map(boardState.board));
        gameboard.from(pieceToMove as string).to(to);
        if (promote) gameboard.at(pieceToMove as string).promote(promote);
        pieceMapsRef.current.push(gameboard.get.pieceMap());
        setCurrentPieceMapIdx(pieceMapsRef.current.length - 1);
      }
    },
    [gameId, boardState, validateMove, checkPromotion, pieceToMove]
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
    if (!pieceMapsRef.current.length)
      pieceMap = Board(
        boardState.board,
        boardState.checks,
        boardState.castleRights
      ).get.pieceMap();
    else pieceMap = pieceMapsRef.current[currentPieceMapIdx];
    return convertPieceMapToArray(pieceMap);
  }, [boardState, currentPieceMapIdx]);

  const historyControls = useMemo(() => {
    return {
      goBackToStart: () => {
        if (!pieceMapsRef.current.length) return;
        setCurrentPieceMapIdx(0);
      },
      goBackOneMove: () => {
        if (!pieceMapsRef.current.length) return;
        setCurrentPieceMapIdx((prev) => {
          if (prev === 0) return prev;
          return prev - 1;
        });
      },
      goForwardOneMove: () => {
        if (!pieceMapsRef.current.length) return;
        setCurrentPieceMapIdx((prev) => {
          if (prev === pieceMapsRef.current.length - 1) return prev;
          return prev + 1;
        });
      },
      goToCurrentMove: () => {
        if (!pieceMapsRef.current.length) return;
        setCurrentPieceMapIdx(pieceMapsRef.current.length - 1);
      },
    };
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles['game-contents']}>
        <Gameboard
          view={gameboardView}
          piecePos={piecePos}
          makeMove={makeMove}
          pieceToMove={pieceToMove}
          setPieceToMove={setPieceToMove}
          getLegalMoves={getLegalMoves}
          activePlayer={activePlayerRef.current}
          promotePopupSquare={promotePopupSquare}
          setPromotePopupSquare={setPromotePopupSquare}
          checkPromotion={(s: Square) => {
            return validateMove(s) && checkPromotion(s);
          }}
          onPromote={(e) => {
            e.stopPropagation();
            makeMove(
              promotePopupSquare as Square,
              e.currentTarget.dataset.piece as
                | 'queen'
                | 'rook'
                | 'knight'
                | 'bishop'
            );
            setPromotePopupSquare(null);
          }}
        ></Gameboard>
        <Interface
          gameOverDetails={gameOverDetails}
          whiteDetails={{
            maxTime: timeDetailsRef.current.maxTime,
            startTime: timeDetailsRef.current.startTime,
            time: whiteTime,
            setTime: setWhiteTime,
            active: !gameOverDetails && turn === 'white',
          }}
          blackDetails={{
            maxTime: timeDetailsRef.current.maxTime,
            startTime: timeDetailsRef.current.startTime,
            time: blackTime,
            setTime: setBlackTime,
            active: !gameOverDetails && turn === 'black',
          }}
          turnStart={timeDetailsRef.current.turnStart}
          history={moveHistory}
          historyControls={historyControls}
          view={gameboardView}
          flipBoard={() =>
            setGameboardView((prev) => {
              return prev === 'white' ? 'black' : 'white';
            })
          }
        />
      </div>
    </main>
  );
}
