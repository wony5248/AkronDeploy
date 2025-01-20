import { dError, KeyEvent, Nullable, MouseEvent, isUndefined, WidgetEditingState } from '@akron/runner';
import WidgetModel from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import {
  WidgetMoveStartCommandProps,
  WidgetMoveCommandProps,
} from 'models/store/command/handler/WidgetEditCommandHandler';
import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import SelectionContainer from 'models/store/container/SelectionContainer';
import WidgetEditInfoContainer, { WidgetEditSubEventState } from 'models/store/container/WidgetEditInfoContainer';
import AkronContext from 'models/store/context/AkronContext';
import AkronEventHandler from 'models/store/event/AkronEventHandler';
import EventState from 'models/store/event/EventState';
import SelectionEnum from 'models/store/selection/SelectionEnum';
import { parentChildPermittedRelationMap, basicChildWidgetTypeNamesSet } from 'models/widget/ParentChildRelMap';
import { isEditAppMode } from 'util/AppModeUtil';
import {
  overrideHitWidgetModel,
  initEditCoordinate,
  calculateDeltaClientXY,
  correctCoordinateForSnap,
} from 'util/WidgetEditUtil';
import { checkPageModel, clearWidgetModelEditContext, findNestedContainer, isAncestor } from 'util/WidgetUtil';

/**
 * 마우스로 WidgetModel을 이동할 때 처리해야 할 Event Handler 로직을 작성하는 class 입니다.
 */
class WidgetMoveEventHandler extends AkronEventHandler {
  // mouse down event는 WidgetSelectionEventHandler에서 처리

