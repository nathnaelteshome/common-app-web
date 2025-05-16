'use client';

import { useState, useLayoutEffect } from 'react';

const TimeStamp = () => {
  const [time, setTime] = useState<number | null>(null);
  useLayoutEffect(() => {
    setTime(new Date().getFullYear());
  }, []);
  return <>{time ? time : null}</>;
};

export default TimeStamp;
