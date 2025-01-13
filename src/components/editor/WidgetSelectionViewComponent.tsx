import { isDefined, isNotNull, isUndefined, WidgetEditingState, WidgetTypeEnum } from '@akron/runner';
import useEditorStore from 'hooks/useEditorStore';
import useEventListener from 'hooks/util/useEventListener';
import useWidgetSelectionViewComponentEventListner from 'hooks/widget/useWidgetSelectionViewComponentEventListner';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { InsertWidgetAtCommandProps } from 'models/store/command/handler/WidgetEditCommandHandler';
import {
  isBottomSide,
  isLeftSide,
  isRightSide,
  isTopSide,
  WidgetResizeHandle,
} from 'models/store/container/WidgetEditInfoContainer';
import { useEffect, useRef, useState } from 'react';
import {
  pageWidgetSelection,
  widgetSelectionView,
  widgetSelectionViewHandleSquare,
} from 'styles/editor/WidgetSelection';
import checkWidgetInParent from 'util/WidgetUtil';

/**
 * Selection을 render하기 위해 필요한 인자들
 */
interface Props {
  model: WidgetModel;
}

const resizeHandles: Array<WidgetResizeHandle> = [
  WidgetResizeHandle.TOP,
  WidgetResizeHandle.LEFT,
  WidgetResizeHandle.RIGHT,
  WidgetResizeHandle.BOTTOM,
  WidgetResizeHandle.LEFT_TOP,
  WidgetResizeHandle.LEFT_BOTTOM,
  WidgetResizeHandle.RIGHT_TOP,
  WidgetResizeHandle.RIGHT_BOTTOM,
];
const SELECTION_HANDLE_SIZE = 6;

/**
 * 주어진 widget에 selection overlay를 그립니다.
 */
