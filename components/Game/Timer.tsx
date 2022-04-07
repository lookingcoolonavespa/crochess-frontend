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

  // useEffect(() => {
  //   setInterval(() => {
  //     setTime((prev) => prev - 1);
  //   });
  // });

  useEffect(() => {
    if (!active) return;

    turnStart.current = Date.now();

    const timeout = setTimeout(() => {
      const elapsed = Date.now() - turnStart.current;
      setTime(time - elapsed);
    }, 100);

    return () => clearTimeout(timeout);
  });

  /*
  if active, start timer 
  subtract elapsed time from duration 
  */

  return <div className={className}>{formatTime(time)}</div>;
}
