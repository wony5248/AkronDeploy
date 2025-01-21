import { action, makeObservable } from 'mobx';
import CommandEnum from '../command/common/CommandEnum';
import SelectionContainer from '../container/SelectionContainer';
import WidgetSelection from './WidgetSelection';
import AkronContext from 'models/store/context/AkronContext';
import WidgetModel from 'models/node/WidgetModel';
import { isDefined, WidgetTypeEnum } from '@akron/runner';
import { writeNodeState } from 'components/toolpane/TreeNodeComponent';
import PageModel from 'models/node/PageModel';

/**
 * 사용자의 Selection 상태를 보여주기 위한 Class
 */
export default class SelectionManager {
  /**
   * Prev Selection 정보를 보관합니다.
   * 이를 통해 Selection 이 변경된 경우에만 update를 수행합니다.
   */
  private prevSelectionContainer?: SelectionContainer;

  // 현재 선택된 Basic WidgetSelection 정보.
  private widgetSelections: WidgetSelection[];

  // 현재 선택된 pageSelection 정보
  private pageSelections: WidgetSelection[];

  /**
   * 생성자.
   */
  public constructor() {
    makeObservable(this);
    this.prevSelectionContainer = undefined;
    this.widgetSelections = Array<WidgetSelection>();
    this.pageSelections = Array<WidgetSelection>();
  }

  /**
   * Selection을 업데이트합니다.
   *
   * @param ctx 앱의 상태.
   */
  @action.bound
  public updateSelection(ctx: AkronContext): void {
    // 1. Update selection container
    this.updateSelectionContainer(ctx);

    // 2. Update floating object
    this.updateFloatingObject(ctx);
  }

  /**
   * Selection을 Clone합니다.
   *
   * @param selectionContainer 복사 할 SelectionContainer.
   */
  @action.bound
  public cloneSelectionContainer(selectionContainer: SelectionContainer | undefined): SelectionContainer | undefined {
    if (selectionContainer === undefined) {
      return undefined;
    }
    return (selectionContainer as SelectionContainer).clone();
  }

