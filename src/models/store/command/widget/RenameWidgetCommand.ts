import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { IOperationMessage } from 'models/message/OperationMessageType';
import AppModel from 'models/node/AppModel';
import WidgetModel from 'models/node/WidgetModel';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { ContentType, ObjectType } from 'models/store/command/widget/WidgetModelTypes';
import { isUndefined } from '@akron/runner';

/**
 * 위젯모델의 name를 바꾸는 simple command입니다.
 * name은 property에 속하지 않아 개별 command 필요함.
 */
class RenameWidgetCommand extends SimpleCommand {
  /**
   * Properties를 업데이트 할 WidgetModel.
   */
  private model: Readonly<AppModel> | Readonly<WidgetModel>;

  /**
   * 변경 후 properties.
   */
  private name: string;

  /**
   * 변경 전 properties.
   */
  private prevName: string;

  /**
   * 생성자
   */
  public constructor(model: Readonly<AppModel> | Readonly<WidgetModel>, name: string) {
    super();
    this.name = name;
    this.model = model;
    this.prevName = this.model.getName();
  }

  /**
   * Apply
   */
  @action.bound
  public override apply(): void {
    this.model.setName(this.name);
  }

  /**
   * Unapply
   */
  @action.bound
  public override unapply(): void {
    this.model.setName(this.prevName);
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
    if (isUndefined(this.model)) {
      return undefined;
    }
    // TODO: command prop 으로 behavior 받아서 기존에 있던 model의 이동이면 ue, 신규 생성도니 model의 삽입이면 ue로 변환 필요
    return this.model.makeOperationMessage('ue') as IOperationMessage[];
    // const targetOpMessage: IOperationMessage = {
    //   behavior: 'ue',
    //   elementType: ContentType.COMPONENT,
    //   objectType: ObjectType.DEFAULT,
    //   elementId: this.model.getID(),
    //   name: this.model.getName(),
    //   updateProp: 4, // 기존 enum 4
    // };

    // return [targetOpMessage];
  }

  /**
   * createUnApplyOperationMessage
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    return this.makeApplyUpdateMessage();
  }

  /**
   * createReApplyOperationMessage
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): Array<IOperationMessage> | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default RenameWidgetCommand;
