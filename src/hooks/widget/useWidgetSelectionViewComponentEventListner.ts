import { Nullable } from '@akron/runner';
import useEditorStore from 'hooks/useEditorStore';
import useEventListener, { MouseHandlerType } from 'hooks/util/useEventListener';
import WidgetModel from 'models/node/WidgetModel';
import { WidgetEditSubEventState, WidgetResizeHandle } from 'models/store/container/WidgetEditInfoContainer';
import EventState from 'models/store/event/EventState';

/**
 * Resize Handle Mouse Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type ResizeHandleMouseHandlerType = Nullable<
  (e: React.MouseEvent<HTMLElement | SVGElement>, resizeHandle: WidgetResizeHandle) => void
>;

/**
 * WidgetSelectionViewComponent에서 사용하는 hook type입니다.
 */
type WidgetSelectionViewComponentEventHook = (model: WidgetModel) => {
  handleWidgetSelectionViewComponentMouseDownCapture: MouseHandlerType;
  handleWidgetSelectionViewComponentMouseDownForMove: MouseHandlerType;
  handleWidgetSelectionViewComponentMouseDownForResize: ResizeHandleMouseHandlerType;
  handleWidgetSelectionViewComponentMouseUpCapture: MouseHandlerType;
  handleWidgetSelectionViewComponentMouseUp: MouseHandlerType;
};

/**
 * WidgetSelectionViewComponent에서 사용하는 event hook입니다.
 */
const useWidgetSelectionViewComponentEventListner: WidgetSelectionViewComponentEventHook = (
  widgetModel: WidgetModel
) => {
  const editorStore = useEditorStore();
  const widgetEditInfoContainer = editorStore.getWidgetEditInfoContainer();

  const { handleMouseDownCapture, handleMouseDown, handleMouseUpCapture, handleMouseUp } =
    useEventListener(widgetModel);

  const handleWidgetSelectionViewComponentMouseDownCapture = handleMouseDownCapture;

  const handleWidgetSelectionViewComponentMouseDownForMove = (e: React.MouseEvent<HTMLElement | SVGElement>) => {
    if (editorStore.getEventState() === EventState.EDIT) {
      editorStore.setEventState(EventState.WIDGET_MOVE);
      widgetEditInfoContainer.setEventTargetWidgetModel(widgetModel);
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.READY);
    }
    handleMouseDown(e);
  };

  const handleWidgetSelectionViewComponentMouseDownForResize = (
    e: React.MouseEvent<HTMLElement | SVGElement>,
    resizeHandle: WidgetResizeHandle
    // cursor: string
  ) => {
    if (editorStore.getEventState() === EventState.EDIT) {
      editorStore.setEventState(EventState.WIDGET_RESIZE);
      widgetEditInfoContainer.setEventTargetWidgetModel(widgetModel);
      widgetEditInfoContainer.setResizeHandle(resizeHandle);
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.READY);
    }
    handleMouseDown(e);
  };

  const handleWidgetSelectionViewComponentMouseUpCapture = handleMouseUpCapture;
  const handleWidgetSelectionViewComponentMouseUp = handleMouseUp;

  return {
    handleWidgetSelectionViewComponentMouseDownCapture,
    handleWidgetSelectionViewComponentMouseDownForMove,
    handleWidgetSelectionViewComponentMouseDownForResize,
    handleWidgetSelectionViewComponentMouseUpCapture,
    handleWidgetSelectionViewComponentMouseUp,
  };
};

export default useWidgetSelectionViewComponentEventListner;
