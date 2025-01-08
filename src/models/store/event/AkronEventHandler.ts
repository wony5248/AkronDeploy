import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import EventHandler from 'models/store/event/EventHandler';

/**
 * UXEventHandler
 */
class AkronEventHandler extends EventHandler<WidgetID, CommandEnum, SelectionProp, WidgetModel> {}

export default AkronEventHandler;
