import ContextMenuItemComponent from 'components/context-menu/ContextMenuItemComponent';
import useContextMenuContainer from 'hooks/useContextMenuContainer';
import useEditorStore from 'hooks/useEditorStore';
import { ContextMenu } from 'store/context-menu/ContextMenuTypes';
import { getPropsHandler } from 'store/ribbon-menu/RibbonMenuComponentInfo';

/**
 * Context menu open에 할당한 data를 ContextMenuItem으로 매핑해줍니다.
 */
const ContextMenuContentComponent = () => {
  const editorStore = useEditorStore();
  const contextMenuContainer = useContextMenuContainer();
  const { data: contextMenuData } = contextMenuContainer.getContextMenu() as ContextMenu;
  const handleClose = () => contextMenuContainer.closeContextMenu();

  if (!contextMenuData) {
    return <></>;
  }

  return (
    <>
      {contextMenuData.map(data => {
        const propHandler = getPropsHandler(data, editorStore);
        const disabled = propHandler?.disabled ?? data.disabled ?? false;

        return (
          <ContextMenuItemComponent
            key={data.id}
            contextMenuData={data}
            variant={data.variant}
            onClick={() => {
              // handleCommandEvent로 변경 예정
              // ribbonStore.onClickedRibbonButton(commandPropName, commandType, ...args);
            }}
            handleClose={handleClose}
            disabled={disabled}
          />
        );
      })}
    </>
  );
};

export default ContextMenuContentComponent;
