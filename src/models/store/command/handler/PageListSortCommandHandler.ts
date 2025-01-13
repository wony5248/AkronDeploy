import { Nullable, isDefined, IWidgetCommonProperties } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { SectionItem } from 'components/toolpane/PageListComponent';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import MoveWidgetCommand from 'models/store/command/widget/MoveWidgetCommand';
import UpdateWidgetCommand from 'models/store/command/widget/UpdateWidgetCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { getPageList, getSectionIdxByPageIdx } from 'util/PageUtil';

/**
 * 페이지 순서 이동 관련 command props
 */
export type MovePageThumbnailCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.MOVE_PAGE_THUMBNAIL;
  // afterPage가 없는 경우 마지막으로 이동
  afterPage: Nullable<WidgetModel<IWidgetCommonProperties>>;
};

/**
 * 구역이 있을 때, 페이지 순서 이동 관련 command props
 */
export type SectionMovePageThumbnailCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.MOVE_PAGE_THUMBNAIL_IN_SECTION;
  // afterPage가 없는 경우 마지막으로 이동
  afterPage: Nullable<WidgetModel<IWidgetCommonProperties>>;
  targetSectionIdx?: number;
};

/**
 * 구역을 이동시킬 때, 순서 이동 관련 command props
 */
export type SectionMoveCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.MOVE_SECTION;
  // afterPage가 없는 경우 마지막으로 이동
  afterSectionIdx: Nullable<number>;
  sectionInfo: SectionItem[];

  // targetSectionIdx?: number;
};

/**
 * 페이지 순서 이동 관련 전반적인 command를 수행할 때 필요한 Props
 */
type PageListCommandProps =
  | MovePageThumbnailCommandProps
  | SectionMovePageThumbnailCommandProps
  | SectionMoveCommandProps;

/**
 * Page Sorter View의 순서 변경을 처리하는 핸들러
 */
