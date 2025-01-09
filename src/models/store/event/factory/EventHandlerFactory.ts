import AkronEventHandler from 'models/store/event/AkronEventHandler';
import DefaultEventHandler from 'models/store/event/handler/DefaultEventHandler';
import HitEventHandler from 'models/store/event/handler/HitEventHandler';
import WidgetAltkeyEventHandler from 'models/store/event/handler/WidgetAltKeyEventHandler';
import WidgetEventHandler from 'models/store/event/handler/WidgetEventHandler';
import WidgetMoveEventHandler from 'models/store/event/handler/WidgetMoveEventHandler';
import WidgetResizeEventHandler from 'models/store/event/handler/WidgetResizeEventHandler';
import WidgetSelectionEventHandler from 'models/store/event/handler/WidgetSelectionHandler';

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
   * preViewEventHandler를 생성합니다.
   */
  // public createRuntimeEventHandler(): AkronEventHandler {
  //   return new RuntimeEventHandler();
  // }

  /**
   * WidgetAltkeyEventHandler를 생성합니다.
   */
  public createWidgetAltkeyEventHandler(): AkronEventHandler {
    return new WidgetAltkeyEventHandler();
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

  /**
   * SubToolpaneEventHandler를 생성합니다.
   */
  // public createSubToolpaneEventHandler(): AkronEventHandler {
  //   return new SubToolpaneEventHandler();
  // }

  /**
   * Runtime DrawingToolEventHandler 생성합니다.
   */
  // public createDrawingToolEventHandler(): AkronEventHandler {
  //   return new DrawingToolEventHandler();
  // }

  /**
   * HandToolEventHandler 생성합니다.
   */
  // public createHandToolEventHandler(): AkronEventHandler {
  //   return new HandToolEventHandler();
  // }
}

export default EventHandlerFactory;
