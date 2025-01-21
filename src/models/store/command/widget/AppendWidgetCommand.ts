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
    const messages: IOperationMessage[] = [];
    const message = this.target.makeOperationMessage('ie') as IOperationMessage[];

    // apply가 message 생성보다 늦어진다는 가정하에 주석의 코드를 이용하려 했으나, 정상 동작으로 인해 아래 코드로 사용
    // if (this.parent.getFirstChild()?.getID() === this.nextSibling?.getID() || !this.parent.getFirstChild()) {
    //   // 첫 자식으로 삽입
    //   const parentMessage = this.parent.makeRelationMessage('ue');
    //   parentMessage.childId = this.target.getID();
    //   messages.push(parentMessage);
    //   if (this.nextSibling) {
    //     message[0].nextId = this.nextSibling.getID();
    //   }
    // }
    // if (this.nextSibling && this.parent.getFirstChild()?.getID() !== this.nextSibling.getID()) {
    //   // 중간에 삽입
    //   const prevSiblingMessage = this.nextSibling.getPrevSibling()?.makeRelationMessage('ue') as IOperationMessage;
    //   prevSiblingMessage.nextId = this.target.getID();
    //   messages.push(prevSiblingMessage);
    //   message[0].nextId = this.nextSibling.getID();
    // }
    // if (this.parent.getFirstChild() && !this.nextSibling) {
    //   // 마지막 자식으로 삽입
    //   const lastChildMessage = this.parent.getLastChild()?.makeRelationMessage('ue') as IOperationMessage;
    //   lastChildMessage.nextId = this.target.getID();
    //   messages.push(lastChildMessage);
    // }

    if (this.parent.getFirstChild()?.getID() === this.nextSibling?.getID() || !this.parent.getFirstChild()) {
      // 첫 자식으로 삽입
      const parentMessage = this.parent.makeRelationMessage('ue');
      messages.push(parentMessage);
    }
    if (
      (this.nextSibling && this.parent.getFirstChild()?.getID() !== this.nextSibling.getID()) ||
      (this.parent.getFirstChild() && !this.nextSibling)
    ) {
      // 중간에 삽입 || 마지막 자식으로 삽입
      const prevSiblingMessage = this.target.getPrevSibling()?.makeRelationMessage('ue') as IOperationMessage;
      messages.push(prevSiblingMessage);
    }
    messages.push(...message);

    return messages;
  }

  /**
   * createUnApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    if (isUndefined(this.target)) {
      return undefined;
    }
    const messages: IOperationMessage[] = [];
    const message = this.target.makeOperationMessage('de') as IOperationMessage[];

    if (this.parent.getFirstChild()?.getID() === this.nextSibling?.getID() || !this.parent.getFirstChild()) {
      // 첫 자식으로 삽입
      const parentMessage = this.parent.makeRelationMessage('ue');
      parentMessage.childId = this.parent.getFirstChild()?.getID();
      messages.push(parentMessage);
    }
    if (this.nextSibling && this.parent.getFirstChild()?.getID() !== this.nextSibling.getID()) {
      // 중간에 삽입
      const prevSiblingMessage = this.nextSibling.getPrevSibling()?.makeRelationMessage('ue') as IOperationMessage;
      prevSiblingMessage.nextId = this.nextSibling.getID();
      messages.push(prevSiblingMessage);
    }
    if (this.parent.getFirstChild() && !this.nextSibling) {
      // 마지막 자식으로 삽입
      const lastChildMessage = this.parent.getLastChild()?.makeRelationMessage('ue') as IOperationMessage;
      lastChildMessage.nextId = null;
      messages.push(lastChildMessage);
    }
    messages.push(...message);

    return messages;
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
