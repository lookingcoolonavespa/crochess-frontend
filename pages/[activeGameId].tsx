import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Gameboard from '../components/Game/Gameboard';
import Interface from '../components/Game/Interface';
import { io } from 'socket.io-client';
import { Gameboard as Board } from 'crochess-api';
import {
  Board as BoardType,
  Moves,
  Square,
} from 'crochess-api/dist/types/types';
import { AllPieceMap, CastleObj } from 'crochess-api/dist/types/interfaces';
import {
  convertPieceMapToArray,
  getActivePlayer,
  getOppColor,
} from '../utils/misc';
import styles from '../styles/ActiveGame.module.scss';
import { fetchGame, sendMove } from '../utils/game';
import updateGameDetails from '../utils/updateGameDetails';
import { GameOverDetailsInterface } from '../types/interfaces';

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
  const [claimDrawDetails, setClaimDrawDetails] = useState({
    white: false,
    black: false,
  });
  const [gameOverDetails, setGameOverDetails] =
    useState<GameOverDetailsInterface>();

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
            setClaimDrawDetails,
            setTurn,
          }
        );
      })();
    },
    [gameId]
  );

  useEffect(
    function connectToSocket() {
      const socket = io(`${process.env.NEXT_PUBLIC_URL_BACKEND}/games`);

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
            setClaimDrawDetails,
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
      const valid = validateMove(to);
      if (!valid) return;
      if (promote && !checkPromotion(to)) return;

      updatePieceMaps();

      try {
        await sendMove(gameId as string, pieceToMove as string, to, promote);
      } catch (err) {
        console.log(err);
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

  const flipBoard = useCallback(() => {
    setGameboardView((prev) => {
      return prev === 'white' ? 'black' : 'white';
    });
  }, []);

  const validateAndCheckPromotion = useCallback(
    (s: Square) => {
      return validateMove(s) && checkPromotion(s);
    },
    [checkPromotion, validateMove]
  );

  const onPromote = useCallback(
    (e) => {
      e.stopPropagation();
      makeMove(
        promotePopupSquare as Square,
        e.currentTarget.dataset.piece as 'queen' | 'rook' | 'knight' | 'bishop'
      );
      setPromotePopupSquare(null);
    },
    [makeMove, promotePopupSquare]
  );

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
          checkPromotion={validateAndCheckPromotion}
          onPromote={onPromote}
        ></Gameboard>
        <Interface
          activePlayer={activePlayerRef.current}
          claimDraw={
            !!activePlayerRef.current &&
            claimDrawDetails[activePlayerRef.current]
          }
          offeredDraw={
            !!activePlayerRef.current &&
            !claimDrawDetails[activePlayerRef.current] &&
            claimDrawDetails[getOppColor(activePlayerRef.current)]
          }
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
          flipBoard={flipBoard}
        />
      </div>
    </main>
  );
}
