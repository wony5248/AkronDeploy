import LeftToolPaneContentComponent from 'components/toolpane/LeftToolpaneContentComponent';
import ToolPaneTitleComponent from 'components/toolpane/ToolPaneTitleComponent';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetLayerContainer, { WidgetLayerContainerProvider } from 'models/widget/WidgetLayerContainer';
import * as React from 'react';
import { ForwardedRef, useState } from 'react';
import { reverseViewer } from 'styles/toolpane/LeftToolpane';

/**
 * View tree 기능을 제공하는 툴페인.
 */
const TreeToolPaneComponent = React.forwardRef((_, ref: ForwardedRef<HTMLDivElement>) => {
  const editorStroe = useEditorStore();
  // const topWidgetModels = editorStroe.getEditingPageModel();
  // const isPageLocked = topWidgetModels?.getComponentSpecificProperties().locked ?? false;
  const [store, setStore] = useState<WidgetLayerContainer>(() => new WidgetLayerContainer());

  return (
    <div id="TreeToolPaneComponent" ref={ref} style={{ height: 'calc(50% - 5px)' }}>
      <ToolPaneTitleComponent
        isLeftToolPane
        titleID={'디자인 요소'}
        isDraggable={false}
        showPopupButton={false}
        showCloseButton={false}
        showPlusButton
        plusButtonLogicType={'InsertComponent'}
      />
      <LeftToolPaneContentComponent>
        <WidgetLayerContainerProvider value={store}>
          <div css={reverseViewer} /*onMouseLeave={() => store.setTargetModel(undefined)}*/>
            {/* {topWidgetModels?.mapChild(
                            widgetModel =>
                                widgetModel.getProperties().editingState !== WidgetEditingState.FLOATING && (
                                    <TreeNodeComponent
                                        key={widgetModel.getID()}
                                        widgetModel={widgetModel}
                                        isPageLocked={isPageLocked}
                                    />
                                )
                        )} */}
          </div>
        </WidgetLayerContainerProvider>
      </LeftToolPaneContentComponent>
    </div>
  );
});

export default observer(TreeToolPaneComponent);
