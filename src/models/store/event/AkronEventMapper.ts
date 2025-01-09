import { BaseWidgetModel } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import EventMapper from 'models/store/event/EventMapper';
import EventState from 'models/store/event/EventState';
import EventHandlerFactory from 'models/store/event/factory/EventHandlerFactory';

/**
 * UXEventMapper
 */
class AkronEventMapper extends EventMapper<WidgetID, CommandEnum, SelectionProp, BaseWidgetModel> {
  /**
   * HitItem을 채우는 Handler입니다.
   */
  protected readonly hitEventHandler: AkronEventHandler;

  /**
   * Constructor 에서 map 구성을 정의합니다. Event handler 인스턴스를 공유하는 것을 고려하여 constructor 를 작성해야 합니다.
   */
  public constructor(factory: EventHandlerFactory) {
    super();
    this.hitEventHandler = factory.createHitEventHandler();

    // EventMap 구성
    this.setDefaultEventMap(factory);
    this.setEditWidgetEventMap(factory);
  }

  /**
   * HitEventHandler를 반환합니다.
   */
  @boundMethod
  public getHitEventHandler(): AkronEventHandler {
    return this.hitEventHandler;
  }

  /**
   * 기본적인 상태에 대한 EventState를 등록합니다.
   */
  @boundMethod
  private setDefaultEventMap(factory: EventHandlerFactory): void {
    const defaultEventHandler = factory.createDefaultEventHandler();
    const widgetEventHandler = factory.createWidgetEventHandler();
    // const runtimeEventHandler = factory.createRuntimeEventHandler();
    const widgetAltkeyEventHandler = factory.createWidgetAltkeyEventHandler();
    const subToolpaneEventHandler = factory.createSubToolpaneEventHandler();

    this.eventMap.set(EventState.DEFAULT, [defaultEventHandler]);
    this.eventMap.set(EventState.EDIT, [defaultEventHandler, widgetAltkeyEventHandler, widgetEventHandler]);
    // this.eventMap.set(EventState.RUN, [defaultEventHandler, runtimeEventHandler]);
    this.eventMap.set(EventState.TOOLPANE_MOVE, [subToolpaneEventHandler]);

    this.eventMap.set(EventState.DEFAULT, [defaultEventHandler]);
    this.eventMap.set(EventState.EDIT, [defaultEventHandler, widgetAltkeyEventHandler, widgetEventHandler]);
    this.eventMap.set(EventState.IDLE, [defaultEventHandler, widgetAltkeyEventHandler, widgetEventHandler]);
  }

  /**
   * WidgetModel의 편집 중인 상태에 대한 EventState를 등록합니다.
   */
  @boundMethod
  private setEditWidgetEventMap(factory: EventHandlerFactory): void {
    const widgetSelectionEventHandler = factory.createWidgetSelectionEventHandler();
    const widgetMoveEventHandler = factory.createWidgetMoveEventHandler();
    const widgetResizeEventHandler = factory.createWidgetResizeEventHandler();

    this.eventMap.set(EventState.WIDGET_MOVE, [widgetSelectionEventHandler, widgetMoveEventHandler]);
    this.eventMap.set(EventState.WIDGET_RESIZE, [widgetResizeEventHandler]);
    // TODO: insert event handler 분리
    this.eventMap.set(EventState.WIDGET_INSERT, [widgetResizeEventHandler]);
  }
}

export default AkronEventMapper;
