import { useEffect, useRef, useState } from 'react';

/**
 * useDropdown return type
 */
interface Hook {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ref: React.RefObject<HTMLDivElement>;
}

/**
 * Dropdown 열림/닫힘 상태 관리 및 외부 click event를 감지합니다.
 */
export default function useDropdown(initOpenState: boolean): Hook {
  const [isOpen, setIsOpen] = useState(initOpenState);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (!ref.current || ref.current.contains(event.target as Node)) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  return { isOpen, setIsOpen, ref };
}