const WidgetSelectionViewBaseComponent: React.FC<Props> = observer((props: Props) => {
  const editorStore = useEditorStore();
  const editorUIStore = editorStore.getEditorUIStore();
  const { model } = props;
  const _ = model.getRerenderSwitch(); // rerender switch 참조용
  const selectionRef = useRef<HTMLDivElement>(null);
  // re-render가 필요한 시점에 state값을 바꿔줌으로써 re-render를 시키기 위한 switch 역할
  const [reRenderSwitch, setReRenderSwitch] = useState(true);
  const [refDefined, setRefDefined] = useState(false);
  let refX = model.getRefX() ?? 0;
  let refY = model.getRefY() ?? 0;
  let refWidth = model.getRefWidth() ?? 0;
  let refHeight = model.getRefHeight() ?? 0;
  const zoomRatio = editorStore.getZoomRatio() / 100;
  const childInAkronProject = model.getParent()?.getWidgetType() !== WidgetTypeEnum.Page && !model.getSelectable();
  const pageLocked = false; // editorStore.getEditingPageModel()?.getComponentSpecificProperties().locked;

  // 최하위 widget의 경우 text 입력이 가능해야하기 때문에 textComponent 활성화를 위한 조건
  const isLowestLvlWidget = model.getFirstChild() === undefined && model.getSelectable();

  // 디바이스 정보가 변경되면 리랜더링
  // useEffect(() => {
  //   setReRenderSwitch(!reRenderSwitch);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [editorStore.getDeviceInfo()]);

  // 위젯삽입 툴페인의 트랜지션 시간 이후 re-render하여 selectionView 맞춤
  useEffect(() => {
    setTimeout(() => {
      setReRenderSwitch(!reRenderSwitch);
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorUIStore.getActiveLeftToolPaneType()]);

  // Tabs 하위인 경우 Tabs가 사이즈를 임의로 잡고 이동 및 리사이징이 불가능함.
  // 추후 이러한 컴포넌트가 있을 경우 따로 TypeNames로 관리해야 함
  const isParentTabs = model.getParent()?.getWidgetType() === 'BasicTabs';

  let parentRefX = model.getParent()?.getRefX() ?? 0;
  let parentRefY = model.getParent()?.getRefY() ?? 0;
  const parentRefWidth = model.getParent()?.getRefWidth() ?? 1;
  const parentRefHeight = model.getParent()?.getRefHeight() ?? 1;
  let x = '0px';
  let y = '0px';
  if (isUndefined(refX) || isUndefined(refY)) {
    x = model.getStyleProperties('x')?.unit === 'px' ? '0px' : '0%';
    y = model.getStyleProperties('y')?.unit === 'px' ? '0px' : '0%';
  } else if (model.getParent()?.getWidgetType() === WidgetTypeEnum.Page) {
    const pageId = model.getParent()?.getID();
    const pageDomId = `Page-${pageId}`;
    const pageDom = document.getElementById(pageDomId);
    parentRefX = pageDom?.getBoundingClientRect().x ?? 0;
    parentRefY = pageDom?.getBoundingClientRect().y ?? 0;
    x =
      model.getStyleProperties('x')?.unit === 'px'
        ? `${(refX - parentRefX) / zoomRatio}px`
        : `${((refX - parentRefX) / parentRefWidth) * 100}%`;
    y =
      model.getStyleProperties('y')?.unit === 'px'
        ? `${(refY - parentRefY) / zoomRatio}px`
        : `${((refY - parentRefY) / parentRefHeight) * 100}%`;
  } else {
    x =
      model.getStyleProperties('x')?.unit === 'px'
        ? `${(refX - parentRefX) / zoomRatio}px`
        : `${((refX - parentRefX) / parentRefWidth) * 100}%`;
    y =
      model.getStyleProperties('y')?.unit === 'px'
        ? `${(refY - parentRefY) / zoomRatio}px`
        : `${((refY - parentRefY) / parentRefHeight) * 100}%`;
  }
  let width = '1px';
  let height = '1px';
  if (isUndefined(refWidth) || isUndefined(refHeight)) {
    width = model.getStyleProperties('width')?.unit === 'px' ? '1px' : '1%';
    height = model.getStyleProperties('height')?.unit === 'px' ? '1px' : '1%';
  } else {
    width =
      model.getStyleProperties('width')?.unit === 'px' || isParentTabs
        ? `${refWidth / zoomRatio}px`
        : `${(refWidth / parentRefWidth) * 100}%`;
    height =
      model.getStyleProperties('height')?.unit === 'px' || isParentTabs
        ? `${refHeight / zoomRatio}px`
        : `${(refHeight / parentRefHeight) * 100}%`;
  }

  const editingState = model.getEditingState();
  const selected = model.getSelected();
  const resizeHandleVisibility = selected && editingState === WidgetEditingState.NONE ? 'visible' : 'hidden';

  const backgroundColor = 'transparent';
  let outline = 'none';

  if (selected && editingState === WidgetEditingState.NONE) {
    if (childInAkronProject) {
      outline = `solid 1px #205EFF`;
    } else {
      outline = `solid 1px #ff5353`;
    }
  }

  // 자식 컴포넌트로 삽입 가능하거나 속성으로 추가가 가능할 때 하이라이트
  // const isReactNodeProp = editorStore.getMetaDataContainer().getReactNodeTypePropMap().get(model.getWidgetType());

  if (
    /*isReactNodeProp && */
    model.getDragHovered() === true &&
    model.getSelected() === false
  ) {
    outline = 'solid 2px #0043f2';
  }

  // 이동 중에 겹쳐진 widget을 알기 위해 현재 widget의 mouse event 받지 않음
  const pointerEvents = model.getEditingState() === WidgetEditingState.MOVE ? 'none' : 'auto';

  const {
    handleMouseDownCapture,
    handleMouseMove,
    handleClick,
    handleDoubleClick,
    handleDrag,
    handleContextMenu,
    handleKeyDown,
    handleMouseOver,
  } = useEventListener(model);

  const {
    handleWidgetSelectionViewComponentMouseDownCapture,
    handleWidgetSelectionViewComponentMouseDownForMove,
    handleWidgetSelectionViewComponentMouseDownForResize,
    handleWidgetSelectionViewComponentMouseUp,
  } = useWidgetSelectionViewComponentEventListner(model);

  const squareHandleLen = SELECTION_HANDLE_SIZE;

  const calcHandlePosition = (handle: WidgetResizeHandle) => {
    let tx = 50;
    let ty = 50;
    const offsetX = squareHandleLen / 2;
    const offsetY = squareHandleLen / 2;

    if (isLeftSide(handle)) {
      tx = 0;
    } else if (isRightSide(handle)) {
      tx = 100;
    }

    if (isTopSide(handle)) {
      ty = 0;
    } else if (isBottomSide(handle)) {
      ty = 100;
    }

    return { left: `calc(${tx}% - ${offsetX}px)`, top: `calc(${ty}% - ${offsetY}px)` };
  };

  const calcHandleStyle = (handle: WidgetResizeHandle) => {
    // cursor: css 마우스 커서 모양 속성
    if (model.getParent()?.getWidgetType() === 'BasicTabs') {
      return { cursor: 'not-allowed' };
    }

    // e.g) 'nw-resize'
    let cursor = '';

    if (isTopSide(handle)) {
      cursor += 'n';
    } else if (isBottomSide(handle)) {
      cursor += 's';
    }

    if (isLeftSide(handle)) {
      cursor += 'w';
    } else if (isRightSide(handle)) {
      cursor += 'e';
    }

    return { cursor: `${cursor}-resize` };
  };

  // Resize용 네모 handle render
  const renderResizeHandles = () =>
    resizeHandles.map((handle, index: number) => (
      <div
        // id={`SuperUX-${getWidgetElementID(model)}-resizehandle-${handle}`}
        id={`SuperUX-${model.getWidgetCategory()}${model.getID()}-resizehandle-${handle}`}
        // computed하지 않은 값이므로 index를 key로 써도 무방함

        key={index.toString()}
        css={widgetSelectionViewHandleSquare}
        style={{
          ...calcHandleStyle(handle),
          ...calcHandlePosition(handle),
          visibility: resizeHandleVisibility,
        }}
        onMouseDownCapture={isParentTabs ? undefined : handleWidgetSelectionViewComponentMouseDownCapture}
        onMouseDown={
          isParentTabs
            ? undefined
            : e => {
                handleWidgetSelectionViewComponentMouseDownForResize?.(e, handle);
              }
        }
        data-handlestring={handle}
      />
    ));

  // child Selection들 render
  const renderChildrenSelection = () => {
    if (model.isRepeatableLayoutWidgetType()) {
      return null;
    }

    return model.mapChild(child => <WidgetSelectionViewComponent key={child.getID()} model={child} />);
  };

  const doNothing = () => {
    // do nothing
  };

  // Selection이 불필요한 영역은 렌더링하지 않습니다.
  if (
    !checkWidgetInParent(model) &&
    model.getParent()?.getWidgetType() !== WidgetTypeEnum.Page &&
    !model.getSelected()
  ) {
    return <></>;
  }

  return (
    <>
      {isDefined(model.getRefX()) && (
        <div // WidgetComponent보다 1px 더 큰 크기의 render 영역
          css={childInAkronProject ? widgetSelectionView(false) : widgetSelectionView(pageLocked)}
          style={{
            left: `calc(${x} - 1px)`,
            top: `calc(${y} - 1px)`,
            width: `calc(${width} + 2px)`,
            height: `calc(${height} + 2px)`,
            pointerEvents,
            backgroundColor,
            outline,
          }}
          tabIndex={0} // for key event
          onMouseDownCapture={childInAkronProject ? doNothing : handleMouseDownCapture}
          onMouseDown={childInAkronProject ? doNothing : handleWidgetSelectionViewComponentMouseDownForMove}
          onMouseMove={childInAkronProject ? doNothing : handleMouseMove}
          onMouseUp={childInAkronProject ? doNothing : handleWidgetSelectionViewComponentMouseUp}
          onClick={childInAkronProject ? doNothing : handleClick}
          onDoubleClick={handleDoubleClick}
          onDrag={childInAkronProject ? doNothing : handleDrag}
          onContextMenu={childInAkronProject ? doNothing : handleContextMenu}
          onKeyDown={childInAkronProject ? doNothing : handleKeyDown}
          onMouseOver={childInAkronProject ? doNothing : handleMouseOver}
          onFocus={doNothing}
          onMouseEnter={e => model.setDragHovered(true)}
          onMouseLeave={e => model.setDragHovered(false)}
        >
          {renderResizeHandles()}
          <div
            id={`widgetSelection${model.getID()}`}
            style={{
              position: 'inherit',
              // model과 사이즈 맞춤
              left: '1px',
              top: '1px',
              width: `calc(100% - 2px)`,
              height: `calc(100% - 2px)`,
            }}
            ref={selectionRef}
          >
            {(!childInAkronProject || isLowestLvlWidget) && (
              <></>
              // <WidgetTextViewComponent key={model.getID()} model={model} />
            )}
            {renderChildrenSelection()}
          </div>
        </div>
      )}
    </>
  );
});

// observer()를 component 정의에 직접 붙였으면 이렇게 해줘야 React devtools에서 이름이 뜸.
WidgetSelectionViewBaseComponent.displayName = 'WidgetSelectionViewBaseComponent';

/**
 * Page widget의 selection overlay를 그립니다.
 */
const PageWidgetSelectionViewComponent: React.FC<Props> = observer((props: Props) => {
  const editorStore = useEditorStore();
  const { model } = props;
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseDownCapture,
    handleMouseMove,
    handleClick,
    handleDoubleClick,
    handleDrag,
    handleMouseOver,
  } = useEventListener(model);
  // child Selection들 render
  const renderChildrenSelection = () => {
    return model.mapChild(child => <WidgetSelectionViewComponent key={child.getID()} model={child} />);
  };

  const doNothing = () => {
    // do nothing
  };

  return (
    <div
      // Page 하위에 그려지므로, 페이지와 같은 크기의 render 영역을 그려줌. Composite 편집시에도 동일
      id={`Page-${model.getID()}`}
      css={pageWidgetSelection}
      onMouseDownCapture={handleMouseDownCapture}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDrag={handleDrag}
      onMouseOver={handleMouseOver}
      onFocus={doNothing}
      onDrop={e => {
        e.preventDefault();
        const widgetId = e.dataTransfer.getData('widgetId');
        const widgetType = e.dataTransfer.getData('widgetType');
        if (widgetId && widgetId) {
          const pageDomId = `widget-${model.getID()}`;
          const pageDom = document.getElementById(pageDomId);
          const commandProps: InsertWidgetAtCommandProps = {
            commandID: CommandEnum.INSERT_WIDGET_AT,
            widgetType: widgetType as WidgetTypeEnum,
            widgetID: 0, // 임시. id 정책이 반영되어야함
            posX: e.clientX - (pageDom?.getBoundingClientRect().x ?? 0),
            posY: e.clientY - (pageDom?.getBoundingClientRect().y ?? 0),
          };
          editorStore.handleCommandEvent(commandProps);
        }
      }}
      onDragOver={e => {
        e.preventDefault();
      }}
    >
      {renderChildrenSelection()}
    </div>
  );
});

PageWidgetSelectionViewComponent.displayName = 'PageWidgetSelectionViewComponent';

/**
 * 주어진 widget이 selection & drag 가능한 widget일 경우에만 selection overlay를 그립니다.
 */
const WidgetSelectionViewComponent: React.FC<Props> = ({ model }: Props) => {
  // WidgetSelectionViewBaseComponent 내부에서 hook들을 사용하기 때문에 static widget인 경우에 미리 return null을 할 수가 없습니다.
  // 따라서 이러한 wrapper component를 만들고 여기서 return null을 합니다.
  const modelType = model.getWidgetType();
  const editorStore = useEditorStore();
  const isTopWidget = editorStore.getEditingWidgetModel()?.getID() === model.getID();

  if (model.getID() === 0 /* appModel */ || model.getEditingState() === WidgetEditingState.FLOATING) {
    return null;
  }
  if (modelType === WidgetTypeEnum.Page || isTopWidget) {
    return <PageWidgetSelectionViewComponent key={model.getID()} model={model} />;
  }
  return <WidgetSelectionViewBaseComponent key={model.getID()} model={model} />;
};

export default WidgetSelectionViewComponent;
