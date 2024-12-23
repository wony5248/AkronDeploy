import DeviceButtonComponent from 'components/ribbon-menu/DeviceButtonComponent';
import ExitButtonComponent from 'components/ribbon-menu/ExitButtonComponent';
import PublishButtonComponent from 'components/ribbon-menu/PublishButtonComponent';
import SaveIndicatorComponent from 'components/ribbon-menu/save-indicator/SaveIndicatorComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import EditorUIStore, { WorkAreaTabIndex } from 'store/app/EditorUIStore';
import { playButton, rightMenu } from 'styles/ribbon-menu/RibbonMenu';

/**
 * 우측 Ribbon Menu 구성 Component
 */
const RightMenuComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const UIStore = editorStore.getEditorUIStore();

  // const appModeContainer = editorStore.getAppModeContainer();

  const isDialogWidgetMode = false; // isEditDialogWidgetMode(appModeContainer);

  const [open, setOpen] = useState<boolean>(false);

  const onClick = (commandPropName: string, commandType: string, ...args: unknown[]) => {
    // handleCommandEvent로 변경 예정
    // ribbonStore.onClickedRibbonButton(commandPropName, commandType, ...args);
  };

  const button = () => {
    if (UIStore.getWorkAreaTabIndex() !== WorkAreaTabIndex.EDITOR) {
      return (
        <ExitButtonComponent
          onClick={() => {
            // if (UIStore.getEditOSobject()) {
            //     // 편집 중인 데이터 존재할 경우 팝업창
            //     setOpen(true);
            // } else {
            UIStore.setWorkAreaTabIndex(WorkAreaTabIndex.EDITOR);
            //     UIStore.clearOSobjectTab();
            // }
          }}
        />
      );
    }

    return (
      !isDialogWidgetMode && (
        <PublishButtonComponent
          id={'RIB_VIEW_RUN_PROJECT'}
          commandPropName={'BuildApp'}
          commandType={'View'}
          onClick={onClick}
        />
      )
    );
  };

  return (
    <div css={rightMenu}>
      {!isDialogWidgetMode ? (
        <>
          <DeviceButtonComponent />
          <SaveIndicatorComponent />
          <div
            css={playButton}
            onClick={() => {
              onClick('PreviewProject', 'View');
            }}
            key={'RIB_VIEW_PREVIEW_PROJECT'}
          >
            {/* <ImageResourceComponent id={'IC_TOP_PLAY_NORMAL'} w={'32px'} h={'32px'} /> */}
            <button style={{ width: '32px', height: '32px' }} />
          </div>
        </>
      ) : (
        <SaveIndicatorComponent />
      )}
      {button()}
      {/* <DataEditWarningDialogComponent open={open} handleClose={() => setOpen(false)} /> */}
    </div>
  );
};

export default observer(RightMenuComponent);
