import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { IWidgetContentProperties } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { IOperationMessage } from 'models/message/OperationMessageType';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import { getPropertyKeys } from 'util/WidgetUtil';

/**
 * 위젯모델의 Contents Properties를 바꾸는 simple command입니다.
 */
class UpdateWidgetContentCommand extends SimpleCommand {
  private model: WidgetModel;

  private contents: IWidgetContentProperties; // 변경하고자 하는 속성 값

  private prevContents: IWidgetContentProperties; // 변경 전 속성 값

  /**
   * 생성자
   */
  public constructor(model: WidgetModel, propValue: IWidgetContentProperties) {
    super();
    this.model = model;
    this.contents = propValue;
    this.prevContents = this.model.getProperties().content;
  }

  /**
   * apply
   */
  @action.bound
  public override apply(): void {
    this.model.setProperties({
      ...this.model.getProperties(),
      content: { ...this.model.getProperties().content, ...this.contents },
    });
  }

  /**
   * unapply
   */
  @action.bound
  public override unapply(): void {
    this.model.setProperties({
      ...this.model.getProperties(),
      content: { ...this.model.getProperties().content, ...this.prevContents },
    });
  }

  /**
   * reapply
   */
  @action.bound
  public override reapply(): void {
    this.apply();
  }

  /**
   * apply 에 대한 서버 전송 메시지
   */
  @boundMethod
  public override makeApplyUpdateMessage(): IOperationMessage[] | undefined {
    const keys = getPropertyKeys(this.contents);
    const messages = keys.map(key => {
      return {
        elementId: this.model.getID(),
        elementType: ContentType.COMPONENT_CONTENT,
        behavior: 'ue',
        name: key,
        value: this.contents[key].value,
        variableId: this.contents[key].variableId,
        dataType: 0,
      } as IOperationMessage;
    });

    return messages;
  }

  /**
   * unapply 에 대한 서버 전송 메시지
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    const keys = getPropertyKeys(this.prevContents);
    const messages = keys.map(key => {
      return {
        elementId: this.model.getID(),
        elementType: ContentType.COMPONENT_CONTENT,
        behavior: 'ue',
        name: key,
        value: this.prevContents[key].value,
        variableId: this.prevContents[key].variableId,
        dataType: 0,
      } as IOperationMessage;
    });

    return messages;
  }

  /**
   * reapply 에 대한 서버 전송 메시지
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): IOperationMessage[] | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default UpdateWidgetContentCommand;
