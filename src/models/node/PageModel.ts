import { IWidgetCommonProperties } from '@akron/runner';
import { makeObservable } from 'mobx';
import WidgetModel, { IWidgetModelInitProps } from 'models/node/WidgetModel';
import { pageStyleMeta } from 'models/util/LocalMetaData';

interface PageModelInitProps extends IWidgetModelInitProps<IWidgetCommonProperties> {}

class PageModel extends WidgetModel<IWidgetCommonProperties> {
  protected pageSize: any;
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

    this.properties.style = {
      ...this.properties.style,
      ...pageStyleMeta,
    };
  }
}

export default PageModel;
