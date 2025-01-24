import { Nullable, isDefined, IWidgetCommonProperties } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import MoveWidgetCommand from 'models/store/command/widget/MoveWidgetCommand';
import WidgetCommandProps from 'models/store/command/widget/WidgetCommandProps';
import AkronContext from 'models/store/context/AkronContext';

/**
 * 페이지 순서 이동 관련 command props
 */
export type MovePageThumbnailCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.MOVE_PAGE_THUMBNAIL;
  // afterPage가 없는 경우 마지막으로 이동
  afterPage: Nullable<WidgetModel<IWidgetCommonProperties>>;
};

/**
 * 페이지 순서 이동 관련 전반적인 command를 수행할 때 필요한 Props
 */
type PageListCommandProps = MovePageThumbnailCommandProps;

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
          ctx.getAppModel(),
          ctx.getAppModel(),
          props.afterPage
        );
        ctx.getCommand()?.append(moveWidgetCommand);
      });
    }
  }
}

export default PageListSortCommandHandler;
