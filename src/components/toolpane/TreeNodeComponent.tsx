import { isNotNull } from '@akron/runner';
import useContextMenuContainer from 'hooks/useContextMenuContainer';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { WidgetSelectCommandProps } from 'models/store/command/handler/WidgetSelectionCommandHandler';
import { useEffect, useRef, useState } from 'react';
import ResourceContextMenuData from 'store/toolpane/TreeNodeViewerContextMenuData';
import {
  childrenArea,
  hideIconArea,
  lockIconArea,
  nameArea,
  nameButtomTop,
  nameButton,
  nameButtonArea,
  nameButtonBottom,
  nameButtonBottomInner,
  openButton,
  openIcon,
  treeNode,
} from 'styles/toolpane/TreeNode';

/**
 * localStorage 등에 node 정보를 저장할 때 쓸 key.
 */
function getNodeKey(appID: number, widgetID: WidgetID) {
  return `superux-tree-${appID}-${widgetID}`;
}

/**
 * 브라우저에 node의 상태 저장.
 * (값이 있음: 노드 펼침, 값이 없음: 노드 접음으로 간주)
 */
export function writeNodeState(appID: number, widgetID: WidgetID, isOpen: boolean) {
  if (isOpen) {
    localStorage.setItem(getNodeKey(appID, widgetID), 'open');
  } else {
    localStorage.removeItem(getNodeKey(appID, widgetID));
  }
}

/**
 * 브라우저에 저장된 node의 상태 읽기.
 * (값이 있음: 노드 펼침, 값이 없음: 노드 접음으로 간주)
 */
function readNodeState(appID: number, widgetID: WidgetID) {
  return localStorage.getItem(getNodeKey(appID, widgetID)) !== null;
}

/**
 * TreeNodeComponent props.
 */
interface IProps {
  widgetModel: WidgetModel;
  // 내부적으로 사용.
  // (최상위 node만 true, 그 자식부터는 자동으로 false가 됨.)
  isTop?: boolean;
  isPageLocked: boolean;
}

/**
 * hoverPlace Type.
 */
type HoverPlace = 'NONE' | 'TOP' | 'BOTTOM' | 'IN';

/**
 * 주어진 view(WidgetModel)부터 시작하는 view tree(WidgetModel tree)를 표시하는 component입니다.
 */
