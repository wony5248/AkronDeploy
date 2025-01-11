import { dError, KeyEvent, Nullable, MouseEvent, isUndefined, WidgetEditingState } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import WidgetRepository from 'models/repository/WidgetRepository';
import CommandEnum from 'models/store/command/common/CommandEnum';
import {
  InsertWidgetAtCommandProps,
  WidgetResizeCommandProps,
  WidgetResizeEndCommandProps,
} from 'models/store/command/handler/WidgetEditCommandHandler';
import SelectionContainer from 'models/store/container/SelectionContainer';
import WidgetEditInfoContainer, {
  WidgetEditSubEventState,
  WidgetResizeHandle,
} from 'models/store/container/WidgetEditInfoContainer';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import EventState from 'models/store/event/EventState';
import HitItem from 'models/store/selection/HitItem';
import {
  calcResizeDeltaBounds,
  calculateDeltaClientXY,
  correctCoordinateForSnap,
  initEditCoordinate,
  overrideHitWidgetModel,
} from 'util/WidgetEditUtil';
import { checkPageModel, clearWidgetModelEditContext } from 'util/WidgetUtil';

/**
 * 마우스로 WidgetModel을 크기를 변경할 때 처리해야 할 Event Handler 로직을 작성하는 class 입니다.
 */
class WidgetResizeEventHandler extends AkronEventHandler {
  /**
   * 마우스 버튼 누를 때
   */
  public override onMouseDown(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    const state = ctx.getState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const propContainer = ctx.getPropContainer();
    if (event.isLButton() === false || selectionContainer === undefined) {
      this.finishResizeOnInterrupted(ctx);
      return true;
    }

    event.stopPropagation();

    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

    // init coordinate
    initEditCoordinate(event, widgetEditInfoContainer);

    const resizedWidgetModels = selectionContainer.getSelectedWidgets();
    const targetResizeHandle = this.getTargetResizeHandle(event, state, widgetEditSubEventState);
    if (!targetResizeHandle) {
      if (widgetEditSubEventState !== WidgetEditSubEventState.RELEASED) {
        this.finishResizeOnInterrupted(ctx);
      }

      return true;
    }

    // change state
    ctx.setState(EventState.WIDGET_RESIZE);
    widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.PRESSED);

    // set resize handle
    widgetEditInfoContainer.setResizeHandle(targetResizeHandle);

