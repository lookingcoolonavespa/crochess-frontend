import { useState, useEffect, useRef } from 'react';
import { dayjs, toMilliseconds, formatTime } from '../../utils/timerStuff';
import { TimeObjInterface } from '../../types/interfaces';

interface TimerProps {
  time: number;
  className: string;
  active: boolean;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function Timer({
  className,
  time,
  setTime,
  active,
}: TimerProps) {
  const turnStart = useRef(0);
  const [display, setDisplay] = useState(time);

  useEffect(() => {
    setDisplay(time);
  }, [time]);

  useEffect(() => {
    turnStart.current = Date.now();
  }, [active]);

  useEffect(() => {
    if (!active || !time) return;
    const interval: number = window.setInterval(() => {
      const elapsed = Date.now() - turnStart.current;
      const timeLeft = time - elapsed;
      if (timeLeft < 0) return clearInterval(interval);
      setDisplay(timeLeft);
      // if (!timeLeft) return clearInterval(interval);
    }, 1);

    return () => clearInterval(interval);
  }, [active, time]);

  /*
  if active, start timer 
  subtract elapsed time from duration 
  */

  return <div className={className}>{formatTime(display)}</div>;
}
