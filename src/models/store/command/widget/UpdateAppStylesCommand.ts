import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { OperationMessage } from 'models/message/OperationMessage';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { ContentType, ObjectType } from 'models/store/command/widget/WidgetModelTypes';
import AppStylesContainer from 'models/store/container/AppStylesContainer';
import { AppInfo } from 'store/app/AppInfo';
import { IOperationMessage } from 'models/message/OperationMessageType';

/**
 * 앱 전체에서 사용되는 스타일 업데이트하는 command.
 */
class UpdateAppStylesCommand extends SimpleCommand {
  private appID: number;

  private appInfo: AppInfo;

  private appStylesContainer: AppStylesContainer;

  // private prevGlobalCSSs: Array<[string, CSSInfo]>;

  /**
   * 생성자.
   */
  public constructor(appID: number, appInfo: AppInfo, appStylesContainer: AppStylesContainer) {
    super();
    this.appID = appID;
    this.appInfo = appInfo;
    this.appStylesContainer = appStylesContainer;
    // this.prevGlobalCSSs = this.appInfo.globalCSSs;
  }

  /**
   * 스타일 적용.
   */
  @action.bound
  public override apply(): void {
    // this.appInfo.globalCSSs = this.appStylesContainer.getAllGlobalCSSsForDB();
  }

  /**
   * 스타일 적용 취소.
   */
  @action.bound
  public override unapply(): void {
    // this.appInfo.globalCSSs = this.prevGlobalCSSs;
    // this.appStylesContainer.setAllGlobalCSSs(this.prevGlobalCSSs);
  }

  /**
   * 스타일 재적용.
   */
  @action.bound
  public override reapply(): void {
    this.apply();
  }

  // /**
  //  * apply 에 대한 서버 전송 메시지
  //  */
  // @boundMethod
  // public override makeApplyUpdateMessage(): UpdateWidgetMessage | undefined {
  //     const updateMessage = new UpdateWidgetMessage();
  //     updateMessage.fillUpdateMessageAppInfo(this.appInfo, 'ua');
  //     return updateMessage;
  // }

  // /**
  //  * unapply 에 대한 서버 전송 메시지
  //  */
  // @boundMethod
  // public override makeUnApplyUpdateMessage(): UpdateWidgetMessage | undefined {
  //     const undoUpdateMessage = new UpdateWidgetMessage();
  //     undoUpdateMessage.fillUpdateMessageAppInfo(this.appInfo, 'ua');
  //     return undoUpdateMessage;
  // }

  // /**
  //  * reapply 에 대한 서버 전송 메시지
  //  */
  // @boundMethod
  // public override makeReApplyUpdateMessage(): UpdateWidgetMessage | undefined {
  //     return this.makeApplyUpdateMessage();
  // }

  /**
   * 동시편집 위해 apply 메시지 전송
   */
  @boundMethod
  public override makeApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    const opMsgs: Array<IOperationMessage> = [
      {
        behavior: 'ue',
        elementType: ContentType.APP_STYLES,
        objectType: ObjectType.DEFAULT,
        // 현재 외부 CSS는 UX_APP_META appInfo에 저장.
        // UX_APP_META는 PK가 appID밖에 없어, 이렇게 임시적으로 우회.
        elementId: this.appID,
        appInfo: this.appInfo,
      },
    ];

    return opMsgs;
  }

  /**
   * 동시편집 위해 unapply 메시지 전송
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    return this.makeApplyUpdateMessage();
  }

  /**
   * 동시편집 위해 reapply 메시지 전송
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default UpdateAppStylesCommand;
