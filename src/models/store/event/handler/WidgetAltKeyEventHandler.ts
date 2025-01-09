import AkronEventHandler from 'models/store/event/AkronEventHandler';
import { MouseEvent } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import AkronContext from 'models/store/context/AkronContext';

/**
 * Widget의 Altkey가 눌린 상태의 Event를 처리하는 Handler입니다.
 */
class WidgetAltkeyEventHandler extends AkronEventHandler {
  /**
   * 마우스 버튼 누를 때
   */
  public override onMouseDown(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onMouseDown');
    return true;
  }

  /**
   * 마우스 주버튼(보통 Left)을 누른 채 끌고 있을 때
   */
  public override onMouseMove(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onMouseMove');
    return true;
  }

  /**
   * 눌렀던 마우스 버튼을 뗄 때
   */
  public override onMouseUp(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onMouseUp');
    return true;
  }

  /**
   * Mouse Event ( on click ),
   */
  public override onClick(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onClick');
    return true;
  }

  /**
   * Mouse Event ( on double click ),
   */
  public override onDoubleClick(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onDoubleClick');
    return true;
  }

  /**
   * Mouse Event ( on double click ),
   */
  public override onMouseOver(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (!event.isAltDown()) {
      return false;
    }
    event.stopPropagation();
    // executeBusinessLogic(event, ctx, 'onMouseOver');
    return true;
  }
}

export default WidgetAltkeyEventHandler;
