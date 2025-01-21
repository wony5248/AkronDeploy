import { isDefined, dWarn, dLog, MouseEvent, WidgetEditingState } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import WidgetEditInfoContainer, {
  WidgetResizeHandle,
  WidgetPosition,
  isLeftSide,
  isRightSide,
  isTopSide,
  isBottomSide,
} from 'models/store/container/WidgetEditInfoContainer';
import AkronContext from 'models/store/context/AkronContext';
import EventState from 'models/store/event/EventState';
import { isEditAppMode, isEditWidgetMode } from 'util/AppModeUtil';

/**
 * WidgetModel의 편집 관련 context를 초기화하는 함수입니다.
 */
export function clearWidgetModelEditContext(ctx: AkronContext): void {
  const selectionContainer = ctx.getSelectionContainer();
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  const hitContainer = ctx.getHitContainer();

  if (ctx.getEventState() === EventState.EDIT) {
    return;
  }

  hitContainer.setStartHitItem(undefined);
  ctx.setEventState(EventState.EDIT);

  widgetEditInfoContainer.clear();

  selectionContainer?.getFloatingWidgetModels().forEach(floatingWidgetModel => {
    const parentModel = floatingWidgetModel.getParent();
    if (isDefined(parentModel)) {
      floatingWidgetModel.remove(parentModel);
    }
  });
  selectionContainer?.clearFloatingWidgetModels();
}

/**
 * Widget에 마우스 커서를 올려 드래깅하여 Resize하는 중일 때,
 * 기존 WidgetStyle 대비 변화해야 하는 {x,y,width,height}값을 계산해 반환
 */
export function calcResizeDeltaBounds(
  handleDeltaX: number,
  handleDeltaY: number,
  handle: WidgetResizeHandle, // NONE이면 안됨
  style: WidgetPosition
): { deltaX: number; deltaY: number; deltaWidth: number; deltaHeight: number } {
  if (handle === WidgetResizeHandle.NONE) {
    dWarn('handle should not be NONE.');
    dWarn('bounds will not changed.');
  }
  const { x, y, width, height } = style;

  const left = x;
  const right = x + width;
  const top = y;
  const bottom = y + height;

  let newLeft = left;
  let newRight = right;
  let newTop = top;
  let newBottom = bottom;

  // 1. newLeft/Right 계산
  if (isLeftSide(handle)) {
    newLeft = left + handleDeltaX;
    if (newLeft >= right) {
      newLeft = right - 1;
    }
  } else if (isRightSide(handle)) {
    newRight = right + handleDeltaX;
    if (newRight <= left) {
      newRight = left + 1;
    }
  }

  // 2. newTop/Bottom 계산
  if (isTopSide(handle)) {
    newTop = top + handleDeltaY;
    if (newTop >= bottom) {
      newTop = bottom - 1;
    }
  } else if (isBottomSide(handle)) {
    newBottom = bottom + handleDeltaY;
    if (newBottom <= top) {
      newBottom = top + 1;
    }
  }

  return {
    deltaX: newLeft - x,
    deltaY: newTop - y,
    deltaWidth: (newRight - newLeft) / width,
    deltaHeight: (newBottom - newTop) / height,
  };
}

/**
 * Hit WidgetModel을 재정의하는 함수입니다.
 */
export function overrideHitWidgetModel(ctx: AkronContext, hitModel: WidgetModel): WidgetModel {
  const appModeContainer = ctx.getAppModeContainer();
  const appModel = ctx.getAppModel();
  let newHitWidgetModel = hitModel;
  //   if (isEditAppMode(appModeContainer)) {
  //     // 최상단의 BusinessDialog widget을 찾아 해당 widget에게 이벤트 처리를 위임 -> BusinessDialog widget이 한 덩어리로 select.
  //     newHitWidgetModel =
  //       hitModel.findTopSatisfyingWidget(target => target.getWidgetType() === 'BusinessDialog') ?? hitModel;
  //   } else if (isEditWidgetMode(appModeContainer)) {
  //     // (현재 편집 중인 대상을 제외한) 최상단의 BusinessDialog widget을 찾아 해당 widget에게 이벤트 처리를 위임 -> BusinessDialog widget이 한 덩어리로 select.
  //     newHitWidgetModel =
  //       newHitWidgetModel.findTopSatisfyingWidget(
  //         target => target.getWidgetType() === 'BusinessDialog' && target.getID() !== editingWidgetModel?.getID()
  //       ) ?? hitModel;
  //   }

  dLog(`Selection will be handled on: ${hitModel.getName()}`);
  dLog(`Selection will be handled widgetID: ${hitModel.getID()}`);

  return newHitWidgetModel;
}

/**
 * WidgetModel 편집 시작 시 초기 좌표를 설정하는 함수입니다.
 */
export function initEditCoordinate(
  event: MouseEvent<WidgetModel>,
  widgetEditInfoContainer: WidgetEditInfoContainer
): void {
  // widgetEditInfoContainer 초기값 세팅
  widgetEditInfoContainer.setDeltaX(0);
  widgetEditInfoContainer.setDeltaY(0);

  // 1 = 100%(현재 상태)로 계산
  widgetEditInfoContainer.setDeltaWidth(1);
  widgetEditInfoContainer.setDeltaHeight(1);

  widgetEditInfoContainer.setFromClientX(event.getClientX());
  widgetEditInfoContainer.setFromClientY(event.getClientY());
}

