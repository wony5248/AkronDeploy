import { isDefined, WidgetCreatorComponent } from '@akron/runner';
import CenterStyleWrapperComponent from 'components/editor/CenterStyleWrapperComponent';
import UndoRedoMiniBarComponent from 'components/editor/UndoRedoMiniBarComponent';
import WidgetSelectionOverlayComponent from 'components/editor/WidgetSelectionOverlayComponent';
import useEditorStore from 'hooks/useEditorStore';
import useEditor from 'hooks/widget/useEditor';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import { Fragment } from 'react';
import { editor, editorArea } from 'styles/editor/EditorStyle';

/**
 * Editor Page 내에서 TopBar를 제외하고 Edit을 담당하는 내용을 나타내는 컴포넌트입니다.
 */
const EditorComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const isEditMode = true;
  const appModel = editorStore.getAppModel();

  const {
    handleMouseDownCapture,
    handleMouseMoveCapture,
    handleMouseUpCapture,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleMouseLeave,
  } = useEditor(appModel as WidgetModel);

  // 현재 렌더할 대상 위젯
  let targetWidgetModel: WidgetModel | undefined;

  // EDIT_APP 모드인 경우 selected된 Page가 있으면 그걸 보여줌
  // FIXME: 다른 app mode 고려해서 조건문 수정
  if (isEditMode) {
    targetWidgetModel = editorStore.getEditingPageModel() ?? appModel?.getFirstChild(); // FIX ME : Composite widget 편집 모드에서 들어갔다 나왔을 경우 첫번째 페이지 가져오도록 임시처리.
  }
  const CenterStyleWrapper =
    isDefined(targetWidgetModel) && ['Page'].includes(targetWidgetModel?.getWidgetType())
      ? CenterStyleWrapperComponent
      : Fragment;

  const EditorWrapper = Fragment; // hotKey 사용 시 hotKeyWrapper로 변경해야함

  const dialog = editorStore.getDialog();
  const handleDialogClose = () => {
    editorStore.setDialog(undefined, false);
  };

  return (
    <EditorWrapper>
      {targetWidgetModel && (
        <div css={editorArea}>
          <div
            // text가 아닌 기능 키(delete, enter)를 위해 div가 KeyEvent를 받으려면 tabIndex가 셋팅되어야 함
            // lint가 상호작용 할 수 없는 element는 tabIndex를 못달게 해서 disable
            tabIndex={0}
            className="akron-css-scope"
            css={editor}
            onMouseDownCapture={handleMouseDownCapture}
            onMouseMoveCapture={handleMouseMoveCapture}
            onMouseUpCapture={handleMouseUpCapture}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onMouseLeave={handleMouseLeave}
          >
            <UndoRedoMiniBarComponent />
            <CenterStyleWrapper>
              {isEditMode === true ? (
                <div className="Device" style={{ position: 'relative' }}>
                  <WidgetCreatorComponent widgetModel={targetWidgetModel} />
                  <WidgetSelectionOverlayComponent model={targetWidgetModel} />
                </div>
              ) : (
                <WidgetCreatorComponent widgetModel={targetWidgetModel} />
              )}
            </CenterStyleWrapper>
            {dialog.dialogOpen && dialog.dialogType && (
              <dialog.dialogType
                open
                handleClose={handleDialogClose}
                onClick={() => {
                  handleDialogClose();
                }}
              />
            )}
          </div>
        </div>
      )}
    </EditorWrapper>
  );
};

EditorComponent.displayName = 'EditorComponent';

export default observer(EditorComponent);
