import { makeObservable } from 'mobx';
import WidgetModel, { IWidgetModelInitProps } from 'models/node/WidgetModel';

interface PageModelInitProps extends IWidgetModelInitProps<null> {}

class PageModel extends WidgetModel<null> {
  /**
   * 생성자
   */
  constructor(args: PageModelInitProps) {
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
