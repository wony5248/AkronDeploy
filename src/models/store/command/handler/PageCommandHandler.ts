import {
  Nullable,
  dError,
  isDefined,
  dWarn,
  isUndefined,
  IWidgetCommonProperties,
  WidgetTypeEnum,
} from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import PageModel from 'models/node/PageModel';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import AppendWidgetCommand from 'models/store/command/widget/AppendWidgetCommand';
import RemoveWidgetCommand from 'models/store/command/widget/RemoveWidgetCommand';
import RenameWidgetCommand from 'models/store/command/widget/RenameWidgetCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';
import SelectionEnum from 'models/store/selection/SelectionEnum';
import { isPagesDeletable, pageNameExist, getDeletablePageModels } from 'util/PageUtil';
import { checkPageModel, appendDeleteWidgetCommandsRecursive } from 'util/WidgetUtil';

/**
 * Page 추가 시 필요한 Props
 */
export type AddPageCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ADD_PAGE;
  widgetType: WidgetTypeEnum;
  widgetID: WidgetID;
  pageLevel: number; // Page 추가시, pageLevel 정보를 props로 받음.
  pageTemplate?: string;
};

/**
 * Page update 시 필요한 Props
 */
export type RenamePageCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.RENAME_PAGE;
  targetModel: WidgetModel;
  pageName: string;
};

/**
 * Page Level update 시 필요한 Props
 */
export type UpdatePageLevelCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.UPDATE_PAGE_LEVEL;
  targetModel: WidgetModel;
  pageLevel: number;
};

/**
 * Page 삭제 시 필요한 Props
 */
export type DeletePageCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DELETE_PAGE | CommandEnum.CLIPBOARD_CUT_PROCESS;
};

/**
 * 지정한 ID의 Page로 이동 시(Select 변경) 필요한 Props
 */
export type SelectPageByIDCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SELECT_PAGE_BY_ID;
  pageID: WidgetID;
};

/**
 * Page 잠금시 필요한 Props
 */
export type LockPageCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.LOCK_PAGE;
  targetModels: WidgetModel[];
  locked: boolean;
};

/**
 * Page 숨김시 필요한 Props
 */
export type HidePageCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.HIDE_PAGE;
  targetModels: WidgetModel[];
  hidden: boolean;
};

/**
 * PageCommandProp의 집합.
 */
type PageCommandProps =
  | AddPageCommandProps
  | RenamePageCommandProps
  | DeletePageCommandProps
  | SelectPageByIDCommandProps
  | LockPageCommandProps
  | HidePageCommandProps
  | UpdatePageLevelCommandProps;

/**
 * 해당 WidgetModel의 부모를 탐색하며 PageWidgetModel을 찾아 반환
 *
 * @param node 탐색을 시작할 기준 WidgetModel
 * @returns 해당 WidgetModel의 부모에 해당하는 PageWidgetModel node
 */
export function findParentPageModel(node: WidgetModel): Nullable<WidgetModel> {
  if (checkPageModel(node)) {
    return node;
  }
  const parentNode = node.getParent();
  if (isUndefined(parentNode)) {
    return undefined;
  }
  return findParentPageModel(parentNode);
}

/**
 * AppWidget이 가지고 있는 Child를 탐색하며(PageModel만 탐색)
 * 파라미터로 받은 ID와 일치하는 PageModel을 반환
 */
export function findPageModelByID(
  appWidgetModel: WidgetModel,
  id: WidgetID
): Nullable<WidgetModel<IWidgetCommonProperties>> {
  let findPageModel;
  appWidgetModel.forEachChild(child => {
    if (child.getID() === id) {
      findPageModel = child;
    }
  });
  return findPageModel;
}

/**
 * Page 이동 동작을 처리하는 CommandHandler
 */
