import CommandEnum from 'models/store/command/common/CommandEnum';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';

/**
 * CommandManager 에 command 를 execute 할 때 지켜야 할 interface 입니다.
 * CommandHandler 는 CommandPros 를 인자를 받아 작업을 처리합니다.
 * reUpdateSelection: 현재 selection container로 재 업데이트 flag
 *                     Selection container를 복제하여 새로운 Selection Container로 변경하는 방식
 *                     command 처리 후 초기화, selectionProp보다 후순위 처리
 */
interface CommandProps {
  commandID: CommandEnum;
  selectionProp?: SelectionProp;
  reUpdateSelection?: boolean;
  undoable?: boolean;
}

export default CommandProps;
