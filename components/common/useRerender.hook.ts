import { useState } from 'react';

const useRerender = () => {
  const [, setRe] = useState({});
  return () => setRe({});
};

export { useRerender };
