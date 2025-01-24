import useEditorStore from 'hooks/useEditorStore';
import * as React from 'react';
import { ribbonDialogContentMap } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import {
  menuItem,
  menuItemImage,
  menuItemLabel,
  menuItemWrapper,
  menuNoImageItemLabel,
} from 'styles/ribbon-menu/menu-item/DialogMenuItem';

/**
 * DialogMenuItem props
 */
interface IProps {
  id: string;
  label: string;
  image?: string;
  commandPropName: string;
  commandType: string;
  disabled: boolean;
  handleClose: () => void;

  // 확인을 클릭할 경우의 handler.
  onClick: (buttonName: string, commandType: string, ...args: unknown[]) => void;
}

const DialogMenuItemComponent: React.FC<IProps> = (props: IProps) => {
  const editorStore = useEditorStore();
  const [open, setOpen] = React.useState(false);

  const { id, label, image, commandPropName, commandType, disabled, handleClose, onClick } = props;
  const handleDialogOpen = () => {
    editorStore.setDialog(ribbonDialogContentMap[commandPropName], true);
    setOpen(true);
  };

  const handleDialogClose = (e?: React.MouseEvent) => {
    // e.target === undefined : 닫기 버튼 및 취소 버튼, dialog 외부 클릭 : classList에 MuiDialog-container 존재
    if (e?.target === undefined || !(e?.target as HTMLElement).classList.contains('MuiDialog-container')) {
      setOpen(false);
      handleClose();
    }
  };

  return (
    <>
      <div
        css={menuItem(disabled)}
        onClick={() => {
          handleClose();
          handleDialogOpen();
        }}
        key={id}
      >
        <div css={menuItemWrapper}>
          {image && (
            <button css={menuItemImage} style={{ width: '14px', height: '14px' }} />
            // <ImageResourceComponent className={styles.menuItemImage} id={image} w={'14px'} h={'14px'} />
          )}
          <div css={image ? menuItemLabel : menuNoImageItemLabel}>{label}</div>
        </div>
      </div>
    </>
  );
};

export default DialogMenuItemComponent;
