import { useState, useEffect, useRef } from 'react';
import { dayjs, toMilliseconds, formatTime } from '../../utils/timerStuff';
import { TimeObjInterface } from '../../types/interfaces';

interface TimerProps {
  init: TimeObjInterface;
}

export default function Timer({ init }: TimerProps) {
  const [time, setTime] = useState(toMilliseconds(init));

  const startTime = useRef(Date.now());

  useEffect(() => {
    setInterval(() => {
      setTime((prev) => prev - 1);
    });
  });

  return <div>{formatTime(time)}</div>;
}
