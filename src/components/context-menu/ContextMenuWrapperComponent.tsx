import PortalComponent from 'components/common/PortalComponent';
import ContextMenuComponent from 'components/context-menu/ContextMenuComponent';
import useContextMenu from 'hooks/useContextMenu';
import { observer } from 'mobx-react-lite';

/**
 * ContextMenuWrapperComponent props
 */
interface IProps {
  children: React.ReactNode;
}

/**
 * MainPageComponent 상위에 위치하며 한 개만 생성합니다.
 * openContextMenu 또는 closeContextMenu에 따라 마운트, 언마운트 됩니다.
 */
const ContextMenuWrapperComponent: React.FC<IProps> = ({ children }: IProps) => {
  const { menuRef, isOpen, parentElement, closeMenu } = useContextMenu({ depthLevel: 0 });

  if (!isOpen) {
    return <></>;
  }

  const renderContextMenu = () => {
    return (
      <ContextMenuComponent ref={menuRef} closeMenu={closeMenu}>
        {children}
      </ContextMenuComponent>
    );
  };

  return <PortalComponent parentElement={parentElement}>{renderContextMenu()}</PortalComponent>;
};

ContextMenuWrapperComponent.displayName = 'ContextMenuWrapperComponent';

export default observer(ContextMenuWrapperComponent);
