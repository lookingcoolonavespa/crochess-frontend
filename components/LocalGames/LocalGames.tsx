import TwoColumnView from '../TwoColumnView';
import ListOfGames from './ListOfGames';

import styles from '../../styles/HomePageForeground.module.scss';

interface LocalGamesProps {
  className?: string;
}

export default function LocalGames({ className }: LocalGamesProps) {
  return (
    <TwoColumnView title="Local games" className={className}>
      <ListOfGames className={styles.content} />
    </TwoColumnView>
  );
}
