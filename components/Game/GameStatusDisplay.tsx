import { useRouter } from 'next/router';

import closeSVG from '../../public/icons/close-line.svg';
import checkSVG from '../../public/icons/check-line.svg';
import { GameOverDetailsInterface } from '../../types/interfaces';
import IconBtn from '../IconBtn';
import FlatBtn from '../FlatBtn';
import { resign, claimDraw, offerDraw, denyDraw } from '../../utils/game';

interface GameStatusDisplayProps {
  styles: { [key: string]: string };
  close: () => void;
  status: {
    type:
      | 'gameOver'
      | 'offeredDraw'
      | 'claimDraw'
      | 'offerDrawConfirmation'
      | 'resignConfirmation';
    payload: GameOverDetailsInterface | undefined;
  };
  activePlayer: 'white' | 'black';
}

function asyncErrorHandler(
  cb:
    | ((gameId: string, activePlayer?: 'white' | 'black') => void)
    | ((gameId: string, activePlayer: 'white' | 'black') => void),
  params: { gameId: string; activePlayer?: 'white' | 'black' }
) {
  const { gameId, activePlayer } = params;
  try {
    cb(gameId, activePlayer as 'white' | 'black');
  } catch (err) {
    console.log(err);
  }
}

export default function GameStatusDisplay({
  styles,
  close,
  status,
  activePlayer,
}: GameStatusDisplayProps) {
  const router = useRouter();
  const { activeGameId: gameId } = router.query;

  return (
    <div className={styles.game_over_display}>
      <IconBtn
        className="close-btn"
        icon={closeSVG}
        altText="hide game over message"
        onClick={close}
      />
      <div>
        {status &&
          {
            gameOver: (
              <>
                {status.payload && (
                  <>
                    <p>Game over</p>
                    {status.payload.winner && (
                      <p>
                        {status.payload.winner} won by {status.payload.reason}
                      </p>
                    )}
                    {!status.payload.winner && (
                      <p>Draw by {status.payload.reason}</p>
                    )}
                  </>
                )}
              </>
            ),
            resignConfirmation: (
              <>
                <p>Are you sure you want to resign?</p>
                <div className={styles.btn_ctn}>
                  <FlatBtn
                    icon={{ src: closeSVG, alt: 'cancel' }}
                    size="small"
                    onClick={close}
                  />
                  <FlatBtn
                    icon={{ src: checkSVG, alt: 'confirm' }}
                    size="small"
                    onClick={() =>
                      asyncErrorHandler(resign, {
                        activePlayer,
                        gameId: gameId as string,
                      })
                    }
                  />
                </div>
              </>
            ),
            claimDraw: (
              <>
                <p>Claim draw?</p>
                <div className={styles.btn_ctn}>
                  <FlatBtn
                    icon={{ src: closeSVG, alt: 'cancel' }}
                    size="small"
                    onClick={() => {
                      asyncErrorHandler(denyDraw, { gameId: gameId as string });
                    }}
                  />
                  <FlatBtn
                    icon={{ src: checkSVG, alt: 'confirm' }}
                    size="small"
                    onClick={() => {
                      asyncErrorHandler(claimDraw, {
                        gameId: gameId as string,
                      });
                    }}
                  />
                </div>
              </>
            ),
            offeredDraw: <p>You have offered a draw</p>,
            offerDrawConfirmation: (
              <>
                <p>Are you sure you want to offer a draw?</p>
                <div className={styles.btn_ctn}>
                  <FlatBtn
                    icon={{ src: closeSVG, alt: 'cancel' }}
                    size="small"
                    onClick={close}
                  />
                  <FlatBtn
                    icon={{ src: checkSVG, alt: 'confirm' }}
                    size="small"
                    onClick={() => {
                      asyncErrorHandler(offerDraw, {
                        activePlayer,
                        gameId: gameId as string,
                      });
                    }}
                  />
                </div>
              </>
            ),
          }[status.type]}
      </div>
    </div>
  );
}
