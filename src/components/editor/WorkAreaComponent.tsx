// import { WidgetCreatorComponent } from '@akron/runner';
import Snackbar from 'components/common/SnackBarComponent';
import LeftToolpaneComponent from 'components/toolpane/LeftToolpaneComponent';
import ToolPaneAreaComponent from 'components/toolpane/ToolPaneAreaComponent';
import ContentComponent from 'components/workarea/ContentComponent';
import DataContentComponent from 'components/workarea/DataContentComponent';
import DataLeftToolPaneComponent from 'components/workarea/DataLeftToolPaneComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { WorkAreaTabIndex } from 'store/app/EditorUIStore';
import { WorkAreaStyle } from 'styles/editor/WorkAreaStyle';

/**
 * Editor Page 내에서 좌측 패널, 우측 패널을 제외한 실제 작업 영역을 나타내는 컴포넌트입니다.
 */
const WorkAreaComponent = () => {
  const editorStore = useEditorStore();
  const UIStore = editorStore.getEditorUIStore();

  const [snackBarMsg, setSnackBarMsg] = useState<string>('');

  const editorSnackBarMsg = editorStore.getEditorUIStore().getEditorSnackBarMsg();

  useEffect(() => {
    setSnackBarMsg(editorSnackBarMsg);
  }, [editorSnackBarMsg]);

  return (
    <div id="workarea" css={WorkAreaStyle}>
      {UIStore.getWorkAreaTabIndex() === WorkAreaTabIndex.EDITOR && (
        <>
          <LeftToolpaneComponent />
          <ContentComponent />
          <ToolPaneAreaComponent />
        </>
      )}
      {UIStore.getWorkAreaTabIndex() === WorkAreaTabIndex.DATA && (
        <>
          <DataLeftToolPaneComponent />
          <DataContentComponent />
        </>
      )}
      {snackBarMsg !== '' && (
        <Snackbar
          open={snackBarMsg !== ''}
          message={snackBarMsg}
          autoHideDuration={1000}
          onClose={() => {
            if (snackBarMsg !== '') {
              editorStore.getEditorUIStore().setEditorSnackBarMsg('');
            }
          }}
        />
      )}
    </div>
  );
};

WorkAreaComponent.displayName = 'WorkAreaComponent';

export default observer(WorkAreaComponent);
