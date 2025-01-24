import { useCallback, useEffect, useRef } from 'react';

/**
 * return type
 */
interface Hook {
  ref: React.RefObject<HTMLDivElement>;
}

/**
 * ref의 외부 click event를 감지합니다.
 */
export default function useOutsideClick(onClick: () => void): Hook {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    },
    [onClick]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return { ref };
}
