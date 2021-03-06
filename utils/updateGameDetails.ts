import { getActivePlayer, getOppColor } from './misc';
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

    if (game.active) {
      timeDetailsRef.current[game.turn] = {
        startTime: game[game.turn].timeLeft,
        turnStart: game.turnStart || Date.now(),
      };
    }

    timeDetailsRef.current.maxTime = game.time;

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

    setClaimDrawDetails(game.claimDraw);
    setTurn(game.turn);

    if (!game.active) {
      // needs to be last state set otherwise the display wont popup
      setGameOverDetails({
        winner: game.winner,
        reason: game.causeOfDeath,
      });
    }
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

    if (game.active) {
      timeDetailsRef.current[game.turn] = {
        turnStart: game.turnStart || Date.now(),
        startTime: game[game.turn].timeLeft,
      };

      timeDetailsRef.current[getOppColor(game.turn)] = {
        // need to reset to 0 so Timer doesnt use the old values when turn changes
        turnStart: 0,
        startTime: 0,
      };

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
    }

    setTurn(game.turn);

    setMoveHistory(game.history);

    setWhiteTime(game.white.timeLeft);
    setBlackTime(game.black.timeLeft);

    setBoardState({
      board: new Map(Object.entries(game.board)),
      checks: game.checks,
      castleRights: game.castle,
    });

    setClaimDrawDetails(game.claimDraw);

    if (!game.active) {
      setGameOverDetails({
        winner: game.winner,
        reason: game.causeOfDeath,
      });
    }
  },
};

export default updateGameDetails;
