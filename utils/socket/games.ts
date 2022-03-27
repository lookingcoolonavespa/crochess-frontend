import io from 'socket.io-client';
import urls from './urls';

export function subscribeToGames() {
  const socket = io(urls.listOfGamesSocket);
}
