import { useRouter } from 'next/router';
import Gameboard from '../components/Game/Gameboard';

export default function ActiveGame() {
  return <Gameboard color="white" />;
}