/**
 * WidgetModel 편집 시 x, y 변화량을 계산하는 함수입니다.
 */
export function calculateDeltaClientXY(event: MouseEvent<WidgetModel>, ctx: AkronContext): { x: number; y: number } {
  const zoomRatio = ctx.getZoomRatio();
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  // 드래그로 인한 마우스 커서의 위치 변화량
  let deltaClientX = (event.getClientX() - widgetEditInfoContainer.getFromClientX()) / (zoomRatio / 100);
  let deltaClientY = (event.getClientY() - widgetEditInfoContainer.getFromClientY()) / (zoomRatio / 100);

  // shift 이동 가이드
  const isShiftDown = event.isShiftDown();
  const isCloseToX = Math.abs(deltaClientX) < Math.abs(deltaClientY);
  if (isShiftDown) {
    if (isCloseToX) {
      deltaClientX = 0;
    } else {
      deltaClientY = 0;
    }
  }

  return { x: deltaClientX, y: deltaClientY };
}

/**
 * 스마트 가이드 관련 자료구조 set 해주는 함수
 */
export function setSmartGuideLineStructure(ctx: AkronContext): void {
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  const eventTargetModel = widgetEditInfoContainer.getEventTargetWidgetModel();
  const editingWidgets = widgetEditInfoContainer.getEditingWidgetModels();
  const page = eventTargetModel ? eventTargetModel.getParent() : undefined;
  const pageX = page?.getRefX() ?? 0;
  const pageY = page?.getRefY() ?? 0;
  const pageWidth = page?.getRefWidth() ?? 0;
  const pageHeight = page?.getRefHeight() ?? 0;
  //   const widgetArr: GuideCoordinate[] = [];
  //   if (page) {
  //     page.forEachChild(child => {
  //       if (child instanceof WidgetModel && child.getID() !== eventTargetModel?.getID()) {
  //         const widget = child as WidgetModel;
  //         const refX = widget.getRefX();
  //         const refY = widget.getRefY();
  //         const refW = widget.getRefWidth();
  //         const refH = widget.getRefHeight();
  //         const x = refX
  //           ? (refX - ctx.editingPageRefPosition.x) / (ctx.zoomRatio / 100)
  //           : widget.getProperties().style.x.absolute;
  //         const y = refY
  //           ? (refY - ctx.editingPageRefPosition.y) / (ctx.zoomRatio / 100)
  //           : widget.getProperties().style.y.absolute;
  //         const w = refW ? refW / (ctx.zoomRatio / 100) : widget.getProperties().style.width.absolute;
  //         const h = refH ? refH / (ctx.zoomRatio / 100) : widget.getProperties().style.height.absolute;
  //         widgetArr.push({ x, y, w, h });
  //       }
  //     });
  //     widgetArr.push({ x: 0, y: 0, w: pageWidth, h: pageHeight });
  //   }
  //   setSmartGuideStructure(widgetArr);
}

/**
 * smartGuide 기능중 snap을 이용하기 위해 좌표 보정을 해주는 함수.
 */
export function correctCoordinateForSnap(
  ctx: AkronContext,
  widget: WidgetModel,
  newX: number,
  newY: number,
  typeofEditing?: string
): { correctedX: number; correctedY: number } {
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  const refX = widget.getRefX();
  const refY = widget.getRefY();
  const refW = widget.getRefWidth();
  const refH = widget.getRefHeight();
  //   const x = refX
  //     ? (refX - ctx.editingPageRefPosition.x) / (ctx.zoomRatio / 100) + newX
  //     : widget.getProperties().style.x.absolute;
  //   const y = refY
  //     ? (refY - ctx.editingPageRefPosition.y) / (ctx.zoomRatio / 100) + newY
  //     : widget.getProperties().style.y.absolute;
  //   const w = refW ? refW / (ctx.zoomRatio / 100) : widget.getProperties().style.width.absolute;
  //   const h = refH ? refH / (ctx.zoomRatio / 100) : widget.getProperties().style.height.absolute;
  //   let correctedX = newX;
  //   let correctedY = newY;
  //   if (widgetEditInfoContainer.getEditingWidgetModels().length === 1) {
  //     if (typeofEditing === 'move') {
  //       correctedX = getSnapCoordinate(x, y, w, h, x + newX, y + newY).newX - x;
  //       correctedY = getSnapCoordinate(x, y, w, h, x + newX, y + newY).newY - y;
  //     } else if (typeofEditing === 'resize') {
  //       correctedX = getSnapCoordinate(x, y, w, h, x + newX, y + newY).newX - x;
  //       correctedY = getSnapCoordinate(x, y, w, h, x + newX, y + newY).newY - y;
  //     }
  //   }
  return { correctedX: newX, correctedY: newY };
}

export function applyStyleByEditingState(widgetModel: WidgetModel) {
  const htmlDom = document.getElementById(`widget-${widgetModel.getID()}`);
  if (htmlDom) {
    if (
      widgetModel.getEditingState() === WidgetEditingState.MOVE ||
      widgetModel.getEditingState() === WidgetEditingState.RESIZE
    ) {
      htmlDom.style.opacity = '0.4';
    } else {
      htmlDom.style.opacity = '';
    }
  }
}
