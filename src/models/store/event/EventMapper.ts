import { boundMethod } from 'autobind-decorator';
import EventState from './EventState';
import EventHandler from './EventHandler';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from '../command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';

/**
 * EventMaper 은 EventState 에 따라 어떤 event handler 들이 순서대로 동작하는 지를 정의한 class 입니다.
 * EventManager class 가 event 를 받으면 event mapper 에서 event handler 의 list 를 받아 처리합니다.
 */

export interface AkronEventMapper extends EventMapper<WidgetID, CommandEnum, SelectionProp, WidgetModel> {}

class EventMapper<ID, CommandEnum, SelectionProp, Model> {
  /**
   * EventState를 key로 EvenetHandler List를 반환하는 map 입니다.
   */
  protected readonly eventMap: Map<EventState, EventHandler<ID, CommandEnum, SelectionProp, Model>[]>;

  protected readonly eventHandler: Array<EventHandler<ID, CommandEnum, SelectionProp, Model>> = [];

  /**
   * Constructor 에서 map 구성을 정의합니다. Event handler 인스턴스를 공유하는 것을 고려하여 constructor 를 작성해야 합니다.
   */
  public constructor() {
    this.eventMap = new Map();
  }

  /**
   * EventState 에 따른 event handler list 를 반환합니다. 이 event list 는 현재 상태에서 가능한 동작들을 명세한 것으로, finite state machine 컨셉을 가지고 있습니다.
   * Return 받은 event map 은 chain 형태로 동작하게 됩니다.
   *
   * @param state EventMapper 의 key 에 해당하는 인자로 어떤 상태인지를 나타냅니다.
   * @returns 인자로 들어온 상태에 따라 처리할 수 있는 event handler 의 리스트입니다.
   */
  @boundMethod
  public get(state: EventState): Array<EventHandler<ID, CommandEnum, SelectionProp, Model>> {
    return this.eventMap.get(state) ?? this.eventHandler;
  }
}

export default EventMapper;
