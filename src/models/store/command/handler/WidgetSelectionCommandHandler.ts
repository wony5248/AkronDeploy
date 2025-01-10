import { action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { dError, isDefined, isUndefined } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import WidgetCommandProps, {
  SelectionProp,
  SectionSelectionProp,
} from 'models/store/command/widget/WidgetCommandProps';
import SelectionEnum from 'models/store/selection/SelectionEnum';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { checkPageModel } from 'util/WidgetUtil';
import AkronContext from 'models/store/context/AkronContext';
import PageModel from 'models/node/PageModel';

/**
 * Section 선택 시 필요한 props
 */
export type SectionSelectCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SELECT_SECTION;
  pageSection: PageSection;
  firstPageModel?: WidgetModel;
};

/**
 * BasicWidget 선택 시 필요한 Props
 */
export type WidgetSelectCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SELECT_WIDGET;
  targetModel: WidgetModel;
  // true일 경우 targetModel을 selection에 추가함(multi selection)
  isAdded?: boolean;
};

/**
 * Drag를 통한 BasicWidget 선택 시 필요한 Props
 */
export type WidgetDragSelectCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DRAG_SELECT_WIDGET;
  targetModels: WidgetModel[];
};

/**
 * 페이지 썸네일 선택 시 필요한 Props
 */
export type PageThumbnailSelectCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SELECT_PAGE_THUMBNAIL;
  targetModel: PageModel;
  isMouseDown: boolean;
  isAdded?: boolean;
  isShiftPressed?: boolean;
};

/**
 * 셀렉션 관련 command props 인터페이스 입니다.
 */
type SelectCommandProps =
  | WidgetSelectCommandProps
  | WidgetDragSelectCommandProps
  | SectionSelectCommandProps
  | PageThumbnailSelectCommandProps;

/**
 * Widget 선택 동작을 처리하는 CommandHandler
 */
class WidgetSelectCommandHandler extends CommandHandler {
  /**
   * Widget 편집  관련 커맨드를 처리합니다
   */
  public processCommand(props: SelectCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.SELECT_WIDGET:
        this.selectWidget(ctx, props);
        break;
      case CommandEnum.DRAG_SELECT_WIDGET:
        this.dragSelectWidget(ctx, props);
        break;
      case CommandEnum.SELECT_PAGE_THUMBNAIL:
        this.selectPageThumbnail(ctx, props);
        break;
      case CommandEnum.SELECT_SECTION:
        this.selectSection(ctx, props);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Widget 삽입
   */
  @boundMethod
  private selectWidget(ctx: AkronContext, props: WidgetSelectCommandProps) {
    // 입력값 검증
    if (isUndefined(ctx.getNewAppModel())) {
      dError('dom is not exist');
      return;
    }
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }

    // SelectionProp만 생성
    this.createWidgetSelectionProp(ctx, props);
  }

  /**
   * Widget 삽입
   */
  @boundMethod
  private dragSelectWidget(ctx: AkronContext, props: WidgetDragSelectCommandProps) {
    const commandProps = ctx.getCommandProps();
    // 입력값 검증
    if (isUndefined(ctx.getNewAppModel())) {
      dError('dom is not exist');
      return;
    }
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }

