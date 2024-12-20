import { WidgetModel } from 'models/store/EditorStore';
import SelectionEnum from '../selection/SelectionEnum';

/**
 * CommandManager 에 command 를 execute 할 때 지켜야 할 interface 입니다.
 * CommandHandler 는 CommandPros 를 인자를 받아 작업을 처리합니다.
 * reUpdateSelection: 현재 selection container로 재 업데이트 flag
 *                     Selection container를 복제하여 새로운 Selection Container로 변경하는 방식
 *                     command 처리 후 초기화, selectionProp보다 후순위 처리
 */
interface CommandProps<CommandEnum, SelectionProp> {
  commandID: CommandEnum;
  selectionProp?: SelectionProp;
  reUpdateSelection?: boolean;
  undoable?: boolean;
}

export interface SelectionProp {
  selectionType: SelectionEnum;
  widgetModels: WidgetModel[];
  // editingPageModel을 따로 주지 않는 경우, 기존 SelectionContainer에서 승계됩니다.
  editingPageModel?: WidgetModel;
  thumbnailModels?: WidgetModel[];
}

export default CommandProps;
