import TwoColumnViewTitle from '../TwoColumnViewWithTitle';
import GameGrid from './GameGrid';

interface CreateGameProps {}

export default function CreateGame({}: CreateGameProps) {
  return (
    <TwoColumnViewTitle title="Create a game">
      <GameGrid />
    </TwoColumnViewTitle>
  );
}