    // SelectionProp 생성
    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: props.targetModels,
    };
    if (isDefined(commandProps)) {
      commandProps.selectionProp = selectionPropObj;
    }
  }

  /**
   * Context 내에 SelectionProperty 값 생성
   */
  @action.bound
  private createWidgetSelectionProp(ctx: AkronContext, props: WidgetSelectCommandProps): void {
    const widgetModels: WidgetModel[] = [];
    const selectedWidgetModels = ctx.getSelectionContainer()?.getSelectedWidgets();
    const commandProps = ctx.getCommandProps();
    let selectedPage = ctx.getSelectionContainer()?.getEditingPage();
    let selectTarget = true;

    if (isDefined(selectedWidgetModels) && selectedWidgetModels[0]?.getParent() !== props.targetModel.getParent()) {
      widgetModels.push(props.targetModel);
    } else {
      // page select의 경우 isAdded값이 없어 다중선택되지 않으나 최초 page select 상태에서 widget 다중선택이 가능하기 때문에
      // 최초 page select 상태인지 예외처리
      const isPageSelected =
        isDefined(selectedWidgetModels) &&
        selectedWidgetModels.length !== 0 &&
        !checkPageModel(selectedWidgetModels[0]);

      if (isPageSelected && props.isAdded) {
        selectedWidgetModels?.forEach(_model => {
          if (_model !== props.targetModel) {
            widgetModels.push(_model);
          } else if (selectedWidgetModels.length > 1) {
            // multi selection 상태에서 선택된 widget을 클릭할 경우 선택해제
            selectTarget = false;
          }
        });
      }
      if (selectTarget) {
        widgetModels.push(props.targetModel);
      }
    }
    if (checkPageModel(props.targetModel)) {
      selectedPage = props.targetModel as PageModel;
    }

    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels,
      editingPageModel: selectedPage,
    };
    if (isDefined(commandProps)) {
      commandProps.selectionProp = selectionPropObj;
    }
  }

  /**
   * Page 썸네일 선택 핸들러 함수
   */
  @boundMethod
  private selectPageThumbnail(ctx: AkronContext, props: PageThumbnailSelectCommandProps) {
    // 썸네일 셀렉션을 채움
    let widgetModels: PageModel[] = [];
    const commandProps = ctx.getCommandProps();
    const selectedPageModels = ctx.getSelectionContainer()?.getSelectedPages();
    let selectedPageModel = ctx.getSelectionContainer()?.getEditingPage();
    let selectTarget = true;

    if (props.isAdded) {
      if (props.isMouseDown) {
        selectedPageModels?.forEach(model => {
          // target 이 아닌경우 선택
          // target 인 경우, 전체 선택된 페이지가 단일이면 변화 없음
          // target 인 경우, 멀티 셀렉션 상태면 toggle
          if (model !== props.targetModel) {
            widgetModels.push(model);
          } else if (selectedPageModels.length === 1) {
            selectTarget = true;
          } else {
            selectTarget = false;
          }
        });
        if (selectTarget) {
          widgetModels.push(props.targetModel);
        }
        // 기존 프레임웤으로 페이지 선택 할 수 있도록 commandProps를 채워줌 (editing page 변경을 위함)
        if (checkPageModel(props.targetModel)) {
          selectedPageModel = props.targetModel;
        }
      } else {
        selectedPageModels?.forEach(model => {
          widgetModels.push(model);
        });
      }
    } else if (props.isShiftPressed) {
      if (props.isMouseDown) {
        if (isUndefined(selectedPageModels) || selectedPageModels?.length === 0) {
          // 이미 선택한게 없는 경우, 그냥 선택
          widgetModels.push(props.targetModel);
        } else if (selectedPageModels?.find(element => element === props.targetModel)) {
          // 이미 선택한 걸 선택한 경우, 그걸 제외
          selectedPageModels?.forEach(model => {
            if (model !== props.targetModel) {
              widgetModels.push(model);
            }
          });
        } else {
          // 이미 선택한게 있고 target이 그중 없을 경우, 최초 선택 부터 target 까지 주르륵 선택
          // XXX: 이미 다중선택 상황인 경우 동일한 페이지가 중복으로 들어감
          //   const pageList = getPageList(ctx.getNewAppModel());
          const firstPage = selectedPageModels[0];
          // const targetPage = props.targetModel;
          // let isTargetSearched = false;
          // let isPrevSelectSearched = false;
          //   pageList.forEach(page => {
          //     if (page === firstPage) {
          //       isPrevSelectSearched = true;
          //       widgetModels.push(page);
          //     } else if (page === targetPage) {
          //       isTargetSearched = true;
          //       widgetModels.push(page);
          //     }
          //     if (page !== targetPage && page !== firstPage && isTargetSearched !== isPrevSelectSearched) {
          //       widgetModels.push(page);
          //     }
          //   });
          // 추가 적으로 나머지 기존 선택된 페이지들도 선택
          selectedPageModels.forEach(page => {
            if (page !== firstPage) {
              widgetModels.push(page);
            }
          });
        }
      } else {
        selectedPageModels?.forEach(model => {
          widgetModels.push(model);
        });
      }
    } else if (props.isMouseDown === true) {
      // 특수키 누르지 않은 상태에서, 기존 선택 페이지들 중 하나를 mouseDown한 경우 유지
      if (
        selectedPageModels?.some(thumbnail => {
          return thumbnail === props.targetModel;
        })
      ) {
        widgetModels = [...selectedPageModels];
      } else {
        // 특수키 누르지 않은 상태에서, 기존 선택 페이지를 클릭한 경우가 아닌 경우 target만 select
        selectedPageModel = props.targetModel;
        widgetModels.push(props.targetModel);
      }
    } else if (props.isMouseDown === false) {
      // 특수키 누르지 않은 상태에서 mouseUp인경우 target만 select
      selectedPageModel = props.targetModel;
      widgetModels.push(props.targetModel);
    }

    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [props.targetModel],
      editingPageModel: selectedPageModel,
      selectPageModels: [...new Set(widgetModels)], // 같은 Page가 중복으로 targetModels에 들어있는 경우가 있어 중복제거
    };
    if (isDefined(commandProps)) {
      commandProps.selectionProp = selectionPropObj;
    }
  }

  /**
   * 구역 선택 핸들링 함수입니다.
   */
  @action
  private selectSection(ctx: AkronContext, props: SectionSelectCommandProps) {
    const commandProps = ctx.getCommandProps();
    const sectionSelectionPropObj: SectionSelectionProp = {
      pageSection: props.pageSection,
    };
    if (isDefined(commandProps)) {
      commandProps.sectionSelectionProp = sectionSelectionPropObj;
    }
  }
}

export default WidgetSelectCommandHandler;
