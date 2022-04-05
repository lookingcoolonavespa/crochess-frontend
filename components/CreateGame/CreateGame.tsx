import TwoSectionViewTitle from '../TwoSectionViewWithTitle';
import GameGrid from './GameGrid';

interface CreateGameProps {}

export default function CreateGame({}: CreateGameProps) {
  return (
    <TwoSectionViewTitle title="Create a game">
      <GameGrid />
    </TwoSectionViewTitle>
  );
}
