import { isDefined, dError } from '@akron/runner';
import { action } from 'mobx';
import { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';

/**
 * Editor 확대/축소시 필요한 Props
 */
export type ZoomInOutCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ZOOM_IN | CommandEnum.ZOOM_OUT;
};

/**
 * 지정 비율을 통한 zoom 조절시 필요한 Props
 */
export type ZoomRatioCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ZOOM_RATIO;
  zoomRatio: number;
};

/**
 * Editor CTRL을 통한 확대/축소시 필요한 Props
 */
export type ZoomInOutCtrlCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ZOOM_IN_CTRL | CommandEnum.ZOOM_OUT_CTRL;
};

/**
 * 창에 맞춤시 필요한 Props
 */
export type FitWindowCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.FIT_WINDOW;
};

/**
 * ZoomCommandProp의 집합
 */
type ZoomCommandProps =
  | ZoomInOutCommandProps
  | ZoomRatioCommandProps
  | FitWindowCommandProps
  | ZoomInOutCtrlCommandProps;

/**
 * Zoom 데이터 관리를 위한 상수
 */
export enum ZoomData {
  maximum = 3200,
  minimum = 1,
}

/**
 * Zoom In Ctrl Ratio
 */
const ZoomInCtrlBreakPoints = [3, 5, 13, 25, 50, 100, 200, 400, 800, 1600, ZoomData.maximum];

/**
 * Zoom out Ctrl Ratio
 */
const ZoomOutCtrlBreakPoints = [1600, 800, 400, 200, 100, 50, 25, 13, 5, 3, ZoomData.minimum];

/**
 * 줌 증가에 따른 계산 알고리즘
 */
function calculateIncreaseZoomRatio(currentRatio: number): number {
  if (currentRatio < 28) {
    return currentRatio + 1;
  }
  return currentRatio + 4;
}

/**
 * 줌 감소에 따른 계산 알고리즘
 */
function calculateDecreaseZoomRatio(zoomRatio: number): number {
  if (zoomRatio <= 28) {
    return zoomRatio - 1;
  }
  return zoomRatio - 4;
}

/**
 * Editor 확대/축소 동작을 처리하는 CommandHandler
 */
class EditorZoomInOutCommandHandler extends CommandHandler {
  /**
   * Editor의 확대/축소 관련 커맨드를 처리합니다.
   */
  public processCommand(props: ZoomCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.ZOOM_IN:
        this.zoomInProcess(ctx);
        break;
      case CommandEnum.ZOOM_OUT:
        this.zoomOutProcess(ctx);
        break;
      case CommandEnum.ZOOM_IN_CTRL:
        this.zoomInProcess(ctx, ZoomInCtrlBreakPoints);
        break;
      case CommandEnum.ZOOM_OUT_CTRL:
        this.zoomOutProcess(ctx, ZoomOutCtrlBreakPoints);
        break;
      case CommandEnum.ZOOM_RATIO:
        this.zoomRatioProcess(props, ctx);
        break;
      case CommandEnum.FIT_WINDOW:
        this.fitWindowProcess(props, ctx);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Ctrl + 휠 UP으로 Editor 영역 확대
   * 휠로 설정 가능한 크기 중 가장 가까운 올림 한 배율로 설정.
   */
  @action.bound
  private zoomInProcess(ctx: AkronContext, breakPoints?: number[]) {
    // 화면 맞춤일 경우 -1임.
    if (ctx.getIsFitWindow()) {
      ctx.setIsFitWindow(false);
    } // zoom in 시 이전 비율이 '창에 맞춤'이였다면 false로 변경.
    if (isDefined(breakPoints)) {
      breakPoints.some(value => {
        if (ctx.getZoomRatio() < value) {
          ctx.setZoomRatio(value);

          return true;
        }
        return false;
      });
    } else {
      if (ctx.getZoomRatio() < ZoomData.maximum) {
        ctx.setZoomRatio(calculateIncreaseZoomRatio(ctx.getZoomRatio()));
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Ctrl + 휠 UP으로 Editor 영역 축소
   * 휠로 설정 가능한 크기 중 가장 가까운 내림 한 배율로 설정.
   */
  @action.bound
  private zoomOutProcess(ctx: AkronContext, breakPoints?: number[]) {
    if (ctx.getIsFitWindow()) {
      ctx.setIsFitWindow(false);
    } // zoom out 시 이전 비율이 '창에 맞춤'이였다면 false로 변경.
    if (isDefined(breakPoints)) {
      breakPoints.some(value => {
        if (ctx.getZoomRatio() > value) {
          ctx.setZoomRatio(value);

          return true;
        }
        return false;
      });
    } else {
      if (ctx.getZoomRatio() > ZoomData.minimum) {
        ctx.setZoomRatio(calculateDecreaseZoomRatio(ctx.getZoomRatio()));
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Editor 영역 정해진 ratio로 zoom 변경
   */
  @action.bound
  private zoomRatioProcess(props: ZoomRatioCommandProps, ctx: AkronContext) {
    if (ctx.getIsFitWindow()) {
      ctx.setIsFitWindow(false);
    } // zoom 변경 시 이전 비율이 창에 맞춤이였다면 false로 변경.
    if (props.zoomRatio <= ZoomData.minimum || props.zoomRatio >= ZoomData.maximum) {
      // zoom 범위 내 값 아닐경우 1로 지정.
      dError('zoom ratio is not in range');
    } else {
      ctx.setZoomRatio(props.zoomRatio);
    }
  }

  /**
   * 현재 창 크기에 맞춰 ratio 변경
   */
  @action.bound
  private fitWindowProcess(props: FitWindowCommandProps, ctx: AkronContext) {
    ctx.setZoomRatio(-1); // 화면 맞춤
    ctx.setIsFitWindow(true);
  }
}

export default EditorZoomInOutCommandHandler;
