import { IWidgetCommonProperties, isDefined } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { runInAction } from 'mobx';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import AppRepository from 'models/repository/AppRepository';
import WidgetRepository from 'models/repository/WidgetRepository';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import UpdateWidgetCommand from 'models/store/command/widget/UpdateWidgetCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import { AppModeType } from 'models/store/container/AppModeContainer';
import AkronContext from 'models/store/context/AkronContext';
import { SaveState } from 'models/store/EditorStore';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { AppType } from 'store/app/AppInfo';
import { isUndefined } from 'util';

const unNamedSection = '이름 없는 구역';
const defaultSection = '기본 구역';

/**
 * 앱을 DB저장 하기 위해 필요한 props
 */
export type SaveCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SAVE;
};

/**
 * 앱을 다른 이름으로 저장 후 로딩 하는데 필요한 props
 */
export type SaveAsCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.SAVE_AS;
  appType: Lowercase<AppType>;
  appName: string;
  appID: number;
  userID: number;
  modeType: Lowercase<AppModeType>;
  roomID: number;
};

/**
 * 구역 추가에 필요한 props. AppWidgetModel의 props를 변경
 */
export type AddSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.ADD_SECTION;
  targetModel: WidgetModel<IWidgetCommonProperties>;
  appWidgetModel: WidgetModel<IWidgetCommonProperties>;
};

/**
 * 구역 삭제에 필요한 props. AppWidgetModel의 props를 변경
 */
export type DeleteSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DELETE_SECTION;
  pageSection: PageSection;
  appWidgetModel: WidgetModel<IWidgetCommonProperties>;
};

/**
 * 구역 확장에 필요한 props. AppWidgetModel의 props를 변경
 */
export type ExpandAllSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.EXPAND_ALL_SECTION;
  appWidgetModel: WidgetModel<IWidgetCommonProperties>;
};

/**
 * 구역 축소에 필요한 props. AppWidgetModel의 props를 변경
 */
export type CollapseAllSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.COLLAPSE_ALL_SECTION;
  appWidgetModel: WidgetModel<IWidgetCommonProperties>;
};

/**
 * 특정 구역 확대/축소에 필요한 props. AppWidgetModel의 props를 변경
 */
export type CollapseSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.COLLAPSE_SECTION;
  isExpand: boolean;
  pageSection: PageSection;
};

/**
 * 전체 구역 삭제에 필요한 props. AppWidgetModel의 props를 변경
 */
export type DeleteAllSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DELETE_ALL_SECTION;
  appWidgetModel: WidgetModel<IWidgetCommonProperties>;
};

/**
 * 구역 이름 변경 props. AppWidgetModel의 props를 변경
 */
export type RenameSectionCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.RENAME_SECTION;
  name: string;
};

/**
 * 해당 page의 index를 반환하는 함수
 */
export function getTargetPageIndex(appWidgetModel: WidgetModel, pageModel: WidgetModel): number {
  let targetIdx = 0;
  appWidgetModel.forEachChild(child => {
    if (child === pageModel) {
      targetIdx += 1;
    }
  });

  return targetIdx;
}

/**
 * 앱 전반적인 command를 수행할 때 필요한 Props
 */
type AppCommandProps =
  | DeleteAllSectionCommandProps
  | CollapseAllSectionCommandProps
  | CollapseSectionCommandProps
  | ExpandAllSectionCommandProps
  | DeleteSectionCommandProps
  | AddSectionCommandProps
  | RenameSectionCommandProps
  | SaveCommandProps
  | SaveAsCommandProps;

/**
 * 앱 전반적인 command를 수행할 때 필요한 commandhandler
 */
