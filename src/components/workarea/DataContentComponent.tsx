import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { DataTabIndex } from 'store/app/EditorUIStore';
import { content } from 'styles/workarea/Content';

/**
 * Studio 레이아웃에서 툴페인 등을 제외한 중앙의 공간.
 */
const DataContentComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const UIStore = editorStore.getEditorUIStore();

  /**
   * DataTab render
   */
  function renderDataTabComponent(idx: DataTabIndex) {
    switch (idx) {
      // case DataTabIndex.VARIABLE_DATA:
      //     return <VariableDataEditComponent />;
      // case DataTabIndex.OBJECT_TYPE:
      //     return <ObjectTypeEditComponent />;
      // case DataTabIndex.PRESET_VARIABLE_DATA:
      //     return <PresetVariableDataComponent />;
      // case DataTabIndex.EXTERNAL_API:
      //     return <ExternalServiceAPISettingComponent />;
      // case DataTabIndex.REQUEST_SERVICE:
      //     return <IntegrateDXServiceComponent />;
      // case DataTabIndex.CUSTOM_CODE:
      //     return <CustomCodeDataComponent />;
      // case DataTabIndex.STATES_PROPS:
      //     return <StatesPropsDataComponent />;
      default:
        return <div />;
    }
  }
  return <div css={content}>{renderDataTabComponent(UIStore.getDataTabIndex())}</div>;
};

export default observer(DataContentComponent);
