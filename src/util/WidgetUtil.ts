import { dError, isDefined, isUndefined, Nullable, WidgetTypeEnum } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import RemoveWidgetCommand from 'models/store/command/widget/RemoveWidgetCommand';
import SelectionContainer from 'models/store/container/SelectionContainer';
import AkronContext from 'models/store/context/AkronContext';
import EventState from 'models/store/event/EventState';
import { basicChildableWidgetTypeNamesSet, parentChildEssentialRelationMap } from 'models/widget/ParentChildRelMap';
import { isEditAppMode } from 'util/AppModeUtil';

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
 * hover되는 widget에 style className 추가하는 함수
 */
export function addWidgetHoveredStyle(widgetModel: WidgetModel, selectionContainer: SelectionContainer | undefined) {
  const hoverableElement = document.getElementById(`widgetSelection${widgetModel.getID()}`) as HTMLElement;
  hoverableElement.classList.add('hovered');
  selectionContainer?.setHoverableWidgetModel(widgetModel);
}

/**
 * hover 해제되는 widget에 style className 제거하는 함수
 */
export function removeWidgetHoveredStyle(widgetModel: WidgetModel, selectionContainer: Nullable<SelectionContainer>) {
  const hoverElement = document.getElementById(`widgetSelection${widgetModel.getID()}`) as HTMLElement;
  hoverElement?.classList.remove('hovered');
  selectionContainer?.setHoverableWidgetModel(undefined);
}

/**
 * 해당 WidgetModel들 중 삭제 가능한 WidgetModel들을 찾아 배열 형태로 반환
 * PageModel이 포함되어 있거나 삭제 불가능한 상태인 경우 빈 배열 반환
 */
export function getDeletableWidgetModels(widgetModels: WidgetModel[]): WidgetModel[] {
  if (widgetModels.some(widgetModel => checkPageModel(widgetModel))) {
    return [];
  }

  // if (widgetModels.some(widgetModel => widgetModel.getWidgetType() === 'FragmentLayout')) {
  //   return [];
  // }

  const deletableWidgetModels = widgetModels.filter(
    widgetModel => widgetModel.getProperties().content.locked.value === false
  );

  return deletableWidgetModels;
}

/**
 * 해당 BusinessDialog 인지 확인합니다.
 *
 * @param targetModel BusinessDialog 인지 확인하기 위한 WidgetModel
 * @returns WidgetModel이 존재하며 WidgetModel의 widgetType이 'BusinessDialog'인 경우 true
 */
export function checkBusinessDialogModel(targetModel: Nullable<WidgetModel>): boolean {
  return targetModel?.getWidgetType() === WidgetTypeEnum.BasicDialog;
}

/**
 * 해당 Page 또는 BusinessDialog 인지 확인합니다.
 *
 * @param targetModel Page 또는 BusinessDialog 인지 확인하기 위한 WidgetModel
 * @returns WidgetModel이 존재하며 WidgetModel의 widgetType이 'Page' 또는 'BusinessDialog'인 경우 true
 */
