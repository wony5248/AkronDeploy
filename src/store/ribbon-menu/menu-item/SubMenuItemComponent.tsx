import { MenuItem } from 'components/controls/MenuItem';
import PopoverComponent from 'components/controls/popover/PopoverComponent';
import useEditorStore from 'hooks/useEditorStore';
import { useRef, useState } from 'react';
import { getPropsHandler, IRibbonItemProp, ribbonDropdownMenuItemMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import {
  menuItem,
  menuItemContent,
  menuItemImage,
  menuItemLabel,
  menuItemWrapper,
  menuNoImageItemLabel,
  subMenuArrowIcon,
  subMenuWrapper,
} from 'styles/ribbon-menu/menu-item/SubMenuItem';
import { ribbonMenu } from 'styles/ribbon-menu/RibbonMenu';

/**
 * SubMenuItem props
 */
interface IProps {
  id: string;
  label: string;
  image?: string;
  childList?: IRibbonItemProp[];
  disabled: boolean;
  handleClose: () => void;
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

const SubMenuItemComponent: React.FC<IProps> = (props: IProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLLIElement | null>(null);
  const { id, label, image, childList, disabled, handleClose, onClick } = props;
  const handleSubMenuClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const editorStore = useEditorStore();

  const getSubMenuPlacement = () => {
    switch (id) {
      case 'RIB_INSERT_COMPONENT_ICON_DROPDOWN':
        return 'bottom';
      default:
        return 'right';
    }
  };

  const parseMenu = () =>
    childList &&
    childList.map((child: IRibbonItemProp) => {
      const propHandler = getPropsHandler(child, editorStore);
      const childDisabled = propHandler?.disabled ? propHandler.disabled : (child.disabled ?? false);
      const SubMenuItem = ribbonDropdownMenuItemMap[child.type];
      return (
        <SubMenuItem
          key={child.id}
          id={child.id ?? ''}
          label={child.label ?? ''}
          image={child.image ? child.image : 'IC_RIB_SET_ADD_16'}
          commandPropName={child.commandPropName ? child.commandPropName : 'None'}
          commandType={child.commandType ? child.commandType : 'None'}
          // childList={child.childList}
          disabled={childDisabled}
          handleClose={() => {
            handleSubMenuClose();
            handleClose();
          }}
          onClick={onClick}
        />
      );
    });

  return (
    <MenuItem css={menuItem} ref={ref} onMouseEnter={handleOpen} onMouseLeave={handleSubMenuClose} disabled={disabled}>
      <div css={menuItemWrapper(disabled)} key={id}>
        <div css={menuItemContent}>
          {image && (
            // <ImageResourceComponent className={styles.menuItemImage} id={image} w={'14px'} h={'14px'} />
            <button css={menuItemImage} style={{ width: '14px', height: '14px' }} />
          )}
          <div css={image ? menuItemLabel : menuNoImageItemLabel}>{label}</div>
          {/* <ImageResourceComponent
                        className={styles.subMenuArrowIcon}
                        id={'IC_CONTEXTMENU_ARROW_DEPTH_NORMAL'}
                        w={'8px'}
                        h={'8px'}
                    /> */}
          <button css={subMenuArrowIcon} style={{ width: '8px', height: '8px' }} />
        </div>
      </div>
      {open && (
        <PopoverComponent
          css={ribbonMenu}
          title="popover"
          anchorEl={ref.current}
          direction={getSubMenuPlacement()}
          onClose={{ handler: handleClose }}
          // Popper가 닫혀도 자식들이 살아남아서 dialog 등을 열도록 함.
        >
          <div css={subMenuWrapper}>{parseMenu()}</div>
        </PopoverComponent>
      )}
    </MenuItem>
  );
};

export default SubMenuItemComponent;
