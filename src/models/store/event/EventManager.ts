import { boundMethod } from 'autobind-decorator';
import EventMapper, { AkronEventMapper } from './EventMapper';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from '../command/common/CommandEnum';
import { DefaultEvent, DefaultFormEvent } from '@akron/runner';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';

export interface AkronEventManager
  extends EventManager<WidgetID, CommandEnum, SelectionProp, WidgetModel, AkronEventMapper> {}
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
  public onClick(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onClick(event, ctx));
  }

  @boundMethod
  public onDoubleClick(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDoubleClick(event, ctx));
  }

  @boundMethod
  public onMouseDown(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseDown(event, ctx));
  }

  @boundMethod
  public onMouseMove(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseMove(event, ctx));
  }

  @boundMethod
  public onMouseOut(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseOut(event, ctx));
  }

  @boundMethod
  public onMouseOver(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseOver(event, ctx));
  }

  @boundMethod
  public onMouseUp(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseUp(event, ctx));
  }

  @boundMethod
  public onMouseWheel(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseWheel(event, ctx));
  }

  @boundMethod
  public onMouseEnter(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseEnter(event, ctx));
  }

  @boundMethod
  public onMouseLeave(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseLeave(event, ctx));
  }

  @boundMethod
  public onMouseDownCapture(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseDownCapture(event, ctx));
  }

  @boundMethod
  public onMouseUpCapture(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseUpCapture(event, ctx));
  }

  @boundMethod
  public onMouseMoveCapture(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onMouseMoveCapture(event, ctx));
  }

  @boundMethod
  public onWheel(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onWheel(event, ctx));
  }

  @boundMethod
  public onKeyDown(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onKeyDown(event, ctx));
  }

  @boundMethod
  public onKeyUp(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onKeyUp(event, ctx));
  }

  @boundMethod
  public onKeyPressed(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onKeyPressed(event, ctx));
  }

  @boundMethod
  public onCompositionUpdate(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onCompositionUpdate(event, ctx));
  }

  @boundMethod
  public onBeforeInput(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onBeforeInput(event, ctx));
  }

  @boundMethod
  public onInput(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onInput(event, ctx));
  }

  @boundMethod
  public onChange(event: DefaultFormEvent<Model>, ctx: AkronContext, eventParams: any[]): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onChange(event, ctx, eventParams));
  }

  @boundMethod
  public onFocus(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onFocus(event, ctx));
  }

  @boundMethod
  public onBlur(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onBlur(event, ctx));
  }

  @boundMethod
  public onContextMenu(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onContextMenu(event, ctx));
  }

  @boundMethod
  public onDrag(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDrag(event, ctx));
  }

  @boundMethod
  public onDragStart(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDragStart(event, ctx));
  }

  @boundMethod
  public onDragEnd(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDragEnd(event, ctx));
  }

  @boundMethod
  public onDragEnter(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDragEnter(event, ctx));
  }

  @boundMethod
  public onDragLeave(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDragLeave(event, ctx));
  }

  @boundMethod
  public onDragOver(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDragOver(event, ctx));
  }

  @boundMethod
  public onScroll(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onScroll(event, ctx));
  }

  @boundMethod
  public onDrop(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onDrop(event, ctx));
  }

  @boundMethod
  public onFormContextMenu(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onFormContextMenu(event, ctx));
  }

  @boundMethod
  public onInvalid(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onInvalid(event, ctx));
  }

  @boundMethod
  public onReset(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onReset(event, ctx));
  }

  @boundMethod
  public onSearch(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onSearch(event, ctx));
  }

  @boundMethod
  public onSelect(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onSelect(event, ctx));
  }

  @boundMethod
  public onSubmit(event: DefaultFormEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onSubmit(event, ctx));
  }

  @boundMethod
  public onCopy(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onCopy(event, ctx));
  }

  @boundMethod
  public onCut(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onCut(event, ctx));
  }

  @boundMethod
  public onPaste(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPaste(event, ctx));
  }

  @boundMethod
  public onTouchStart(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onTouchStart(event, ctx));
  }

  @boundMethod
  public onTouchEnd(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onTouchEnd(event, ctx));
  }

  @boundMethod
  public onTouchMove(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onTouchMove(event, ctx));
  }

  @boundMethod
  public onPointerDown(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerDown(event, ctx));
  }

  @boundMethod
  public onPointerMove(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerMove(event, ctx));
  }

  @boundMethod
  public onPointerUp(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerUp(event, ctx));
  }

  @boundMethod
  public onPointerCancel(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerCancel(event, ctx));
  }

  @boundMethod
  public onPointerEnter(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerEnter(event, ctx));
  }

  @boundMethod
  public onPointerLeave(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerLeave(event, ctx));
  }

  @boundMethod
  public onPointerOver(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onPointerOver(event, ctx));
  }

  @boundMethod
  public onGotPointerCapture(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onGotPointerCapture(event, ctx));
  }

  @boundMethod
  public onLostPointerCapture(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onLostPointerCapture(event, ctx));
  }

  @boundMethod
  public onAnimationStart(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onAnimationStart(event, ctx));
  }

  @boundMethod
  public onAnimationEnd(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onAnimationEnd(event, ctx));
  }

  @boundMethod
  public onAnimationIteration(event: DefaultEvent<Model>, ctx: AkronContext): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onAnimationIteration(event, ctx));
  }

  @boundMethod
  public onCustom(event: DefaultEvent<Model>, ctx: AkronContext, widgetEventProperty: any): void {
    this.eventMap.get(ctx.getState())?.some(handler => handler.onCustom(event, ctx, widgetEventProperty));
  }
}
export default EventManager;
