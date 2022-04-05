import TwoSectionViewTitle from '../TwoSectionViewWithTitle';
import ListOfGames from './ListOfGames';

interface LocalGamesProps {
  className?: string;
}

export default function LocalGames({}: LocalGamesProps) {
  return (
    <TwoSectionViewTitle title="Local games" className="align-start">
      <ListOfGames />
    </TwoSectionViewTitle>
  );
}
