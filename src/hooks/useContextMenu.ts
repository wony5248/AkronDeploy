import useContextMenuContainer from 'hooks/useContextMenuContainer';
import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';

/**
 * useContextMenu의 파라미터
 */
type Option = {
  depthLevel: number;
};

/**
 * useContextMenu의 훅 형태
 */
type Hook = ({ depthLevel }: Option) => {
  menuRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  closeMenu(): void;
  parentElement?: HTMLElement;
};

/**
 * Context menu를 위한 커스텀 훅입니다.
 *
 * @param depthLevel 디폴트는 0으로 subContext menu 미사용시 사용하지 않습니다.
 */
const useContextMenu: Hook = ({ depthLevel }) => {
  const contextMenuContainer = useContextMenuContainer();
  const { isOpen, parentElement, position } = contextMenuContainer.getContextMenu();
  const { isOpen: isSubContextMenuOpen, position: subMenuPosition } = contextMenuContainer.getSubContextMenu();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen === false) {
      return () => undefined;
    }

    const closeContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      contextMenuContainer.closeAllContextMenu();
    };

    window.addEventListener('click', closeContextMenu);
    window.addEventListener('contextmenu', closeContextMenu);
    return () => {
      window.removeEventListener('click', closeContextMenu);
      window.removeEventListener('contextmenu', closeContextMenu);
    };
  }, [contextMenuContainer, isOpen]);

  useLayoutEffect(() => {
    if (!menuRef.current) {
      return;
    }

    if (depthLevel === 0) {
      const scrollWidth = 16;

      const containerWidth = window.innerWidth - scrollWidth;
      const containerHeight = window.innerHeight - scrollWidth;
      const menuWidth = menuRef.current.clientWidth;
      const menuHeight = menuRef.current.clientHeight;

      let { top, left } = position;
      const bottom = top + menuHeight;
      const right = left + menuWidth;

      if (right > containerWidth) {
        left -= menuWidth;
      }
      if (bottom > containerHeight) {
        top -= menuHeight;
      }

      menuRef.current.style.top = `${top}px`;
      menuRef.current.style.left = `${left}px`;
      return;
    }

    const subMenu = menuRef.current;
    const menuItem = subMenu.parentElement; // submenu 를 여는 menu item
    if (!menuItem || !subMenu) {
      return;
    }

    const scrollWidth = 16;

    const containerWidth = window.innerWidth - scrollWidth;
    const containerHeight = window.innerHeight - scrollWidth;
    const { width: menuWidth, bottom: menuBottom } = menuItem.getBoundingClientRect();

    const { width: subMenuWidth, height: subMenuHeight } = subMenu.getBoundingClientRect();
    let { top, left } = subMenuPosition;
    const bottom = top + subMenuHeight;
    const right = left + subMenuWidth;

    if (right > containerWidth) {
      left = left - subMenuWidth - menuWidth;
    }
    if (bottom > containerHeight) {
      top = menuBottom - subMenuHeight;
    }

    subMenu.style.top = `${top}px`;
    subMenu.style.left = `${left}px`;
  }, [depthLevel, isOpen, position, subMenuPosition]);

  return {
    menuRef,
    isOpen: depthLevel === 0 ? isOpen : isSubContextMenuOpen,
    parentElement: depthLevel === 0 ? parentElement : undefined,
    closeMenu: depthLevel === 0 ? contextMenuContainer.closeContextMenu : contextMenuContainer.closeSubContextMenu,
  };
};

export default useContextMenu;