class PageCommandHandler extends CommandHandler {
  /**
   * Page 이동 관련 커맨드를 처리합니다.
   */
  public processCommand(props: PageCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.ADD_PAGE:
        this.addPage(ctx, props);
        break;
      case CommandEnum.RENAME_PAGE:
        this.renamePage(ctx, props);
        break;
      case CommandEnum.DELETE_PAGE:
        this.deletePage(ctx, props);
        break;
      case CommandEnum.CLIPBOARD_CUT_PROCESS:
        if (
          isUndefined(ctx.getSelectionContainer()) ||
          !isPagesDeletable(
            ctx.getSelectionContainer()?.getSelectedWidgets() ?? [],
            ctx.getAppModel(),
            ctx.getAppModeContainer()
          )
        ) {
          return false;
        }
        this.deletePage(ctx, props);
        return true;
      case CommandEnum.SELECT_PAGE_BY_ID:
        this.selectPageByID(ctx, props);
        break;
      case CommandEnum.LOCK_PAGE:
        this.lockPage(ctx, props);
        break;
      case CommandEnum.HIDE_PAGE:
        this.hidePage(ctx, props);
        break;
      case CommandEnum.UPDATE_PAGE_LEVEL:
        this.updatePageLevel(ctx, props);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Page 추가
   */
  @boundMethod
  private addPage(ctx: AkronContext, props: AddPageCommandProps) {
    // WidgetModel 생성
    const newWidgetModel = ctx
      .getMetadataContainer()
      .getDefaultWidgetModels()
      .get(props.widgetType)
      ?.cloneNode(ctx.getIdContainerController());

    const currentPage = ctx.getSelectionContainer()?.getEditingPage();

    if (isUndefined(newWidgetModel) || isUndefined(ctx.getCommand()) || isUndefined(currentPage)) {
      dError('widgetModel creation failed.');
      return;
    }

    const pageNamePrefix = 'New Page';

    let pageIndex = ctx.getAppModel().getChildCount() + 1; // page 개수 + 1
    while (pageNameExist(ctx.getAppModel(), `${pageNamePrefix} ${pageIndex}`)) {
      pageIndex += 1;
    }
    newWidgetModel.setName(`${pageNamePrefix} ${pageIndex}`);

    // SimpleCommand 생성
    // Page는 app(root)를 parent로 설정.
    const parentWidgetModel = ctx.getAppModel();

    // Page 컴포넌트의 Property 별도 셋팅.
    newWidgetModel.setProperties({
      ...currentPage.getProperties(),
    });

    const appendWidgetCommand = new AppendWidgetCommand(
      ctx,
      newWidgetModel,
      parentWidgetModel,
      ctx.getSelectionContainer()?.getEditingPage()?.getNextSibling()
    );
    ctx.getCommand()?.append(appendWidgetCommand);

    this.createWidgetSelectionProp(ctx, newWidgetModel);
  }

  /**
   * Page의 Properties 변경
   */
  @boundMethod
  private renamePage(ctx: AkronContext, props: RenamePageCommandProps): void {
    const command = ctx.getCommand();
    if (isUndefined(command)) {
      dError('command is not exist');
      return;
    }
    const { targetModel, pageName } = props;

    const renameWidgetCommand = new RenameWidgetCommand(targetModel, pageName);
    command.append(renameWidgetCommand);
  }

  /**
   * Page 삭제
   */
  @boundMethod
  private deletePage(ctx: AkronContext, props: DeletePageCommandProps) {
    const appWidgetModel = ctx.getAppModel();
    const command = ctx.getCommand();
    const selectionContainer = ctx.getSelectionContainer();
    const appModeContainer = ctx.getAppModeContainer();

    if (isUndefined(appWidgetModel)) {
      dError('dom is not exist');
      return;
    }
    if (isUndefined(command)) {
      dError('command is not exist');
      return;
    }
    if (isUndefined(selectionContainer)) {
      return;
    }

    const targetModels = selectionContainer.getSelectedPages();
    if (!isPagesDeletable(targetModels, appWidgetModel, appModeContainer)) {
      return;
    }

    let deletableModels = getDeletablePageModels(targetModels, appWidgetModel, appModeContainer);

    if (deletableModels.length === appWidgetModel.getChildCount()) {
      // 모든 페이지 선택 시 첫 페이지 제외 하위 컴포넌트만 삭제
      const firstPage = appWidgetModel.getFirstChild();
      if (firstPage) {
        deletableModels = deletableModels.filter(page => page !== firstPage);
      }
    }

    let currentPage = appWidgetModel.getLastChild();
    let nextPage = currentPage?.getPrevSibling();
    let nextSelectPage = currentPage;
    while (currentPage && nextPage) {
      if (deletableModels.includes(currentPage) && !deletableModels.includes(nextPage)) {
        nextSelectPage = nextPage;
        break;
      }
      currentPage = nextPage;
      nextPage = currentPage?.getPrevSibling();
    }

    // selectionProp set
    const commandProps = ctx.getCommandProps();
    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [],
      editingPageModel: nextSelectPage as PageModel,
    };
    if (isDefined(commandProps)) {
      commandProps.selectionProp = selectionPropObj;
    }

    deletableModels.forEach(targetModel => {
      targetModel.forEachChild(childModel =>
        appendDeleteWidgetCommandsRecursive(childModel, ctx, CommandEnum.DELETE_WIDGET)
      );
      const removeWidgetCommand = new RemoveWidgetCommand(targetModel, appWidgetModel);
      command.append(removeWidgetCommand);
    });
  }

