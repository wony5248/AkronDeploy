// import styles from 'common/style/ribbon-menu/RibbonMenu.scss';
import useEditorStore from 'hooks/useEditorStore';
import * as React from 'react';
import { getPropsHandler, IRibbonItemProp, ribbonDropdownMenuItemMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import { ribbonButtonLabel, ribbonDropdownButton, ribbonDropdownButtonIcon } from 'styles/ribbon-menu/RibbonMenu';

/**
 * Dropdown Button props.
 */
interface IProps {
  label: string;
  image: string;
  childList?: IRibbonItemProp[];

  // Root Menu를 클릭할 경우의 handler.
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

/**
 * RibbonMenu 내 Dropdown Button을 나타내는 component.
 */
const RibbonMenuDropdownButtonComponent: React.FC<IProps> = (props: IProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const { label, image, childList, onClick } = props;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const editorStore = useEditorStore();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = () => {
    setAnchorEl(rootRef.current);
  };

  const parseMenu = () => {
    if (childList) {
      return childList.map((child: IRibbonItemProp, index: number) => {
        const propHandler = getPropsHandler(child, editorStore);
        const disabled = propHandler?.disabled ? propHandler.disabled : (child.disabled ?? false);
        const MenuItem = ribbonDropdownMenuItemMap[child.type];
        return (
          <MenuItem
            key={child.id}
            // id={child.id}
            // index={index}
            // label={child.label ?? ''}
            // image={child.image ? child.image : ''}
            // commandPropName={child.commandPropName ? child.commandPropName : 'None'}
            // commandType={child.commandType ? child.commandType : 'None'}
            // childList={child.childList}
            // disabled={disabled}
            // handleClose={handleClose}
            // onClick={onClick}
          />
        );
      });
    }
    return null;
  };

  return (
    <div ref={rootRef}>
      <div css={ribbonDropdownButton} className={anchorEl ? 'selected' : ''} onClick={handleOpen}>
        <div css={ribbonDropdownButtonIcon} onClick={handleOpen}>
          {/* <ImageResourceComponent id={image} w={'18px'} h={'18px'} /> */}
          <button style={{ width: '18px', height: '18px' }} />
        </div>
        <div css={ribbonButtonLabel} onClick={handleOpen}>
          {/* {useTextResource(label)} */}
          {label}
        </div>
        <div css={ribbonDropdownButtonIcon} onClick={handleOpen}>
          {/* <ImageResourceComponent id={'IC_TOP_MENU_ARROW_DOWN'} w={'8px'} h={'8px'} /> */}
          <button style={{ width: '8px', height: '8px' }} />
        </div>
      </div>
      {/* <Menu
                className={styles.ribbonDropdownMenu}
                keepMounted
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                onClose={handleClose}
                open={Boolean(anchorEl)}
                PaperProps={{ sx: { borderRadius: '8px' } }}
                MenuListProps={{ sx: { paddingTop: '6px', paddingBottom: '6px' } }}
            >
                {parseMenu()}
            </Menu> */}
    </div>
  );
};

export default RibbonMenuDropdownButtonComponent;
