import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { isUndefined } from '@akron/runner';
import { IOperationMessage } from 'models/message/OperationMessageType';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import AkronContext from 'models/store/context/AkronContext';
import WidgetModel from 'models/node/WidgetModel';

/**
 * 해당 커맨드는 기본적으로 AppendWidgetCommand와 동작은 같습니다.
 * (parent, sibling을 받아서 WidgetModel Tree에 삽입하는 동작을 수행)
 * AppendWidgetCommand는 Single Widget Model 삽입 시 사용하고
 * AppendWidgetRecursiveCommand는 widget model sub tree를 root tree에 append 시 사용하세요
 * 서버에서는 해당 widget의 하위에 어떤 widget들이 있는지 알지 못해 이를 위한 updatemessage를 재귀적으로 만들어 줍니다.
 */
class AppendWidgetRecursiveCommand extends SimpleCommand {
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

  //   private ctx: AkronContext;

  /**
   * 생성자
   */
  public constructor(ctx: AkronContext, target: WidgetModel, parent: WidgetModel, nextSibling?: WidgetModel) {
    super();
    this.target = target;
    this.parent = parent;
    this.nextSibling = nextSibling;
    // this.ctx = ctx;
  }

  /**
   * Recursive Widget Message를 생성하여 저장
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
  public override makeApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }
    const targetOpMessages: IOperationMessage[] = [];
    this.makeOperationMessageRecursive(this.target, targetOpMessages, 'ie');
    return targetOpMessages;
  }

  /**
   * createUnApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }
    const targetOpMessages: IOperationMessage[] = [];
    this.makeOperationMessageRecursive(this.target, targetOpMessages, 'de');
    return targetOpMessages;
  }

  /**
   * createReApplyOperationMessage
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    return this.makeApplyUpdateMessage();
  }

  /**
   * 재귀적으로 Update Operation Message를 생산하여 반환하는 함수입니다.
   */
  private makeOperationMessageRecursive(
    model: WidgetModel,
    childOpMgs: IOperationMessage[] = [],
    behavior: string
  ): void {
    const modelMsg = model.makeOperationMessage() as IOperationMessage;
    modelMsg.behavior = behavior;
    modelMsg.elementType = ContentType.COMPONENT;
    // modelMsg.codeData = this.ctx.getNewMetaDataContainer().getComponentCodeData();
    modelMsg.propMap = (model as WidgetModel).getProperties();
    childOpMgs.push(modelMsg);

    model.forEachChild((child: WidgetModel) => {
      this.makeOperationMessageRecursive(child, childOpMgs, behavior);
    });
  }
}

export default AppendWidgetRecursiveCommand;
