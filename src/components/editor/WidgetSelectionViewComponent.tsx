import { isDefined, isNotNull, isUndefined } from '@akron/runner';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetModel from 'models/node/WidgetModel';
import { WidgetEditingState } from 'models/store/command/widget/WidgetModelTypes';
import {
  isBottomSide,
  isLeftSide,
  isRightSide,
  isTopSide,
  WidgetResizeHandle,
} from 'models/store/container/WidgetEditInfoContainer';
import { useEffect, useRef, useState } from 'react';
import {
  widgetSelectionOverlay,
  widgetSelectionView,
  widgetSelectionViewHandleSquare,
} from 'styles/editor/WidgetSelection';

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
  const childInAkronProject =
    model.getParent()?.getWidgetType() !== 'Page' &&
    model.getParent()?.getWidgetType() !== 'BusinessDialog' &&
    !model.getSelectable();
  const pageLocked = editorStore.getEditingPageModel()?.getComponentSpecificProperties().locked;

  // 최하위 widget의 경우 text 입력이 가능해야하기 때문에 textComponent 활성화를 위한 조건
  const isLowestLvlWidget = model.getFirstChild() === undefined && model.getSelectable();
  // Container 삽입 직후 model의 ref가 undefined이라서 re-render 시키고 min-width 체크함
  useEffect(() => {
    if (model.getParent()?.getWidgetCategory() === 'Layout') {
      setRefDefined(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 아래 useEffect는 mount 직후 setRefDefined()에 의해 한번만 수행됨
  useEffect(() => {
    if (model.getParent()?.getWidgetCategory() === 'Layout') {
      if (
        isNotNull(selectionRef.current) &&
        isDefined(refWidth) &&
        isDefined(refHeight) &&
        ((selectionRef.current as HTMLDivElement).clientWidth < Number(refWidth) ||
          (selectionRef.current as HTMLDivElement).clientHeight < Number(refHeight))
      ) {
        setReRenderSwitch(!reRenderSwitch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refDefined]);

  // 디바이스 정보가 변경되면 리랜더링
  // useEffect(() => {
  //     setReRenderSwitch(!reRenderSwitch);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [editorStore.getDeviceInfo()]);

  useEffect(() => {
    // refWidth 변수 재할당은 null체크를 위한 것으로 re-render에 관여하지 않으므로 state로 관리할 필요 없음.
    /* eslint-disable react-hooks/exhaustive-deps */
    refX = model.getRefX() ?? 0;
    refY = model.getRefY() ?? 0;
    refWidth = model.getRefWidth() ?? 0;
    refHeight = model.getRefHeight() ?? 0;
    const selectionX = selectionRef.current?.getBoundingClientRect().x ?? 0;
    const selectionY = selectionRef.current?.getBoundingClientRect().y ?? 0;
    /* eslint-enable */
    // model과 selection의 위치가 다른 경우 rerender
    if (
      (isNotNull(selectionRef.current) &&
        isDefined(refWidth) &&
        isDefined(refHeight) &&
        (Math.abs(refWidth - (selectionRef.current as HTMLDivElement).getBoundingClientRect().width) > 1 ||
          Math.abs(refHeight - (selectionRef.current as HTMLDivElement).getBoundingClientRect().height) > 1)) ||
      (isDefined(refX) &&
        isDefined(refY) &&
        isDefined(selectionX) &&
        isDefined(selectionY) &&
        (Math.abs(refX - selectionX) > 0.1 || Math.abs(refY - selectionY) > 0.1))
    ) {
      setReRenderSwitch(!reRenderSwitch);
    }
  });

  const isParentLayoutFrame = model.getParent()?.getWidgetCategory() === 'Layout';
  // Tabs 하위인 경우 Tabs가 사이즈를 임의로 잡고 이동 및 리사이징이 불가능함.
  // 추후 이러한 컴포넌트가 있을 경우 따로 TypeNames로 관리해야 함
  const isParentTabs = model.getParent()?.getWidgetType() === 'BasicTabs';

  const parentRefX = model.getParent()?.getRefX() ?? 0;
  const parentRefY = model.getParent()?.getRefY() ?? 0;
  const parentRefWidth = model.getParent()?.getRefWidth() ?? 1;
  const parentRefHeight = model.getParent()?.getRefHeight() ?? 1;
  let x = '0px';
  let y = '0px';
  if (isUndefined(refX) || isUndefined(refY)) {
    x = model.getStyleProperties('x')?.unit === 'px' ? '0px' : '0%';
    y = model.getStyleProperties('y')?.unit === 'px' ? '0px' : '0%';
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

  const { editingState, selected } = model.getProperties();
  const resizeHandleVisibility = selected && editingState === WidgetEditingState.NONE ? 'visible' : 'hidden';

  const backgroundColor = 'transparent';
  let outline = 'none';

  if (selected && editingState === WidgetEditingState.NONE) {
    if (model.getWidgetCategory() !== 'Layout' || childInAkronProject) {
      outline = `solid 1px #205EFF`;
    } else {
      outline = `solid 1px #ff5353`;
    }
  }

  // 자식 컴포넌트로 삽입 가능하거나 속성으로 추가가 가능할 때 하이라이트
  const isChildableWidgetOrLayout =
    basicChildableWidgetTypeNamesSet.has(model.getWidgetType()) || model.getWidgetCategory() === 'Layout';
  const isReactNodeProp = editorStore.getMetaDataContainer().getReactNodeTypePropMap().get(model.getWidgetType());
  const isInnerPageLayout = model.getWidgetType() === 'InnerPageLayout';

  if (
    (isChildableWidgetOrLayout || isReactNodeProp) &&
    !isInnerPageLayout &&
    model.getProperties().dragHovered === true
  ) {
    outline = 'solid 2px #0043f2';
  }

  // 이동 중에 겹쳐진 widget을 알기 위해 현재 widget의 mouse event 받지 않음
  const pointerEvents = model.getProperties().editingState === WidgetEditingState.MOVE ? 'none' : 'auto';

  // const {
  //     handleMouseDownCapture,
  //     handleMouseMove,
  //     handleClick,
  //     handleDoubleClick,
  //     handleDrag,
  //     handleContextMenu,
  //     handleKeyDown,
  //     handleMouseOver,
  // } = useEventListener(model);

  // const {
  //     handleWidgetSelectionViewComponentMouseDownCapture,
  //     handleWidgetSelectionViewComponentMouseDownForMove,
  //     handleWidgetSelectionViewComponentMouseDownForResize,
  //     handleWidgetSelectionViewComponentMouseUp,
  // } = useWidgetSelectionViewComponentEventListner(model);

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
    if (model.getParent()?.getWidgetCategory() === 'Layout' || model.getParent()?.getWidgetType() === 'BasicTabs') {
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
        // eslint-disable-next-line react/no-array-index-key
        key={index.toString()}
        css={widgetSelectionViewHandleSquare}
        style={{
          ...calcHandleStyle(handle),
          ...calcHandlePosition(handle),
          visibility: resizeHandleVisibility,
        }}
        // onMouseDownCapture={
        //     isParentLayoutFrame || isParentTabs ? undefined : handleWidgetSelectionViewComponentMouseDownCapture
        // }
        // onMouseDown={
        //     isParentLayoutFrame || isParentTabs
        //         ? undefined
        //         : e => {
        //               handleWidgetSelectionViewComponentMouseDownForResize?.(e, handle);
        //           }
        // }
        data-handlestring={handle}
      />
    ));

  // child Selection들 render
  const renderChildrenSelection = () => {
    // ESLint가 mutually recursive한 함수들(a()가 b()를 호출, b()가 a()를 호출)을 제대로 처리 못함 -> 이 줄 한해서 off.
    // ConditionalLayout은 현재 렌더링하는 FragmentLayout 하위 widget의 selection view만 렌더링
    if (checkConditionalLayout(model)) {
      const childWidgetModels = model.mapChild(childWidgetModel => childWidgetModel);
      const renderedChildIndex = model.getProperties().content.flag.value ? 0 : 1;

      return childWidgetModels[renderedChildIndex]?.mapChild(grandChild => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <WidgetSelectionViewBaseComponent key={grandChild.getID()} model={grandChild} />
      ));
    }
    if (model.isRepeatableLayoutWidgetType()) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return model.mapChild(child => <WidgetSelectionViewComponent key={child.getID()} model={child} />);
  };

  const doNothing = () => {
    // do nothing
  };

  // Selection이 불필요한 영역은 렌더링하지 않습니다.
  if (
    !checkWidgetInParent(model) &&
    !checkBusinessOrPageDialogModel(model.getParent()) &&
    !model.getProperties().selected
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
          // onMouseDownCapture={childInAkronProject ? doNothing : handleMouseDownCapture}
          // onMouseDown={childInAkronProject ? doNothing : handleWidgetSelectionViewComponentMouseDownForMove}
          // onMouseMove={childInAkronProject ? doNothing : handleMouseMove}
          // onMouseUp={childInAkronProject ? doNothing : handleWidgetSelectionViewComponentMouseUp}
          // onClick={childInAkronProject ? doNothing : handleClick}
          // onDoubleClick={handleDoubleClick}
          // onDrag={childInAkronProject ? doNothing : handleDrag}
          // onContextMenu={childInAkronProject ? doNothing : handleContextMenu}
          // onKeyDown={childInAkronProject ? doNothing : handleKeyDown}
          // onMouseOver={childInAkronProject ? doNothing : handleMouseOver}
          onFocus={doNothing}
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
            {/* UX에서는 1 depth selection만 렌더링함 */}
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
  const { model } = props;

  // const {
  //     handleMouseDown,
  //     handleMouseUp,
  //     handleMouseDownCapture,
  //     handleMouseMove,
  //     handleClick,
  //     handleDoubleClick,
  //     handleDrag,
  //     handleMouseOver,
  // } = useEventListener(model);
  // child Selection들 render
  const renderChildrenSelection = () => {
    // ESLint가 mutually recursive한 함수들(a()가 b()를 호출, b()가 a()를 호출)을 제대로 처리 못함 -> 이 줄 한해서 off.
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return model.mapChild(child => <WidgetSelectionViewComponent key={child.getID()} model={child} />);
  };

  const doNothing = () => {
    // do nothing
  };

  return (
    <div
      // Page 하위에 그려지므로, 페이지와 같은 크기의 render 영역을 그려줌. Composite 편집시에도 동일
      css={widgetSelectionOverlay}
      // onMouseDownCapture={handleMouseDownCapture}
      // onMouseDown={handleMouseDown}
      // onMouseUp={handleMouseUp}
      // onMouseMove={handleMouseMove}
      // onClick={handleClick}
      // onDoubleClick={handleDoubleClick}
      // onDrag={handleDrag}
      // onMouseOver={handleMouseOver}
      onFocus={doNothing}
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

  if (modelType === 'App' || model.getProperties().editingState === WidgetEditingState.FLOATING) {
    return null;
  }
  if (modelType === 'Page' || (modelType === 'BusinessDialog' && isTopWidget)) {
    return <PageWidgetSelectionViewComponent key={model.getID()} model={model} />;
  }
  return <WidgetSelectionViewBaseComponent key={model.getID()} model={model} />;
};

export default WidgetSelectionViewComponent;
