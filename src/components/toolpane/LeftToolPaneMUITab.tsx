import { isUndefined } from '@akron/runner';
import LeftToolPaneCategory from 'components/toolpane/LeftToolPaneCategory';
import useEditorStore from 'hooks/useEditorStore';

/**
 * LeftToolPaneMUITab props.
 */
interface IProps {
  searchValue: string;
}

/**
 * LeftToolPane MUI tab.
 */
const LeftToolPaneMUITab: React.FC<IProps> = ({ searchValue }: IProps) => {
  const editorStore = useEditorStore();
  const uiStore = editorStore.getEditorUIStore();

  const selectedTab = uiStore.getToolPaneTabItem('TOOLPANE_TAB_INSERT');
  const componentGroup = selectedTab?.groups.filter(group => group.id === 'RIB_INSERT_GROUP_COMPONENT')[0].childList[0];

  if (isUndefined(componentGroup)) {
    return null;
  }
  return (
    <>
      {componentGroup?.childList?.map(item => {
        return <LeftToolPaneCategory key={item.label} item={item} searchValue={searchValue} />;
      })}
    </>
  );
};

export default LeftToolPaneMUITab;