class AppCommandHandler extends CommandHandler {
  /**
   * 앱 관련 커맨드를 처리합니다
   */
  @boundMethod
  public processCommand(props: AppCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.SAVE:
        this.saveApp(ctx);
        break;
      // case CommandEnum.SAVE_AS:
      //   this.saveAppAs(props);
      //   break;
      case CommandEnum.ADD_SECTION:
        this.addSection(props, ctx);
        break;
      case CommandEnum.DELETE_SECTION:
        this.deleteSection(props, ctx);
        break;
      case CommandEnum.DELETE_ALL_SECTION:
        this.deleteAllSection(props, ctx);
        break;
      case CommandEnum.EXPAND_ALL_SECTION:
        this.expandAllSection(props, ctx);
        break;
      case CommandEnum.COLLAPSE_ALL_SECTION:
        this.collapseAllSection(props, ctx);
        break;
      case CommandEnum.COLLAPSE_SECTION:
        this.collapseSection(props, ctx);
        break;
      case CommandEnum.RENAME_SECTION:
        this.renameSection(props, ctx);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * section 추가 command
   */
  private addSection(props: AddSectionCommandProps, ctx: AkronContext): void {
    const appProp = props.appWidgetModel.getProperties();
    if (isUndefined(appProp.content.sectionList?.value) || appProp.content.sectionList?.value?.length === 0) {
      // 첫 구역이 추가되는 케이스
      const pageCount = props.appWidgetModel.reduceChild((curCount: number) => {
        return curCount + 1;
      }, 0);

      if (props.appWidgetModel.getFirstChild() === props.targetModel) {
        // first index 일 때, 해당 구역만 추가
        const pageSection: PageSection = {
          name: unNamedSection,
          id: WidgetRepository.generateWidgetID(),
          isExpanded: true,
          pageCount,
          isSelected: false,
        };
        const newAppProp: IWidgetCommonProperties = {
          ...appProp,
          content: {
            ...appProp.content,
            sectionList: { locked: true, value: [pageSection] },
          },
        };
        const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
        ctx.getCommand()?.append(updateWidgetCommand);
      } else {
        // first index 아닐 때, default 포함 두 구역 추가
        const targetIdx = getTargetPageIndex(props.appWidgetModel, props.targetModel);

        const pageSectionDefault: PageSection = {
          name: defaultSection,
          id: WidgetRepository.generateWidgetID(),
          isExpanded: true,
          pageCount: targetIdx,
          isSelected: false,
        };

        const pageSectionTarget: PageSection = {
          name: unNamedSection,
          id: WidgetRepository.generateWidgetID(),
          isExpanded: true,
          pageCount: pageCount - targetIdx,
          isSelected: false,
        };

        const sectionList: PageSection[] = [];
        sectionList.push(pageSectionDefault, pageSectionTarget);

        const newAppProp: IWidgetCommonProperties = {
          ...appProp,
          content: {
            ...appProp.content,
            sectionList: {
              locked: true,
              value: sectionList,
            },
          },
        };

        const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
        ctx.getCommand()?.append(updateWidgetCommand);
      }
    } else {
      // 기존 구역이 존재할 때, 구역이 추가되는 케이스

      const targetIdx = getTargetPageIndex(props.appWidgetModel, props.targetModel);
      const sectionList: PageSection[] = [];
      if (isDefined(appProp.content.sectionList?.value)) {
        appProp.content.sectionList?.value.forEach((val: PageSection) => sectionList.push({ ...val }));
      }

      let accumulateIndex = 0;
      const newSectionList: PageSection[] = [];
      sectionList?.forEach(pageSection => {
        if (accumulateIndex <= targetIdx && accumulateIndex + pageSection.pageCount > targetIdx) {
          newSectionList.push({
            ...pageSection,
            pageCount: targetIdx - accumulateIndex,
          });
          newSectionList.push({
            name: unNamedSection,
            id: WidgetRepository.generateWidgetID(),
            isExpanded: true,
            pageCount: pageSection.pageCount - (targetIdx - accumulateIndex),
            isSelected: false,
          });
        } else {
          newSectionList.push(pageSection);
        }
        accumulateIndex += pageSection.pageCount;
      });

      const newAppProp: IWidgetCommonProperties = {
        ...appProp,
        content: {
          ...appProp.content,
          sectionList: { ...appProp.content.sectionList, value: newSectionList },
        },
      };
      const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
      ctx.getCommand()?.append(updateWidgetCommand);
    }
  }

  /**
   * section delete command
   */
  private deleteAllSection(props: DeleteAllSectionCommandProps, ctx: AkronContext): void {
    const appProp = props.appWidgetModel.getProperties();

    const newAppProp = {
      ...appProp,
      content: {
        ...appProp.content,
        sectionList: { ...appProp.content.sectionList, value: undefined },
      },
    };

    const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
    ctx.getCommand()?.append(updateWidgetCommand);
  }

  /**
   * delete specific section command
   */
  private deleteSection(props: DeleteSectionCommandProps, ctx: AkronContext): void {
    const appProp = props.appWidgetModel.getProperties();
    const targetSection = props.pageSection;

    if (isDefined(appProp.content.sectionList?.value)) {
      if (appProp.content.sectionList?.value.length === 1) {
        const newAppProp = {
          ...appProp,
          content: {
            ...appProp.content,
            sectionList: { ...appProp.content.sectionList, value: undefined },
          },
        };

        const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
        ctx.getCommand()?.append(updateWidgetCommand);
        return;
      }
      const sectionList: PageSection[] = [];
      appProp.content.sectionList?.value.forEach((val: PageSection) => sectionList.push({ ...val }));

      const newSectionList: PageSection[] = [];
      sectionList?.forEach((pageSection, index) => {
        // 선택된 page가 속해 있는 Section 찾기
        if (targetSection.id === pageSection.id) {
          if (index !== 0 && newSectionList.length > 0) {
            // 이전 pageSection과 합치기
            const prevSectionList: PageSection = newSectionList.pop() as PageSection;
            newSectionList.push({
              ...prevSectionList,
              pageCount: prevSectionList.pageCount + pageSection.pageCount,
            });
          } else {
            newSectionList.push(pageSection);
          }
        } else {
          newSectionList.push(pageSection);
        }
      });
      const newAppProp: IWidgetCommonProperties = {
        ...appProp,
        content: {
          ...appProp.content,
          sectionList: { ...appProp.content.sectionList, value: newSectionList },
        },
      };
      const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
      ctx.getCommand()?.append(updateWidgetCommand);
    }
  }

  /**
   * expand all command
   */
  private expandAllSection(props: ExpandAllSectionCommandProps, ctx: AkronContext): void {
    const appProp = props.appWidgetModel.getProperties();

    const sectionList: PageSection[] = [];
    if (isDefined(appProp.content.sectionList?.value)) {
      appProp.content.sectionList?.value.forEach((val: PageSection) =>
        sectionList.push({
          ...val,
          isExpanded: true,
        })
      );
    }

    const newAppProp = {
      ...appProp,
      content: {
        ...appProp.content,
        sectionList: { ...appProp.content.sectionList, value: sectionList },
      },
    };

    const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
    ctx.getCommand()?.append(updateWidgetCommand);
    ctx.getCommand()?.setUndoable(false);
  }

  /**
   * collapse all command
   */
  private collapseAllSection(props: CollapseAllSectionCommandProps, ctx: AkronContext): void {
    const appProp = props.appWidgetModel.getProperties();

    const sectionList: PageSection[] = [];
    if (isDefined(appProp.content.sectionList?.value)) {
      appProp.content.sectionList?.value.forEach((val: PageSection) =>
        sectionList.push({
          ...val,
          isExpanded: false,
        })
      );
    }

    const newAppProp = {
      ...appProp,
      content: {
        ...appProp.content,
        sectionList: { ...appProp.content.sectionList, value: sectionList },
      },
    };

    const updateWidgetCommand = new UpdateWidgetCommand(props.appWidgetModel, newAppProp);
    ctx.getCommand()?.append(updateWidgetCommand);
    ctx.getCommand()?.setUndoable(false);
  }

  /**
   * collapse command
   */
  private collapseSection(props: CollapseSectionCommandProps, ctx: AkronContext): void {
    const appProp = ctx.getEditingWidgetModel().getProperties();
    const { isExpand } = props;
    const targetSection = props.pageSection;

    const sectionList: PageSection[] = [];
    if (isDefined(appProp.content.sectionList?.value)) {
      appProp.content.sectionList?.value.forEach((section: PageSection) => {
        if (section.id === targetSection.id) {
          sectionList.push({
            ...section,
            isExpanded: isExpand,
          });
        } else {
          sectionList.push(section);
        }
      });
    }

    const newAppProp = {
      ...appProp,
      content: {
        ...appProp.content,
        sectionList: { ...appProp.content.sectionList, value: sectionList },
      },
    };

    const updateWidgetCommand = new UpdateWidgetCommand(ctx.getNewAppModel(), newAppProp);
    ctx.getCommand()?.append(updateWidgetCommand);
    ctx.getCommand()?.setUndoable(false);
  }

  /**
   * rename 구역
   */
  private renameSection(props: RenameSectionCommandProps, ctx: AkronContext): void {
    const appProp = ctx.getNewAppModel().getProperties();

    const sectionList: PageSection[] = [];
    if (isDefined(appProp.content.sectionList?.value)) {
      appProp.content.sectionList?.value.forEach((section: PageSection) => {
        if (section.isSelected === true) {
          sectionList.push({
            ...section,
            isSelected: false,
            name: props.name,
          });
        } else {
          sectionList.push(section);
        }
      });
    }

    const newAppProp = {
      ...appProp,
      content: {
        ...appProp.content,
        sectionList: { ...appProp.content.sectionList, value: sectionList },
      },
    };

    const updateWidgetCommand = new UpdateWidgetCommand(ctx.getNewAppModel(), newAppProp);
    ctx.getCommand()?.append(updateWidgetCommand);
  }

  /**
   * Model을 기반으로 서버에 보낼 JSON을 생성하여 DB저장하는 로직을 수행
   */
  @boundMethod
  private saveApp(ctx: AkronContext): void {
    if (!(ctx.getSaveState() === SaveState.SAVE_ERROR || ctx.getSaveState() === SaveState.RESAVE_ERROR)) {
      AppRepository.sendUpdateMessage(ctx).then(result => {
        runInAction(() => {
          // eslint-disable-next-line no-empty
          if (result === 'nonUpdate') {
          } else if (result === 'updateError') {
            if (ctx.getSaveState() === SaveState.RESAVING) {
              ctx.setSaveState(SaveState.RESAVE_ERROR);
            } else {
              ctx.setSaveState(SaveState.SAVE_ERROR);
            }
          } else if (result === 'updateComplete') {
            ctx.setSaveState(SaveState.SAVE_COMPLETE);
            // ctx.lastSavedTime = new Date();
            if (ctx.getNeedSaveState()) {
              ctx.setSaveState(SaveState.SAVING);
              this.saveApp(ctx);
            }
          }
        });
      });
    }
  }

  // /**
  //  * 다른 이름으로 저장 후, 해당 앱으로 로딩하는 로직
  //  */
  // @boundMethod
  // private saveAppAs(props: SaveAsCommandProps): void {
  //   changeAppURL({
  //     appType: props.appType,
  //     appName: props.appName,
  //     appID: props.appID,
  //     userID: props.userID,
  //     modeType: props.modeType,
  //     roomID: props.roomID,
  //   });
  // }
}

export default AppCommandHandler;
