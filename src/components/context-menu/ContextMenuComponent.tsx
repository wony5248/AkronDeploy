import { forwardRef } from 'react';
import { contextMenu } from 'styles/context-menu/ContextMenuComponent';
// import styles from 'common/style/context-menu/ContextMenuComponent.scss';

/**
 * ContextMenuComponent props
 */
interface IProps {
  children: React.ReactNode;
  closeMenu(): void;
}

/**
 * menuItem들을 받아 하나의 div로 감싸줍니다.
 *
 * @param children Context menu에 삽입될 menuItem 컴포넌트들
 * @param closeMenu Context menu 컴포넌트를 닫는 함수
 * @param ref Context menu의 위치 설정을 위한 ref
 */
const ContextMenuComponent = forwardRef<HTMLDivElement, IProps>(({ children, closeMenu }: IProps, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') closeMenu();
  };

  const preventWindowEvent = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      id="contextmenu"
      css={contextMenu}
      ref={ref}
      onKeyDown={handleKeyDown}
      onClick={preventWindowEvent}
      tabIndex={-1}
      role="menu"
    >
      {children}
    </div>
  );
});

export default ContextMenuComponent;
