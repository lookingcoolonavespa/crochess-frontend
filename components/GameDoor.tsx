interface GameDoorProps {
  color: 'white' | 'black' | 'random';
  timeControl: string;
  gameType: 'blitz' | 'bullet' | 'rapid' | 'classical';
}

export default function GameDoor({
  color,
  timeControl,
  gameType,
}: GameDoorProps) {
  return (
    <div>
      <p>{color}</p>
      <p>{timeControl}</p>
      <p>{gameType}</p>
    </div>
  );
}
