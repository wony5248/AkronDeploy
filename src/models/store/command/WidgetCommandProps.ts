import CommandProps from '../command/CommandProps';
import { WidgetModel } from 'models/store/EditorStore';
import CommandEnum from 'models/store/command/CommandEnum';
import SelectionEnum from 'models/store/selection/SelectionEnum';

/**
 * Selection 을 새로 업데이트 할 때 사용됩니다.
 */
export interface SelectionProp {
  selectionType: SelectionEnum;
  widgetModels: WidgetModel[];
  // editingPageModel을 따로 주지 않는 경우, 기존 SelectionContainer에서 승계됩니다.
  editingPageModel?: WidgetModel;
  thumbnailModels?: WidgetModel[];
}

/**
 * 구역을 새로 업데이트 할 때 사용됩니다.
 */
export interface SectionSelectionProp {
  //   pageSection: PageSection;
}

/**
 * UX에서 사용되는 기본 CommandProps
 */
type WidgetCommandProps = CommandProps<CommandEnum, SelectionProp> & {
  sectionSelectionProp?: SectionSelectionProp;
};

export default WidgetCommandProps;
