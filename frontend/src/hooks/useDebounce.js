import { useEffect, useRef } from 'react';

export function useDebounce(fn, delay, deps) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    const id = setTimeout(() => fnRef.current(), delay);
    return () => clearTimeout(id);
  }, [delay, ...deps]);
}
