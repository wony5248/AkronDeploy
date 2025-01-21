import { isDefined, dError, KeyEvent, MouseEvent, isUndefined, WheelEvent, WidgetEditingState } from '@akron/runner';
import { runInAction } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { DeleteWidgetCommandProps } from 'models/store/command/handler/WidgetEditCommandHandler';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import { isPageListMode } from 'util/AppModeUtil';
import { overrideHitWidgetModel } from 'util/WidgetEditUtil';
import { addWidgetHoveredStyle, checkPageModel, removeWidgetHoveredStyle } from 'util/WidgetUtil';

/**
 * Widget의 Event를 처리하는 Handler입니다.
 */
class WidgetEventHandler extends AkronEventHandler {
  /**
   * 마우스 버튼 누를 때
   */
  public override onMouseDown(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    // 상위 Widget model이 Event를 다시 처리하는 것을 막음
    event.stopPropagation();
    return false;
  }

  /**
   * 마우스 주버튼(보통 Left)을 누른 채 끌고 있을 때
   */
  public override onMouseMove(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    // Edit mode에서 MouseMove는 drag시에 동작함
    if (event.isLButton() === false) {
      return false;
    }
    event.preventDefault(); // 브라우저의 기본 동작을 막음

    // Thumbnail drag 시 propagation을 허용해 MainPage의 MouseMove 이벤트를 발생시킴
    if (isUndefined(ctx.getDragObject())) {
      event.stopPropagation(); // 상위 Widget model이 Event를 다시 처리하는 것을 막음
    }

    return false;
  }

  /**
   * 눌렀던 마우스 버튼을 뗄 때
   */
  public override onMouseUp(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    let hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
    event.preventDefault(); // 브라우저의 기본 동작을 막음
    if (isDefined(hitModel)) {
      event.stopPropagation(); // 상위 Widget model이 Event를 다시 처리하는 것을 막음
    }
    if (isUndefined(hitModel)) {
      // do nothing
      return false;
    }

    const appModeContainer = ctx.getAppModeContainer();

    // 입력 값 검증
    const hitWidgetProps = hitModel.getProperties();
    if (isUndefined(hitWidgetProps)) {
      dError('hitModelProps are undefined');
      return false;
    }

    if (checkPageModel(hitModel)) {
      if (isPageListMode(appModeContainer)) {
        return true;
      }
      const commandProps = {
        commandID: CommandEnum.SELECT_PAGE_THUMBNAIL,
        targetModel: hitModel,
      };
      ctx.setCommandProps(commandProps);
      ctx.getHitContainer().setStartHitItem(undefined);
      runInAction(() => {
        ctx.setMouseMode('Normal');
      });
      return true;
    }

    hitModel = overrideHitWidgetModel(ctx, hitModel);

    const editingState = hitModel.getEditingState();
    // Widget을 누름
    if (editingState === WidgetEditingState.NONE) {
      // Selection
      const commandProps = {
        commandID: CommandEnum.SELECT_WIDGET,
        targetModel: hitModel,
        isAdded: event.isCtrlDown() || event.isShiftDown(),
      };
      ctx.setCommandProps(commandProps);
      ctx.getHitContainer().setStartHitItem(undefined);

      // widget이 select될 때 hover style은 삭제되어야함
      removeWidgetHoveredStyle(hitModel, ctx.getSelectionContainer());
      runInAction(() => {
        ctx.setMouseMode('Normal');
      });
      return true;
    }

    dError('Something, somewhere terribly wrong.');
    return false;
  }

  /**
   * 마우스 Wheel 스크롤 시
   */
  public override onWheel(event: WheelEvent<WidgetModel>, ctx: AkronContext): boolean {
    // ctrl 안누를 경우 scroll.
    if (!event.isCtrlDown()) {
      return false;
    }
    const deltaY = event.getYOffset();
    const props = {
      commandID: CommandEnum.INVALID,
    };
    if (event.getTargetModel() instanceof WidgetModel) {
      if (deltaY < 0) {
        props.commandID = CommandEnum.ZOOM_IN;
      } else {
        props.commandID = CommandEnum.ZOOM_OUT;
      }
    }
    ctx.setCommandProps(props);
    return true;
  }

