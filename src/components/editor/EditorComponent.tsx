import { isDefined, WidgetCreatorComponent } from '@akron/runner';
import CenterStyleWrapperComponent from 'components/editor/CenterStyleWrapperComponent';
import UndoRedoMiniBarComponent from 'components/editor/UndoRedoMiniBarComponent';
import WidgetSelectionOverlayComponent from 'components/editor/WidgetSelectionOverlayComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import { Fragment } from 'react';
import { editor, editorArea } from 'styles/editor/EditorStyle';
import { getDeviceSize } from 'util/DeviceUtil';

/**
 * Editor Page 내에서 TopBar를 제외하고 Edit을 담당하는 내용을 나타내는 컴포넌트입니다.
 */
const EditorComponent: React.FC = () => {
  const editorStore = useEditorStore();
  const isEditMode = true; // isEditAppMode(appModeContainer);
  // ex. App 편집 상황 -> App widget.
  // ex. Composite widget 편집 상황 -> Top widget.
  const editingWidgetModel = editorStore.getEditingWidgetModel();
  const editorUIStore = editorStore.getEditorUIStore();
  // const uiStore = editorStore.getUIStore();

  // const {
  //   handleMouseDownCapture,
  //   handleMouseMoveCapture,
  //   handleMouseUpCapture,
  //   handleMouseDown,
  //   handleMouseMove,
  //   handleMouseUp,
  //   handleWheel,
  //   handleMouseLeave,
  // } = useEditor(editorStore.getAppWidgetModel());

  // 현재 렌더할 대상 위젯
  let targetWidgetModel: WidgetModel | undefined;

  // EDIT_APP 모드인 경우 selected된 Page가 있으면 그걸 보여줌
  // RUNTIME_PREVIEW 모드인 경우 AppWidget 부터 보여줌
  // FIXME: 다른 app mode 고려해서 조건문 수정
  if (isEditMode) {
    targetWidgetModel = editorStore.getEditingPageModel() ?? editingWidgetModel?.getFirstChild(); // FIX ME : Composite widget 편집 모드에서 들어갔다 나왔을 경우 첫번째 페이지 가져오도록 임시처리.
  } else {
    // targetWidgetModel = editingWidgetModel;
    // // PageComponent를 저장하는 Map 생성
    // const pageComponentMap = new Map<number, JSX.Element>();
    // targetWidgetModel.forEachChild(pageModel => {
    //   pageComponentMap.set(pageModel.getID(), <WidgetCreatorComponent widgetModel={pageModel} />);
    // });
    // uiStore.setPageComponentMap(pageComponentMap);
  } // targetWidget applyPageWrapperComponents에 있는 type 일때만 PageWrapperComponent를 씌움.
  const CenterStyleWrapper =
    isDefined(targetWidgetModel) && ['Page', 'BusinessDialog'].includes(targetWidgetModel?.getWidgetType())
      ? CenterStyleWrapperComponent
      : Fragment;

  const EditorWrapper = Fragment; // isEditMode ? EditorHotKeyWrapper : Fragment;

  // const dialog = editorStore.getDialog();
  const handleDialogClose = () => {
    // editorStore.setDialog(undefined, false);
  };

  // const businessDialogModel = editorStore.getBusinessDialogWidgetMap().get(uiStore.getBusinessDialogWidgetModelID());

  const deviceSizeStyle = getDeviceSize(editorStore.getDeviceInfo());

  const ctx = editorStore.getCtx();
  // const widgetPropContainer = ctx.propContainer.getWidgetPropContainer();
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  const eventTargetModel = widgetEditInfoContainer.getEventTargetWidgetModel();
  const refX = eventTargetModel?.getRefX() ?? 0;
  const refY = eventTargetModel?.getRefY() ?? 0;
  const refW = eventTargetModel?.getRefWidth() ?? 0;
  const refH = eventTargetModel?.getRefHeight() ?? 0;
  const x = refX
    ? (refX - ctx.getEditingPageRefPosition().x) / (ctx.getZoomRatio() / 100) + widgetEditInfoContainer.getDeltaX()
    : (eventTargetModel?.getProperties().style.x.absolute ?? 0);
  const y = refY
    ? (refY - ctx.getEditingPageRefPosition().y) / (ctx.getZoomRatio() / 100) + widgetEditInfoContainer.getDeltaY()
    : (eventTargetModel?.getProperties().style.y.absolute ?? 0);
  const w = refW ? refW / (ctx.getZoomRatio() / 100) + widgetEditInfoContainer.getDeltaWidth() : 0;
  const h = refH ? refH / (ctx.getZoomRatio() / 100) + widgetEditInfoContainer.getDeltaHeight() : 0;

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
            // onMouseDownCapture={handleMouseDownCapture}
            // onMouseMoveCapture={handleMouseMoveCapture}
            // onMouseUpCapture={handleMouseUpCapture}
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
            // onWheel={handleWheel}
            // onMouseLeave={handleMouseLeave}
          >
            <UndoRedoMiniBarComponent />
            <CenterStyleWrapper>
              {isEditMode === true ? (
                <div className="Device" style={{ /*...deviceSizeStyle,*/ position: 'relative' }}>
                  {/* <div
                    id="smartGuideLineArea"
                    style={{
                      zIndex: 30,
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      scale: `${ctx.zoomRatio / 100}`,
                      transformOrigin: `50% 0%`,
                    }}
                  >
                    <svg style={{ width: '100%', height: '100%' }}>
                      {widgetPropContainer.getIsSmartGuide() ? getTotalSmartGuideJSXElements(x, y, w, h, '') : null}
                    </svg>
                  </div> */}
                  {/* <WidgetCreatorComponent widgetModel={targetWidgetModel} /> */}
                  {/* <PageWidgetComponent
                    id={`${targetWidgetModel.getID()}`}
                    content={targetWidgetModel.getProperties().content}
                    widgetStyle={{
                      ...deviceSizeStyle,
                    }}
                    model={targetWidgetModel}
                    defaultEvent={{}}
                  ></PageWidgetComponent> */}
                  <WidgetSelectionOverlayComponent model={targetWidgetModel} />
                </div>
              ) : (
                <WidgetCreatorComponent widgetModel={targetWidgetModel} />
              )}
            </CenterStyleWrapper>
            {/* {isEditMode && <div id="superux-toast" className={toastMessageStyles.closeToast} />}
            {isEditMode && businessDialogModel && <BusinessDialogComponent widgetModel={businessDialogModel} />}
            {isEditMode && (
              <NotificationDialogContentComponent
                open={editorUIStore.getBusinessAlertOpenProperty()}
                handleClose={() => {
                  editorUIStore.setBusinessAlertOpenProperty(false);
                }}
                propsTitleID={editorUIStore.getBusinessAlertTitle()}
                propsPlainContent={editorUIStore.getBusinessAlertContent()}
              />
            )} */}
            {/* {dialog.dialogOpen && dialog.dialogType && (
              <dialog.dialogType
                open
                handleClose={handleDialogClose}
                commandPropName={''}
                commandType={''}
                onClick={() => {
                  handleDialogClose();
                }}
              />
            )} */}
          </div>
          {/* {isRuntimePreviewMode(editorStore.getAppModeContainer()) && (
            <PageNavigationButtonComponent startPageModel={targetWidgetModel} />
          )} */}
        </div>
      )}
      {/* <ContainerGuideline /> */}
    </EditorWrapper>
  );
};

EditorComponent.displayName = 'EditorComponent';

export default observer(EditorComponent);
