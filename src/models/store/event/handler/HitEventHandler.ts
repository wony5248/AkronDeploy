import { BaseWidgetModel, dError, MouseEvent, isUndefined, isDefined } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import WidgetModel from 'models/node/WidgetModel';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import HitItem from 'models/store/selection/HitItem';

enum HitType {
  DOWN,
  UP,
  MOVE,
}

/**
 * CaptureEvent를 처리하여 AkronContext의 HitEventContainer 구성을 변경합니다.
 */
class HitEventHandler extends AkronEventHandler {
  /**
   * onMouseDownCapture 이벤트 처리
   */
  @boundMethod
  public override onMouseDownCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    this.handleHitItem(event, ctx, HitType.DOWN);
    return true;
  }

  /**
   * onMouseUpCapture 이벤트 처리
   */
  @boundMethod
  public override onMouseUpCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    this.handleHitItem(event, ctx, HitType.UP);
    return true;
  }

  /**
   * onMouseMoveCapture 이벤트 처리
   */
  @boundMethod
  public override onMouseMoveCapture(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    this.handleHitItem(event, ctx, HitType.MOVE);
    return true;
  }

  /**
   * 하나의 HitEventHandler에서, HitItem Set 로직을 진행
   * Widget Type 별로 처리
   */
  @boundMethod
  private handleHitItem(event: MouseEvent<WidgetModel>, ctx: AkronContext, type: HitType) {
    const model = event.getTargetModel();

    // 현재 model이 최상위 widget이면...
    // (ex. App 편집 모드 -> AppWidget.)
    if (model.getWidgetType() === 'App') {
      this.handleEditorHitItem(event, ctx, type);
      return;
    }

    Error(`${event.getTargetModel()} Type does not have capture handler.`);
  }

  /**
   * 최상위 component의 MouseCapture EventHandler
   * HitItem을 최초 생성합니다.
   */
  private handleEditorHitItem(event: MouseEvent<BaseWidgetModel>, ctx: AkronContext, type: HitType) {
    switch (type) {
      case HitType.DOWN: {
        const startHitItem = new HitItem<BaseWidgetModel>();
        ctx.getHitContainer().setStartHitItem(startHitItem);
        break;
      }
      case HitType.UP: {
        break;
      }
      case HitType.MOVE: {
        const endHitItem = new HitItem<BaseWidgetModel>();
        ctx.getHitContainer()?.setEndHitItem(endHitItem);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Widget에 대한 hitItem 처리
   */
  @boundMethod
  private handleWidgetHitItem(event: MouseEvent<BaseWidgetModel>, ctx: AkronContext, type: HitType) {
    const model = event.getTargetModel();
    switch (type) {
      case HitType.UP: {
        break;
      }
      case HitType.MOVE: {
        break;
      }
      case HitType.DOWN: {
        const startHitItem = ctx.getHitContainer()?.getStartHitItem();
        if (startHitItem === undefined) {
          dError('hitItem is undefined');
          break;
        }
        if (model instanceof WidgetModel) {
          startHitItem.setModel(model);
        }
        break;
      }
      default:
        break;
    }
  }
}

export default HitEventHandler;