  /**
   * Context 내에 SelectionProperty 값 생성
   */
  private createWidgetSelectionProp(ctx: AkronContext, newWidgetModel: PageModel): void {
    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [],
      editingPageModel: newWidgetModel,
    };
    const commandProps = ctx.getCommandProps();
    if (commandProps) {
      commandProps.selectionProp = selectionPropObj;
    }
  }

  /**
   * 지정한 ID의 Page로 이동.
   * Business Logic에서 지정된 Page로 이동함.
   * WidgetID를 인자를 받고, 해당 ID에 맞는 PageModel을 찾아 Selection을 변경함.
   */
  @boundMethod
  private selectPageByID(ctx: AkronContext, props: SelectPageByIDCommandProps) {
    // 지정된 ID에 해당하는 Page를 찾음.
    const pageModel = findPageModelByID(ctx.getAppModel(), props.pageID);

    if (isUndefined(pageModel)) {
      dWarn('Page is not defined');
      return;
    }
    // 이미 선택된 페이지일 경우
    // FIXME: 다중선택에 따른 로직 구현 필요
    const selectedWidgetModel = ctx.getSelectionContainer()?.getSelectedWidgets()[0];
    if (selectedWidgetModel === pageModel) {
      return;
    }
    // 지정 Page를 SelectionProp으로 생성하여 전달.
    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [pageModel],
      editingPageModel: ctx.getSelectionContainer()?.getEditingPage(),
    };
    const commandProps = ctx.getCommandProps();
    if (commandProps) {
      commandProps.selectionProp = selectionPropObj;
    }
  }

  /**
   * page의 locked 속성 변경 (페이지 잠금/잠금해제)
   */
  @boundMethod
  private lockPage(ctx: AkronContext, props: LockPageCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }
    const widgetModels: WidgetModel[] = props.targetModels;

    // widgetModels.forEach(widgetModel => {
    //   const lockedWidgetCommand = new UpdateWidgetCommand(widgetModel, props);
    //   ctx.getCommand()?.append(lockedWidgetCommand);
    // });

    // 컴포넌트 selection 상태인 경우 editing Page를 SelectionProp으로 생성하여 전달
    const selectedWidgetModel = ctx.getSelectionContainer()?.getSelectedWidgets()[0];
    if (checkPageModel(selectedWidgetModel)) {
      return;
    }

    // TODO: 현재는 editingPage 없는 경우 없음. 추후 없을 경우 로직 반영 해야함.
    const editingPage = ctx.getSelectionContainer()?.getEditingPage();
    const SelectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [editingPage as WidgetModel],
      editingPageModel: editingPage,
    };
    const commandProps = ctx.getCommandProps();
    if (isDefined(commandProps)) {
      commandProps.selectionProp = SelectionPropObj;
    }
  }

  /**
   * page의 hidden 속성 변경 (페이지 숨김/숨김해제)
   */
  @boundMethod
  private hidePage(ctx: AkronContext, props: HidePageCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }
    const widgetModels: WidgetModel[] = props.targetModels;

    // widgetModels.forEach(widgetModel => {
    //   const hiddenWidgetCommand = new UpdateWidgetCommand(widgetModel, 'hidden', props.hidden);
    //   ctx.getCommand()?.append(hiddenWidgetCommand);
    // });
  }

  /**
   * pageLevel 속성 변경
   */
  @boundMethod
  private updatePageLevel(ctx: AkronContext, props: UpdatePageLevelCommandProps) {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }
    // const { targetModel, pageLevel } = props;

    // const updatePageLevelCommand = new UpdateWidgetCommand(targetModel, 'pageLevel', pageLevel);
    // ctx.getCommand()?.append(updatePageLevelCommand);
  }
}

export default PageCommandHandler;
