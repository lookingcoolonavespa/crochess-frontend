import { GameType } from '../types/types';

export function createGame(
  time: number,
  increment: number,
  color: 'white' | 'black' | 'random',
  seeker: string,
  gameType: GameType
) {
  fetch('http://localhost:8000/gameSeeks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ time, increment, color, gameType, seeker }),
  });
}
