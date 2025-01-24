import { DirectionType } from 'components/type/StyleTypes';
import { useCallback, useLayoutEffect, useState } from 'react';

/**
 * Popover의 위치를 나타내는 타입
 */
type Position = { left: number; top: number };

/**
 * usePopoverPosition Props
 */
interface IProps {
  anchorEl: HTMLElement | null;
  ref: React.RefObject<HTMLElement>;
  direction: DirectionType;
}

/**
 * Popover의 생성 위치를 계산해 반환합니다.
 */
export default function usePopoverPosition({ anchorEl, ref, direction }: IProps): Position {
  const [position, setPosition] = useState<Position>({ left: 0, top: 0 });

  const calculatePosition = useCallback((rect: DOMRect, popoverWidth: number, popoverHeight: number) => {
    const centerLeft = rect.left + window.scrollX + rect.width / 2 - popoverWidth / 2;
    const centerTop = rect.top + window.scrollY + rect.height / 2 - popoverHeight / 2;

    return {
      top: {
        left: centerLeft,
        top: rect.top + window.scrollY - popoverHeight,
      },
      bottom: {
        left: centerLeft,
        top: rect.bottom + window.scrollY,
      },
      left: {
        left: rect.left + window.scrollX - popoverWidth,
        top: centerTop,
      },
      right: {
        left: rect.right + window.scrollX,
        top: centerTop,
      },
    };
  }, []);

  useLayoutEffect(() => {
    if (!anchorEl || !ref.current) {
      return;
    }

    const rect = anchorEl.getBoundingClientRect();
    const { offsetHeight: popoverHeight, offsetWidth: popoverWidth } = ref.current;

    const { left, top } = calculatePosition(rect, popoverWidth, popoverHeight)[direction];

    // 화면 내에 위치하도록 조정
    const newLeft = Math.min(Math.max(0, left), window.innerWidth - popoverWidth);
    const newTop = Math.min(Math.max(0, top), window.innerHeight - popoverHeight);

    setPosition({ left: newLeft, top: newTop });
  }, [anchorEl, direction, ref, calculatePosition]);

  return position;
}
