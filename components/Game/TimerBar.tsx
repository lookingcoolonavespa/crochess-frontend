interface TimerBarProps {
  time: number;
  maxTime: number;
}

export default function TimerBar({ time, maxTime }: TimerBarProps) {
  return (
    <div
      style={{
        width: `${(time / maxTime) * 100}%`,
        height: '3px',
        backgroundColor: 'red',
      }}
    ></div>
  );
}