    // Resize Start CommandProps 생성
    const commandProps: WidgetResizeCommandProps = {
      commandID: CommandEnum.WIDGET_RESIZE_START,
      targetModels: resizedWidgetModels ?? [],
    };
    ctx.setCommandProps(commandProps);
    return true;
  }

  /**
   * 마우스 주버튼(보통 Left)을 누른 채 끌고 있을 때
   */
  public override onMouseMove(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    const state = ctx.getState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const propContainer = ctx.getPropContainer();
    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

    if (selectionContainer === undefined) {
      return true;
    }

    if (widgetEditInfoContainer.getEditingWidgetModels().length === 0) {
      return true;
    }

    if (widgetEditSubEventState === WidgetEditSubEventState.DRAG && event.isLButton() === false) {
      this.finishResizeOnInterrupted(ctx);
      return true;
    }

    event.preventDefault();
    event.stopPropagation();
    const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
    const selectedWidgets = selectionContainer?.getSelectedWidgets();
    if (selectedWidgets?.length === 1 && hitModel?.getParent()?.getWidgetType() === 'Page') {
      propContainer.getWidgetPropContainer().setIsSmartGuide(true);
    }
    if (
      isUndefined(hitModel) ||
      isUndefined(selectedWidgets) ||
      (checkPageModel(hitModel) && ctx.getMouseMode() === 'Normal')
    ) {
      // do nothing
      return false;
    }

    // 입력 값 검증
    if (isUndefined(hitModel)) {
      dError('hitModel is undefined');
      return false;
    }

    if (widgetEditSubEventState === WidgetEditSubEventState.PRESSED) {
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.DRAG);
    }

    const editingState = hitModel.getEditingState();

    // 드래그로 container 삽입 후 리사이징 시작
    if (editingState === WidgetEditingState.NONE) {
      // MouseDown 때 container가 삽입되며 해당 container만 단일 선택으로 존재함
      const insertedContainer = selectedWidgets;
      const hitItem = new HitItem<WidgetModel>();
      // Mouse Down 때 생긴 widget이라 hit item 셋팅이 안되서 임의로 셋팅
      hitItem.setModel(insertedContainer[0]);
      ctx.getHitContainer().setStartHitItem(hitItem);

      // Resize Start CommandProps 생성
      const commandProps: WidgetResizeCommandProps = {
        commandID: CommandEnum.WIDGET_RESIZE_START,
        targetModels: insertedContainer ?? [],
      };
      ctx.setCommandProps(commandProps);

      return true;
    }

    if (!this.onMouseMoveValidCheck(state, widgetEditInfoContainer)) {
      if (widgetEditSubEventState !== WidgetEditSubEventState.RELEASED) {
        this.finishResizeOnInterrupted(ctx);
      }

      return true;
    }

    let widgetModels = selectedWidgets;
    // select 상태가 아닌 widget을 끌 경우 hitModel로 처리함
    if (widgetModels.includes(hitModel) === false) {
      widgetModels = [hitModel];
    }

    const eventTargetModel = event.getTargetModel();
    if (eventTargetModel.getID() === 0) {
      // appModel
      this.finishResizeOnInterrupted(ctx);
      return true;
    }

    // 리사이징 중
    // WidgetStyle 기준으로 변화해야 하는 Bounds 값 계산
    const deltaClientXY = calculateDeltaClientXY(event, ctx);
    const correctDeltaXY = correctCoordinateForSnap(ctx, eventTargetModel, deltaClientXY.x, deltaClientXY.y, 'resize');
    const { deltaX, deltaY, deltaWidth, deltaHeight } = calcResizeDeltaBounds(
      correctDeltaXY.correctedX,
      correctDeltaXY.correctedY,
      widgetEditInfoContainer.getResizeHandle(),
      widgetEditInfoContainer.getRefPositionMap(hitModel) ?? {
        x: hitModel.getStyleProperties('x').absolute,
        y: hitModel.getStyleProperties('y').absolute,
        width: hitModel.getStyleProperties('width').absolute,
        height: hitModel.getStyleProperties('height').absolute,
      }
    );

    const prevDeltaX = widgetEditInfoContainer.getDeltaX();
    const prevDeltaY = widgetEditInfoContainer.getDeltaY();
    const prevDeltaWidth = widgetEditInfoContainer.getDeltaWidth();
    const prevDeltaHeight = widgetEditInfoContainer.getDeltaHeight();

    widgetEditInfoContainer.setDeltaX(deltaX / (ctx.getZoomRatio() / 100));
    widgetEditInfoContainer.setDeltaY(deltaY / (ctx.getZoomRatio() / 100));

    widgetEditInfoContainer.setDeltaWidth(deltaWidth);
    widgetEditInfoContainer.setDeltaHeight(deltaHeight);

    const floatingWidgetModels = ctx.getSelectionContainer()?.getFloatingWidgetModels();
    floatingWidgetModels?.forEach(model => {
      const modelProperties = model.getProperties();
      const modelTop = model.getStyleProperties('top');
      const modelLeft = model.getStyleProperties('left');
      const modelWidth = model.getStyleProperties('width');
      const modelHeight = model.getStyleProperties('height');
      model.setProperties({
        ...modelProperties,
        style: {
          ...modelProperties.style,
          left:
            deltaX !== 0
              ? {
                  ...modelProperties.style.left,
                  value: {
                    absolute: modelLeft.absolute + deltaClientXY.x - prevDeltaX,
                    relative: 0,
                    unit: 'px',
                  },
                }
              : { ...modelProperties.style.left },
          top:
            deltaY !== 0
              ? {
                  ...modelProperties.style.top,
                  value: {
                    absolute: modelTop.absolute + deltaClientXY.y - prevDeltaY,
                    relative: 0,
                    unit: 'px',
                  },
                }
              : { ...modelProperties.style.top },
          width: {
            ...modelProperties.style.width,
            value: {
              absolute: (modelWidth.absolute / prevDeltaWidth) * deltaWidth,
              relative: 0,
              unit: 'px',
            },
          },
          height: {
            ...modelProperties.style.height,
            value: {
              absolute: (modelHeight.absolute / prevDeltaHeight) * deltaHeight,
              relative: 0,
              unit: 'px',
            },
          },
        },
      });
    });

    return true;
  }

  /**
   * 눌렀던 마우스 버튼을 뗄 때
   */
  public override onMouseUp(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    event.preventDefault();

    let hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();

    if (isUndefined(hitModel)) {
      return false;
    }

    event.stopPropagation();

    const state = ctx.getState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const propContainer = ctx.getPropContainer();
    // clearSmartGuideStructure();
    propContainer.getWidgetPropContainer().setIsSmartGuide(false);
    const selectedWidgets = selectionContainer?.getSelectedWidgets();

    // 입력 값 검증
    if (isUndefined(hitModel)) {
      dError('hitModel is undefined');
      return false;
    }

    hitModel = overrideHitWidgetModel(ctx, hitModel);

    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();
    if (widgetEditSubEventState === WidgetEditSubEventState.DRAG) {
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.RELEASED);
    }

    // Valid check
    if (!this.onMouseUpValidCheck(state, widgetEditInfoContainer, selectionContainer)) {
      this.finishResizeOnInterrupted(ctx);
      return true;
    }

    // 리사이즈 정상 종료
    const resizedWidgetModels = selectedWidgets ?? [];
    const deltaClientX = (event.getClientX() - widgetEditInfoContainer.getFromClientX()) / (ctx.getZoomRatio() / 100);
    const deltaClientY = (event.getClientY() - widgetEditInfoContainer.getFromClientY()) / (ctx.getZoomRatio() / 100);
    const { deltaX, deltaY, deltaWidth, deltaHeight } = calcResizeDeltaBounds(
      deltaClientX,
      deltaClientY,
      widgetEditInfoContainer.getResizeHandle(),
      widgetEditInfoContainer.getRefPositionMap(hitModel) ?? {
        x: hitModel.getStyleProperties('x').absolute,
        y: hitModel.getStyleProperties('y').absolute,
        width: hitModel.getStyleProperties('width').absolute,
        height: hitModel.getStyleProperties('height').absolute,
      }
    );

    const props: WidgetResizeCommandProps = {
      commandID: CommandEnum.WIDGET_RESIZE_END,
      targetModels: resizedWidgetModels,
      deltaX,
      deltaY,
      deltaWidth,
      deltaHeight,
    };
    ctx.setCommandProps(props);

    return true;
  }

  /**
   * Mouse Leave
   */
  public override onMouseLeave(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    this.finishResizeOnInterrupted(ctx);
    return true;
  }

  /**
   * onKeyDown
   */
  public override onKeyDown(event: KeyEvent<WidgetModel>, ctx: AkronContext): boolean {
    switch (true) {
      case /^Escape$/.test(event.getKey()): {
        event.stopPropagation();
        this.finishResizeOnInterrupted(ctx);

        return true;
      }
      case /^Delete$/.test(event.getKey()): {
        // clear edit context
        clearWidgetModelEditContext(ctx);

        // useGlobalHokeyHandler에서 이후 과정 처리
        return true;
      }
      default: {
        break;
      }
    }

    event.stopPropagation();

    return true;
  }

  /**
   * onKeyUp
   */
  public override onKeyUp(event: KeyEvent<WidgetModel>, ctx: AkronContext): boolean {
    event.stopPropagation();

    return true;
  }

  /**
   * Widget Resize Event onMouseDown event의 valid를 check하는 함수
   *
   * @param event mouse event
   * @param eventState DocumentContext에 저장되어있는 현재 event state
   * @param widgetEditSubEventState widget edit event의 세부 state
   * @returns true: **valid**, false: **Invalid** -> should abort
   */
  private onMouseDownValidCheck(
    event: MouseEvent<WidgetModel>,
    eventState: EventState,
    widgetEditSubEventState: WidgetEditSubEventState
  ): boolean {
    if (eventState !== EventState.WIDGET_RESIZE || widgetEditSubEventState !== WidgetEditSubEventState.READY) {
      return false;
    }

    const currentTarget = event.getCurrentTarget();
    const { handlestring } = (currentTarget as HTMLElement).dataset;
    if (isUndefined(handlestring)) {
      dError('ResizeHandle is undefined.');
      return false;
    }

    const handle: WidgetResizeHandle = parseInt(handlestring, 10);
    if (isUndefined(handle)) {
      dError('handleString is invald.');
      return false;
    }

    return true;
  }

  /**
   * Target resize handle을 반환하는 함수
   *
   * @param event mouse event
   * @param eventState DocumentContext에 저장되어있는 현재 event state
   * @param widgetEditSubEventState widget edit event의 세부 state
   * @returns WidgetResizeHandle
   */
  private getTargetResizeHandle(
    event: MouseEvent<WidgetModel>,
    eventState: EventState,
    widgetEditSubEventState: WidgetEditSubEventState
  ): Nullable<WidgetResizeHandle> {
    if (!this.onMouseDownValidCheck(event, eventState, widgetEditSubEventState)) {
      return undefined;
    }

    const currentTarget = event.getCurrentTarget();
    const { handlestring } = (currentTarget as HTMLElement).dataset;
    if (isUndefined(handlestring)) {
      return undefined;
    }

    const handle: WidgetResizeHandle = parseInt(handlestring, 10);

    return handle;
  }

  /**
   * Widget Resize Event onMouseMove event의 valid를 check하는 함수
   *
   * @param eventState AppContext에 저장되어있는 현재 event state
   * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
   * @returns true: **valid**, false: **Invalid** -> should abort
   */
  private onMouseMoveValidCheck(eventState: EventState, widgetEditInfoContainer: WidgetEditInfoContainer): boolean {
    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

    if (!(eventState === EventState.WIDGET_RESIZE) || widgetEditSubEventState !== WidgetEditSubEventState.DRAG) {
      return false;
    }

    return true;
  }

  /**
   * Widget Resize Event onMouseUp event의 valid를 check하는 함수
   *
   * @param eventState AppContext에 저장되어있는 현재 event state
   * @param wwidgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
   * @param selectionContainer selection 정보가 담겨있는 container
   * @returns true: **valid** , false: **Invalid** -> should abort
   */
  private onMouseUpValidCheck(
    eventState: EventState,
    widgetEditInfoContainer: WidgetEditInfoContainer,
    selectionContainer: Nullable<SelectionContainer>
  ): boolean {
    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

    if (
      !(eventState === EventState.WIDGET_RESIZE) ||
      widgetEditSubEventState !== WidgetEditSubEventState.RELEASED ||
      !selectionContainer ||
      selectionContainer.getSelectedWidgets().length === 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * 마우스 드래그를 통한 resize 도중 ESC 키 입력, 우클릭 등의 이벤트로 인해 종료되는 경우에 호출
   */
  private finishResizeOnInterrupted(ctx: AkronContext) {
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();

    const commandProps: WidgetResizeEndCommandProps = {
      commandID: CommandEnum.WIDGET_RESIZE_END,
      targetModels: widgetEditInfoContainer.getEditingWidgetModels(),
      deltaX: widgetEditInfoContainer.getDeltaX(),
      deltaY: widgetEditInfoContainer.getDeltaY(),
      deltaWidth: widgetEditInfoContainer.getDeltaWidth(),
      deltaHeight: widgetEditInfoContainer.getDeltaHeight(),
    };
    ctx.setCommandProps(commandProps);
  }
}

export default WidgetResizeEventHandler;
