import TwoColumnView from '../TwoColumnView';
import GameGrid from './GameGrid';

import styles from '../../styles/HomePageForeground.module.scss';

interface CreateGameProps {
  className?: string;
}

export default function CreateGame({ className }: CreateGameProps) {
  return (
    <TwoColumnView title="Create a game" className={styles.main}>
      <GameGrid className={styles.content} />
    </TwoColumnView>
  );
}
