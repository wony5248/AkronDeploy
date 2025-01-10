import useEditorStore from 'hooks/useEditorStore';
import WidgetModel from 'models/node/WidgetModel';
import { SaveState } from 'models/store/EditorStore';
import {
  MouseEvent,
  KeyEvent,
  FocusEvent,
  FormEvent,
  BaseEvent,
  DragEvent,
  VoidEvent,
  TouchEvent,
  PointerEvent,
  UIEvent,
  WheelEvent,
  ChangeEvent,
  CustomEvent,
  AnimationEvent,
  ClipboardEvent,
  SyntheticEvent,
  CompositionEvent,
  isDefined,
  isNotNull,
} from '@akron/runner';

/**
 * Mouse Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type MouseHandlerType = (e: React.MouseEvent<HTMLElement | SVGElement>) => void;
/**
 * Mouse Wheel Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type WheelHandlerType = (e: React.WheelEvent<HTMLElement>) => void;
/**
 * Key Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type KeyHandlerType = (e: React.KeyboardEvent<HTMLElement>) => void;
/**
 * Form Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type FormHandlerType = (e: React.FormEvent<HTMLElement>) => void;

/**
 * Focus Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type FocusHandlerType = (e: React.FocusEvent<HTMLElement>) => void;

/**
 * Composition Event 관련 EvnetListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type CompositionHandelrType = (e: React.CompositionEvent<HTMLElement>) => void;

/**
 * Event MetaData를 통해 정의되는 함수는 EventType이 어떤 것이든 올 수 있기 때문에 any로 설정
 */
export type CustomHandlerType = (eventName: string, e?: any) => void;

/**
 * Drag Wheel Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type DragHandlerType = (e: React.DragEvent<HTMLElement>) => void;

/**
 * Clipboard Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type ClipboardHandlerType = (e: React.ClipboardEvent<HTMLElement>) => void;

/**
 * Touch Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type TouchHandlerType = (e: React.TouchEvent<HTMLElement>) => void;

/**
 * Pointer Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type PointerHandlerType = (e: React.PointerEvent<HTMLElement>) => void;

/**
 * Animation Event 관련 EventListener 함수의 형태입니다.
 * event => void 형태의 함수를 리턴합니다.
 */
export type AnimationHandlerType = (e: React.AnimationEvent<HTMLElement>) => void;

/**
 * EventListener 를 생성하기 위한 팩토리 인터페이스 정의입니다.
 */
type Hook = (node: WidgetModel) => {
  handleClick: MouseHandlerType;
  handleDoubleClick: MouseHandlerType;
  handleMouseDown: MouseHandlerType;
  handleMouseMove: MouseHandlerType;
  handleMouseOut: MouseHandlerType;
  handleMouseOver: MouseHandlerType;
  handleMouseUp: MouseHandlerType;
  handleMouseDownCapture: MouseHandlerType;
  handleMouseUpCapture: MouseHandlerType;
  handleMouseMoveCapture: MouseHandlerType;
  handleMouseEnter: MouseHandlerType;
  handleMouseLeave: MouseHandlerType;
  handleDrag: DragHandlerType;
  handleDragStart: DragHandlerType;
  handleDragEnd: DragHandlerType;
  handleDragEnter: DragHandlerType;
  handleDragLeave: DragHandlerType;
  handleDrop: DragHandlerType;
  handleScroll: DragHandlerType;
  handleDragOver: DragHandlerType;
  handleContextMenu: MouseHandlerType;
  handleWheel: WheelHandlerType;
  handleKeyDown: KeyHandlerType;
  handleKeyUp: KeyHandlerType;
  handleKeyPressed: KeyHandlerType;
  handleBeforeInput: FormHandlerType;
  handleFocus: FocusHandlerType;
  handleBlur: FocusHandlerType;
  handleCompositionUpdate: CompositionHandelrType;
  handleInput: FormHandlerType;
  handleOnChange: FormHandlerType;
  handleOnContextMenu: MouseHandlerType;
  handleInvalid: FormHandlerType;
  handleReset: FormHandlerType;
  handleSearch: FormHandlerType;
  handleSelect: FormHandlerType;
  handleSubmit: FormHandlerType;
  handleCopy: ClipboardHandlerType;
  handleCut: ClipboardHandlerType;
  handlePaste: ClipboardHandlerType;
  handleTouchStart: TouchHandlerType;
  handleTouchEnd: TouchHandlerType;
  handleTouchMove: TouchHandlerType;
  handlePointerDown: PointerHandlerType;
  handlePointerMove: PointerHandlerType;
  handlePointerUp: PointerHandlerType;
  handlePointerCancel: PointerHandlerType;
  handlePointerEnter: PointerHandlerType;
  handlePointerLeave: PointerHandlerType;
  handlePointerOver: PointerHandlerType;
  handleGotPointerCapture: PointerHandlerType;
  handleLostPointerCapture: PointerHandlerType;
  handleAnimationStart: AnimationHandlerType;
  handleAnimationEnd: AnimationHandlerType;
  handleAnimationIteration: AnimationHandlerType;
  // custom
  handleCustom: CustomHandlerType;
};

