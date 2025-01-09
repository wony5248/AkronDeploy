import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { isUndefined } from '@akron/runner';
import { IOperationMessage } from 'models/message/OperationMessageType';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import AkronContext from 'models/store/context/AkronContext';
import WidgetModel from 'models/node/WidgetModel';

/**
 * Target node 를 node tree 에 append 하는 simple command 입니다.
 */
class AppendWidgetCommand extends SimpleCommand {
  /**
   * Node tree 에 append 할 target 입니다.
   */
  private target: WidgetModel;

  /**
   * Target node 의 부모 node 입니다.
   */
  private parent: WidgetModel;

  /**
   * Target node 의 next sibling node 입니다. undefined 인 경우 부모의 마지막 child 로 append 됩니다.
   */
  private nextSibling?: WidgetModel;

  private ctx: AkronContext;

  /**
   * 생성자
   */
  public constructor(ctx: AkronContext, target: WidgetModel, parent: WidgetModel, nextSibling?: WidgetModel) {
    super();
    this.target = target;
    this.parent = parent;
    this.nextSibling = nextSibling;
    this.ctx = ctx;
  }

  /**
   * Widget 추가
   */
  @action.bound
  public override apply(): void {
    this.target.append(this.parent, this.nextSibling);
  }

  /**
   * Widget 제거
   */
  @action.bound
  public override unapply(): void {
    this.target.remove(this.parent);
  }

  /**
   * reapply
   */
  @action.bound
  public override reapply(): void {
    this.apply();
  }

  /**
   * createApplyOperationMessage
   */
  @boundMethod
  public override makeApplyUpdateMessage(): IOperationMessage[] | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }
    const targetOpMessages: IOperationMessage[] = [];
    const componentMsg = this.target.makeOperationMessage() as IOperationMessage;
    componentMsg.behavior = 'ie';
    componentMsg.elementType = ContentType.COMPONENT;
    // componentMsg.codeData = this.ctx.getNewMetaDataContainer().getComponentCodeData();
    componentMsg.propMap = (this.target as WidgetModel).getProperties();
    targetOpMessages.push(componentMsg);
    return targetOpMessages;
  }

  /**
   * createUnApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }

    const targetOpmessage = this.target.makeOperationMessage() as IOperationMessage;
    targetOpmessage.behavior = 'de';
    return [targetOpmessage];
  }

  /**
   * createReApplyOperationMessage
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): IOperationMessage[] | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default AppendWidgetCommand;