// 이 component 내부에서 이 component를 재귀적으로 불러야 하므로 observer()를 여기에 바로 붙여야 함.
const TreeNodeComponent: React.FC<IProps> = observer(({ widgetModel, isTop = true, isPageLocked }: IProps) => {
  const editorStore = useEditorStore();
  const contextMenuContainer = useContextMenuContainer();
  const editorUIStore = editorStore.getEditorUIStore();
  const widgetLayerConatiner = editorStore.getWidgetLayerContainer();
  const [isOpen, setOpen] = useState(false);
  const [hoverPlace, setHoverPlace] = useState<HoverPlace>('NONE');

  const selectedWidgets = editorStore.getSelectedWidgets();
  const isSelected = selectedWidgets.map(eachWidgetModel => eachWidgetModel.getID()).includes(widgetModel.getID());
  const isInsertable = widgetLayerConatiner.isInsertableModel(widgetModel);

  const childWidgetModels = widgetModel.mapChild(childWidgetModel => childWidgetModel);
  // const { locked, hidden } = widgetModel.getComponentSpecificProperties();
  const locked = false; // 임시
  const hidden = false; // 임시
  const isLeaf = childWidgetModels.length === 0;
  const titleRef = useRef<HTMLLabelElement>(null);
  const mouseRef = useRef<HTMLDivElement>(null);

  const appID = editorStore.getAppID();
  const widgetID = widgetModel.getID();
  const treeRerenderFlag = editorUIStore.getTreeRerenderFlag();

  useEffect(() => {
    setOpen(readNodeState(appID, widgetID));
  }, [appID, widgetID, setOpen, treeRerenderFlag]);

  useEffect(() => {
    writeNodeState(appID, widgetID, isOpen);
  }, [appID, widgetID, isOpen]);

  const handleClickOpen = () => {
    setOpen(!isOpen);
  };

  const handleClickName = (e: React.MouseEvent) => {
    if (!isPageLocked) {
      const commandProps: WidgetSelectCommandProps = {
        commandID: CommandEnum.SELECT_WIDGET,
        targetModel: widgetModel,
        isAdded: e.ctrlKey || e.shiftKey,
      };
      editorStore.handleCommandEvent(commandProps);
    }
  };

  /**
   * Drag가 시작될 때, TargetModel(레이어를 이동할 모델), DepModel(TargetModel의 부모)를 설정하고,
   * 마우스 커서 스타일을 grabbing으로 변환합니다.
   */
  const handleDragStart = (e: React.MouseEvent) => {
    handleClickName(e);
    // if (!isWidgetsDeletable([widgetModel])) {
    //     return;
    // }
    if (widgetModel.getWidgetType() === 'BasicIcon') {
      widgetLayerConatiner.setTargetModel(widgetModel);
      widgetLayerConatiner.setDepModel(widgetModel.getParent());
      if (mouseRef.current) {
        mouseRef.current.style.cursor = 'grabbing';
      }
    }
  };

  /**
   * Drag 상태에서 다른 컴포넌트의 Tree Node 진입시, destModel(이동될 위치의 부모 모델), destNextModel(이동될 위치의 다음 모델)을 설정하고
   * 마우스 커서를 들어갈 수 있는지 없는지에 따라 판별하고 변환합니다.
   */
  const handleDragOver = (newDestModel?: WidgetModel, newDestNextModel?: WidgetModel) => {
    if (widgetLayerConatiner.getIsDragging()) {
      widgetLayerConatiner.setDestModel(newDestModel);
      widgetLayerConatiner.setDestNextModel(newDestNextModel);
      if (mouseRef.current) {
        if (widgetLayerConatiner.isInsertableSituation(isInsertable)) {
          mouseRef.current.style.cursor = 'copy';
        } else {
          mouseRef.current.style.cursor = 'no-drop';
        }
      }
    } else {
      if (mouseRef.current) {
        mouseRef.current.style.cursor = 'auto';
      }
    }
  };

  /**
   * Drag 상태가 끝날 때, 해당 위치에 들어갈 수 있는지를 판별하고, 커서를 auto로 변환합니다.
   * 가능한 경우 이동 커맨드를 실행합니다.
   */
  const handleDragEnd = () => {
    if (!widgetLayerConatiner.getIsDragging()) {
      return;
    }
    setHoverPlace('NONE');

    if (widgetLayerConatiner.isInsertableSituation(isInsertable)) {
      widgetLayerConatiner.execute(editorStore);
    }
    widgetLayerConatiner.clear();

    if (mouseRef.current) {
      mouseRef.current.style.cursor = 'auto';
    }
  };

  /**
   * eslint에서 onMouseOver 이벤트는 onFocus와 병행해서 사용하는 것을 권장하고 있습니다.
   * 하지만, input 태그가 아닌 div 태그는 일반적으로 onFocus 이벤트가 발생하지 않아 필요가 없어 아래와 같이 처리했습니다.
   */
  const handleOnFocus = () => {
    // do nothing
  };

  const widgetNameColor = () => {
    if (hidden) {
      return '#B9BFCD';
    }
    if (!widgetLayerConatiner.getIsDragging()) {
      return 'black';
    }
    if (isInsertable) {
      return 'black';
    }
    return 'gray';
  };

  const renderChildWidgetModels = () => {
    // if (checkConditionalLayout(widgetModel)) {
    //     const renderedChildIndex = widgetModel.getProperties().content.flag.value ? 0 : 1;
    //     return (
    //         <TreeNodeComponent
    //             key={childWidgetModels[renderedChildIndex].getID()}
    //             widgetModel={childWidgetModels[renderedChildIndex]}
    //             isTop={false}
    //             isPageLocked={isPageLocked}
    //         />
    //     );
    // }
    return childWidgetModels.map(childWidgetModel => (
      <TreeNodeComponent
        key={childWidgetModel.getID()}
        widgetModel={childWidgetModel}
        isTop={false}
        isPageLocked={isPageLocked}
      />
    ));
  };

  useEffect(() => {
    if (isNotNull(titleRef.current)) {
      (titleRef.current as HTMLLabelElement).focus();
      const range = document.createRange();
      range.selectNodeContents(titleRef.current as HTMLLabelElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [titleRef.current?.contentEditable]);

  return (
    <div
      id={'treeNode'}
      css={[nameArea({ isTop, isLeaf: false, isSelected: false }), treeNode]}
      ref={mouseRef}
      onContextMenu={e => {
        handleClickName(e);
        if (!isPageLocked) {
          contextMenuContainer.openContextMenu(e, ResourceContextMenuData);
        }
      }}
    >
      <div css={nameArea({ isTop, isLeaf, isSelected })} onMouseDown={handleDragStart} onMouseUp={handleDragEnd}>
        <div css={openButton} onClick={handleClickOpen}>
          {!isLeaf && (
            // <ImageResourceComponent
            //     css={openIcon}
            //     id={isOpen ? 'IC_TOOLPANE_TOGGLE_ON' : 'IC_TOOLPANE_TOGGLE_OFF'}
            //     w={'16px'}
            //     h={'16px'}
            // />
            <button css={hideIconArea} style={{ width: '16px', height: '16px' }} id="IC_TOOLPANE_HIDE_DISABLED" />
          )}
        </div>
        <div css={nameButtonArea}>
          <div
            onMouseEnter={() => {
              if (widgetLayerConatiner.getIsDragging()) {
                setHoverPlace('TOP');
              }
            }}
            onFocus={handleOnFocus}
            onMouseOver={() => handleDragOver(widgetModel.getParent(), widgetModel.getNextSibling())}
            onMouseLeave={() => setHoverPlace('NONE')}
            css={nameButtomTop}
          />
          <span
            css={nameButton}
            onFocus={handleOnFocus}
            onMouseEnter={() => {
              if (widgetLayerConatiner.getIsDragging()) {
                setHoverPlace('IN');
              }
            }}
            onMouseLeave={() => setHoverPlace('NONE')}
            onMouseOver={() => handleDragOver(widgetModel, widgetModel.getFirstChild())}
            style={{
              color: widgetNameColor(),
            }}
          >
            <div style={{ flex: 1 }}>{widgetModel.getName()}</div>

            {locked && (
              // <ImageResourceComponent
              //     id={hidden ? 'IC_TOOLPANE_HOLD_DISABLED' : 'IC_TOOLPANE_HOLD_NORMAL'}
              //     css={lockIconArea}
              //     w={'12px'}
              //     h={'12px'}
              // />
              <button css={hideIconArea} style={{ width: '12px', height: '12px' }} id="IC_TOOLPANE_HIDE_DISABLED" />
            )}

            {hidden && (
              // <ImageResourceComponent
              //     id={'IC_TOOLPANE_HIDE_DISABLED'}
              //     css={hideIconArea}
              //     w={'12px'}
              //     h={'12px'}
              // />
              <button css={hideIconArea} style={{ width: '12px', height: '12px' }} id="IC_TOOLPANE_HIDE_DISABLED" />
            )}
          </span>
          <div
            onMouseEnter={() => {
              if (widgetLayerConatiner.getIsDragging()) {
                setHoverPlace('BOTTOM');
              }
            }}
            onFocus={handleOnFocus}
            onMouseOver={() => handleDragOver(widgetModel.getParent(), widgetModel)}
            onMouseLeave={() => setHoverPlace('NONE')}
            css={nameButtonBottom}
          >
            <div
              onMouseEnter={() => {
                if (widgetLayerConatiner.getIsDragging()) {
                  setHoverPlace('BOTTOM');
                }
              }}
              onFocus={handleOnFocus}
              onMouseOver={() => handleDragOver(widgetModel.getParent(), widgetModel)}
              onMouseLeave={() => setHoverPlace('NONE')}
              css={nameButtonBottomInner}
            />
          </div>
        </div>
      </div>
      <div css={childrenArea}>{isOpen && renderChildWidgetModels()}</div>
    </div>
  );
});

// observer()를 component 정의에 직접 붙였으면 이렇게 해줘야 React devtools에서 이름이 뜸.
TreeNodeComponent.displayName = 'TreeNodeComponent';

export default TreeNodeComponent;
