import useEditorStore from 'hooks/useEditorStore';
import useEventListener from 'hooks/util/useEventListener';
import WidgetModel from 'models/node/WidgetModel';

/**
 * Hook
 */
type Hook = (widgetModel: WidgetModel) => {
  handleMouseDownCapture: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseUpCapture: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseMoveCapture: (e: React.MouseEvent<HTMLElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
  handleKeyUp: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  handleWheel: (e: React.WheelEvent<HTMLElement>) => void;
};

const useEditor: Hook = widgetModel => {
  const editorStore = useEditorStore();

  const {
    handleMouseDownCapture,
    handleMouseUpCapture,
    handleMouseMoveCapture,
    handleClick,
    handleMouseUp,
    handleMouseDown,
    handleMouseMove,
    handleKeyUp,
    handleKeyDown,
    handleWheel,
    handleMouseLeave,
  } = useEventListener(widgetModel);

  const documentHandleMouseDownCapture = (e: React.MouseEvent<HTMLElement>) => {
    editorStore.initHitContainer();
    handleMouseDownCapture(e);
  };

  return {
    handleMouseDownCapture: documentHandleMouseDownCapture,
    handleMouseUpCapture,
    handleMouseMoveCapture,
    handleClick,
    handleMouseUp,
    handleMouseDown,
    handleMouseMove,
    handleKeyUp,
    handleKeyDown,
    handleWheel,
    handleMouseLeave,
  };
};
export default useEditor;
