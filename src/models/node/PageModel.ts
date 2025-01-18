import { IWidgetCommonProperties } from '@akron/runner';
import { makeObservable } from 'mobx';
import WidgetModel, { IWidgetModelInitProps } from 'models/node/WidgetModel';

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
  }
}

export default PageModel;
