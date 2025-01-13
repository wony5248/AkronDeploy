import { dError, isUndefined } from '@akron/runner';
import { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import UpdateAppStylesCommand from 'models/store/command/widget/UpdateAppStylesCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';
import { CSSInfo } from 'store/app/AppInfo';

/**
 * 주어진 cssInfoMap(Map<key, CSS 정보>)안의 CSS 코드들을 전역 CSS 목록에 추가합니다.
 */
export type AddAppStylesCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ADD_APP_STYLES;
  cssInfoMap: Map<string, CSSInfo>;
};

/**
 * 해당하는 key의 CSS 코드들을 CSS 목록에서 제거합니다.
 */
export type DeleteAppStylesCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DELETE_APP_STYLES;
  keys: Array<string>;
};

/**
 * 해당하는 key의 CSS 코드들을 적용(활성화)합니다.
 */
export type ApplyAppStylesCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.APPLY_APP_STYLES;
  keys: Array<string>;
};

/**
 * 해당하는 key의 CSS 코드들을 미적용(비활성화)합니다.
 */
export type UnapplyAppStylesCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.UNAPPLY_APP_STYLES;
  keys: Array<string>;
};

/**
 * Command props.
 */
type AppStylesCommandProps =
  | AddAppStylesCommandProps
  | DeleteAppStylesCommandProps
  | ApplyAppStylesCommandProps
  | UnapplyAppStylesCommandProps;

/**
 * 앱 전체의 스타일 관련 command handler.
 */
class AppStylesCommandHandler extends CommandHandler {
  /**
   * CommandID별 처리.
   */
  public processCommand(props: AppStylesCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.ADD_APP_STYLES:
        this.performAdd(ctx, props);
        break;
      case CommandEnum.DELETE_APP_STYLES:
        this.performDelete(ctx, props);
        break;
      case CommandEnum.APPLY_APP_STYLES:
        this.performApply(ctx, props);
        break;
      case CommandEnum.UNAPPLY_APP_STYLES:
        this.performUnapply(ctx, props);
        break;
      default:
        return false;
    }

    return true;
  }

  /**
   * Import한 CSS들 서버에 저장.
   */
  private performAdd(ctx: AkronContext, props: AddAppStylesCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('ctx.getCommand() is undefined!');
      return;
    }

    for (const [key, cssInfo] of props.cssInfoMap) {
      ctx.getAppStylesContainer().setGlobalCSS(key, cssInfo);
    }

    const command = new UpdateAppStylesCommand(ctx.getAppID(), ctx.getAppInfo(), ctx.getAppStylesContainer());
    ctx.getCommand()?.append(command);
  }

  /**
   * Import한 CSS들 서버에서 삭제.
   */
  private performDelete(ctx: AkronContext, props: DeleteAppStylesCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('ctx.getCommand() is undefined!');
      return;
    }

    props.keys.forEach(key => {
      ctx.getAppStylesContainer().deleteGlobalCSS(key);
    });

    const command = new UpdateAppStylesCommand(ctx.getAppID(), ctx.getAppInfo(), ctx.getAppStylesContainer());
    ctx.getCommand()?.append(command);
  }

  /**
   * Import한 CSS들 적용(활성화).
   */
  private performApply(ctx: AkronContext, props: ApplyAppStylesCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('ctx.getCommand() is undefined!');
      return;
    }

    props.keys.forEach(key => {
      ctx.getAppStylesContainer().updateGlobalCSS(key, prevInfo => ({ ...prevInfo, isApplied: true }));
    });

    const command = new UpdateAppStylesCommand(ctx.getAppID(), ctx.getAppInfo(), ctx.getAppStylesContainer());
    ctx.getCommand()?.append(command);
  }

  /**
   * Import한 CSS들 미적용(비활성화).
   */
  private performUnapply(ctx: AkronContext, props: UnapplyAppStylesCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('ctx.getCommand() is undefined!');
      return;
    }

    props.keys.forEach(key => {
      ctx.getAppStylesContainer().updateGlobalCSS(key, prevInfo => ({ ...prevInfo, isApplied: false }));
    });

    const command = new UpdateAppStylesCommand(ctx.getAppID(), ctx.getAppInfo(), ctx.getAppStylesContainer());
    ctx.getCommand()?.append(command);
  }
}

export default AppStylesCommandHandler;