  /**
   * Selection container를 업데이트합니다.
   *
   * @param ctx 앱의 상태.
   */
  @action.bound
  public updateSelectionContainer(ctx: AkronContext): void {
    // Update selection
    const commandID = ctx.getCommandProps()?.commandID;
    let newSelectionContainer: SelectionContainer;
    if (commandID !== undefined) {
      switch (commandID) {
        case CommandEnum.UNDO:
          ctx.setPrevSelectionContainer(ctx.getSelectionContainer());
          // 최초 상태에서는 selection update하지 않음
          break;
        case CommandEnum.REDO:
          ctx.setPrevSelectionContainer(ctx.getSelectionContainer());
          break;
        case CommandEnum.CLIPBOARD_CUT_PROCESS: {
          //   if (
          //     !isCutPossible(ctx.selectionContainer as SelectionContainer, ctx.appWidgetModel, ctx.appModeContainer)
          //   ) {
          //     break;
          //   }

          const oldSelectionContainer = ctx.getCommand()?.getOldSelectionContainer();
          if (oldSelectionContainer === undefined) {
            break;
          }

          const selectedWidgets = (oldSelectionContainer as SelectionContainer).getSelectedWidgets();
          const firstSelectedWidget = selectedWidgets[0];
          if (!firstSelectedWidget) {
            break;
          }

          //   const isPageDeleted = checkPageModel(firstSelectedWidget);
          //   if (isPageDeleted) {
          //     this.updateSelectionByDeletePage(ctx);
          //   } else {
          //     this.updateSelectionByDeleteWidget(ctx);
          //   }

          break;
        }
        default: {
          // 일반 셀렉션
          const widgetModels = ctx.getCommandProps()?.selectionProp?.widgetModels;
          if (isDefined(widgetModels)) {
            newSelectionContainer = new SelectionContainer();
            widgetModels?.forEach(model => {
              let currentWidgetModel: WidgetModel | undefined = model.getParent();

              while (
                isDefined(currentWidgetModel) &&
                currentWidgetModel?.getWidgetType() !==
                  WidgetTypeEnum.Page /*&& !checkBusinessOrPageDialogModel(currentWidgetModel)*/
              ) {
                writeNodeState(ctx.getAppID(), currentWidgetModel.getID(), true);
                currentWidgetModel = currentWidgetModel?.getParent();
              }
              // treeView re-render
              ctx.getEditorUIStore().treeRerender();
              newSelectionContainer.setWidgetSelection(model);
            });

            const selectPageModels = ctx.getCommandProps()?.selectionProp?.selectPageModels;
            const editingPageModel = ctx.getCommandProps()?.selectionProp?.editingPageModel;
            if (isDefined(selectPageModels)) {
              // 다중 선택
              selectPageModels?.forEach(model => {
                if (model !== editingPageModel) {
                  newSelectionContainer.setSelectedPage(model);
                }
              });
              // 화면에 보여질 페이지
              if (editingPageModel) {
                newSelectionContainer.setEditingPage(editingPageModel);
                newSelectionContainer.setSelectedPage(editingPageModel);
              }
            } else if (editingPageModel) {
              // 페이지 단일 선택
              newSelectionContainer.setEditingPage(editingPageModel);
              newSelectionContainer.setSelectedPage(editingPageModel);
            } else if (isDefined(ctx.getSelectionContainer()?.getEditingPage())) {
              // 페이지 선택X -> 기존 페이지 유지
              newSelectionContainer.setEditingPage(ctx.getSelectionContainer()?.getEditingPage());
              newSelectionContainer.setSelectedPage(ctx.getSelectionContainer()?.getEditingPage());
            }

            ctx?.setSelectionContainer(newSelectionContainer);
            ctx.setPrevSelectionContainer(ctx.getSelectionContainer());
            ctx.getPrevSelectionContainer()?.clearSelectableWidgetModels();
            ctx.setSelectionContainer(newSelectionContainer);

            // selectableModelList set
            widgetModels?.forEach(model => {
              newSelectionContainer.initSelectableWidgetModels(model);
            });
            newSelectionContainer.setWidgetModelSelectable();
          } else if (ctx.getCommandProps()?.reUpdateSelection) {
            const clonedSelectionContainer = this.cloneSelectionContainer(ctx.getSelectionContainer());
            if (isDefined(clonedSelectionContainer)) {
              ctx.setSelectionContainer(clonedSelectionContainer);
              ctx.setPrevSelectionContainer(ctx.getSelectionContainer());
              ctx.setSelectionContainer(clonedSelectionContainer);
            }
          }
          break;
        }
      }
    }
  }

  /**
   * Floating object를 업데이트합니다.
   *
   * @param ctx 앱의 상태.
   */
  @action.bound
  public updateFloatingObject(ctx: AkronContext): void {
    // 1. Update floating check
    const selectionContainer = ctx.getSelectionContainer();
    if (!this.checkToUpdateFloating(selectionContainer)) {
      return;
    }

    // 2. Clear prev floating object
    this.clearFloatingObject();

    // 3. Update new floating object
    this.updateNewFloatingObject(ctx);

    // 4. set prevSelectionContainer as current one
    this.prevSelectionContainer = selectionContainer;
  }

  /**
   * Floating object update시 체크를 합니다.
   *
   * @param container SelectionContainer 객체.
   */
  @action.bound
  private checkToUpdateFloating(container: SelectionContainer | undefined): boolean {
    if (container === undefined) {
      return false;
    }
    if (this.prevSelectionContainer === container) {
      return false;
    }
    return true;
  }

  /**
   * Floating object selection을 취소합니다.
   *
   * @param ctx 앱의 상태.
   */
  @action.bound
  private clearFloatingObject(): void {
    this.prevSelectionContainer?.setSelected(false);
  }

  /**
   * Floating object를 새로 select합니다.
   *
   * @param ctx 앱의 상태.
   */
  @action.bound
  private updateNewFloatingObject(ctx: AkronContext): void {
    const selectionContainer = ctx.getSelectionContainer();
    selectionContainer?.setSelected(true);
  }
}
