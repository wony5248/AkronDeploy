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
