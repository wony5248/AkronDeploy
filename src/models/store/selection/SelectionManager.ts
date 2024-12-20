import { action, makeObservable } from 'mobx';
import CommandEnum from '../command/CommandEnum';
import SelectionContainer from './SelectionContainer';
import WidgetSelection from './WidgetSelection';
import AkronContext from 'models/store/context/AkronContext';
import { WidgetModel } from 'models/store/EditorStore';

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
    const commandID = ctx.commandProps?.commandID;
    let newSelectionContainer: SelectionContainer;

    if (commandID !== undefined) {
      switch (commandID) {
        case CommandEnum.UNDO:
          ctx.prevSelectionContainer = ctx.selectionContainer;
          // 최초 상태에서는 selection update하지 않음
          if (ctx.command?.getOldSelectionContainer() !== undefined) {
            ctx.selectionContainer = ctx.command?.getOldSelectionContainer() as SelectionContainer;
          }
          break;
        case CommandEnum.REDO:
          ctx.prevSelectionContainer = ctx.selectionContainer;
          // 최후 상태에서는 selection update하지 않음
          if (ctx.command?.getNewSelectionContainer() !== undefined) {
            ctx.selectionContainer = ctx.command?.getNewSelectionContainer() as SelectionContainer;
          }
          break;
        case CommandEnum.DELETE_WIDGET:
          //   this.updateSelectionByDeleteWidget(ctx);
          break;
        case CommandEnum.DELETE_PAGE: {
          //   this.updateSelectionByDeletePage(ctx);
          break;
        }
        case CommandEnum.CLIPBOARD_CUT_PROCESS: {
          //   if (
          //     !isCutPossible(ctx.selectionContainer as SelectionContainer, ctx.appWidgetModel, ctx.appModeContainer)
          //   ) {
          //     break;
          //   }

          const oldSelectionContainer = ctx.command?.getOldSelectionContainer();
          if (oldSelectionContainer === undefined) {
            break;
          }

          //   const selectedWidgets = (oldSelectionContainer as SelectionContainer).getSelectedWidgets();
          //   const firstSelectedWidget = selectedWidgets[0];
          //   if (!firstSelectedWidget) {
          //     break;
          //   }

          //   const isPageDeleted = checkPageModel(firstSelectedWidget);
          //   if (isPageDeleted) {
          //     this.updateSelectionByDeletePage(ctx);
          //   } else {
          //     this.updateSelectionByDeleteWidget(ctx);
          //   }

          break;
        }
        case CommandEnum.CHANGE_APP_MODE:
          switch (ctx.appModeContainer.getAppMode()) {
            case 'EDIT_DIALOG_WIDGET':
              // 사용자 정의 컴포넌트 또는 다이얼로그 만들기 작업 모드로 변경될 때 기존 selection을
              // editModeLastSelectionContainer 별도로 저장.
              if (ctx.editModeLastSelectionContainer !== undefined) {
                ctx.editModeLastSelectionContainer = ctx.selectionContainer;
              }
              if (ctx.editingWidgetModel !== undefined) {
                newSelectionContainer = new SelectionContainer();
                ctx.command?.setNewSelectionContainer(newSelectionContainer);
                ctx.prevSelectionContainer = undefined;
                ctx.selectionContainer = newSelectionContainer;

                // selectableModelList set
                const widgetModels = ctx.commandProps?.selectionProp?.widgetModels;
                if (widgetModels !== undefined) {
                  //   widgetModels.forEach(model => {
                  //     newSelectionContainer.initSelectableWidgetModels(model);
                  //   });
                  //   newSelectionContainer.setWidgetModelSelectable();
                }

                this.udpateSelectionContainerByEditingWidgetModel(ctx);

                // undoStack 초기화
                // if (isEditDialogWidgetMode(ctx.appModeContainer)) {
                //   ctx.editBusinessDialogWidgetModeUndoStack.clear();
                // }
                ctx.lastRegisteredEditUndoStackTag = '';
              }
              break;
            case 'EDIT_APP':
              // EDIT_APP 모드로 변경될 때, editModeLastSelectionContainer 있으면, 현재 selection으로 변경.
              if (ctx.editModeLastSelectionContainer !== undefined) {
                ctx.selectionContainer = ctx.editModeLastSelectionContainer;
                ctx.prevSelectionContainer = undefined; // 이전 selection은 사용자 정의 컴포넌트 수정 시 남아있던 것임. 모드 변경으로 사라짐에 따라 undefined 처리
                ctx.editModeLastSelectionContainer = undefined;
              }
              break;
            default:
              break;
          }
          break;
        case CommandEnum.SELECT_SECTION:
          if (ctx.commandProps?.sectionSelectionProp !== undefined) {
            // 구역 선택 시 선택중인 page는 바뀌지 않음
            const editingPage = ctx.selectionContainer?.getEditingPage();
            const selectedPages: WidgetModel[] = editingPage !== undefined ? [editingPage] : [];
            // const pageSection = ctx.commandProps?.sectionSelectionProp.pageSection;

            newSelectionContainer = new SelectionContainer();
            // if (pageSection) {
            //     newSelectionContainer.setSelectedSection(ctx.appWidgetModel, pageSection, selectedPages);
            // }
            if (selectedPages !== undefined && selectedPages.length > 0) {
              newSelectionContainer.setSelectedPage(selectedPages[0]);
              newSelectionContainer.setWidgetSelection(selectedPages[0]);
            }
            ctx?.command?.setNewSelectionContainer(newSelectionContainer);
            ctx.prevSelectionContainer = ctx.selectionContainer;
            ctx.selectionContainer = newSelectionContainer;
          }
          break;
        default: {
          // const widgetModels = ctx.commandProps?.selectionProp?.widgetModels;
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
    const { selectionContainer } = ctx;
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
    const { selectionContainer } = ctx;
    selectionContainer?.setSelected(true);
  }

  /**
   * GX Edit app 모드인 경우, EditingWidgetModel에 대한 추가 selsection 정보를 설정합니다.
   *
   * @param ctx 앱의 상태.
   */
  private udpateSelectionContainerByEditingWidgetModel(ctx: AkronContext): void {
    const { selectionContainer, editingWidgetModel } = ctx;

    if (selectionContainer) {
      selectionContainer.setWidgetSelection(editingWidgetModel);
      selectionContainer.setSelectedPage(editingWidgetModel);
    }
  }
}
