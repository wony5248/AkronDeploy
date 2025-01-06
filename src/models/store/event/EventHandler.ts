import AkronContext from 'models/store/context/AkronContext';
import { DefaultEvent, DefaultFormEvent } from '@akron/runner';

/**
 * event 를 처리하는 event handler class 입니다.
 * Event handler list 안에 존재하며 메소드가 return true 하면 chaining 이 중단됩니다.
 */

class EventHandler<ID, CommandEnum, SelectionProp, Model> {
  public onClick(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDoubleClick(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseDown(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseMove(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseOut(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseOver(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseUp(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseWheel(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseEnter(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseLeave(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseDownCapture(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseUpCapture(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onMouseMoveCapture(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onWheel(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onKeyDown(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onKeyPressed(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onKeyUp(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onCompositionUpdate(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onBeforeInput(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onInput(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onChange(event: DefaultFormEvent<Model>, ctx: AkronContext, eventParams: any[]): boolean {
    return false;
  }
  public onFocus(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onBlur(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onContextMenu(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDrag(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDragStart(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDragEnd(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDragEnter(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDragLeave(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDragOver(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onDrop(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onScroll(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onFormContextMenu(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onInvalid(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onReset(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onSearch(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onSelect(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onSubmit(event: DefaultFormEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onCopy(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onCut(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPaste(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onTouchStart(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onTouchEnd(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onTouchMove(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerDown(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerMove(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerUp(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerCancel(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerEnter(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerLeave(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onPointerOver(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onGotPointerCapture(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onLostPointerCapture(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onAnimationStart(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onAnimationEnd(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onAnimationIteration(event: DefaultEvent<Model>, ctx: AkronContext): boolean {
    return false;
  }
  public onCustom(event: DefaultEvent<Model>, ctx: AkronContext, widgetEventProperty: any): boolean {
    return false;
  }
}

export default EventHandler;