class PageListSortCommandHandler extends CommandHandler {
  /**
   * processCommand
   */
  public processCommand(props: PageListCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.MOVE_PAGE_THUMBNAIL:
        this.movePage(ctx, props);
        break;
      case CommandEnum.MOVE_PAGE_THUMBNAIL_IN_SECTION:
        this.movePageInSection(ctx, props);
        break;
      case CommandEnum.MOVE_SECTION:
        this.moveSection(ctx, props);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * 단일 혹은 다중 페이지를 특정 위치로 이동시키는 기능입니다.
   */
  @boundMethod
  private movePage(ctx: AkronContext, props: MovePageThumbnailCommandProps) {
    const pageList = ctx.getSelectionContainer()?.getSelectedPages();
    if (isDefined(pageList)) {
      pageList.forEach(pageModel => {
        const moveWidgetCommand = new MoveWidgetCommand(
          pageModel,
          ctx.getNewAppModel(),
          ctx.getNewAppModel(),
          props.afterPage
        );
        ctx.getCommand()?.append(moveWidgetCommand);
      });
    }
  }

  /**
   * 구역이 존재할 때, 단일 혹은 다중 페이지를 특정 위치로 이동시키는 기능입니다.
   */
  private movePageInSection(ctx: AkronContext, props: SectionMovePageThumbnailCommandProps) {
    const movePageThumbnailCommandProps: MovePageThumbnailCommandProps = {
      commandID: CommandEnum.MOVE_PAGE_THUMBNAIL,
      afterPage: props.afterPage,
    };
    this.movePage(ctx, movePageThumbnailCommandProps);

    if (isDefined(props.targetSectionIdx)) {
      // section update
      const pageArr: WidgetModel<IWidgetCommonProperties>[] = getPageList(ctx.getNewAppModel());
      const selectedPageArr = ctx.getSelectionContainer()?.getSelectedPages();
      const sectionPageCountArr = ctx
        .getNewAppModel()
        .getProperties()
        .content.sectionList?.value?.map((section: PageSection) => {
          return section.pageCount;
        });

      const sectionCounter = Array(sectionPageCountArr?.length).fill(0);
      pageArr.forEach((pageModel, idx) => {
        if (
          selectedPageArr?.some(selectModel => {
            return pageModel.getID() === selectModel.getID();
          })
        ) {
          const sectionIdx = getSectionIdxByPageIdx(sectionPageCountArr, idx);
          sectionCounter[sectionIdx] += 1;
        }
      });

      if (selectedPageArr) {
        sectionCounter[props.targetSectionIdx] -= selectedPageArr?.length;
      }

      const appProp = ctx.getNewAppModel().getProperties();
      let sectionList: PageSection[];
      if (isDefined(appProp.content.sectionList)) {
        sectionList = [];
        appProp.content.sectionList?.value.forEach((section: PageSection, idx: number) => {
          sectionList.push({
            ...section,
            pageCount: section.pageCount - sectionCounter[idx],
          });
        });

        const newAppProp: IWidgetCommonProperties = {
          ...appProp,
          content: {
            ...appProp.content,
            sectionList: { ...appProp.content.sectionList, value: sectionList },
          },
        };
        const updateWidgetCommand = new UpdateWidgetCommand(ctx.getNewAppModel(), newAppProp);
        ctx.getCommand()?.append(updateWidgetCommand);
      }
    }
  }

  /**
   * 구역을 이동시키는 기능입니다.
   */
  private moveSection(ctx: AkronContext, props: SectionMoveCommandProps) {
    const pageList = getPageList(ctx.getNewAppModel());
    const appProp = ctx.getNewAppModel().getProperties();

    const selectedSection = ctx.getSelectionContainer()?.getSelectedSection();
    const selectedSectionId = selectedSection?.getSectionInfo().id;
    const isSameSecitionID = (sectionItem: SectionItem) => selectedSectionId === sectionItem.id;
    const prevSectionIdx = Array.prototype.findIndex.call(appProp.content.sectionList.value, isSameSecitionID);
    const movePageList: Nullable<WidgetModel<IWidgetCommonProperties>[]> = [];

    let accumPageIdx = 0;
    appProp.content.sectionList?.value?.forEach((section: PageSection, index: number) => {
      if (index === prevSectionIdx) {
        for (let tempPageIdx = accumPageIdx; tempPageIdx < accumPageIdx + section.pageCount; tempPageIdx++) {
          movePageList.push(pageList[tempPageIdx]);
        }
      }
      accumPageIdx += section.pageCount;
    });

    let finalPageModel: Nullable<WidgetModel<IWidgetCommonProperties>>;

    if (isDefined(props.afterSectionIdx) && props.afterSectionIdx !== -1) {
      for (let i = props.afterSectionIdx; i < props.sectionInfo.length; i++) {
        if (props.sectionInfo[i].children.length !== 0) {
          finalPageModel = props.sectionInfo[i].children[0].content;
          break;
        }
      }
    }

    if (isDefined(movePageList)) {
      movePageList.forEach(pageModel => {
        const moveWidgetCommand = new MoveWidgetCommand(
          pageModel,
          ctx.getNewAppModel(),
          ctx.getNewAppModel(),
          finalPageModel
        );
        ctx.getCommand()?.append(moveWidgetCommand);
      });
    }

    if (isDefined(appProp.content.sectionList)) {
      const newSectionList: PageSection[] = [];
      appProp.content.sectionList?.value.forEach((section: PageSection, idx: number) => {
        newSectionList.push({
          ...section,
        });
      });

      if (isDefined(props.afterSectionIdx)) {
        const swapIndex = props.afterSectionIdx === -1 ? newSectionList.length - 1 : props.afterSectionIdx - 1;
        [newSectionList[prevSectionIdx], newSectionList[swapIndex]] = [
          newSectionList[swapIndex],
          newSectionList[prevSectionIdx],
        ];
      }

      const newAppProp: IWidgetCommonProperties = {
        ...appProp,
        content: {
          ...appProp.content,
          sectionList: { ...appProp.content.sectionList, value: newSectionList },
        },
      };
      const updateWidgetCommand = new UpdateWidgetCommand(ctx.getNewAppModel(), newAppProp);
      ctx.getCommand()?.append(updateWidgetCommand);
    }
  }
}

export default PageListSortCommandHandler;
