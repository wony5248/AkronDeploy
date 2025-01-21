import AkronEventHandler from 'models/store/event/AkronEventHandler';
import DefaultEventHandler from 'models/store/event/handler/DefaultEventHandler';
import HitEventHandler from 'models/store/event/handler/HitEventHandler';
import WidgetEventHandler from 'models/store/event/handler/WidgetEventHandler';
import WidgetMoveEventHandler from 'models/store/event/handler/WidgetMoveEventHandler';
import WidgetResizeEventHandler from 'models/store/event/handler/WidgetResizeEventHandler';
import WidgetSelectionEventHandler from 'models/store/event/handler/WidgetSelectionEventHandler';

/**
 * Event handler 를 생성하는 abstract factory 입니다.
 */
class EventHandlerFactory {
  /**
   * defaultEventHandler를 생성합니다.
   */
  public createDefaultEventHandler(): AkronEventHandler {
    return new DefaultEventHandler();
  }

  /**
   * HitEventHandler를 생성합니다.
   */
  public createHitEventHandler(): AkronEventHandler {
    return new HitEventHandler();
  }

  /**
   * widgetEventHandler를 생성합니다.
   */
  public createWidgetEventHandler(): AkronEventHandler {
    return new WidgetEventHandler();
  }

  /**
   * WidgetSelectionEventHandler를 생성합니다.
   */
  public createWidgetSelectionEventHandler(): AkronEventHandler {
    return new WidgetSelectionEventHandler();
  }

  /**
   * WidgetMoveEventHandler를 생성합니다.
   */
  public createWidgetMoveEventHandler(): AkronEventHandler {
    return new WidgetMoveEventHandler();
  }

  /**
   * WidgetResizeEventHandler를 생성합니다.
   */
  public createWidgetResizeEventHandler(): AkronEventHandler {
    return new WidgetResizeEventHandler();
  }
}

export default EventHandlerFactory;
