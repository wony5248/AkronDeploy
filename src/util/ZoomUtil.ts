import AkronContext from 'models/store/context/AkronContext';
import { isEditAppMode } from 'util/AppModeUtil';
import { getDeviceSize } from 'util/DeviceUtil';

/**
 * 줌 증가 및 감소 양
 */
export function calculateChangeZoomRatio(zoomRatio: number): number {
  const ratio = Math.round(zoomRatio * 0.2);
  return ratio === 0 ? 1 : ratio;
}

/**
 * 줌 계산 함수
 */
export function calcZoomRatio(ctx: AkronContext) {
  const appModeContainer = ctx.getAppModeContainer();
  const zoomRatio = ctx.getZoomRatio();
  const currentWorArea = ctx.getSelectionContainer().getEditingNewWorkArea();
  const workAreaRef = document.getElementById(`SuperUX-${currentWorArea?.getWidgetType()}-${currentWorArea?.getID()}`);
  // const deviceInfoMetaDataMap = ctx.getNewMetaDataContainer().getDeviceInfoMetaDataMap();
  const deviceSizeStyle = getDeviceSize(ctx.getAppModel().getDeviceInfo());
  if (!isEditAppMode(appModeContainer)) {
    return 1;
  }
  if (zoomRatio === -1) {
    // Zoom to fit 했을 경우
    // 화면 맞춤 값으로, 현재 창 크기에 맞춰서 ratio 적용
    const centerWrapper = workAreaRef?.parentElement as HTMLDivElement;
    const { clientWidth, clientHeight } = centerWrapper;

    const paddingOffset = 60;
    const pageWidth = deviceSizeStyle.width + paddingOffset;
    const pageHeight = deviceSizeStyle.height + paddingOffset;

    const widthRatio = (clientWidth / pageWidth) * 100;
    const heightRatio = (clientHeight / pageHeight) * 100;

    const selectedRatio = Math.min(widthRatio, heightRatio);
    ctx.setZoomRatio(selectedRatio);
  }
  return zoomRatio / 100;
}

/**
 * 줌 값 및 스크롤 값 계산, htmlDom에 반영하는 함수
 */
export default function zoomInOut(ctx: AkronContext, e?: React.WheelEvent<HTMLElement>, inputRatio?: number) {
  const currentWorArea = ctx.getSelectionContainer().getEditingNewWorkArea();
  const workAreaRef = document.getElementById(`SuperUX-${currentWorArea?.getWidgetType()}-${currentWorArea?.getID()}`);
  const zoomRatio = ctx.getZoomRatio();
  const centerWrapper = workAreaRef?.parentElement as HTMLDivElement;
  const editorAreaRef = centerWrapper?.parentElement as HTMLDivElement;
  const editorRect = editorAreaRef?.getBoundingClientRect();
  const workAreaRect = workAreaRef?.getBoundingClientRect();
  const { width, height } = currentWorArea?.getSize() ?? { width: 100000, height: 100000 };
  // 휠로 줌을 조정하는 경우
  if (editorRect && e?.ctrlKey) {
    const isZoomOut = e.deltaY > 0;
    const newScale = inputRatio
      ? inputRatio / 100
      : (zoomRatio + (isZoomOut ? -1 * calculateChangeZoomRatio(zoomRatio) : calculateChangeZoomRatio(zoomRatio))) /
        100;
    const oldScale = zoomRatio / 100;
    const mx = e.clientX - editorRect.left;
    const my = e.clientY - editorRect.top;

    const sx = editorAreaRef.scrollLeft;
    const sy = editorAreaRef.scrollTop;

    const sx2 = (sx + mx) * (newScale / oldScale) - mx;
    const sy2 = (sy + my) * (newScale / oldScale) - my;

    // 마우스 위치로 워크에어리어 이동
    if (workAreaRef) {
      workAreaRef.style.transformOrigin = '0 0';
      workAreaRef.style.transform = `scale(${newScale})`;
      editorAreaRef.scroll(sx2, sy2);
    }
  } else if (inputRatio && workAreaRect && editorRect) {
    // 툴바로 줌을 조정하는 경우
    const newScale = inputRatio / 100;

    // 줌 배율 변경시 변경 전 뷰포트 중앙으로 화면 이동
    const centerXper = (editorAreaRef.scrollLeft + editorAreaRef.clientWidth / 2) / workAreaRect.width;
    const centerYper = (editorAreaRef.scrollTop + editorAreaRef.clientHeight / 2) / workAreaRect.height;

    const newScrollLeft = width * newScale * centerXper;
    const newScrollTop = height * newScale * centerYper;

    const newCenterX = newScrollLeft - editorAreaRef.clientWidth / 2;
    const newCenterY = newScrollTop - editorAreaRef.clientHeight / 2;

    if (workAreaRef) {
      workAreaRef.style.transform = `scale(${newScale})`;
      editorAreaRef.scroll(newCenterX, newCenterY);
    }
  } else {
    if (workAreaRef) {
      const match = workAreaRef.style.transform.match(/scale\(([0-9.]+)\)/);
      if (!match || (match && parseFloat(match[1]) !== zoomRatio / 100)) {
        const ratio = calcZoomRatio(ctx);
        workAreaRef.style.transform = `scale(${ratio})`;
      }
    }
  }
}

/**
 * 줌 증가에 따른 계산 알고리즘
 */
export function calculateIncreaseZoomRatio(zoomRatio: number): number {
  return zoomRatio + calculateChangeZoomRatio(zoomRatio);
}

/**
 * 줌 감소에 따른 계산 알고리즘
 */
export function calculateDecreaseZoomRatio(zoomRatio: number): number {
  return zoomRatio - calculateChangeZoomRatio(zoomRatio);
}
