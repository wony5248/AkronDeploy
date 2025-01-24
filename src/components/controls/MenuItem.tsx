import { Interpolation, Theme } from '@emotion/react';
import { ReactNode, useState } from 'react';

export interface MenuItemProp {
  css?: Interpolation<Theme>;
  ref: React.MutableRefObject<HTMLLIElement | null>;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode[];
}
const styles: { [key: string]: React.CSSProperties } = {
  menuItem: {
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    color: 'inherit',
    userSelect: 'none', // 타입 정의에 맞게 수정
  },
  menuItemHover: {
    background: '#f0f0f0',
  },
  menuItemDisabled: {
    color: 'rgba(0, 0, 0, 0.38)',
    cursor: 'not-allowed',
  },
};

export const MenuItem = ({ ref, disabled = false, onClick, children }: MenuItemProp) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => setIsHovered(false);

  return (
    <li
      ref={ref}
      style={{
        ...styles.menuItem,
        ...(isHovered && !disabled ? styles.menuItemHover : {}),
        ...(disabled ? styles.menuItemDisabled : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      aria-disabled={disabled}
      role="menuitem"
    >
      {children}
    </li>
  );
};