export function checkBusinessOrPageDialogModel(targetModel: Nullable<WidgetModel>): boolean {
  return checkPageModel(targetModel) || checkBusinessDialogModel(targetModel);
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

// /**
//  * 해당 WidgetModel이 ConditionalLayout인지 확인합니다.
//  *
//  * @param targetModel ConditionalLayout인지 확인하기 위한 WidgetModel
//  * @returns WidgetModel이 존재하며 WidgetModel의 widgetType이 'ConditionalLayout'인 경우 true
//  */
// export function checkConditionalLayout(targetModel: Nullable<WidgetModel>): boolean {
//   return targetModel?.getWidgetType() === 'ConditionalLayout';
// }

/**
 * container에 item 삽입 시 삽입 가능한 type인지 체크.
 */
export function checkInsertableItem(parent: WidgetModel | undefined, item: WidgetModel): boolean {
  if (parent === undefined) {
    return false;
  }
  // if (parent.getWidgetCategory() === 'Layout' && parent.getWidgetType() !== 'InnerPageLayout') {
  //   return true;
  // }
  if (basicChildableWidgetTypeNamesSet.has(parent.getWidgetType())) {
    if (
      // parentChildEssentialRelationMap에 있는 경우 삽입 가능한지 확인
      parentChildEssentialRelationMap.has(parent.getWidgetType()) &&
      (parentChildEssentialRelationMap.get(parent.getWidgetType()) as Set<string>).has(item.getWidgetType())
    ) {
      return true;
    }
    // parentChildEssentialRelationMap에 없는 경우 모든 타입 삽입 가능
    if (parentChildEssentialRelationMap.has(parent.getWidgetType()) === false) {
      return true;
    }
  }
  // if (parent.getWidgetCategory() === 'UserCreated') {
  //   return true;
  // }
  return false;
}

/**
 * 페이지가 아닌 일반 WidgetModel이 복사 가능한 상태인지 확인하는 함수
 * PageModel이 포함되어 있거나 복사 가능한 WidgetModel이 없는 경우 false 반환
 */
export function isWidgetsCopyable(widgetModels: WidgetModel[]): boolean {
  return getCopyableWidgetModels(widgetModels).length > 0;
}

/**
 * 해당 WidgetModel들 중 복사 가능한 WidgetModel들을 찾아 배열 형태로 반환
 * PageModel이 포함되어 있거나 삭제 가능한 WidgetModel이 없는 경우 빈 배열 반환
 */
export function getCopyableWidgetModels(widgetModels: WidgetModel[]): WidgetModel[] {
  if (widgetModels.some(widgetModel => checkPageModel(widgetModel))) {
    return [];
  }

  // const targetWidgetModels = widgetModels.filter(widgetModel => !checkWidgetType(widgetModel, 'FragmentLayout'));
  const targetWidgetModels = widgetModels;
  return targetWidgetModels;
}

/**
 * 해당 WidgetModel의 타입을 확인합니다.
 *
 * @param targetModel 타입을 확인하기 위한 WidgetModel
 * @param type 확인하기 위한 WidgetType(AnyWidgetType)
 * @returns WidgetModel이 존재하며 WidgetModel의 widgetType이 인자로 넘긴 type과 같은 경우 true
 */
export function checkWidgetType(targetModel: Nullable<WidgetModel>, type: WidgetTypeEnum): boolean {
  return targetModel?.getWidgetType() === type;
}

/**
 * widget을 겹치지 않게 삽입하기 위한 좌표를 찾음
 */
export function findInsertPosition(
  widgetModel: WidgetModel,
  ctx: AkronContext,
  startPosition: { x: number; y: number } = { x: 0, y: 0 },
  insertingPositionSet?: Set<string>
): { x: number; y: number } {
  const GAP = 20; // 20px
  const RestartGAP = 50; // 위치가 페이지를 초과해 다시 시작할때 x좌표 간격
  let countRestart = 1;
  const { style: widgetStyle } = widgetModel.getProperties();
  let page;
  if (isEditAppMode(ctx.getAppModeContainer())) {
    page = ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel().getFirstChild()!;
  } else {
    page = ctx.getEditingWidgetModel();
  }
  const pageStyle = page.getProperties().style;

  const widgetPositionSet = new Set<string>();
  page?.forEachChild((widget: WidgetModel) => {
    const childStyle = widget.getProperties().style;
    // Set의 key값으로 쓰기 위해 object가 아닌 string으로 변환
    widgetPositionSet.add(
      `${childStyle.x.value.toString()}/${childStyle.y.value.toString()}/${childStyle.width.value.toString()}/${childStyle.height.value.toString()}`
    );
  });

  let { x, y } = startPosition;
  while (true) {
    // 페이지보다 클 경우 (0,0)에 삽입(무한루프 도는 이슈)
    if (x + widgetStyle.width.value > pageStyle.width.value && y + widgetStyle.height.value > pageStyle.height.value) {
      return { x: 0, y: 0 };
    }
    if (
      widgetPositionSet.has(
        `${x.toString()}/${y.toString()}/${widgetStyle.width.value.toString()}/${widgetStyle.height.value.toString()}`
      ) === false &&
      (isUndefined(insertingPositionSet) ||
        (insertingPositionSet &&
          insertingPositionSet.has(
            `${x.toString()}/${y.toString()}/${widgetStyle.width.value.toString()}/${widgetStyle.height.value.toString()}`
          ) === false)) &&
      (x + widgetStyle.width.value <= pageStyle.width.value || y + widgetStyle.height.value <= pageStyle.height.value)
    ) {
      return { x, y };
    }
    x += GAP;
    y += GAP;
    if (
      x + widgetStyle.width.value >= pageStyle.width.value ||
      y + widgetStyle.height.value >= pageStyle.height.value
    ) {
      x = RestartGAP * countRestart;
      y = 0;
      countRestart += 1;
    }
  }
}

/**
 * widget model 삭제 관련 command를 ctx.command에 추가하는 함수
 */
export const appendDeleteWidgetCommandsRecursive = (
  widgetModel: WidgetModel,
  ctx: AkronContext,
  commandID: CommandEnum
) => {
  const parentModel = widgetModel.getParent();
  if (isUndefined(parentModel)) {
    dError('model is not appended');
    return;
  }

  widgetModel.forEachChild(childModel => appendDeleteWidgetCommandsRecursive(childModel, ctx, commandID));

  // Widget 삭제 시 content에 바인딩 되어 있는 WidgetModel을 삭제합니다.
  const properties = widgetModel.getProperties();
  const { content } = properties;
  Object.keys(content).forEach(key => {
    if (content[key].value instanceof WidgetModel) {
      const contentWidgetModel = content[key].value;
      appendDeleteWidgetCommandsRecursive(contentWidgetModel, ctx, commandID);
    }
  });

  // Widget 삭제 시 dataStore의 reference를 동기화합니다..
  // syncSubstrackDataStoreReference(widgetModel, ctx.dataStore, ctx.command);

  // 삭제 대상 중 InnerPageLayout이 있을 경우,
  // if (widgetModel.getWidgetType() === 'InnerPageLayout') {
  //   const editingPageID = ctx.getSelectionContainer()?.getEditingPage()?.getID();
  //   if (isDefined(editingPageID)) {
  //     // const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(ctx, commandID, editingPageID, widgetModel);
  //     // ctx.getCommand()?.append(updateInnerPageMapCommand);
  //   }
  // }

  // appendDeleteWidgetBusinessLogicCommands(ctx, widgetModel);

  const removeWidgetCommand = new RemoveWidgetCommand(widgetModel, parentModel);
  ctx.getCommand()?.append(removeWidgetCommand);

  if (widgetModel.isRepeatableLayoutWidgetType()) {
    const childWidgetModel = widgetModel.getFirstChild();
    if (isDefined(childWidgetModel)) {
      // const deleteCustomPropsVariableMapsCommand = new DeleteCustomPropsVariableMapCommand(
      //   childWidgetModel,
      //   ctx.dataBindingContainer
      // );
      // ctx.getCommand()?.appendPost(deleteCustomPropsVariableMapsCommand);
    }
  }
  // 해당 widget model이 들고 있는 prop/state 삭제
  // deletePropsStatesByComponentID(ctx, widgetModel.getID());

  // 컨테이너 내부 item 삭제 시 나를 제외한 sibling re-render
  if (!checkBusinessOrPageDialogModel(parentModel)) {
    parentModel.forEachChild((child: WidgetModel) => {
      if (child !== widgetModel) {
        child.triggerRerender();
      }
    });
  }
};

/**
 * WidgetModel의 편집 관련 context를 초기화하는 함수입니다.
 */
export function clearWidgetModelEditContext(ctx: AkronContext): void {
  const selectionContainer = ctx.getSelectionContainer();
  const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  const hitContainer = ctx.getHitContainer();

  if (ctx.getState() === EventState.EDIT) {
    return;
  }

  hitContainer.setStartHitItem(undefined);
  ctx.setState(EventState.EDIT);

  widgetEditInfoContainer.clear();

  selectionContainer?.getFloatingWidgetModels().forEach(floatingWidgetModel => {
    const parentModel = floatingWidgetModel.getParent();
    if (isDefined(parentModel)) {
      floatingWidgetModel.remove(parentModel);
    }
  });
  selectionContainer?.clearFloatingWidgetModels();
}
