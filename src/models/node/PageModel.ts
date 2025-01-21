import { IWidgetCommonProperties } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { makeObservable } from 'mobx';
import { Behavior } from 'models/message/OperationMessage';
import { IOperationMessage } from 'models/message/OperationMessageType';
import WidgetModel, { IWidgetModelInitProps } from 'models/node/WidgetModel';
import { ContentType } from 'models/store/command/widget/WidgetModelTypes';

class PageModel extends WidgetModel<IWidgetCommonProperties> {
  /**
   * 생성자
   */
  constructor(args: IWidgetModelInitProps<IWidgetCommonProperties>) {
    super({
      id: args.id,
      widgetType: args.widgetType,
      widgetCategory: args.widgetCategory,
      name: args.name,
      properties: args.properties,
      ref: args.ref,
    });
    makeObservable(this);
    this.contentType = ContentType.COMPONENT_PAGE;
  }

  /**
   * Model 1개의 Instance 변경에서 사용되는 Message 생성
   */
  @boundMethod
  public override makeInstanceMessage(behavior: Behavior): IOperationMessage {
    return {
      elementId: this.getID(),
      elementType: this.getContentType(),
      componentType: this.getWidgetType(),
      name: this.getName(),
      locked: false, // 필드 추가해야함
      hidden: false, // 필드 추가해야함
      behavior: behavior,
      pageSize: 'test',
    };
  }
}

export default PageModel;
