import TwoColumnViewTitle from '../TwoColumnViewWithTitle';
import ListOfGames from './ListOfGames';

interface LocalGamesProps {
  className?: string;
}

export default function LocalGames({}: LocalGamesProps) {
  return (
    <TwoColumnViewTitle title="Local games" className="align-start">
      <ListOfGames />
    </TwoColumnViewTitle>
  );
}
