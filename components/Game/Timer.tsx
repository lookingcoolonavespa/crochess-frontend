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

  // useEffect(() => {
  //   setInterval(() => {
  //     setTime((prev) => prev - 1);
  //   });
  // });

  useEffect(() => {
    turnStart.current = Date.now();
    console.log(turnStart.current);
  }, [active]);

  useEffect(() => {
    if (!active || !time) return;

    // const interval = time > 20000 ? 100 : 1;
    const interval = setInterval(() => {
      const elapsed = Date.now() - turnStart.current;
      setDisplay(time - elapsed);
    }, 10);

    return () => clearTimeout(interval);
  });

  /*
  if active, start timer 
  subtract elapsed time from duration 
  */

  return <div className={className}>{formatTime(display)}</div>;
}