  /**
   * 마우스 주버튼(보통 Left)을 누른 채 끌고 있을 때
   */
  public override onMouseMove(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    if (event.isLButton() === false) {
      this.finishMoveOnInterrupted(ctx);
      return true;
    }

    event.preventDefault();
    event.stopPropagation();
    const state = ctx.getEventState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const propContainer = ctx.getPropContainer();

    const targetModel = event.getTargetModel();

    let hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();

    if (isUndefined(selectionContainer)) {
      return false;
    }
    const selectedWidgets = selectionContainer.getSelectedWidgets();
    if (selectedWidgets.length === 1 && hitModel?.getParent()?.getWidgetType() === 'Page') {
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
    const hitWidgetProps = hitModel?.getProperties();
    if (isUndefined(hitWidgetProps)) {
      dError('hitModelProps are undefined');
      return false;
    }

    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

    let movedWidgetModels = selectedWidgets;

    // 첫 drag 시점
    if (widgetEditSubEventState === WidgetEditSubEventState.PRESSED) {
      ctx.setEventState(EventState.WIDGET_MOVE);
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.DRAG);

      hitModel = overrideHitWidgetModel(ctx, hitModel);

      const editingPage = isEditAppMode(ctx.getAppModeContainer())
        ? selectionContainer.getEditingPage()
        : ctx.getAppModel()?.getFirstChild();

      const canMove = editingPage
        ? movedWidgetModels.every(widgetModel => {
            if (
              parentChildPermittedRelationMap.has(editingPage.getWidgetType()) &&
              parentChildPermittedRelationMap.get(editingPage.getWidgetType())?.has(widgetModel.getWidgetType())
            ) {
              return true;
            }
            return basicChildWidgetTypeNamesSet.has(widgetModel.getWidgetType()) === false;
          })
        : false;

      if (!canMove) {
        movedWidgetModels = [];
      }

      // set edit targets
      if (movedWidgetModels) {
        widgetEditInfoContainer.setEditingWidgetModels(movedWidgetModels);
      }

      // init coordinate
      initEditCoordinate(event, widgetEditInfoContainer);

      // Move Start CommandProps 생성
      const commandProps: WidgetMoveStartCommandProps = {
        commandID: CommandEnum.WIDGET_MOVE_START,
        targetModels: movedWidgetModels,
      };
      ctx.setCommandProps(commandProps);
    }

    if (!this.onMouseMoveValidCheck(state, widgetEditInfoContainer)) {
      if (widgetEditSubEventState !== WidgetEditSubEventState.RELEASED) {
        this.finishMoveOnInterrupted(ctx);
      }

      return true;
    }

    // // 페이지 밖으로 나갈 경우 이동 종료
    // if (targetModel.getWidgetType() === 'App') {
    //   this.finishMoveOnInterrupted(ctx);
    //   return true;
    // }

    // delta값 설정
    const deltaClientXY = calculateDeltaClientXY(event, ctx);
    const correctDeltaXY = correctCoordinateForSnap(ctx, targetModel, deltaClientXY.x, deltaClientXY.y, 'move');
    const prevDeltaX = widgetEditInfoContainer.getDeltaX();
    const prevDeltaY = widgetEditInfoContainer.getDeltaY();
    widgetEditInfoContainer.setDeltaX(correctDeltaXY.correctedX);
    widgetEditInfoContainer.setDeltaY(correctDeltaXY.correctedY);

    const floatingWidgetModels = ctx.getSelectionContainer()?.getFloatingWidgetModels();
    floatingWidgetModels?.forEach(model => {
      const modelProperties = model.getProperties();
      const modelTop = model.getStyleProperties('top');
      const modelLeft = model.getStyleProperties('left');
      model.setProperties({
        ...modelProperties,
        style: {
          ...modelProperties.style,
          left: {
            ...modelProperties.style.left,
            value: {
              absolute: modelLeft.absolute + deltaClientXY.x - prevDeltaX,
              relative: 0,
              unit: 'px',
            },
          },
          top: {
            ...modelProperties.style.top,
            value: {
              absolute: modelTop.absolute + deltaClientXY.y - prevDeltaY,
              relative: 0,
              unit: 'px',
            },
          },
        },
      });
    });

    // FIXME: 가독성을 위한 코드 정리
    // let nestedContainer =
    //   movedWidgetModels.length >= 1
    //     ? findNestedContainer(ctx, movedWidgetModels[0], targetModel)
    //     : (ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel());
    // nestedContainer =
    //   !checkPageModel(nestedContainer) &&
    //   movedWidgetModels.every(widget => nestedContainer === findNestedContainer(ctx, widget, targetModel))
    //     ? nestedContainer
    //     : (ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel());

    // // 부모-자식 역전이 일어나는 경우 child로 삽입하지 않음
    // if (movedWidgetModels.some(widget => isAncestor(widget, nestedContainer))) {
    //   nestedContainer = ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel();
    // }

    // smart guide(dragHovered) 셋팅
    // if (
    //   ctx.getSmartGuideContainer().getDragHoveredWidget() !== nestedContainer &&
    //   nestedContainer.getProperties().editingState !== WidgetEditingState.MOVE &&
    //   movedWidgetModels.length > 0
    // ) {
    //   // 기존 dragHovered 초기화
    //   ctx.getSmartGuideContainer().setDragHovered(false);
    //   // 새로운 widget, dragHovered 셋팅
    //   ctx.getSmartGuideContainer().setDragHoveredWidget(nestedContainer);
    //   ctx.getSmartGuideContainer().setDragHovered(true);
    // }

    // 드래그 도중 속성으로 삽입되는 경우 하이라이트 기능을 위해 셋팅
    // if (
    //   ctx.metaDataContainer.getReactNodeTypePropMap().get(targetModel.getWidgetType()) &&
    //   targetModel !== movedWidgetModels[0]
    // ) {
    //   ctx.getSmartGuideContainer().setDragHovered(false);
    //   ctx.getSmartGuideContainer().setDragHoveredWidget(targetModel);
    //   ctx.getSmartGuideContainer().setDragHovered(true);
    // }

    // smart guide(container order) 셋팅
    // if (nestedContainer.getWidgetCategory() === 'Layout') {
    //   const nextSibling = findNextSiblingDragInContainer(
    //     nestedContainer,
    //     { x: event.getClientX(), y: event.getClientY() },
    //     movedWidgetModels.includes(hitModel) ? movedWidgetModels : movedWidgetModels.concat(hitModel)
    //   );
    //   let refX = 0;
    //   let refY = 0;
    //   if (isDefined(nextSibling)) {
    //     refX = nextSibling.getRefX() ?? 0;
    //     refY = nextSibling.getRefY() ?? 0;
    //   } else {
    //     const lastWidget = targetModel.getLastChild();
    //     if (isUndefined(lastWidget)) {
    //       refX = 0;
    //       refY = 0;
    //     } else if (targetModel.getWidgetType() === 'LayoutVerticalFrame') {
    //       refX = lastWidget.getRefX() ?? 0;
    //       refY = (lastWidget.getRefY() ?? 0) + (lastWidget.getRefHeight() ?? 0);
    //     } else if (targetModel.getWidgetType() === 'LayoutHorizontalFrame') {
    //       refX = (lastWidget.getRefX() ?? 0) + (lastWidget.getRefWidth() ?? 0);
    //       refY = lastWidget.getRefY() ?? 0;
    //     }
    //   }
    //   ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
    //     x: refX / (ctx.zoomRatio / 100),
    //     y: refY / (ctx.zoomRatio / 100),
    //   });
    // } else {
    //   ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
    //     x: 0,
    //     y: 0,
    //   });
    // }

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

    const state = ctx.getEventState();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const propContainer = ctx.getPropContainer();
    propContainer.getWidgetPropContainer().setIsSmartGuide(false);
    // clearSmartGuideStructure();
    const selectedWidgets = selectionContainer?.getSelectedWidgets();

    // 입력 값 검증
    const hitWidgetProps = hitModel.getProperties();
    if (isUndefined(hitWidgetProps)) {
      dError('hitModelProps are undefined');
      return false;
    }

    hitModel = overrideHitWidgetModel(ctx, hitModel);

    const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();
    if (widgetEditSubEventState === WidgetEditSubEventState.DRAG) {
      widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.RELEASED);
    }

