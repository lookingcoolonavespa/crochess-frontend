interface GameOverDisplayProps {
  winner: 'black' | 'white' | null;
  reason: string;
}

export default function GameOverDisplay({
  winner,
  reason,
}: GameOverDisplayProps) {
  return (
    <div>
      <p>Game over</p>
      {winner && (
        <p>
          {winner} won by {reason}
        </p>
      )}
      {!winner && <p>Draw by {reason}</p>}
    </div>
  );
}
