import { useRouter } from 'next/router';
import Gameboard from '../components/ActiveGame/Gameboard';

export default function ActiveGame() {
  return <Gameboard color="white" />;
}
