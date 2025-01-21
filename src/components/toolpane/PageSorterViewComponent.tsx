import PageListComponent, { PageItem } from 'components/toolpane/PageListComponent';
import ToolPaneTitleComponent from 'components/toolpane/ToolPaneTitleComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import PageModel from 'models/node/PageModel';
import * as React from 'react';
import { ForwardedRef } from 'react';
import { pageSorterViewComponent } from 'styles/toolpane/LeftToolpane';

/**
 * Page list를 화면에 표시하기 위한 component.
 */
const PageSorterViewComponent = React.forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
  const editorStore = useEditorStore();
  const appModel = editorStore.getAppModel();

  const pageItemList: PageItem[] = [];
  appModel?.mapChild(child => {
    const pageItem: PageItem = {
      id: child.getID(),
      content: child as PageModel,
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
    </div>
  );
});

export default observer(PageSorterViewComponent);
