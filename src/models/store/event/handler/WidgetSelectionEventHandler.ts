import { isUndefined, MouseEvent } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import WidgetEditInfoContainer, { WidgetEditSubEventState } from 'models/store/container/WidgetEditInfoContainer';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import EventState from 'models/store/event/EventState';
import { isEditWidgetMode } from 'util/AppModeUtil';
import { setSmartGuideLineStructure, overrideHitWidgetModel } from 'util/WidgetEditUtil';
import { removeWidgetHoveredStyle, clearWidgetModelEditContext, checkPageModel } from 'util/WidgetUtil';

/**
 * 마우스로 WidgetModel을 이동할 때 처리해야 할 Event Handler 로직을 작성하는 class 입니다.
 */
class WidgetSelectionEventHandler extends AkronEventHandler {
  /**
   * 마우스 버튼 누를 때
   */
  public override onMouseDown(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    // event.preventDefault();
    event.stopPropagation();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const HitContainer = ctx.getHitContainer();
    const selectionContainer = ctx.getSelectionContainer();

    let hitModel = HitContainer.getStartHitItem()?.getModel();
    const selectedWidgets = selectionContainer?.getSelectedWidgets();
    setSmartGuideLineStructure(ctx);
    if (
      isUndefined(hitModel) ||
      isUndefined(selectedWidgets) ||
      (checkPageModel(hitModel) && ctx.getMouseMode() === 'Normal')
    ) {
      // do nothing
      return false;
    }

    // Validation check
    if (!this.onMouseDownValidCheck(ctx)) {
      // this.finishMoveOnInterrupted(ctx);
      return true;
    }

    // change state
    widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.PRESSED);

    // set edit targets
    hitModel = overrideHitWidgetModel(ctx, hitModel);

    // windowSelection 초기화
    const windowSelection = window.getSelection();
    windowSelection?.removeAllRanges();

    // editor focus
    // 현재 widget에 focus가 되지 않아 editor로 focus
    // -> widget을 선택한 상태에서 단축키를 사용하기 위해서는 textViewComponent가 아닌 editor 영역에 focus가 되어야함.
    // -> 또, text 편집 중 다른 widget 선택 시 onBlur를 통해 update하기 위함
    // setEditorFocus();

    // 순수 widget영역 선택 -> textEditing 동작 X
    hitModel.setProperties({
      content: {
        ...hitModel.getProperties().content,
        textEditing: { value: false, defaultValue: false, variableId: 0 },
      },
      style: hitModel.getProperties().style,
    });

    // update selection
    const isSelectedWidget = selectedWidgets.includes(hitModel);

    if (isSelectedWidget) {
      return false;
    }

    const commandProps = {
      commandID: CommandEnum.SELECT_WIDGET,
      targetModel: hitModel,
      isAdded: event.isCtrlDown() || event.isShiftDown(),
    };
    ctx.setCommandProps(commandProps);

    // widget이 select될 때 hover style은 삭제되어야함
    removeWidgetHoveredStyle(hitModel, selectionContainer);

    return true;
  }

  /**
   * 눌렀던 마우스 버튼을 뗄 때
   */
  public override onMouseUp(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    event.preventDefault();
    event.stopPropagation();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const propContainer = ctx.getPropContainer();
    const state = ctx.getEventState();
    propContainer.getWidgetPropContainer().setIsSmartGuide(false);
    if (this.onMouseUpValidCheck(state, widgetEditInfoContainer)) {
      // WidgetMoveEventHandler에서 처리
      return false;
    }

    widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.RELEASED);
    ctx.getHitContainer().setStartHitItem(undefined);
    clearWidgetModelEditContext(ctx);

    return true;
  }

  /**
   * Context Menu
   */
  public override onContextMenu(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    event.preventDefault(); // 브라우저의 기본 동작을 막음

    const selectionContainer = ctx.getSelectionContainer();
    const hitContainer = ctx.getHitContainer();
    let hitModel = hitContainer.getStartHitItem()?.getModel();
    const selectedWidgets = selectionContainer?.getSelectedWidgets();
    if (isUndefined(hitModel) || isUndefined(selectedWidgets) || hitModel.getProperties().content.textEditing.value) {
      // do nothing
      return false;
    }

    // set edit targets
    hitModel = overrideHitWidgetModel(ctx, hitModel);

    // update selection
    const isSelectedWidget = selectedWidgets.includes(hitModel);

    if (!isSelectedWidget) {
      return false;
    }

    return false;
  }

  /**
   * Widget Move Event onMouseDown event의 valid를 check하는 함수
   *
   * @param ctx app context
   * @returns true: **valid**, false: **Invalid** -> should abort
   */
  private onMouseDownValidCheck(ctx: AkronContext): boolean {
    const state = ctx.getEventState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const appModeContainer = ctx.getAppModeContainer();
    const appModel = ctx.getAppModel();
    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();
    const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();

    if (state !== EventState.WIDGET_MOVE || widgetEditSubEventState !== WidgetEditSubEventState.READY) {
      return false;
    }

    // 다이얼로그 편집 모드에서 최상위 모델(Top Widget)일 경우 이동되지 않아야 함
    if (
      isEditWidgetMode(appModeContainer) &&
      hitModel?.getID() === appModel.getID() &&
      ctx.getMouseMode() === 'Normal'
    ) {
      return false;
    }

    return true;
  }

  /**
   * Widget Move Event onMouseUp event의 valid를 check하는 함수
   *
   * @param eventState AppContext에 저장되어있는 현재 event state
   * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
   * @returns true: **valid** , false: **Invalid** -> should abort
   */
  private onMouseUpValidCheck(eventState: EventState, widgetEditInfoContainer: WidgetEditInfoContainer): boolean {
    const graphicEditEventSubState = widgetEditInfoContainer.getWidgetEditSubEventState();
    const eventTargetWidgetModel = widgetEditInfoContainer.getEventTargetWidgetModel();
    if (
      eventState === EventState.WIDGET_MOVE &&
      graphicEditEventSubState === WidgetEditSubEventState.DRAG &&
      eventTargetWidgetModel !== undefined
    ) {
      return true;
    }
    return false;
  }
}

export default WidgetSelectionEventHandler;
