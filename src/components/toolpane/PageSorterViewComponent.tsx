import PageListComponent, { PageItem } from 'components/toolpane/PageListComponent';
import ToolPaneTitleComponent from 'components/toolpane/ToolPaneTitleComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import * as React from 'react';
import { ForwardedRef } from 'react';
import { pageSorterViewComponent } from 'styles/toolpane/LeftToolpane';

/**
 * Page list를 화면에 표시하기 위한 component.
 */
const PageSorterViewComponent = React.forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
  const editorStore = useEditorStore();
  const appModel = editorStore.getAppModel();
  // const widgetModel = editorStore.getEditingWidgetModel();
  // const prop = widgetModel.getProperties().content;

  // let sectionList: PageSection[] | undefined;
  // if (isDefined(prop.sectionList?.value)) {
  //     sectionList = [];
  //     prop.sectionList?.value.forEach((val: PageSection) => (sectionList as PageSection[]).push({ ...val }));
  // }

  // const pageArray = getPageList(widgetModel);
  // let sorterViewRender;
  // if (isDefined(sectionList) && sectionList.length > 0) {
  //     const sectionItemList: SectionItem[] = [];
  //     let sectionIdx = 0;
  //     sectionList.forEach((section, index) => {
  //         sectionItemList.push({
  //             id: index + 1,
  //             content: section,
  //             type: 'section',
  //             children: [],
  //         });
  //         for (let i = 0; i < section.pageCount; i += 1) {
  //             sectionItemList[index].children.push({
  //                 id: sectionIdx + i,
  //                 content: pageArray[sectionIdx + i],
  //                 type: 'page',
  //             });
  //         }
  //         sectionIdx += section.pageCount;
  //     });
  //     sorterViewRender = <SectionListComponent sectionList={sectionItemList} />;
  // } else {
  //     const pageItemList: PageItem[] = widgetModel.mapChild((page, index) => {
  //         return {
  //             id: index,
  //             content: page as WidgetModel<IPageComponentProperties>,
  //             type: 'page',
  //         };
  //     });
  //     sorterViewRender = <PageListComponent pageList={pageItemList} />;
  // }
  const pageItemList: PageItem[] = [];
  appModel?.mapChild(child => {
    const pageItem: PageItem = {
      id: child.getID(),
      content: child as WidgetModel,
      type: 'page',
    };
    pageItemList.push(pageItem);
  });
  let sorterViewRender = <PageListComponent pageList={pageItemList} />;

  return (
    <div css={pageSorterViewComponent} ref={ref}>
      <ToolPaneTitleComponent
        isLeftToolPane
        titleID={'페이지'}
        isDraggable={false}
        showPopupButton={false}
        showCloseButton={false}
        showPlusButton
        plusButtonLogicType="AddPage"
      />
      {sorterViewRender}
      {/* <PageSorterViewHotKeyWrapper>{sorterViewRender}</PageSorterViewHotKeyWrapper> */}
    </div>
  );
});

export default observer(PageSorterViewComponent);
