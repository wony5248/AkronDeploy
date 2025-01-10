import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import SimpleCommand from '../common/SimpleCommand';
import { isDefined } from '@akron/runner';
import { IOperationMessage } from 'models/message/OperationMessageType';
import { ContentType, ObjectType } from 'models/store/command/widget/WidgetModelTypes';
import WidgetModel from 'models/node/WidgetModel';

/**
 * tree에 존재하는 Target node를 node tree의 다른 위치로 이동시키는 simple command 입니다.
 */
class MoveWidgetCommand extends SimpleCommand {
  /**
   * tree 상에서 다른 부모로 이동시킬 target 입니다.
   * root 로는 이동 시킬 수 없습니다. AppWidgetModel이 root인 것은 불변입니다.
   */
  private target: WidgetModel;

  /**
   * Target node의 이동 전 부모 node 입니다.
   */
  private depParent: WidgetModel;

  /**
   * Target node 의 이전 next sibling node 입니다.
   * undefined 인 경우 undo 시, depParent의 last child 로 append 됩니다.
   * dep는 departure의 약어입니다.
   */
  private depNextSibling?: WidgetModel;

  /**
   * target 이동 시, 관계정보가 변경될 여지가 있는 node 입니다.
   * 존재할 경우 커맨드 수행 후 해당 node의 nextID가 변경됩니다.
   * target 이동 후, prevSibling의 nextID가 target 이동 전 target의 next sibling으로 변경됩니다.
   */
  private depPrevSibling?: WidgetModel;

  /**
   * target 이동 시, 관계정보가 변경될 여지가 있는 node 입니다.
   * 존재할 경우 커맨드 수행 후 해당 node의 nextID가 변경됩니다.
   * target 이동 후, destination의 prevSibling의 nextID가 destination nextSibling에서 target으로 변경됩니다.
   */
  private destPrevSibling?: WidgetModel;

  /**
   * Target node 이동할 위치의 부모 node 입니다.
   * dest는 destination의 약어입니다.
   */
  private destParent: WidgetModel;

  /**
   * Target node 의 이동할 위치의 next sibling node 입니다.
   * undefined 인 경우 do 시, destParent의 last child 로 append 됩니다.
   * dest는 destination의 약어 입니다.
   */
  private destNextSibling?: WidgetModel;

  /**
   * 생성자
   */
  public constructor(
    target: WidgetModel,
    depParent: WidgetModel,
    destParent: WidgetModel,
    destNextSibling?: WidgetModel
  ) {
    super();
    this.target = target;
    this.depParent = depParent;
    this.destParent = destParent;
    this.destNextSibling = destNextSibling;
    // 이동 전의 next sibling이 필요한 이유는 unapply 시, 필요한 위치를 저장하기 위함입니다.
    this.depNextSibling = target.getNextSibling();
  }

  /**
   * Widget 이동 departure -> destination
   */
  @action.bound
  public override apply(): void {
    this.depPrevSibling = this.target.getPrevSibling();
    if (isDefined(this.destNextSibling)) {
      this.destPrevSibling = this.destNextSibling.getPrevSibling();
    } else {
      this.destPrevSibling = this.destParent.getLastChild();
    }

    this.target.remove(this.depParent);
    this.target.append(this.destParent, this.destNextSibling);
  }

  /**
   * Widget 이동 destination -> departure
   */
  @action.bound
  public override unapply(): void {
    this.destPrevSibling = this.target.getPrevSibling();
    if (isDefined(this.depNextSibling)) {
      this.depPrevSibling = this.depNextSibling.getPrevSibling();
    } else {
      this.depPrevSibling = this.depParent.getLastChild();
    }

    this.target.remove(this.destParent);
    this.target.append(this.depParent, this.depNextSibling);
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
    const updateRelationMessage = (this.target.makeOperationMessage('ue') as IOperationMessage[])[0];
    updateRelationMessage.parentId = this.destParent.getID();
    updateRelationMessage.nextId = this.destNextSibling?.getID();
    updateRelationMessage.elementType = ContentType.COMPONENT;
    return [updateRelationMessage];
  }

  /**
   * createUnApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    const updateRelationMessage = (this.target.makeOperationMessage('ue') as IOperationMessage[])[0];
    updateRelationMessage.parentId = this.depParent.getID();
    updateRelationMessage.nextId = this.depNextSibling?.getID();
    updateRelationMessage.elementType = ContentType.COMPONENT;
    return [updateRelationMessage];
  }

  /**
   * createReApplyOperationMessage
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): IOperationMessage[] | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default MoveWidgetCommand;
