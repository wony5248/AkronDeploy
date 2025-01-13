import { content } from './../../../../styles/workarea/Content';
import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { IWidgetCommonProperties, DeepReadonly, isUndefined, dError } from '@akron/runner';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import SimpleCommand from 'models/store/command/common/SimpleCommand';
import { IOperationMessage } from 'models/message/OperationMessageType';
import { WidgetPropID, HandlerID } from 'models/widget/WidgetPropTypes';
import { ContentType, ObjectType } from 'models/store/command/widget/WidgetModelTypes';

/**
 * 위젯모델의 Properties를 바꾸는 simple command입니다.
 */
class UpdateWidgetCommand extends SimpleCommand {
  private model: WidgetModel;

  private propId: WidgetPropID | undefined; // 변경하고자 하는 속성명

  private propValue: IWidgetCommonProperties; // 변경하고자 하는 속성 값

  private prevPropValue: any; // 변경 전 속성 값

  private eventHandler: HandlerID[];

  // private prevEventHandler: HandlerID[];

  // private nonBindableDataReferenceContainer?: NonBindableDataReferenceContainer;

  /**
   * 생성자
   */
  public constructor(
    model: WidgetModel,
    propValue: IWidgetCommonProperties,
    propId?: WidgetPropID,
    eventHandler?: HandlerID[]
    // nonBindableDataReferenceContainer?: NonBindableDataReferenceContainer
  ) {
    super();
    this.model = model;
    this.propId = propId;
    this.propValue = propValue;
    this.prevPropValue = this.model.getProperties();
    this.eventHandler = eventHandler || [];
    // this.prevEventHandler = this.model.getProperties().content.text || [];
    // this.nonBindableDataReferenceContainer = nonBindableDataReferenceContainer;
  }

  /**
   * apply
   */
  @action.bound
  public override apply(): void {
    const widgetProp = this.model.getProperties();
    if (widgetProp) {
      widgetProp.content = this.propValue.content;
      widgetProp.style = this.propValue.style;
      this.model.setProperties(widgetProp);
      //  if (this.nonBindableDataReferenceContainer) {
      //      this.updateNonBindableReferenceDataUpdate(this.prevPropValue, this.propValue);
      //  }
    }
  }

  /**
   * unapply
   */
  @action.bound
  public override unapply(): void {
    const widgetProp = this.model.getProperties();
    if (widgetProp) {
      widgetProp.content = this.prevPropValue.content;
      widgetProp.style = this.prevPropValue.style;
      // widgetProp.eventHandler = this.prevEventHandler;
      this.model.setProperties(widgetProp);
      //  if (this.nonBindableDataReferenceContainer) {
      //      this.updateNonBindableReferenceDataUpdate(this.propValue, this.prevPropValue);
      //  }
    }
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
    if (isUndefined(this.model)) {
      return undefined;
    }

    const targetOpmessage = (this.model.makeOperationMessage('ue') as IOperationMessage[])[0];

    // 'ucp'
    targetOpmessage.behavior = 'ue';
    targetOpmessage.elementType = ContentType.COMPONENT_CONTENT;
    targetOpmessage.propKey = this.propId;
    targetOpmessage.propValue = this.propValue;
    targetOpmessage.eventHandler = this.eventHandler;

    return [targetOpmessage];
  }

  /**
   * unapply 에 대한 서버 전송 메시지
   */
  @boundMethod
  public override makeUnApplyUpdateMessage(): IOperationMessage[] | undefined {
    const targetOpmessage = (this.model.makeOperationMessage('ue') as IOperationMessage[])[0];

    // 'ucp'
    targetOpmessage.behavior = 'ue';
    targetOpmessage.elementType = ContentType.COMPONENT_CONTENT;
    targetOpmessage.propKey = this.propId;
    targetOpmessage.propValue = this.prevPropValue;
    // targetOpmessage.eventHandler = this.prevEventHandler;

    return [targetOpmessage];
  }

  /**
   * reapply 에 대한 서버 전송 메시지
   */
  @boundMethod
  public override makeReApplyUpdateMessage(): IOperationMessage[] | undefined {
    return this.makeApplyUpdateMessage();
  }
}

export default UpdateWidgetCommand;
