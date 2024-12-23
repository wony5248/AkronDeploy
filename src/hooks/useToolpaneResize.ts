import { useCallback, useRef, useState, PointerEvent, MouseEvent } from 'react';

/**
 * MouseHandlerType
 */
type MouseHandlerType = (e: MouseEvent) => void;
/**
 * PointerHandlerType
 */
type PointerHandlerType = (e: PointerEvent) => void;

/**
 * Left Toolpane Horizontal Resize Hook
 */
type Hook = () => {
  ref: React.RefObject<HTMLDivElement>;
  handlePointerMove: PointerHandlerType;
  handlePointerDown: PointerHandlerType;
  handlePointerUp: PointerHandlerType;
  handleMouseMove: MouseHandlerType;
};

const useToolpaneResize: Hook = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [initialX, setInitialX] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const toolpaneWidth = ref.current?.clientWidth ?? 0;

  const handlePointerMove: PointerHandlerType = useCallback(
    e => {
      if (ref.current !== null && isResizing) {
        const deltaX = e.clientX - initialX;
        ref.current.style.width = `${toolpaneWidth + deltaX}px`;
      }
    },
    [isResizing, initialX, toolpaneWidth]
  );

  const handlePointerDown: PointerHandlerType = useCallback(e => {
    e.stopPropagation();
    if (ref.current?.style.cursor === 'ew-resize') {
      setIsResizing(true);
      ref.current.setPointerCapture(e.pointerId);
      setInitialX(e.clientX);
    }
  }, []);

  const handlePointerUp: PointerHandlerType = useCallback(e => {
    if (ref.current !== null) {
      ref.current.releasePointerCapture(e.pointerId);
      setIsResizing(false);
    }
  }, []);

  const handleMouseMove: MouseHandlerType = useCallback(
    e => {
      if (ref.current !== null) {
        const margin = 5;
        if (ref.current.clientWidth < e.clientX + margin && ref.current.clientWidth > e.clientX - margin) {
          ref.current.style.cursor = 'ew-resize';
        } else if (isResizing) {
          ref.current.style.cursor = 'ew-resize';
        } else {
          ref.current.style.cursor = 'default';
        }
      }
    },
    [isResizing]
  );

  return {
    ref,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleMouseMove,
  };
};

export default useToolpaneResize;
