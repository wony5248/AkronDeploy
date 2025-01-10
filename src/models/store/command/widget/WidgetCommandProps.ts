import PageModel from 'models/node/PageModel';
import CommandProps from '../common/CommandProps';
import WidgetModel from 'models/node/WidgetModel';
import SelectionEnum from 'models/store/selection/SelectionEnum';

/**
 * Selection 을 새로 업데이트 할 때 사용됩니다.
 */
export interface SelectionProp {
  selectionType: SelectionEnum;
  widgetModels: WidgetModel[];
  // editingPageModel을 따로 주지 않는 경우, 기존 SelectionContainer에서 승계됩니다.
  editingPageModel?: PageModel; // currentPage
  selectPageModels?: PageModel[]; // selectPages
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
type WidgetCommandProps = CommandProps & {
  sectionSelectionProp?: SectionSelectionProp;
};

export default WidgetCommandProps;
