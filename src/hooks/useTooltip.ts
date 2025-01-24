import EditorStore from 'models/store/EditorStore';
import { useEffect, useLayoutEffect, useRef } from 'react';

const useTooltip = (editorStore: EditorStore) => {
  const tooltipStore = editorStore.getTooltipStore();
  const position = tooltipStore.getPosition();

  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<NodeJS.Timeout | number | null>();
  const tooltipTarget = tooltipStore.getTarget();
  const clearTooltipTimer = () => {
    if (!tooltipTimer.current) {
      return;
    }
    clearTimeout(tooltipTimer.current as number);
    tooltipTimer.current = null;
  };

  // 툴팁 딜레이 후 생성
  const showTooltipWithDelay = () => {
    // 이전에 생성된 tooltip이 아직 visible인 경우
    if (tooltipTimer.current) {
      tooltipStore.setIsVisible(false);
      clearTooltipTimer();
    }
    tooltipTimer.current = setTimeout(() => {
      tooltipStore.setIsVisible(true);
    }, 500);
  };

  /**
   * 툴팁 숨김(딜레이 유무에 따라 달라짐)
   */
  function hide(isCloseDelay: boolean) {
    clearTooltipTimer();

    if (!isCloseDelay) {
      // mouse down event로만 호출 됨
      tooltipStore.setTarget(undefined);
      tooltipStore.setIsVisible(false);
      return;
    }
    tooltipTimer.current = setTimeout(() => {
      tooltipStore.setTarget(undefined);
      tooltipStore.setIsVisible(false);
    }, 500);
  }

  /**
   * Tooltip 즉시 삭제
   */
  function hideTooltipImmediately() {
    hide(false);
  }

  /**
   * Tooltip 딜레이 삭제
   */
  function hideTooltipWithDelay() {
    hide(true);
  }

  // 마우스다운 시 툴팁 즉시 제거
  useEffect(() => {
    window.addEventListener('mousedown', hideTooltipImmediately);
    return () => {
      window.removeEventListener('mousedown', hideTooltipImmediately);
      clearTooltipTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 마우스리브 시 툴팁 딜레이 후 제거
  useEffect(() => {
    if (tooltipTarget) {
      showTooltipWithDelay();
      tooltipTarget?.addEventListener('mouseleave', hideTooltipWithDelay, { once: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tooltipTarget]);

  // 툴팁 위치 초기화
  const resetTooltipPosition = () => {
    if (!tooltipRef.current) {
      return;
    }
    tooltipRef.current.style.left = '';
    tooltipRef.current.style.top = '';
  };

  // 툴팁 위치 값 구하기
  const setTooltipPosition = (target: Element) => {
    const {
      width: targetWidth,
      height: targetHeight,
      x: targetX,
      y: targetY,
    } = target?.getBoundingClientRect() as DOMRect;
    const { width: tooltipWidth, height: tooltipHeight } = tooltipRef.current?.getBoundingClientRect() as DOMRect;
    const TOOLTIP_MARGIN = 8;

    let newX = targetX + targetWidth / 2 - tooltipWidth / 2;
    let newY = targetY + targetHeight / 2 - tooltipHeight / 2;
    const temporaryValue = tooltipWidth / 2;
    switch (position) {
      case 'bottomCenter':
        newY = targetY - tooltipHeight - TOOLTIP_MARGIN;
        break;
      case 'topCenter':
        newY = targetY + targetHeight + TOOLTIP_MARGIN;
        break;
      case 'left':
        newX = targetX - tooltipWidth - TOOLTIP_MARGIN;
        break;
      case 'right':
        newX = targetX + targetWidth + TOOLTIP_MARGIN;
        break;
      case 'bottomRight':
        newY = targetY - tooltipHeight - TOOLTIP_MARGIN;
        newX = targetX + targetWidth + TOOLTIP_MARGIN - temporaryValue;
        break;
      case 'bottomLeft':
        newY = targetY - tooltipHeight - TOOLTIP_MARGIN;
        newX = targetX - tooltipWidth - TOOLTIP_MARGIN + temporaryValue;
        break;
      case 'topRight':
        newY = targetY + targetHeight + TOOLTIP_MARGIN;
        newX = targetX + targetWidth + TOOLTIP_MARGIN - temporaryValue;
        break;
      case 'topLeft':
        newY = targetY + targetHeight + TOOLTIP_MARGIN;
        newX = targetX - tooltipWidth - TOOLTIP_MARGIN + temporaryValue;
        break;
      default:
        // Handle default case if needed
        break;
    }

    // newX와 newY가 0보다 작거나, window.innerWidth, window.innerHeight보다 클 경우
    newX = Math.min(Math.max(0, newX), window.innerWidth - tooltipWidth);
    newY = Math.min(Math.max(0, newY), window.innerHeight - tooltipHeight);
    return { newX, newY };
  };

  // 타겟 값 가져오고, 타겟 위치 할당
  useLayoutEffect(() => {
    const settingTooltip = () => {
      if (tooltipRef.current && tooltipTarget) {
        const { newX, newY } = setTooltipPosition(tooltipTarget);
        tooltipRef.current.style.left = `${newX}px`;
        tooltipRef.current.style.top = `${newY}px`;
      }
    };
    return () => {
      resetTooltipPosition();
      settingTooltip();
    };
  });

  return {
    tooltipRef,
    showTooltipWithDelay,
    hideTooltipWithDelay,
  };
};

export default useTooltip;
