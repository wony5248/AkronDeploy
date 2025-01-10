import PageThumbnailComponent from 'components/toolpane/PageThumbnailComponent';
import useEditorStore from 'hooks/useEditorStore';
import PageModel from 'models/node/PageModel';
import WidgetModel from 'models/node/WidgetModel';
import { useEffect, useState } from 'react';

/**
 * Page를 담을 Item 입니다. 페이지 리스트를 render하기 위한 구조체입니다.
 */
export interface PageItem {
  id: number;
  content: PageModel;
  type: string;
}

/**
 * PageListComponent props.
 */
interface IProps {
  pageList: PageItem[];
}

const chosen = 'pageChosen';
const dragClass = 'dragClass';

const PageListComponent: React.FC<IProps> = ({ pageList }: IProps) => {
  const editorStore = useEditorStore();
  const [list, setList] = useState<PageItem[]>(pageList);
  useEffect(() => {
    setList(pageList);
  }, [pageList]);

  const handleDragStart = () => {
    // editorStore.setDragObject('Thumbnail');
    // const pageSelections = editorStore.getSelectedPages();
    // const lastSelectedPage = document.getElementsByClassName(chosen)[0] as HTMLDivElement;
    // editorStore.getSelectionContainer()?.setMoveMode(true);
    // const dragItem = document.querySelector<HTMLDivElement>(`.${dragClass}`);
    // if (isNotNull(dragItem)) {
    //     const pageID = dragItem.id;
    //     const pageModel = editorStore.findWidgetModelByID(Number(pageID)) as WidgetModel<IPageComponentProperties>;
    //     const thumbnailTitle = dragItem.children[0];
    //     thumbnailTitle.remove();
    //     const selectPageNum = pageSelections?.length;
    //     if (selectPageNum && pageModel) {
    //         render(
    //             <StoreProvider value={editorStore}>
    //                 <PageDragComponent selectPageNum={selectPageNum} pageModel={pageModel} />
    //             </StoreProvider>,
    //             dragItem
    //         );
    //     }
    // }
    // pageSelections?.forEach(page => {
    //     const selectedHTML = document.getElementById(getThumbnailDomID(page)) as HTMLDivElement;
    //     if (lastSelectedPage.id !== selectedHTML.id) {
    //         selectedHTML.classList.add(styles.pageChosenMulti);
    //     }
    // });
  };

  const handleDragEnd = (/*e: SortableEvent*/) => {
    // editorStore.setDragObject(undefined);
    // const selectedPages = editorStore.getSelectedPages();
    // if (selectedPages) {
    //     const thumbnailHTMLs = document.getElementsByClassName('a-page-thumbnail-container');
    //     const isSameHtmlID = (html: Element) => html.id === e.item.id;
    //     const selectedPageIndex = Array.prototype.findIndex.call(thumbnailHTMLs, isSameHtmlID);
    //     let nextPageElement: Nullable<Element>;
    //     for (let i = selectedPageIndex + 1; i < thumbnailHTMLs.length; i += 1) {
    //         if (thumbnailHTMLs.item(i)?.classList.contains(styles.pageChosenMulti) === false) {
    //             nextPageElement = thumbnailHTMLs.item(i) as Element;
    //             break;
    //         }
    //     }
    //     const nextPageModel = getPageModelByHTML(editorStore.getAppWidgetModel(), nextPageElement);
    //     const commandProps: MovePageThumbnailCommandProps = {
    //         commandID: CommandEnum.MOVE_PAGE_THUMBNAIL,
    //         afterPage: nextPageModel,
    //     };
    //     editorStore.handleCommandEvent(commandProps);
    //     // clear chosen multi
    //     Array.from(thumbnailHTMLs).forEach(html => {
    //         html.classList.remove(styles.pageChosenMulti);
    //     });
    // }
    // editorStore.getSelectionContainer()?.setMoveMode(false);
  };

  return (
    // <ReactSortable
    //     className={classNames('PageWidgetList', styles.pageWidgetList)}
    //     list={list}
    //     setList={setList}
    //     onEnd={e => {
    //         handleDragEnd(e);
    //     }}
    //     onStart={() => {
    //         handleDragStart();
    //     }}
    //     chosenClass={chosen}
    //     dragClass={dragClass}
    //     ghostClass={styles.ghostItem}
    //     forceFallback // false라면 html5 standard dnd api 사용
    //     fallbackOnBody
    //     fallbackTolerance={10}
    //     animation={150}
    //     scrollSensitivity={100}
    // >
    <>
      {list.map(item => (
        <PageThumbnailComponent key={item.id} pageModel={item.content} sectionSelected={false} idx={item.id} />
      ))}
    </>
    // </ReactSortable>
  );
};

export default PageListComponent;
