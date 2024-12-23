import DataTabMenuItemComponent from 'components/toolpane/DataTabMenuItemComponent';
import ToolPaneTitleComponent from 'components/toolpane/ToolPaneTitleComponent';
import useEditorStore from 'hooks/useEditorStore';
import { IDataTabMenu, IDataTabMenuTitle, tabMenuItemData } from 'store/toolpane/DataLeftToolpaneInfo';
import { pageWidgetList } from 'styles/toolpane/PageWidgetList';

/**
 * Data Tab Menu를 화면에 표시하기 위한 component.
 */
const DataTabMenuComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const tabMenuData = tabMenuItemData;

  const parseTabMenuData = () => {
    return tabMenuData.map((menu: IDataTabMenuTitle) => {
      return (
        <>
          <ToolPaneTitleComponent
            isLeftToolPane
            titleID={menu.titleID}
            isDraggable={false}
            showPopupButton={false}
            showCloseButton={false}
            showPlusButton={false}
          />
          {menu.child?.map((child: IDataTabMenu) => (
            <DataTabMenuItemComponent tabIndex={child.tabIndex} imgID={child.imgID} labelString={child.labelString} />
          ))}
        </>
      );
    });
  };

  return <div css={pageWidgetList}>{parseTabMenuData()}</div>;
};

export default DataTabMenuComponent;
