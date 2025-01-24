import { boundMethod } from 'autobind-decorator';
import WidgetModel from 'models/node/WidgetModel';
import AppRepository, { UpdateMessageDTO } from 'models/repository/AppRepository';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import UpdateWidgetContentCommand from 'models/store/command/widget/UpdateWidgetContentCommand';
import UpdateWidgetStyleCommand from 'models/store/command/widget/UpdateWidgetStyleCommand';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';
import { AppModeType } from 'models/store/container/AppModeContainer';
import AkronContext from 'models/store/context/AkronContext';
import { SaveState } from 'models/store/EditorStore';
import { AppType } from 'store/app/AppInfo';
import { getPageList } from 'util/PageUtil';

const unNamedSection = '이름 없는 구역';
const defaultSection = '기본 구역';

/**
 * 앱을 DB저장 하기 위해 필요한 props
 */
export type SaveCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SAVE;
};

/**
 * 앱을 다른 이름으로 저장 후 로딩 하는데 필요한 props
 */
export type SaveAsCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SAVE_AS;
  appType: Lowercase<AppType>;
  appName: string;
  appID: number;
  userID: number;
  modeType: Lowercase<AppModeType>;
  roomID: number;
};

/**
 * 앱 디바이스 정보를 업데이트하기 위한 props
 */
export type UpdateDeviceInfoCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.UPDATE_DEVICE_INFO;
  deviceName: string;
  size: number[];
};

/**
 * 해당 page의 index를 반환하는 함수
 */
export function getTargetPageIndex(appWidgetModel: WidgetModel, pageModel: WidgetModel): number {
  let targetIdx = 0;
  appWidgetModel.forEachChild(child => {
    if (child === pageModel) {
      targetIdx += 1;
    }
  });

  return targetIdx;
}

/**
 * 앱 전반적인 command를 수행할 때 필요한 Props
 */
type AppCommandProps = SaveCommandProps | SaveAsCommandProps | UpdateDeviceInfoCommandProps;

/**
 * 앱 전반적인 command를 수행할 때 필요한 commandhandler
 */
class AppCommandHandler extends CommandHandler {
  /**
   * 앱 관련 커맨드를 처리합니다
   */
  @boundMethod
  public processCommand(props: AppCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.SAVE:
        this.saveApp(ctx);
        break;
      // case CommandEnum.SAVE_AS:
      //   this.saveAppAs(props);
      //   break;
      case CommandEnum.UPDATE_DEVICE_INFO:
        this.updateDeviceInfo(props, ctx);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Model을 기반으로 서버에 보낼 JSON을 생성하여 DB저장하는 로직을 수행
   */
  @boundMethod
  private async saveApp(ctx: AkronContext): Promise<void> {
    const updateMessageContainer = ctx.getUpdateMessageContainer();
    const updateMessages = updateMessageContainer.getUpdateMessages();

    const inputDTO: UpdateMessageDTO = {
      appId: ctx.getAppID(),
      updateMessages,
    };

    try {
      await AppRepository.sendUpdateMessage(inputDTO);
      ctx.setSaveState(SaveState.SAVE_COMPLETE);
    } catch {
      ctx.setSaveState(SaveState.SAVE_ERROR);
    }
  }

  /**
   * device size 변경
   */
  private updateDeviceInfo(props: UpdateDeviceInfoCommandProps, ctx: AkronContext) {
    const { deviceName, size } = props;
    const appModel = ctx.getAppModel();
    const pageList = getPageList(appModel);

    for (let i = 0; i < pageList.length; i++) {
      const page = pageList[i];

      const newPageContent = {
        ['device']: {
          ...page.getProperties().content['device'],
          value: deviceName,
        },
      };
      const newPageStyle = {
        ['width']: {
          ...page.getProperties().style['width'],
          value: { ...page.getStyleProperties('width'), absolute: size[0] },
        },
        ['height']: {
          ...page.getProperties().style['height'],
          value: { ...page.getStyleProperties('height'), absolute: size[1] },
        },
      };

      const updateWidgetStyleCommand = new UpdateWidgetStyleCommand(page, newPageStyle);
      ctx.getCommand()?.append(updateWidgetStyleCommand);

      const updateWidgetContentCommand = new UpdateWidgetContentCommand(page, newPageContent);
      ctx.getCommand()?.append(updateWidgetContentCommand);
    }
  }

  // /**
  //  * 다른 이름으로 저장 후, 해당 앱으로 로딩하는 로직
  //  */
  // @boundMethod
  // private saveAppAs(props: SaveAsCommandProps): void {
  //   changeAppURL({
  //     appType: props.appType,
  //     appName: props.appName,
  //     appID: props.appID,
  //     userID: props.userID,
  //     modeType: props.modeType,
  //     roomID: props.roomID,
  //   });
  // }
}

export default AppCommandHandler;
