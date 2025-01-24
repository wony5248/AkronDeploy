import { Interpolation, Theme } from '@emotion/react';
import { CSSProperties, useEffect, useRef } from 'react';

type AnchorOrigin = {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
};

type TransformOrigin = {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
};

export interface MenuProps {
  css?: Interpolation<Theme>;
  anchorEl: HTMLElement | null; // 기준 DOM
  open: boolean;
  onClose: (event: MouseEvent | TouchEvent) => void;
  children: React.ReactNode;
  anchorOrigin?: AnchorOrigin; // 기준 위치
  transformOrigin?: TransformOrigin; // 변환 기준
  menuListStyle?: CSSProperties; // 메뉴 리스트 style
  paperStyle?: CSSProperties; // 최상단 div style
}
const Menu = ({
  css,
  anchorEl,
  open,
  onClose,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  menuListStyle,
  paperStyle,
}: MenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 메뉴 위치 계산
  const getMenuPosition = () => {
    if (!anchorEl) {
      return { top: 0, left: 0 };
    }
    const rect = anchorEl.getBoundingClientRect();

    // 기준 위치(anchorOrigin)
    const anchorOffset = {
      vertical:
        anchorOrigin.vertical === 'top' ? 0 : anchorOrigin.vertical === 'center' ? rect.height / 2 : rect.height,
      horizontal:
        anchorOrigin.horizontal === 'left' ? 0 : anchorOrigin.horizontal === 'center' ? rect.width / 2 : rect.width,
    };

    // 변환 기준(transformOrigin)
    const transformOffset = {
      vertical: transformOrigin.vertical === 'top' ? 0 : transformOrigin.vertical === 'center' ? 50 : 100,
      horizontal: transformOrigin.horizontal === 'left' ? 0 : transformOrigin.horizontal === 'center' ? 50 : 100,
    };

    // 최종 위치 계산
    return {
      top: rect.top + anchorOffset.vertical + window.scrollY,
      left: rect.left + anchorOffset.horizontal + window.scrollX,
      transform: `translate(-${transformOffset.horizontal}%, -${transformOffset.vertical}%)`,
    };
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose && onClose(event);
      }
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) {
    return null;
  }

  const position = getMenuPosition();

  return (
    <div
      css={css}
      ref={menuRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: position.transform,
        zIndex: 1300,
        backgroundColor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
        ...paperStyle,
      }}
    >
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '8px 0',
          outline: 'none',
          ...menuListStyle,
        }}
      >
        {children}
      </ul>
    </div>
  );
};

export default Menu;
