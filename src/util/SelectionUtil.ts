import { Nullable } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import WidgetEditInfoContainer, { DragState, DragScrollState } from 'models/store/container/WidgetEditInfoContainer';
import AkronContext from 'models/store/context/AkronContext';

/**
 * model의 부모가 되는 dom의 rect style 반환
 */
export default function getTargetParentRectStyle(
  ctx: AkronContext,
  parentModel: WidgetModel | undefined
): { parentRefY: number; parentRefX: number; parentRefWidth: number; parentRefHeight: number } {
  let parentRefX = 0;
  let parentRefY = 0;
  let parentRefWidth = 1;
  let parentRefHeight = 1;

  const zoomRatio = ctx.getZoomRatio() / 100;
  if (parentModel !== undefined) {
    // 부모가 일반 widget이면 해당 widget의 style을 사용
    const targetParentSizeModel = parentModel as WidgetModel;
    parentRefX = targetParentSizeModel?.getRefX() ?? 0;
    parentRefY = targetParentSizeModel?.getRefY() ?? 0;
    parentRefWidth = targetParentSizeModel?.getRefWidth() ?? 1;
    parentRefHeight = targetParentSizeModel?.getRefHeight() ?? 1;
  }

  return {
    parentRefX,
    parentRefY,
    parentRefWidth,
    parentRefHeight,
  };
}

/**
 * viewport의 영역 밖으로 드래그할 때 viewport 영역을 scroll 해주는 함수
 */
export function scrollForSelectionGuideBox(widgetEditInfoContainer: WidgetEditInfoContainer, targetHtml: HTMLElement) {
  const dragScrollState = widgetEditInfoContainer.getDragScrollState();
  const dragState = widgetEditInfoContainer.getDragState();
  if (dragState === DragState.DRAG_MOVE) {
    let deltaX = 0;
    let deltaY = 0;
    switch (dragScrollState) {
      case DragScrollState.LEFT_TOP: {
        deltaX = -5;
        deltaY = -5;
        break;
      }
      case DragScrollState.LEFT_BOTTOM: {
        deltaX = -5;
        deltaY = 5;
        break;
      }
      case DragScrollState.RIGHT_TOP: {
        deltaX = 5;
        deltaY = -5;
        break;
      }
      case DragScrollState.RIGHT_BOTTOM: {
        deltaX = 5;
        deltaY = 5;
        break;
      }
      case DragScrollState.LEFT: {
        deltaX = -5;
        break;
      }
      case DragScrollState.RIGHT: {
        deltaX = 5;
        break;
      }
      case DragScrollState.TOP: {
        deltaY = -5;
        break;
      }
      case DragScrollState.BOTTOM: {
        deltaY = 5;
        break;
      }
      default:
        break;
    }
    targetHtml.scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' });
    const oldEndX = widgetEditInfoContainer.getDragGuideEndX();
    const oldEndY = widgetEditInfoContainer.getDragGuideEndY();
    widgetEditInfoContainer.setDragGuideEndX(oldEndX + deltaX);
    widgetEditInfoContainer.setDragGuideEndY(oldEndY + deltaY);
  }
}

/**
 * widget이 selectionGuideBox와 중첩된 영역이 있는지 검사하는 함수
 */
export function isWidgetInSelectionGuideBox(widget: WidgetModel, selectionGuideBox: DOMRect): boolean {
  const widgetRefLeft = widget.getRefX() ?? 0;
  const widgetRefTop = widget.getRefY() ?? 0;
  const widgetRefWidth = widget.getRefWidth() ?? 0;
  const widgetRefHeight = widget.getRefHeight() ?? 0;
  const widgetRefRight = widgetRefLeft + widgetRefWidth;
  const widgetRefBottom = widgetRefTop + widgetRefHeight;

  if (
    !(
      widgetRefRight < selectionGuideBox.left ||
      widgetRefLeft > selectionGuideBox.right ||
      widgetRefBottom < selectionGuideBox.top ||
      widgetRefTop > selectionGuideBox.bottom
    )
  ) {
    return true;
  }
  return false;
}

/**
 * selectionProp을 만들기 위해 pure한 widgetModel과 compositeModel을 분리하는 함수
 */
// export function classifyWidgetModelsForSelection(
//   ctx: AkronContext,
//   widgetModels: BaseWidgetModel[],
//   compoisteSelect: boolean = true,
//   targetModel?: BaseWidgetModel
// ): { compositeKeyModels: WidgetModel[]; compositeModels: CompositeModel[]; pureWidgetModels: BaseWidgetModel[] } {
//   const compositeComponentContainer = ctx.getCompositeComponentContainer();

//   const compositeKeyModels: WidgetModel[] = [];
//   const compositeModels: CompositeModel[] = [];
//   const pureWidgetModels: BaseWidgetModel[] = [];
//   widgetModels.forEach(model => {
//     const compositeModel = compositeComponentContainer.getCompositeModel(model.getID());
//     // 이미 선택된 model의 경우 compositeSelection이 아닌 일반 selection으로 분류
//     if (
//       compositeModel &&
//       (compoisteSelect || (compositeModel.getSelected() && targetModel !== model)) &&
//       model instanceof NewWidgetModel
//     ) {
//       compositeKeyModels.push(model);
//       compositeModels.push(compositeModel);
//     } else {
//       pureWidgetModels.push(model);
//     }
//   });
//   return { compositeKeyModels, compositeModels, pureWidgetModels };
// }

/**
 * viewport 이동이 가능한지 판별하는 함수
 */
export function moveViewPortPossible(widgetModel: WidgetModel): boolean {
  if (widgetModel instanceof WidgetModel) {
    let currentModel: Nullable<WidgetModel> = widgetModel;
    let returnValue = true;
    while (currentModel instanceof WidgetModel) {
      // visible prop 판별이 필요
      //   const visible = getPropByName(currentModel, 'visible')?.widgetProp;

      //   if (isUndefined(visible)) {
      //     // 공통 속성이라 없으면 에러
      //     returnValue = false;
      //     break;
      //   }

      // value === undefined -> defaultValue(=display)
      //   if (visible.value !== undefined && visible.value !== 'display') {
      //     returnValue = false;
      //   }
      //   if (widgetModel.getHidden() === true) {
      //     returnValue = false;
      //   }
      // refX === undefined || display === none -> ref === undefined || htmlDom에서 그려주지 않음 -> 현재 render된 모델이 아님
      if (
        widgetModel.getRefStyle() === undefined ||
        widgetModel.getRefStyle()?.display === 'none' ||
        (widgetModel.getRefHeight() === 0 && widgetModel.getRefWidth() === 0)
      ) {
        returnValue = false;
      }
      // 부모의 visible도 영향을 받음
      currentModel = currentModel.getParent();
    }
    return returnValue;
  }
  return false;
}
