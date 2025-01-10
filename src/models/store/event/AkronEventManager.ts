import { boundMethod } from 'autobind-decorator';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import EventManager from 'models/store/event/EventManager';
import { MouseEvent } from '@akron/runner';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventMapper from 'models/store/event/AkronEventMapper';
/**
 * Event 해석을 담당하는 class 입니다.
 * AppStore 가 소유하고 있으며, event 를 해석하여 어떤 동작을 해야하는 지 알려줍니다.
 */
class AkronEventManager extends EventManager<WidgetID, CommandEnum, SelectionProp, WidgetModel, AkronEventMapper> {
  @boundMethod
  public override onMouseDownCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): void {
    this.getEventMap().getHitEventHandler().onMouseDownCapture(event, ctx);
  }

  @boundMethod
  public override onMouseUpCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): void {
    this.getEventMap().getHitEventHandler().onMouseUpCapture(event, ctx);
  }

  @boundMethod
  public override onMouseMoveCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): void {
    this.getEventMap().getHitEventHandler().onMouseMoveCapture(event, ctx);
  }
}
export default AkronEventManager;
