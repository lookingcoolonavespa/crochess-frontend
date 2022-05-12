import { getActivePlayer } from './misc';
import { Gameboard } from 'crochess-api';
import {
  FetchGameGameDetails,
  FetchGameStateUpdaters,
  GameInterface,
  UpdateGameGameDetails,
  UpdateGameStateUpdaters,
} from '../types/interfaces';

const updateGameDetails = {
  onFetch: (
    gameId: string,
    game: GameInterface,
    gameDetails: FetchGameGameDetails,
    stateUpdaters: FetchGameStateUpdaters
  ) => {
    const { timeDetailsRef, activePlayerRef, pieceMapsRef } = gameDetails;
    const {
      setGameOverDetails,
      setGameboardView,
      setBoardState,
      setMoveHistory,
      setWhiteTime,
      setBlackTime,
      setCurrentPieceMapIdx,
      setClaimDrawDetails,
      setTurn,
    } = stateUpdaters;

    if (game.winner) {
      setGameOverDetails({
        winner: game.winner,
        reason: game.causeOfDeath,
      });
    }

    if (game.active) {
      timeDetailsRef.current = {
        startTime: game[game.turn].timeLeft,
        turnStart: game.turnStart || Date.now(),
        maxTime: game.time,
      };
    }

    activePlayerRef.current = getActivePlayer(
      gameId,
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
      let timeLeft = game[game.turn].timeLeft - elapsedTime;
      if (timeLeft < 0) timeLeft = 0;

      switch (game.turn) {
        case 'white':
          setWhiteTime(timeLeft);
          setBlackTime(game.black.timeLeft);
          break;
        case 'black':
          setBlackTime(timeLeft);
          setWhiteTime(game.white.timeLeft);
          break;
      }

      const oldPieceMaps = Gameboard(
        new Map(Object.entries(game.board)),
        game.checks,
        game.castle
      )
        .get.boardStatesFromHistory(game.history)
        .map((b) => b.pieceMap);
      pieceMapsRef.current = oldPieceMaps;
      setCurrentPieceMapIdx(pieceMapsRef.current.length - 1);
    } else {
      setWhiteTime(game.white.timeLeft);
      setBlackTime(game.black.timeLeft);
    }

    console.log(game.claimDraw);

    setClaimDrawDetails(game.claimDraw);
    setTurn(game.turn);
  },
  onUpdate: (
    game: GameInterface,
    gameDetails: UpdateGameGameDetails,
    stateUpdaters: UpdateGameStateUpdaters
  ) => {
    const { timeDetailsRef, pieceMapsRef } = gameDetails;
    const {
      setGameOverDetails,
      setBoardState,
      setMoveHistory,
      setWhiteTime,
      setBlackTime,
      setCurrentPieceMapIdx,
      setClaimDrawDetails,
      setTurn,
    } = stateUpdaters;

    setClaimDrawDetails(game.claimDraw);

    if (game.winner) {
      setGameOverDetails({
        winner: game.winner,
        reason: game.causeOfDeath,
      });
    }

    let sameTurn = false;

    setTurn((prev) => {
      if (prev === game.turn) sameTurn = true;

      return game.turn;
    });

    if (!sameTurn) {
      setBoardState({
        board: new Map(Object.entries(game.board)),
        checks: game.checks,
        castleRights: game.castle,
      });

      pieceMapsRef.current.push(
        Gameboard(
          new Map(Object.entries(game.board)),
          game.checks,
          game.castle
        ).get.pieceMap()
      );
      setCurrentPieceMapIdx((prev) => {
        if (prev === pieceMapsRef.current.length - 2)
          return pieceMapsRef.current.length - 1;
        else return prev;
      });
      setMoveHistory(game.history);

      setWhiteTime(game.white.timeLeft);
      setBlackTime(game.black.timeLeft);
    }
    if (game.active) {
      const turn = game.turn === 'white' ? 'black' : 'white';
      timeDetailsRef.current = {
        ...timeDetailsRef.current,
        startTime: game[turn].timeLeft,
        turnStart: game.turnStart as number,
      };
    }
  },
};

export default updateGameDetails;