    if (!this.onMouseUpValidCheck(state, widgetEditInfoContainer, selectionContainer)) {
      this.finishMoveOnInterrupted(ctx);
      return true;
    }

    // 이동 정상 종료
    const targetModel = event.getTargetModel();
    let widgetModels = selectedWidgets;
    // select 상태가 아닌 widget을 끌 경우 hitModel로 처리함
    if (isUndefined(widgetModels) || !widgetModels.includes(hitModel)) {
      widgetModels = [hitModel];
    }

    // if (targetModel.getComponentSpecificProperties().locked) {
    //   // 삽입하려고 하는 컴포넌트가 잠금일 경우 이동 하기 전 위치로 이동
    //   const props: WidgetMoveCommandProps = {
    //     commandID: CommandEnum.WIDGET_MOVE_END,
    //     targetModels: widgetModels,
    //     deltaX: 0,
    //     deltaY: 0,
    //   };
    //   ctx.commandProps = props;

    //   const selectionPropObj: SelectionProp = {
    //     selectionType: SelectionEnum.WIDGET,
    //     widgetModels,
    //   };
    //   ctx.commandProps.selectionProp = selectionPropObj;
    //   ctx.hitContainer.setStartHitItem(undefined);
    //   ctx.getSmartGuideContainer().setDragHovered(false);

    //   ctx.getSmartGuideContainer().setDragHoveredWidget(undefined);
    //   ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
    //     x: 0,
    //     y: 0,
    //   });
    //   ctx.getEditorUIStore().setEditorSnackBarMsg('컴포넌트 잠금을 해지 후 시도해보세요.');
    //   return true;
    // }

    const movedWidgetModels: WidgetModel[] = [];
    widgetModels.forEach(widgetModel => {
      // move 불가능한 widget은 값 변경하지 않음
      // if (widgetModel.getComponentSpecificProperties().locked === false) {
      movedWidgetModels.push(widgetModel);
      // }
    });

    let nestedContainer =
      movedWidgetModels.length >= 1
        ? findNestedContainer(ctx, movedWidgetModels[0], targetModel)
        : (ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getAppModel());
    nestedContainer =
      !checkPageModel(nestedContainer) &&
      movedWidgetModels.every(widget => nestedContainer === findNestedContainer(ctx, widget, targetModel))
        ? nestedContainer
        : (ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getAppModel());
    // 부모-자식 역전이 일어나는 경우 child로 삽입하지 않음
    if (widgetModels?.some(widget => isAncestor(widget, nestedContainer))) {
      nestedContainer = ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getAppModel();
    }

