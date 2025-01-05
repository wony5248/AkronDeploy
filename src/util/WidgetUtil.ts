import { Nullable } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';

/**
 * 해당 위젯 모델이 부모보다 밖에 있는지 안에 있는지를 판단합니다.
 */
export default function checkWidgetInParent(targetModel: WidgetModel): boolean {
  const refX = targetModel.getRefX();
  const refY = targetModel.getRefY();
  const refWidth = targetModel.getRefWidth();
  const refHeight = targetModel.getRefHeight();
  const parentRefX = targetModel.getParent()?.getRefX() ?? 0;
  const parentRefY = targetModel.getParent()?.getRefY() ?? 0;
  const parentRefWidth = targetModel.getParent()?.getRefWidth() ?? 1;
  const parentRefHeight = targetModel.getParent()?.getRefHeight() ?? 1;

  if (!refX || !refY || !refWidth || !refHeight) {
    return false;
  }

  const parentTopLeft = { x: parentRefX, y: parentRefY };
  const parentBottomRight = { x: parentRefX + parentRefWidth, y: parentRefY + parentRefHeight };
  const topLeft = { x: refX, y: refY };
  const bottomRight = { x: refX + refWidth, y: refY + refHeight };

  if (parentTopLeft.x > topLeft.x || parentTopLeft.y > topLeft.y) {
    return false;
  }
  if (parentBottomRight.x < bottomRight.x || parentBottomRight.y < bottomRight.y) {
    return false;
  }
  return true;
}

/**
 * 해당 WidgetModel들이 모두 삭제 가능한 상태인지 확인하는 함수
 * PageModel이 포함되어 있거나 삭제 불가능한 경우 false 반환
 */
export function isWidgetsDeletable(widgetModels: WidgetModel[]): boolean {
  return getDeletableWidgetModels(widgetModels).length > 0;
}

/**
 * 해당 WidgetModel들 중 삭제 가능한 WidgetModel들을 찾아 배열 형태로 반환
 * PageModel이 포함되어 있거나 삭제 불가능한 상태인 경우 빈 배열 반환
 */
export function getDeletableWidgetModels(widgetModels: WidgetModel[]): WidgetModel[] {
  if (widgetModels.some(widgetModel => checkPageModel(widgetModel))) {
    return [];
  }

  if (widgetModels.some(widgetModel => widgetModel.getWidgetType() === 'FragmentLayout')) {
    return [];
  }

  const deletableWidgetModels = widgetModels.filter(widgetModel => widgetModel.getProperties().locked === false);

  return deletableWidgetModels;
}

/**
 * 해당 WidgetModel이 페이지인지 확인합니다.
 *
 * @param targetModel 페이지인지 확인하기 위한 WidgetModel
 * @returns WidgetModel이 존재하며 WidgetModel의 widgetType이 'Page'인 경우 true
 */
export function checkPageModel(targetModel: Nullable<WidgetModel>): boolean {
  return targetModel?.getWidgetType() === 'Page';
}
