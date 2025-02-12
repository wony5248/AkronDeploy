import { IWidgetCommonProperties } from '@akron/runner';
import { makeObservable } from 'mobx';
import WidgetModel, { IWidgetModelInitProps } from 'models/node/WidgetModel';

class AppModel extends WidgetModel<IWidgetCommonProperties> {
  //   /**
  //    * DeviceInfo
  //    */
  //   @observable
  //   private deviceInfo: DeviceInfo;

  //   /**
  //    * userId
  //    */
  //   private userId: number;

  //   /**
  //    * roomId
  //    */
  //   private roomId: number;

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

export default AppModel;
