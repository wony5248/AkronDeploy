import { Tab, Tabs } from 'components/controls/TabComponent';
import TextFieldComponent from 'components/controls/TextFieldComponent';
import LeftToolPaneBasicTab from 'components/toolpane/LeftToolPaneBasicTab';
import LeftToolPaneIconTab from 'components/toolpane/LeftToolPaneIconTab';
import LeftToolPaneLibraryTab from 'components/toolpane/LeftToolPaneLibraryTab';
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
 * ContentProps.
 */
interface ContentProps {
  toolPaneWindow: Window | null;
  setToolPaneWindow: React.Dispatch<React.SetStateAction<Window | null>>;
  setAddLibraryDialogOpen: (value: boolean) => void;
}

/**
 * ComponentInsertToolPaneContent.
 */
const ComponentInsertToolPaneContent: React.FC<ContentProps> = ({
  toolPaneWindow,
  setToolPaneWindow,
  setAddLibraryDialogOpen,
}: ContentProps) => {
  const editorStore = useEditorStore();
  const editorUIStore = editorStore.getEditorUIStore();
  const [searchValue, setSearchValue] = useState('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState('');

  const handleTabChange = (newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const onClickPopupButton = () => {
    // setToolPaneWindow(
    //     openPopupWindow({
    //         width: 320,
    //         height: 700,
    //         minWidth: 320,
    //         minHeight: 400,
    //         alwaysOnTop: true,
    //         frame: false,
    //         transparent: true,
    //     })
    // );
  };

  const onClickCloseButton = () => {
    // (1) 메인창 상태: 툴페인 닫기.
    // (2) 팝업창 상태: 팝업창 닫고 메인창으로 전환.
    if (toolPaneWindow === null) {
      editorUIStore.setActiveLeftToolPaneType('None');
    } else {
      setToolPaneWindow(null);
    }
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
      // case 3:
      //     newPlaceholder = tabIndex === 3 ? '커스텀 컴포넌트 검색' : '템플릿 검색';
      //     break;
      default:
        break;
    }
    setPlaceholder(newPlaceholder);
  }, [tabIndex]);

  return (
    <div css={toolPaneContent}>
      <ToolPaneTitleComponent
        titleID={'컴포넌트 추가'}
        isDraggable={toolPaneWindow !== null}
        showPopupButton={toolPaneWindow === null}
        showCloseButton
        showPlusButton={false}
        onClickPopupButton={onClickPopupButton}
        onClickCloseButton={onClickCloseButton}
      />
      <Tabs style={{ margin: '0 16px 0 16px', background: 'white' }} value={tabIndex} onChange={handleTabChange}>
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 0)}>기본요소</span>} />
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 1)}>아이콘</span>} />
        <Tab style={tabStyle} label={<span css={tabLabel(tabIndex === 2)}>라이브러리</span>} />
        {/* <Tab
                    style={tabStyle}
                    label={
                        <span
                            className={classNames(styles.tabLabel, {
                                [styles.selected]: tabIndex === 3,
                            })}
                        >
                            {isGXProject ? '커스텀' : '템플릿'}
                        </span>
                    }
                /> */}
      </Tabs>
      {/* TabPanel에 TabPanelWrapper 스타일이 적용되는데, 별도 스타일 적용되어야 함. calc(100% - 74px) */}
      <TextFieldComponent
        value={searchValue}
        onChange={setSearchValue}
        placeholder={placeholder}
        componentInsertToolpane={true}
      />
      <div
        css={toolPaneTabPanel}
        tabIndex={-1}
        onKeyDown={e => {
          // if (Array.from(HotKeyMap.MOVE.values()).includes(e.key)) {
          //     e.preventDefault();
          // }
        }}
      >
        {tabIndex === 0 && <LeftToolPaneBasicTab searchValue={searchValue} />}
        {tabIndex === 1 && <LeftToolPaneIconTab searchValue={searchValue} />}
        {tabIndex === 2 && (
          <LeftToolPaneLibraryTab searchValue={searchValue} setAddLibraryDialogOpen={setAddLibraryDialogOpen} />
        )}
        {/* {tabIndex === 3 &&
                    (isGXProject ? (
                        <LeftToolPaneCustomComponentTab searchValue={searchValue} />
                    ) : (
                        <LeftToolPaneTemplateTab
                            searchValue={searchValue}
                            setAddLibraryDialogOpen={setAddLibraryDialogOpen}
                        />
                    ))} */}
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
  const [toolPaneWindow, setToolPaneWindow] = useState<Window | null>(null);

  const onClosePopupWindow = () => {
    setToolPaneWindow(null);
  };

  return (
    <div
      css={componentInsertToolPane}
      style={{
        width: editorUIStore.getActiveLeftToolPaneType() === 'None' || toolPaneWindow !== null ? '0px' : '260px',
      }}
    >
      <ComponentInsertToolPaneContent
        toolPaneWindow={toolPaneWindow}
        setToolPaneWindow={setToolPaneWindow}
        setAddLibraryDialogOpen={setAddLibraryDialogOpen}
      />
      {/* {toolPaneWindow && (
                <PopupComponent targetWindow={toolPaneWindow} maxWindowWidth={480} onClose={onClosePopupWindow}>
                    <div className={toolPaneAreaStyles.toolPanePopup}>
                        <ComponentInsertToolPaneContent
                            toolPaneWindow={toolPaneWindow}
                            setToolPaneWindow={setToolPaneWindow}
                            setAddLibraryDialogOpen={setAddLibraryDialogOpen}
                        />
                    </div>
                </PopupComponent>
            )} */}
    </div>
  );
};

export default observer(ComponentInsertToolPane);
