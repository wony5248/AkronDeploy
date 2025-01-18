import { boundMethod } from 'autobind-decorator';
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
import EventMapper from 'models/store/event/EventMapper';
import AkronContext from 'models/store/context/AkronContext';

/**
 * Event 해석을 담당하는 class 입니다.
 * AppStore 가 소유하고 있으며, event 를 해석하여 어떤 동작을 해야하는 지 알려줍니다.
 */
class EventManager<
  ID,
  CommandEnum,
  SelectionProp,
  Model,
  BaseEventMapper extends EventMapper<ID, CommandEnum, SelectionProp, Model>,
> {
  /**
   * state 에 따른 event handler list 를 보관하는 자료구조 입니다.
   */
  private readonly eventMap: BaseEventMapper;

  /**
   * EventMap을 입력받아 생성합니다.
   */
  public constructor(eventMap: BaseEventMapper) {
    this.eventMap = eventMap;
  }

  public getEventMap(): BaseEventMapper {
    return this.eventMap;
  }

  @boundMethod
  public onClick(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onClick(event, ctx));
  }

  @boundMethod
  public onDoubleClick(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDoubleClick(event, ctx));
  }

  @boundMethod
  public onMouseDown(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseDown(event, ctx));
  }

  @boundMethod
  public onMouseMove(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseMove(event, ctx));
  }

  @boundMethod
  public onMouseOut(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseOut(event, ctx));
  }

  @boundMethod
  public onMouseOver(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseOver(event, ctx));
  }

  @boundMethod
  public onMouseUp(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseUp(event, ctx));
  }

  @boundMethod
  public onMouseWheel(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseWheel(event, ctx));
  }

  @boundMethod
  public onMouseEnter(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseEnter(event, ctx));
  }

  @boundMethod
  public onMouseLeave(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseLeave(event, ctx));
  }

  @boundMethod
  public onMouseDownCapture(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseDownCapture(event, ctx));
  }

  @boundMethod
  public onMouseUpCapture(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseUpCapture(event, ctx));
  }

  @boundMethod
  public onMouseMoveCapture(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onMouseMoveCapture(event, ctx));
  }

  @boundMethod
  public onWheel(event: WheelEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onWheel(event, ctx));
  }

  @boundMethod
  public onKeyDown(event: KeyEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onKeyDown(event, ctx));
  }

  @boundMethod
  public onKeyUp(event: KeyEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onKeyUp(event, ctx));
  }

  @boundMethod
  public onKeyPressed(event: KeyEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onKeyPressed(event, ctx));
  }

  @boundMethod
  public onCompositionUpdate(event: CompositionEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onCompositionUpdate(event, ctx));
  }

  @boundMethod
  public onBeforeInput(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onBeforeInput(event, ctx));
  }

  @boundMethod
  public onInput(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onInput(event, ctx));
  }

  @boundMethod
  public onChange(event: FormEvent<Model>, ctx: AkronContext, eventParams: any[]): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onChange(event, ctx, eventParams));
  }

  @boundMethod
  public onFocus(event: FocusEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onFocus(event, ctx));
  }

  @boundMethod
  public onBlur(event: FocusEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onBlur(event, ctx));
  }

  @boundMethod
  public onContextMenu(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onContextMenu(event, ctx));
  }

  @boundMethod
  public onDrag(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDrag(event, ctx));
  }

  @boundMethod
  public onDragStart(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDragStart(event, ctx));
  }

  @boundMethod
  public onDragEnd(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDragEnd(event, ctx));
  }

  @boundMethod
  public onDragEnter(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDragEnter(event, ctx));
  }

  @boundMethod
  public onDragLeave(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDragLeave(event, ctx));
  }

  @boundMethod
  public onDragOver(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDragOver(event, ctx));
  }

  @boundMethod
  public onScroll(event: UIEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onScroll(event, ctx));
  }

  @boundMethod
  public onDrop(event: DragEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onDrop(event, ctx));
  }

  @boundMethod
  public onFormContextMenu(event: MouseEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onFormContextMenu(event, ctx));
  }

  @boundMethod
  public onInvalid(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onInvalid(event, ctx));
  }

  @boundMethod
  public onReset(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onReset(event, ctx));
  }

  @boundMethod
  public onSearch(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onSearch(event, ctx));
  }

  @boundMethod
  public onSelect(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onSelect(event, ctx));
  }

  @boundMethod
  public onSubmit(event: FormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onSubmit(event, ctx));
  }

  @boundMethod
  public onCopy(event: ClipboardEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onCopy(event, ctx));
  }

  @boundMethod
  public onCut(event: ClipboardEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onCut(event, ctx));
  }

  @boundMethod
  public onPaste(event: ClipboardEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPaste(event, ctx));
  }

  @boundMethod
  public onTouchStart(event: TouchEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onTouchStart(event, ctx));
  }

  @boundMethod
  public onTouchEnd(event: TouchEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onTouchEnd(event, ctx));
  }

  @boundMethod
  public onTouchMove(event: TouchEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onTouchMove(event, ctx));
  }

  @boundMethod
  public onPointerDown(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerDown(event, ctx));
  }

  @boundMethod
  public onPointerMove(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerMove(event, ctx));
  }

  @boundMethod
  public onPointerUp(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerUp(event, ctx));
  }

  @boundMethod
  public onPointerCancel(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerCancel(event, ctx));
  }

  @boundMethod
  public onPointerEnter(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerEnter(event, ctx));
  }

  @boundMethod
  public onPointerLeave(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerLeave(event, ctx));
  }

  @boundMethod
  public onPointerOver(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onPointerOver(event, ctx));
  }

  @boundMethod
  public onGotPointerCapture(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onGotPointerCapture(event, ctx));
  }

  @boundMethod
  public onLostPointerCapture(event: PointerEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onLostPointerCapture(event, ctx));
  }

  @boundMethod
  public onAnimationStart(event: AnimationEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onAnimationStart(event, ctx));
  }

  @boundMethod
  public onAnimationEnd(event: AnimationEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onAnimationEnd(event, ctx));
  }

  @boundMethod
  public onAnimationIteration(event: AnimationEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onAnimationIteration(event, ctx));
  }

  @boundMethod
  public onCustom(event: BaseEvent<Model>, ctx: AkronContext, widgetEventProperty: any): void {
    this.eventMap.get(ctx.getEventState())?.some(handler => handler.onCustom(event, ctx, widgetEventProperty));
  }
}
export default EventManager;