  /**
   * Mouse Leave
   */
  public override onMouseLeave(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    return false;
  }

  /**
   * Context Menu
   */
  public override onContextMenu(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    event.preventDefault(); // 브라우저의 기본 동작을 막음
    return false;
  }

  /**
   * onKeyDown
   */
  public override onKeyDown(event: KeyEvent<WidgetModel>, ctx: AkronContext): boolean {
    // 대부분의 key event는 widget에 focus가 없는 상태에서도 동작해야 하므로 useGlobalHotKeyHandler에 등록함
    const keyCode = event.getCode();
    const targetModel = event.getTargetModel();

    switch (keyCode) {
      case 'Delete': {
        const commandProps: DeleteWidgetCommandProps = {
          commandID: CommandEnum.DELETE_WIDGET,
        };
        ctx.setCommandProps(commandProps);
        return true;
      }
      default: {
        return false;
      }
    }
  }

  /**
   * onMouseDoubleClick
   */
  public override onDoubleClick(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    // widget을 doubleClick 시 하위 widget으로 selection이 변경되어야함
    // gx component의 event click을 event.targetModel을 통해 알고 이를 활용
    const target = event.getTargetModel();
    const parentTarget = target.getParent();
    const selectionContainer = ctx.getSelectionContainer();
    const selectedWidgetModels = selectionContainer?.getSelectedWidgets();
    if (isDefined(selectedWidgetModels)) {
      if (
        // parent가 현재 selet되어 있고 target이 select되지 않은 경우 target으로 selection 변경
        isDefined(selectedWidgetModels.find(model => model.getID() === parentTarget?.getID())) &&
        isDefined(selectedWidgetModels.find(model => model.getID() !== target.getID()))
      ) {
        const commandProps = {
          commandID: CommandEnum.SELECT_WIDGET,
          targetModel: target,
          isAdded: true,
        };
        ctx.setCommandProps(commandProps);

        return true;
      }
    }
    return false;
  }

  /**
   * widget에 mouse over 시
   */
  public override onMouseOver(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    // page가 아닌 widget에서는 event의 전파를 막아서 hover 해제를 하지 않게 함
    const selectionContainer = ctx.getSelectionContainer();
    if (checkPageModel(event.getTargetModel())) {
      // 최하위 widget만 over 하기 위해 이벤트 전달을 막음
      event.stopPropagation();

      const selectableWidgetModels = selectionContainer?.getSelectableWidgetModels();
      const selectedWidgetModels = selectionContainer?.getSelectedWidgets();
      const targetWidget = event.getTargetModel();
      // selectable widget과 1depth의 widget만이 hover 대상이 될 수 있음
      if (selectableWidgetModels?.includes(targetWidget) || checkPageModel(targetWidget.getParent())) {
        const hoverableWidget = selectionContainer?.getHoverableWidgetModel();

        // 정의되어있는 hoverable widget이 있다면 초기화
        if (isDefined(hoverableWidget)) {
          removeWidgetHoveredStyle(hoverableWidget, selectionContainer);
        }

        // select된 widget이 아니라면 hoverable widget
        if (!selectedWidgetModels?.includes(targetWidget)) {
          addWidgetHoveredStyle(targetWidget, selectionContainer);
        }
      }
      return false;
    }
    // page에서 over 시 hover 해제
    const hoverableWidget = selectionContainer?.getHoverableWidgetModel();

    if (isDefined(hoverableWidget)) {
      removeWidgetHoveredStyle(hoverableWidget, selectionContainer);
    }
    return false;
  }
}

export default WidgetEventHandler;