    const deltaClientXY = calculateDeltaClientXY(event, ctx);
    const props: WidgetMoveCommandProps = {
      commandID: CommandEnum.WIDGET_MOVE_END,
      targetModels: movedWidgetModels,
      useRefPosition: true,
      deltaX: deltaClientXY.x,
      deltaY: deltaClientXY.y,
      container:
        nestedContainer !== selectionContainer?.getEditingPage() &&
        // nestedContainer.getWidgetType() !== 'InnerPageLayout' &&
        nestedContainer.getDragHovered()
          ? nestedContainer
          : undefined,
      isMovedToPage:
        !checkPageModel(movedWidgetModels[0].getParent()) && nestedContainer === selectionContainer?.getEditingPage(),
      mousePosition: undefined,
      // nestedContainer.getWidgetCategory() === 'Layout' ? { x: event.getClientX(), y: event.getClientY() } : undefined,
      desModel: targetModel.getEditingState() !== WidgetEditingState.FLOATING ? targetModel : undefined,
    };
    ctx.setCommandProps(props);
    const commandProps = ctx.getCommandProps();
    const selectionPropObj: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels,
    };
    if (commandProps) {
      commandProps.selectionProp = selectionPropObj;
    }

    // ctx.getSmartGuideContainer().setDragHovered(false);
    // ctx.getSmartGuideContainer().setDragHoveredWidget(undefined);
    // ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
    //   x: 0,
    //   y: 0,
    // });
    return true;
  }

  /**
   * Mouse Leave
   */
  public override onMouseLeave(event: MouseEvent<WidgetModel>, ctx: AkronContext): boolean {
    this.finishMoveOnInterrupted(ctx);

    return true;
  }

  /**
   * onKeyDown
   */
  public override onKeyDown(event: KeyEvent<WidgetModel>, ctx: AkronContext): boolean {
    switch (true) {
      case /^Escape$/.test(event.getKey()): {
        event.stopPropagation();
        this.finishMoveOnInterrupted(ctx);

        return true;
      }
      case /^Delete$/.test(event.getKey()): {
        // edit context 초기화를 위해 호출
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
  public override onKeyUp(event: KeyEvent<WidgetModel>): boolean {
    event.stopPropagation();

    return true;
  }

  /**
   * Widget Move Event onMouseMove event의 valid를 check하는 함수
   *
   * @param eventState AppContext에 저장되어있는 현재 event state
   * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
   * @returns true: **valid**, false: **Invalid** -> should abort
   */
  private onMouseMoveValidCheck(eventState: EventState, widgetEditInfoContainer: WidgetEditInfoContainer): boolean {
    const widgetEditEventSubState = widgetEditInfoContainer.getWidgetEditSubEventState();

    if (eventState !== EventState.WIDGET_MOVE || widgetEditEventSubState !== WidgetEditSubEventState.DRAG) {
      return false;
    }

    return true;
  }

  /**
   * Widget Move Event onMouseUp event의 valid를 check하는 함수
   *
   * @param eventState AppContext에 저장되어있는 현재 event state
   * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
   * @param selectionContainer selection 정보가 담겨있는 container
   * @returns true: **valid** , false: **Invalid** -> should abort
   */
  private onMouseUpValidCheck(
    eventState: EventState,
    widgetEditInfoContainer: WidgetEditInfoContainer,
    selectionContainer: Nullable<SelectionContainer>
  ): boolean {
    if (
      eventState !== EventState.WIDGET_MOVE ||
      !selectionContainer ||
      selectionContainer.getSelectedWidgets().length === 0 ||
      !selectionContainer.getSelectedWidgets().includes(widgetEditInfoContainer.getEditingWidgetModels()[0])
    ) {
      return false;
    }
    return true;
  }

  /**
   * 마우스 드래그를 통한 move 도중 ESC 키 입력, 우클릭 등의 이벤트로 인해 종료되는 경우에 호출
   */
  private finishMoveOnInterrupted(ctx: AkronContext): void {
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const selectionContainer = ctx.getSelectionContainer();

    if (isUndefined(selectionContainer)) {
      //   ctx.getSmartGuideContainer().setDragHovered(false);
      return;
    }

    const selectedWidgets = selectionContainer.getSelectedWidgets();
    const editingWidgets = widgetEditInfoContainer.getEditingWidgetModels();

    const needToChangeSelection = editingWidgets.length > 0 && !selectedWidgets.includes(editingWidgets[0]);
    const selectedWidgetsOnFinish = needToChangeSelection ? editingWidgets : selectedWidgets;

    if (selectedWidgetsOnFinish.length > 0) {
      const props: WidgetMoveCommandProps = {
        commandID: CommandEnum.WIDGET_MOVE_END,
        targetModels: selectedWidgetsOnFinish,
        deltaX: widgetEditInfoContainer.getDeltaX(),
        deltaY: widgetEditInfoContainer.getDeltaY(),
      };
      ctx.setCommandProps(props);
      const commandProps = ctx.getCommandProps();
      const selectionPropObj: SelectionProp = {
        selectionType: SelectionEnum.WIDGET,
        widgetModels: selectedWidgetsOnFinish ?? [],
      };

      if (commandProps) {
        commandProps.selectionProp = selectionPropObj;
      }
    }

    clearWidgetModelEditContext(ctx);
    // ctx.getSmartGuideContainer().setDragHovered(false);
  }
}

export default WidgetMoveEventHandler;
