import { Tab, Tabs } from 'components/controls/TabComponent';
import TextFieldComponent from 'components/controls/TextFieldComponent';
import LeftToolPaneBasicTab from 'components/toolpane/LeftToolPaneBasicTab';
import LeftToolPaneIconTab from 'components/toolpane/LeftToolPaneIconTab';
import ToolPaneTitleComponent from 'components/toolpane/ToolPaneTitleComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { CSSProperties, useEffect, useState } from 'react';
import {
  componentInsertToolPane,
  tabLabel,
  toolPaneContent,
  toolPaneTabPanel,
} from 'styles/toolpane/ComponentInsertToolpane';

/**
 * ComponentInsertToolPaneContent.
 */
const ComponentInsertToolPaneContent: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState('');

  const handleTabChange = (newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const tabStyle: CSSProperties = {
    minWidth: 0,
    width: 'auto',
    paddingLeft: '8px',
    paddingRight: '8px',
    margin: 0,
    fontSize: '10px',
  };

  useEffect(() => {
    let newPlaceholder = '';
    switch (tabIndex) {
      case 0:
        newPlaceholder = '기본 컴포넌트 검색';
        break;
      case 1:
        newPlaceholder = '아이콘 검색';
        break;
      case 2:
        newPlaceholder = '커스텀 컴포넌트 검색';
        break;
      default:
        break;
    }
    setPlaceholder(newPlaceholder);
  }, [tabIndex]);

  return (
    <div css={toolPaneContent}>
      <ToolPaneTitleComponent
        titleID={'컴포넌트 추가'}
        isDraggable={false}
        showPopupButton={true}
        showCloseButton
        showPlusButton={false}
      />
      <Tabs style={{ margin: '0 16px 0 16px', background: 'white' }} value={tabIndex} onChange={handleTabChange}>
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 0)}>기본요소</span>} />
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 1)}>아이콘</span>} />
        {/* <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 2)}>라이브러리</span>} /> */}
      </Tabs>
      {/* TabPanel에 TabPanelWrapper 스타일이 적용되는데, 별도 스타일 적용되어야 함. calc(100% - 74px) */}
      <TextFieldComponent
        value={searchValue}
        onChange={setSearchValue}
        placeholder={placeholder}
        componentInsertToolpane={true}
      />
      <div css={toolPaneTabPanel} tabIndex={-1}>
        {tabIndex === 0 && <LeftToolPaneBasicTab searchValue={searchValue} />}
        {tabIndex === 1 && <LeftToolPaneIconTab searchValue={searchValue} />}
        {/* {tabIndex === 2 && (
          <LeftToolPaneLibraryTab searchValue={searchValue} setAddLibraryDialogOpen={setAddLibraryDialogOpen} />
        )} */}
      </div>
    </div>
  );
};

/**
 * 컴포넌트 삽입을 위한 Left 2-depth Toolpane props.
 */
interface IProps {
  setAddLibraryDialogOpen: (value: boolean) => void;
}

/**
 * 컴포넌트 삽입을 위한 Left 2-depth Toolpane.
 */
const ComponentInsertToolPane: React.FC<IProps> = ({ setAddLibraryDialogOpen }: IProps) => {
  const editorStore = useEditorStore();
  const editorUIStore = editorStore.getEditorUIStore();

  return (
    <div
      css={componentInsertToolPane}
      style={{
        width: editorUIStore.getActiveLeftToolPaneType() === 'None' ? '0px' : '260px',
      }}
    >
      <ComponentInsertToolPaneContent />
    </div>
  );
};

export default observer(ComponentInsertToolPane);
