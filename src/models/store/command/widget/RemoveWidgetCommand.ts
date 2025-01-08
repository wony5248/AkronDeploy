import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { isUndefined } from '@akron/runner';
import { IOperationMessage } from 'models/message/OperationMessageType';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import WidgetModel from 'models/node/WidgetModel';

/**
 * Target node 를 node tree 에서 remove 하는 simple command 입니다.
 */
class NewRemoveWidgetCommand extends SimpleCommand {
  /**
   * Node tree 에서 remove 할 target 입니다.
   */
  private target: WidgetModel;

  /**
   * Target node 의 부모 node 입니다.
   */
  private parent: WidgetModel;

  /**
   * Target node 의 prev sibling node 입니다. undefined 인 경우 부모의 첫번째 child 로 append 됩니다.
   */
  private prevSibling?: WidgetModel;

  /**
   * Target node 의 next sibling node 입니다. undefined 인 경우 부모의 마지막 child 로 append 됩니다.
   */
  private nextSibling?: WidgetModel;

  /**
   * DB상에 Component data를 남겨둡니다.
   * ReactNode type인 prop으로 들어가는 경우 Widget tree에서는 지워져야 하지만 DB에 해당 Component data는 존재해야 함.
   */
  private keepDB: boolean;

  /**
   * ReactNode type인 prop으로 들어가는 경우 해당 prop 을 가지고 있는 개체
   */
  private desModel: WidgetModel | undefined;

  /**
   * 생성자
   */
  public constructor(
    target: WidgetModel,
    parent: WidgetModel,
    keepDB = false,
    desModel: WidgetModel | undefined = undefined
  ) {
    super();
    this.target = target;
    this.parent = parent;
    this.keepDB = keepDB;
    this.desModel = desModel;
  }

  /**
   * Widget 제거
   */
  @action.bound
  public override apply(): void {
    this.target.remove(this.parent);
    this.nextSibling = this.target.getNextSibling();
    this.prevSibling = this.target.getPrevSibling();
    if (this.keepDB) {
      this.target.setParent(this.desModel);
    }
    // if (isUndefined(this.redoUpdateMessage)) {
    //     this.redoUpdateMessage = new UpdateWidgetMessage();
    //     if (this.keepDB) {
    //         // Widget tree에서만 drop하고 DB에서 삭제하지는 않음
    //         this.redoUpdateMessage.fillUpdateMessage(this.target, 'dre');
    //     } else {
    //         this.redoUpdateMessage.fillUpdateMessage(this.target, 'de');
    //     }
    // }
    if (this.keepDB) {
      this.target.setNextSibling(undefined);
      this.target.setPrevSibling(undefined);
    }
  }

  /**
   * Widget 추가
   */
  @action.bound
  public override unapply(): void {
    const currentParent = this.target.getParent();
    if (currentParent) {
      this.target.remove(currentParent);
    }
    this.target.append(this.parent, this.nextSibling);
    // if (isUndefined(this.undoUpdateMessage)) {
    //     this.undoUpdateMessage = new Array<UpdateWidgetMessage>();
    //     if (this.keepDB) {
    //         // DB에는 남아있으므로, Widget Tree에 다시 업데이트
    //         // prevSibling 확인하여 부모 혹은 이전 prevSibling 업데이트
    //         const prevSiblingUpdateMessage = new UpdateWidgetMessage();
    //         if (this.prevSibling) {
    //             prevSiblingUpdateMessage.fillUpdateMessage(this.prevSibling, 'ue');
    //         } else {
    //             prevSiblingUpdateMessage.fillUpdateMessage(this.parent, 'ue');
    //         }
    //         this.undoUpdateMessage.push(prevSiblingUpdateMessage);
    //         // target의 parent, sibling 업데이트
    //         const targetUpdateMessage = new UpdateWidgetMessage();
    //         targetUpdateMessage.fillUpdateMessage(this.target, 'ue');
    //         this.undoUpdateMessage.push(targetUpdateMessage);
    //     }
    //     else {
    //         const targetUpdateMessage = new UpdateWidgetMessage();
    //         targetUpdateMessage.fillUpdateMessage(this.target, 'ie');
    //         this.undoUpdateMessage.push(targetUpdateMessage);
    //     }
    // }
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
    const targetOpMessages: IOperationMessage[] = [];
    const behavior = this.keepDB ? 'ur' : 'de';

    const modelOpMsg = this.target.makeOperationMessage() as IOperationMessage;
    modelOpMsg.behavior = behavior;
    modelOpMsg.elementType = ContentType.COMPONENT;

    targetOpMessages.push(modelOpMsg);
    return targetOpMessages;
  }

  /**
   * createApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }

    const targetOpmessage = this.target.makeOperationMessage() as IOperationMessage;
    targetOpmessage.behavior = 'ie';
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

export default NewRemoveWidgetCommand;
