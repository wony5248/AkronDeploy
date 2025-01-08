import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import EventManager from 'models/store/event/EventManager';
import { AkronEventMapper } from 'models/store/event/EventMapper';

/**
 * Event 해석을 담당하는 class 입니다.
 * AppStore 가 소유하고 있으며, event 를 해석하여 어떤 동작을 해야하는 지 알려줍니다.
 */
class AkronEventManager extends EventManager<WidgetID, CommandEnum, SelectionProp, WidgetModel, AkronEventMapper> {}
export default AkronEventManager;
