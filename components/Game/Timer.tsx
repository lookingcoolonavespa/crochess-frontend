import { useState, useEffect, useRef } from 'react';
import { dayjs, toMilliseconds, formatTime } from '../../utils/timerStuff';
import { TimeObjInterface } from '../../types/interfaces';

interface TimerProps {
  init: TimeObjInterface;
  className: string;
}

export default function Timer({ className, init }: TimerProps) {
  const [time, setTime] = useState(toMilliseconds(init));

  const startTime = useRef(Date.now());

  useEffect(() => {
    setInterval(() => {
      setTime((prev) => prev - 1);
    });
  });

  return <div className={className}>{formatTime(time)}</div>;
}
