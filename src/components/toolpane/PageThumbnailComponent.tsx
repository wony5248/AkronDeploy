import PageThumbnailTitleComponent from 'components/toolpane/PageThumbnailTitleComponent';
import useContextMenuContainer from 'hooks/useContextMenuContainer';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import { useEffect, useRef, useState } from 'react';
import PageThumbnailContextMenuData from 'store/ribbon-menu/PageThumbnailContextMenuData';
import { pageThumbnail } from 'styles/toolpane/PageList';

const THUMBNAIL_WIDTH_WITH_BORDER = 146;
export const THUMBNAIL_WIDTH = THUMBNAIL_WIDTH_WITH_BORDER - 6;

/**
 * 썸네일을 렌더하는 컴포넌트 입니다. title과 썸네일 페이지로 이루어져 있습니다.
 */
interface IProps {
  pageModel: WidgetModel;
  sectionSelected: boolean;
  idx: number;
}

const PageThumbnailComponent: React.FC<IProps> = (props: IProps) => {
  const { pageModel, sectionSelected, idx } = props;

  const editorStore = useEditorStore();
  const contextMenuContainer = useContextMenuContainer();

  const [open, setOpen] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const titleRef = useRef<HTMLLabelElement>(null);

  const locked = false; // pageModel?.getComponentSpecificProperties().locked ?? false;
  const [arrowClicked, setArrowClicked] = useState<boolean>(false);

  const isSelectedThumbnailPage = true; // editorStore.isSelectedThumbnail(pageModel);

  let arrowType: string;
  if (locked && !(isSelectedThumbnailPage || isHover)) {
    arrowType = 'IC_TOOLPANE_HOLD_NORMAL';
  } else if (open) {
    arrowType = 'IC_TOOLPANE_ARROW_DOWN_NORMAL';
  } else {
    arrowType = 'IC_TOOLPANE_ARROW_UP_NORMAL';
  }

  useEffect(() => {
    if (locked && open) {
      setOpen(false);
    }
  }, [open, locked]);

  const handleClickOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!locked && e.buttons === 1) {
      setOpen(!open);
    }
  };

  const ContextMenuData = PageThumbnailContextMenuData;

  const handleSelectPageThumbnail = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    mouseDown: boolean
  ) => {
    // const commandProps: PageThumbnailSelectCommandProps = {
    //     commandID: CommandEnum.SELECT_PAGE_THUMBNAIL,
    //     targetModel: pageModel,
    //     isMouseDown: mouseDown,
    //     isAdded: e.ctrlKey,
    //     isShiftPressed: e.shiftKey,
    // };
    // editorStore.handleCommandEvent(commandProps);
    setIsMouseDown(isMouseDown);
  };

  return (
    <div
      id={pageModel.getID().toString()}
      className={'a-page-thumbnail-container'}
      onContextMenu={e => {
        contextMenuContainer.openContextMenu(e, ContextMenuData);
      }}
      onMouseUp={e => {
        // if (!arrowClicked && editorStore.getSelectionContainer()?.isMoveMode() === false && isMouseDown) {
        //     handleSelectPageThumbnail(e, false);
        // } else {
        //     setIsMouseDown(false);
        // }
      }}
      onMouseDown={e => handleSelectPageThumbnail(e, true)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div css={pageThumbnail(isSelectedThumbnailPage)}>
        <PageThumbnailTitleComponent pageModel={pageModel} idx={idx} ref={titleRef} />
        <div
          style={{ float: 'right', overflow: 'auto' }}
          // Arrow 클릭 시 select page 동작은 막지만 ReactSortable 라이브러리 동작은 수헹되어야 해서 stopPropagation()이 아닌 flag 처라
          onMouseUp={() => setArrowClicked(true)}
          onMouseDown={handleClickOpen}
        >
          {/* <ImageResourceComponent
                        className={classNames(styles.pageThumbnailArrow, {
                            [styles.hidden]: !(locked && (isSelectedThumbnailPage || isHover)),
                        })}
                        id={'IC_TOOLPANE_HOLD_NORMAL'}
                        w={'12px'}
                        h={'12px'}
                    /> */}
          <button style={{ width: '12px', height: '12px' }} />

          {/* <ImageResourceComponent
                        className={classNames(styles.pageThumbnailArrow, {
                            [styles.hidden]: !(locked || isSelectedThumbnailPage || isHover),
                        })}
                        id={arrowType}
                        w={'12px'}
                        h={'12px'}
                    /> */}
          <button style={{ width: '12px', height: '12px' }} />
        </div>
      </div>
      {/* <PageThumbnailImgComponent pageModel={pageModel} sectionSelected={sectionSelected} open={open} /> */}
    </div>
  );
};

export default observer(PageThumbnailComponent);
