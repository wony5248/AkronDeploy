import Command from '../command/Command';
import UndoStack from '../command/UndoStack';
import EventState from '../event/EventState';
import SelectionContainer from '../selection/SelectionContainer';
import CommandProps from '../command/CommandProps';
import AppModeContainer from 'models/store/container/AppModeContainer';

/**
 * Store는 command, event 등의 로직들을 현재의 Context 값 위에 정해진 순서대로 적용하는 형태로 작동합니다.
 * (CM/C (Component Manager / Component) 구조)
 */
interface Context<ID, CommandEnum, SelectionProp> {
  /**
   * 현재 Event의 상태를 나타냅니다. State에 따라 event manager 에서 처리하는 event handler 구성이 달라집니다.
   */
  state: EventState;

  /**
   * 현재 event 의 command id 와 handling 에 필요한 요소들을 나타냅니다. 휘발적이며 event 마다 초기화 됩니다.
   */
  commandProps?: CommandProps<CommandEnum, SelectionProp>;

  /**
   * Command 를 보관하는 undo stack 입니다.
   */
  undoStack: UndoStack<ID, CommandEnum, SelectionProp>;

  /**
   * Business Dialog 작업을 보관하는 undo stack 입니다.
   */
  editBusinessDialogWidgetModeUndoStack: UndoStack<ID, CommandEnum, SelectionProp>;

  /**
   * 현재 event 에서 실행되어야 할 command 를 보관하는 자료구조 입니다. 휘발적이며 event 마다 초기화 됩니다.
   */
  command?: Command<ID, CommandEnum, SelectionProp>;

  /**
   * 현재 선택된 Selection 정보
   */
  selectionContainer?: SelectionContainer;

  /**
   * AppMode와 관련된 정보를 보관합니다.
   */
  appModeContainer: AppModeContainer;
}

export default Context;
