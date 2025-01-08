import {
  FormEvent,
  KeyEvent,
  MouseEvent,
  FocusEvent,
  WheelEvent,
  CompositionEvent,
  DragEvent,
  UIEvent,
  ClipboardEvent,
  BaseEvent,
  TouchEvent,
  PointerEvent,
  AnimationEvent,
} from '@akron/runner';
import AkronContext from 'models/store/context/AkronContext';

/**
 * event 를 처리하는 event handler class 입니다.
 * Event handler list 안에 존재하며 메소드가 return true 하면 chaining 이 중단됩니다.
 */
class EventHandler<ID, CommandEnum, SelectionProp, Model> {
  public onClick(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDoubleClick(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseDown(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseMove(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseOut(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseOver(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseUp(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseWheel(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseEnter(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseLeave(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseDownCapture(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseUpCapture(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onMouseMoveCapture(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onWheel(event: WheelEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onKeyDown(event: KeyEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onKeyPressed(event: KeyEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onKeyUp(event: KeyEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onCompositionUpdate(event: CompositionEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onBeforeInput(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onInput(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onChange(event: FormEvent<Model>, ctx: AkronContext, eventParams: any[]): boolean {
    return false;
  }

  public onFocus(event: FocusEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onBlur(event: FocusEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onContextMenu(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDrag(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDragStart(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDragEnd(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDragEnter(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDragLeave(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDragOver(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onDrop(event: DragEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onScroll(event: UIEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onFormContextMenu(event: MouseEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onInvalid(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onReset(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onSearch(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onSelect(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onSubmit(event: FormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onCopy(event: ClipboardEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onCut(event: ClipboardEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPaste(event: ClipboardEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onTouchStart(event: TouchEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onTouchEnd(event: TouchEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onTouchMove(event: TouchEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerDown(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerMove(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerUp(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerCancel(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerEnter(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerLeave(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onPointerOver(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onGotPointerCapture(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onLostPointerCapture(event: PointerEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onAnimationStart(event: AnimationEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onAnimationEnd(event: AnimationEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onAnimationIteration(event: AnimationEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }

  public onCustom(event: BaseEvent<Model>, ctx: AkronContext, widgetEventProperty: any): boolean {
    return false;
  }
}

export default EventHandler;
