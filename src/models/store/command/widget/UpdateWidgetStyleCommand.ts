import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { IWidgetStyleProperties } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { IOperationMessage } from 'models/message/OperationMessageType';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';
import { getPropertyKeys } from 'util/WidgetUtil';

/**
 * 위젯모델의 Style Properties를 바꾸는 simple command입니다.
 */
class UpdateWidgetStyleCommand extends SimpleCommand {
  private model: WidgetModel;

  private styles: IWidgetStyleProperties; // 변경하고자 하는 속성 값

  private prevStyles: IWidgetStyleProperties; // 변경 전 속성 값

  /**
   * 생성자
   */
  public constructor(model: WidgetModel, propValue: IWidgetStyleProperties) {
    super();
    this.model = model;
    this.styles = propValue;
    this.prevStyles = this.model.getProperties().style;
  }

  /**
   * apply
   */
  @action.bound
  public override apply(): void {
    this.model.setProperties({
      ...this.model.getProperties(),
      style: { ...this.model.getProperties().style, ...this.styles },
    });
  }

  /**
   * unapply
   */
  @action.bound
  public override unapply(): void {
    this.model.setProperties({
      ...this.model.getProperties(),
      style: { ...this.model.getProperties().style, ...this.prevStyles },
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
    const keys = getPropertyKeys(this.styles);
    const messages = keys.map(key => {
      return {
        elementId: this.model.getID(),
        elementType: ContentType.COMPONENT_STYLE,
        behavior: 'ue',
        name: key,
        value: this.styles[key].value,
        variableId: this.styles[key].variableId,
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
    const keys = getPropertyKeys(this.prevStyles);
    const messages = keys.map(key => {
      return {
        elementId: this.model.getID(),
        elementType: ContentType.COMPONENT_STYLE,
        behavior: 'ue',
        name: key,
        value: this.prevStyles[key].value,
        variableId: this.prevStyles[key].variableId,
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

export default UpdateWidgetStyleCommand;