const useEventListener: Hook = node => {
  const editorStore = useEditorStore();
  const eventTypeMap = new Map(); // useRuntimeStore().getMetaDataContainer().getEventTypeMap();
  /*
   * 저장 실패 후, 이벤트 감지 시 재저장 시도해야 하는 이벤트에 할당됨
   */
  const checkResave = () => {
    if (editorStore.getSaveState() === SaveState.SAVE_ERROR) {
      editorStore.setSaveState(SaveState.RESAVING);
      return true;
    }
    return false;
  };
  /*
   * 저장 실패 후, 이벤트 감지 시 재저장하지 않는 단순 움직임 이벤트에 할당
   */
  const checkDontResave = () => {
    if (editorStore.getSaveState() === SaveState.SAVE_ERROR) {
      return true;
    }
    return false;
  };
  /*
   * handleMouse...Capture는 사용자가 드래깅 했을 때의
   * hitItemContainer 생성/변경용 으로만 사용됩니다.
   */
  const handleClick: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleClick(event);
  };

  const handleDoubleClick: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleDoubleClick(event);
  };

  const handleMouseDown: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseDown(event);
  };

  const handleMouseMove: MouseHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseMove(event);
  };

  const handleMouseOut: MouseHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseOut(event);
  };

  const handleMouseOver: MouseHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseOver(event);
  };

  const handleMouseUp: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseUp(event);
  };

  const handleMouseDownCapture: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseDownCapture(event);
  };

  const handleMouseUpCapture: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseUpCapture(event);
  };
  const handleMouseMoveCapture: MouseHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    if (e.buttons === 1) {
      const event = new MouseEvent(e, node);
      editorStore.handleMouseMoveCapture(event);
    }
  };

  const handleMouseEnter: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseEnter(event);
  };

  const handleMouseLeave: MouseHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleMouseLeave(event);
  };

  const handleContextMenu: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleContextMenu(event);
  };

  const handleWheel: WheelHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new WheelEvent(e, node);
    editorStore.handleWheel(event);
  };

  const handleKeyDown: KeyHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new KeyEvent(e, node);
    editorStore.handleKeyDown(event);
  };

  const handleKeyUp: KeyHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new KeyEvent(e, node);
    editorStore.handleKeyUp(event);
  };

  const handleKeyPressed: KeyHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new KeyEvent(e, node);
    editorStore.handleKeyPressed(event);
  };

  const handleBeforeInput: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleBeforeInput(event);
  };

  const handleInput: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleInput(event);
  };

  const handleFocus: FocusHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FocusEvent(e, node);
    editorStore.handleFocus(event);
  };

  const handleBlur: FocusHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new FocusEvent(e, node);
    editorStore.handleBlur(event);
  };

  const handleCompositionUpdate: CompositionHandelrType = e => {
    if (checkResave()) {
      return;
    }
    const event = new CompositionEvent(e, node);
    editorStore.handleCompositionUpdate(event);
  };

  const handleDrag: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDrag(event);
  };

  const handleDragStart: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDragStart(event);
  };

  const handleDragEnd: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDragEnd(event);
  };

  const handleDragEnter: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDragEnter(event);
  };

  const handleDragLeave: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDragLeave(event);
  };

  const handleDragOver: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDragOver(event);
  };

  const handleScroll: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new UIEvent(e, node);
    editorStore.handleScroll(event);
  };

  const handleDrop: DragHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new DragEvent(e, node);
    editorStore.handleDrop(event);
  };

  const handleOnChange: FormHandlerType = (e, ...eventParams) => {
    if (checkResave()) {
      return;
    }
    let value: any;
    const widgetModelEvent = eventTypeMap.get(node.getWidgetType());
    if (isDefined(widgetModelEvent) && widgetModelEvent.get('onChange')) {
      const targetEventInfo = widgetModelEvent.get('onChange');
      if (targetEventInfo) {
        // Picker 들은 event를 넘기지 않고, value만 넘깁니다.
        // event MetaData의 NewValueLocation를 이용해, newValue를 eventParams에 추가해 넘겨줍니다.
        if (isDefined(targetEventInfo.NewValueLocation)) {
          value = [e, ...eventParams][targetEventInfo.NewValueLocation.Index];
          if (isDefined(targetEventInfo.NewValueLocation.ValueLocation)) {
            targetEventInfo.NewValueLocation.ValueLocation.split('.').forEach((location: string) => {
              value = value?.[location];
            });
          }
        }
      }
    }
    const event = new FormEvent(e, node);
    editorStore.handleChange(event, [...eventParams, value]);
  };

  const handleOnContextMenu: MouseHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new MouseEvent(e, node);
    editorStore.handleOnContextMenu(event);
  };

  const handleInvalid: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleInvalid(event);
  };

  const handleReset: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleReset(event);
  };

  const handleSearch: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleSearch(event);
  };

  const handleSelect: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleSelect(event);
  };

  const handleSubmit: FormHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new FormEvent(e, node);
    editorStore.handleSubmit(event);
  };

  const handleCopy: ClipboardHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new ClipboardEvent(e, node);
    editorStore.handleCopy(event);
  };

  const handleCut: ClipboardHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new ClipboardEvent(e, node);
    editorStore.handleCut(event);
  };

  const handlePaste: ClipboardHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new ClipboardEvent(e, node);
    editorStore.handlePaste(event);
  };

  const handleTouchStart: TouchHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new TouchEvent(e, node);
    editorStore.handleTouchStart(event);
  };

  const handleTouchEnd: TouchHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new TouchEvent(e, node);
    editorStore.handleTouchEnd(event);
  };

  const handleTouchMove: TouchHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new TouchEvent(e, node);
    editorStore.handleTouchMove(event);
  };

  const handlePointerDown: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerDown(event);
  };

  const handlePointerMove: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerMove(event);
  };

  const handlePointerUp: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerUp(event);
  };

  const handlePointerCancel: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerCancel(event);
  };

  const handlePointerEnter: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerEnter(event);
  };

  const handlePointerLeave: PointerHandlerType = e => {
    if (checkDontResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerLeave(event);
  };

  const handlePointerOver: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handlePointerOver(event);
  };

  const handleGotPointerCapture: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handleGotPointerCapture(event);
  };

  const handleLostPointerCapture: PointerHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new PointerEvent(e, node);
    editorStore.handleLostPointerCapture(event);
  };

  const handleAnimationStart: AnimationHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new AnimationEvent(e, node);
    editorStore.handleAnimationStart(event);
  };

  const handleAnimationEnd: AnimationHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new AnimationEvent(e, node);
    editorStore.handleAnimationEnd(event);
  };

  const handleAnimationIteration: AnimationHandlerType = e => {
    if (checkResave()) {
      return;
    }
    const event = new AnimationEvent(e, node);
    editorStore.handleAnimationIteration(event);
  };

  const wrapEvent: (e: any, eventType: string) => BaseEvent<WidgetModel> = (e: any, eventType: string) => {
    switch (eventType) {
      case 'MouseEvent':
        return new MouseEvent(e, node);
      case 'WheelEvent':
        return new WheelEvent(e, node);
      case 'KeyEvent':
      case 'KeyboardEvent':
        return new KeyEvent(e, node);
      case 'FocusEvent':
        return new FocusEvent(e, node);
      case 'FormEvent':
        return new FormEvent(e, node);
      case 'ChangeEvent':
        return new ChangeEvent(e, node);
      case 'CompositionEvent':
        return new CompositionEvent(e, node);
      case 'SyntheticEvent':
        return new SyntheticEvent(e, node);
      case 'DragEvent':
        return new DragEvent(e, node);
      case 'ClipboardEvent':
        return new ClipboardEvent(e, node);
      case 'TouchEvent':
        return new TouchEvent(e, node);
      case 'void':
      default:
        return new VoidEvent(node);
    }
  };

  // custom함수의 경우 어떤 input이 들어올지 모르기 때문에 any로 받음
  // handle함수에서 event prop type을 통해 Event Wrapping을 하고, editorStore에 넘겨줌
  // RuntimeEventHandler에서 BC Event register를 위한 metadata가 필요하므로 EventProperty 파라미터로 넘김

  const handleCustom: CustomHandlerType = (eventName, e, ...eventParams) => {
    if (checkResave()) {
      return;
    }
    const widgetModelEvent = eventTypeMap.get(node.getWidgetType());
    if (isDefined(widgetModelEvent) && widgetModelEvent.get(eventName)) {
      const targetEventInfo = widgetModelEvent.get(eventName);
      if (targetEventInfo) {
        // Picker 들은 event를 넘기지 않고, value만 넘깁니다.
        // event MetaData의 NewValueLocation를 이용해, newValue를 eventParams에 추가해 넘겨줍니다.
        let value: any;
        if (isDefined(targetEventInfo.NewValueLocation) && isNotNull(targetEventInfo.NewValueLocation)) {
          value = [e, ...eventParams][targetEventInfo.NewValueLocation.Index];
          if (
            isDefined(targetEventInfo.NewValueLocation.ValueLocation) &&
            isNotNull(targetEventInfo.NewValueLocation.ValueLocation)
          ) {
            targetEventInfo.NewValueLocation.ValueLocation.split('.').forEach((location: string) => {
              value = value?.[location];
            });
          }
        }

        // editorStore.handleCustom(wrapEvent(e, targetEventInfo.Type), {
        //     name: eventName,
        //     type: targetEventInfo.Type,
        //     inputs: targetEventInfo.Inputs,
        //     eventParams: [...eventParams, value],
        // });
      }
    }
  };

  return {
    handleClick,
    handleDoubleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseOut,
    handleMouseOver,
    handleMouseUp,
    handleKeyDown,
    handleKeyPressed,
    handleKeyUp,
    handleMouseDownCapture,
    handleMouseUpCapture,
    handleMouseMoveCapture,
    handleMouseEnter,
    handleMouseLeave,
    handleDrag,
    handleDragStart,
    handleDragEnd,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleScroll,
    handleDrop,
    handleWheel,
    handleOnChange,
    handleOnContextMenu,
    handleInvalid,
    handleReset,
    handleSearch,
    handleSelect,
    handleSubmit,
    handleContextMenu,
    handleBeforeInput,
    handleInput,
    handleFocus,
    handleBlur,
    handleCopy,
    handleCut,
    handlePaste,
    handleCompositionUpdate,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerOver,
    handleGotPointerCapture,
    handleLostPointerCapture,
    handleAnimationStart,
    handleAnimationEnd,
    handleAnimationIteration,
    handleCustom,
  };
};

export default useEventListener;
