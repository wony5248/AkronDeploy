// import { BaseWidgetModel, isUndefined, dError, Nullable, DefaultEvent } from '@akron/runner';
// import { runInAction } from 'mobx';
// import PageModel from 'models/node/PageModel';
// import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
// import CommandEnum from 'models/store/command/common/CommandEnum';
// import { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
// import { WidgetEditingState } from 'models/store/command/widget/WidgetModelTypes';
// import SelectionContainer from 'models/store/container/SelectionContainer';
// import WidgetEditInfoContainer, { WidgetEditSubEventState } from 'models/store/container/WidgetEditInfoContainer';
// import AkronContext from 'models/store/context/AkronContext';
// import EventHandler from 'models/store/event/EventHandler';
// import EventState from 'models/store/event/EventState';
// import SelectionEnum from 'models/store/selection/SelectionEnum';

// /**
//  * 마우스로 WidgetModel을 이동할 때 처리해야 할 Event Handler 로직을 작성하는 class 입니다.
//  */
// class WidgetMoveEventHandler extends EventHandler<WidgetID, CommandEnum, SelectionProp, WidgetModel> {
//   // mouse down event는 WidgetSelectionEventHandler에서 처리

//   private originalUnits: Map<string, { width: string; height: string }> = new Map();
//   // eslint-disable-next-line lines-between-class-members
//   private originalPositions: Map<string, { top: number; left: number }> = new Map();

//   /**
//    * 마우스 주버튼(보통 Left)을 누른 채 끌고 있을 때
//    */
//   public override onMouseMove(event: DefaultEvent, ctx: AkronContext): boolean {
//     if (event.isLButton() === false) {
//       this.finishMoveOnInterrupted(ctx);
//       return true;
//     }

//     event.preventDefault();
//     event.stopPropagation();
//     const state = ctx.getState();
//     const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//     const selectionContainer = ctx.getSelectionContainer();
//     const propContainer = ctx.getPropContainer();

//     const targetModel = event.getTargetModel();

//     const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
//     if (!(hitModel instanceof WidgetModel)) return false;

//     if (isUndefined(selectionContainer)) {
//       return false;
//     }

//     const selectedCompositeKeyModels = selectionContainer.getSelectedCompositeKeyModels();
//     const selectedWidgets = [
//       ...(selectionContainer.getSelectedWidgets() as BaseWidgetModel[]),
//       ...selectedCompositeKeyModels,
//     ];
//     if (selectedWidgets.length === 1 && hitModel?.getParent()?.getWidgetTypeId() === SystemComponentType.Page) {
//       propContainer.getWidgetPropContainer().setIsSmartGuide(true);
//     }
//     if (
//       isUndefined(hitModel) ||
//       isUndefined(selectedWidgets) ||
//       staticWidgetTypes.has(hitModel.getWidgetType()) ||
//       hitModel.getLocked() ||
//       (checkPageModel(hitModel) && ctx.getMouseMode() === 'Normal') ||
//       hitModel.getTextEditing() ||
//       checkDialogComponent(hitModel) ||
//       hitModel instanceof StudioModel
//     ) {
//       // do nothing
//       return false;
//     }

//     // 입력 값 검증
//     const hitWidgetProps = hitModel?.getProps();
//     if (isUndefined(hitWidgetProps)) {
//       dError('hitModelProps are undefined');
//       return false;
//     }

//     const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();

//     const movedWidgetModels = selectedWidgets.includes(hitModel)
//       ? selectedWidgets.filter(widgetModel => widgetModel instanceof WidgetModel && widgetModel.getLocked() === false)
//       : [hitModel];

//     // 첫 drag 시점
//     if (widgetEditSubEventState === WidgetEditSubEventState.PRESSED) {
//       ctx.setState(EventState.WIDGET_MOVE);
//       widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.DRAG);

//       if (hitModel instanceof WidgetModel) {
//         const zoomRatio = ctx.getZoomRatio() / 100;
//         const parentElement = hitModel.getParent();
//         const parentRefX = parentElement instanceof WidgetModel ? (parentElement.getRefX() ?? 0) : 0;
//         const parentRefY = parentElement instanceof WidgetModel ? (parentElement.getRefY() ?? 0) : 0;
//         const widgetRefX = hitModel.getRefX() ?? 0;
//         const widgetRefY = hitModel.getRefY() ?? 0;

//         this.originalPositions.set(hitModel.getID().toString(), {
//           top: (widgetRefY - parentRefY) / zoomRatio,
//           left: (widgetRefX - parentRefX) / zoomRatio,
//         });
//       }

//       const editingPage = isEditAppMode(ctx.getAppModeContainer())
//         ? selectionContainer.getEditingNewWorkArea()
//         : ctx.getEditingNewWidgetModel();

//       // const canMove = editingPage
//       //     ? movedWidgetModels.every(widgetModel => {
//       //           if (
//       //               parentChildPermittedRelationMap.has(editingPage.getWidgetType()) &&
//       //               parentChildPermittedRelationMap
//       //                   .get(editingPage.getWidgetType())
//       //                   ?.has(widgetModel.getWidgetType())
//       //           ) {
//       //               return true;
//       //           }
//       //           return basicChildWidgetTypeNamesSet.has(widgetModel.getWidgetType()) === false;
//       //       })
//       //     : false;

//       // if (!canMove) {
//       //     movedWidgetModels = [];
//       // }

//       // 현재 단위 저장
//       const startHitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
//       if (startHitModel instanceof WidgetModel) {
//         this.originalUnits.set(startHitModel.getID().toString(), {
//           width: startHitModel.getWidth().unit,
//           height: startHitModel.getHeight().unit,
//         });

//         // 임시로 px 단위로 변환
//         const parent = startHitModel.getParent();
//         if (parent instanceof WidgetModel) {
//           if (startHitModel.getWidth().unit === '%') {
//             const parentWidth = parent.getRefWidth() ?? 0;
//             const pxValue = (Number(startHitModel.getWidth().value) * Number(parentWidth)) / 100;
//             startHitModel.setWidth({ value: pxValue, unit: 'px' });
//           }
//           if (startHitModel.getHeight().unit === '%') {
//             const parentHeight = parent.getRefHeight() ?? 0;
//             const pxValue = (Number(startHitModel.getHeight().value) * parentHeight) / 100;
//             startHitModel.setHeight({ value: pxValue, unit: 'px' });
//           }
//         }
//       }

//       // set edit targets
//       if (movedWidgetModels) {
//         widgetEditInfoContainer.setEditingWidgetModels(movedWidgetModels);
//       }

//       // init coordinate
//       initEditCoordinate(event, widgetEditInfoContainer);

//       // Move Start CommandProps 생성
//       const commandProps: WidgetMoveStartCommandProps = {
//         commandID: CommandEnum.WIDGET_MOVE_START,
//         targetModels: movedWidgetModels as WidgetModel[],
//       };
//       ctx.setCommandProps(commandProps);
//     }

//     if (!this.onMouseMoveValidCheck(state, widgetEditInfoContainer)) {
//       if (widgetEditSubEventState !== WidgetEditSubEventState.RELEASED) {
//         this.finishMoveOnInterrupted(ctx);
//       }

//       return true;
//     }

//     // 페이지 밖으로 나갈 경우 이동 종료
//     if (targetModel.getWidgetType() === 'App') {
//       this.finishMoveOnInterrupted(ctx);
//       return true;
//     }

//     const deltaClientXY = calculateMoveDeltaClientXY(event, ctx);
//     const pinnedDirections = hitModel.getPinnedDirections();
//     const { keepX, keepY } = this.shouldKeepPosition(pinnedDirections);

//     if (hitModel instanceof WidgetModel) {
//       const zoomRatio = ctx.getZoomRatio() / 100;
//       const parentElement = hitModel.getParent();

//       const originalPosition = this.originalPositions.get(hitModel.getID().toString());
//       if (!originalPosition) return false;

//       // pin된 방향은 원래 위치 유지, 아닌 방향만 이동
//       const newPosition = {
//         left: keepX ? originalPosition.left : Math.round(originalPosition.left + deltaClientXY.x),
//         top: keepY ? originalPosition.top : Math.round(originalPosition.top + deltaClientXY.y),
//       };

//       const widgetWidth = hitModel.getRefWidth() ? Number(hitModel.getRefWidth()) / zoomRatio : 0;
//       const widgetHeight = hitModel.getRefHeight() ? Number(hitModel.getRefHeight()) / zoomRatio : 0;

//       let parentWidth = 0;
//       let parentHeight = 0;

//       if (parentElement instanceof WidgetModel) {
//         parentWidth = parentElement.getRefWidth() ? Number(parentElement.getRefWidth()) / zoomRatio : 0;
//         parentHeight = parentElement.getRefHeight() ? Number(parentElement.getRefHeight()) / zoomRatio : 0;
//       } else {
//         const pageDevice = document.getElementById('Page-Device');
//         if (pageDevice) {
//           const rect = pageDevice.getBoundingClientRect();
//           parentWidth = rect.width / zoomRatio;
//           parentHeight = rect.height / zoomRatio;
//         }
//       }

//       widgetEditInfoContainer.setDeltaX(newPosition.left - originalPosition.left);
//       widgetEditInfoContainer.setDeltaY(newPosition.top - originalPosition.top);

//       widgetEditInfoContainer.setRealTimePosition({
//         top: newPosition.top,
//         left: newPosition.left,
//         right: Math.round(parentWidth - (newPosition.left + widgetWidth)),
//         bottom: Math.round(parentHeight - (newPosition.top + widgetHeight)),
//       });
//     }

//     // FIXME: 가독성을 위한 코드 정리
//     let nestedContainer =
//       movedWidgetModels.length >= 1
//         ? findNestedContainer(ctx, movedWidgetModels[0], targetModel)
//         : (ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel());
//     nestedContainer =
//       (!checkWorkAreaModel(nestedContainer) || !checkPageModel(nestedContainer)) &&
//       movedWidgetModels.every(widget => nestedContainer === findNestedContainer(ctx, widget, targetModel))
//         ? nestedContainer
//         : (ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel());

//     // 부모-자식 역전이 일어나는 경우 child로 삽입하지 않음
//     if (movedWidgetModels.some(widget => isAncestor(widget, nestedContainer))) {
//       nestedContainer = ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel();
//     }

//     // smart guide(dragHovered) 셋팅
//     if (checkWorkAreaModel(hitModel.getParent()) && checkWorkAreaModel(nestedContainer)) {
//       // workArea 안에서 컴포넌트 이동 시 하이라이트 되지 않도록 처리
//       ctx.getSmartGuideContainer().setDragHovered(false);
//       ctx.getSmartGuideContainer().setDragHoveredNewWidget(undefined);
//     } else if (checkPageStudioComponent(nestedContainer)) {
//       ctx.getSmartGuideContainer().setDragHovered(false);
//       ctx.getSmartGuideContainer().setDragHoveredNewWidget(undefined);
//     } else if (
//       ctx.getSmartGuideContainer().getDragHoveredNewWidget() !== nestedContainer &&
//       nestedContainer instanceof WidgetModel &&
//       nestedContainer.getEditingState() !== WidgetEditingState.MOVE &&
//       movedWidgetModels.length > 0
//     ) {
//       // 기존 dragHovered 초기화
//       ctx.getSmartGuideContainer().setDragHovered(false);
//       // 새로운 widget, dragHovered 셋팅
//       ctx.getSmartGuideContainer().setDragHoveredNewWidget(nestedContainer);
//       ctx.getSmartGuideContainer().setDragHovered(true);
//     }

//     // 드래그 도중 속성으로 삽입되는 경우 하이라이트 기능을 위해 셋팅
//     // if (
//     //     ctx.getMetaDataContainer().getReactNodeTypePropMap().get(targetModel.getWidgetType()) &&
//     //     targetModel !== movedWidgetModels[0]
//     // ) {
//     //     ctx.getSmartGuideContainer().setDragHovered(false);
//     //     ctx.getSmartGuideContainer().setDragHoveredWidget(targetModel);
//     //     ctx.getSmartGuideContainer().setDragHovered(true);
//     // }

//     // smart guide(container order) 셋팅
//     if (isLayoutWidgetType(nestedContainer.getWidgetType())) {
//       // const nextSibling = findNextSiblingDragInContainer(
//       //     nestedContainer,
//       //     { x: event.getClientX(), y: event.getClientY() },
//       //     movedWidgetModels.includes(hitModel as WidgetModel)
//       //         ? movedWidgetModels
//       //         : movedWidgetModels.concat(hitModel as WidgetModel)
//       // );
//       // let refX = 0;
//       // let refY = 0;
//       // if (isDefined(nextSibling)) {
//       //     refX = nextSibling.getRefX() ?? 0;
//       //     refY = nextSibling.getRefY() ?? 0;
//       // } else {
//       //     const lastWidget = targetModel.getLastChild();
//       //     if (isUndefined(lastWidget)) {
//       //         refX = 0;
//       //         refY = 0;
//       //     } else if (targetModel.getWidgetType() === 'LayoutVerticalFrame') {
//       //         refX = lastWidget.getRefX() ?? 0;
//       //         refY = (lastWidget.getRefY() ?? 0) + (lastWidget.getRefHeight() ?? 0);
//       //     } else if (targetModel.getWidgetType() === 'LayoutHorizontalFrame') {
//       //         refX = (lastWidget.getRefX() ?? 0) + (lastWidget.getRefWidth() ?? 0);
//       //         refY = lastWidget.getRefY() ?? 0;
//       //     }
//       // }
//       // ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
//       //     x: refX / (ctx.getZoomRatio() / 100),
//       //     y: refY / (ctx.getZoomRatio() / 100),
//       // });
//     } else {
//       ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
//         x: 0,
//         y: 0,
//       });
//     }

//     return true;
//   }

//   /**
//    * 눌렀던 마우스 버튼을 뗄 때
//    */
//   public override onMouseUp(event: DefaultEvent<BaseWidgetModel>, ctx: AkronContext): boolean {
//     event.preventDefault();

//     const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
//     if (!(hitModel instanceof WidgetModel)) return false;

//     if (isUndefined(hitModel)) {
//       return false;
//     }

//     event.stopPropagation();

//     if (staticWidgetTypes.has(hitModel.getWidgetType())) {
//       // do nothing
//       return false;
//     }

//     const state = ctx.getState();
//     const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//     const selectionContainer = ctx.getSelectionContainer();
//     const propContainer = ctx.getPropContainer();
//     propContainer.getWidgetPropContainer().setIsSmartGuide(false);
//     clearSmartGuideStructure();

//     const selectedCompositeKeyModels = selectionContainer.getSelectedCompositeKeyModels();
//     const selectedWidgets = [
//       ...(selectionContainer.getSelectedWidgets() as BaseWidgetModel[]),
//       ...selectedCompositeKeyModels,
//     ];

//     // 입력 값 검증
//     const hitWidgetProps = hitModel.getProps();
//     if (isUndefined(hitWidgetProps)) {
//       dError('hitModelProps are undefined');
//       return false;
//     }

//     if (staticWidgetTypes.has(hitModel.getWidgetType())) {
//       return true;
//     }

//     const widgetEditSubEventState = widgetEditInfoContainer.getWidgetEditSubEventState();
//     if (widgetEditSubEventState === WidgetEditSubEventState.DRAG) {
//       widgetEditInfoContainer.setWidgetEditSubEventState(WidgetEditSubEventState.RELEASED);
//     }

//     if (!this.onMouseUpValidCheck(state, widgetEditInfoContainer, selectionContainer)) {
//       this.finishMoveOnInterrupted(ctx);
//       return true;
//     }

//     // 이동 정상 종료
//     const targetModel = event.getTargetModel();
//     if (!(targetModel instanceof WidgetModel) && !(targetModel instanceof WorkAreaModel)) return false;

//     let widgetModels = selectedWidgets;
//     // select 상태가 아닌 widget을 끌 경우 hitModel로 처리함
//     if (isUndefined(widgetModels) || !widgetModels.includes(hitModel)) {
//       widgetModels = [hitModel];
//     }

//     const movedWidgetModels: WidgetModel[] = widgetModels.filter(
//       widgetModel => widgetModel instanceof WidgetModel && !widgetModel.getLocked()
//     ) as WidgetModel[];

//     const mainMovedWidget = movedWidgetModels[0];
//     if (!mainMovedWidget) return false;

//     const pinnedDirections = hitModel.getPinnedDirections();

//     if (targetModel instanceof WidgetModel && targetModel.getLocked()) {
//       // 삽입하려고 하는 컴포넌트가 잠금일 경우 이동 하기 전 위치로 이동
//       const props: WidgetMoveCommandProps = {
//         commandID: CommandEnum.WIDGET_MOVE_END,
//         targetModels: widgetModels as WidgetModel[],
//         deltaX: 0,
//         deltaY: 0,
//         pinnedDirections,
//       };
//       ctx.setCommandProps(props);

//       const selectionPropObj: ISelectionProp = {
//         selectionType: SelectionEnum.WIDGET,
//         widgetModels,
//       };
//       ctx.setCommandProps({ ...props, selectionProp: selectionPropObj });
//       ctx.getHitContainer().setStartHitItem(undefined);
//       ctx.getSmartGuideContainer().setDragHovered(false);

//       ctx.getSmartGuideContainer().setDragHoveredNewWidget(undefined);
//       ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
//         x: 0,
//         y: 0,
//       });

//       const toastPopupContainer = ctx.getEditorUIStore().getToastPopupContainer();
//       toastPopupContainer.setToastPopupData({
//         message: `${targetModel instanceof PageModel ? '페이지' : '컴포넌트'} 잠금을 해지 후 시도해보세요.`,
//       });
//       return true;
//     }

//     let nestedContainer =
//       movedWidgetModels.length >= 1
//         ? findNestedContainer(ctx, movedWidgetModels[0], targetModel)
//         : (ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel());
//     nestedContainer =
//       (!checkWorkAreaModel(nestedContainer) || !checkPageModel(nestedContainer)) &&
//       movedWidgetModels.every(widget => nestedContainer === findNestedContainer(ctx, widget, targetModel))
//         ? nestedContainer
//         : (ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel());
//     // 부모-자식 역전이 일어나는 경우 child로 삽입하지 않음
//     if (widgetModels?.some(widget => isAncestor(widget, nestedContainer))) {
//       nestedContainer = ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel();
//     }

//     const destParent = checkTopParentIsWorkArea(targetModel)
//       ? ctx.getSelectionContainer()?.getEditingNewWorkArea()
//       : ctx.getSelectionContainer()?.getEditingNewWorkArea()?.getFirstChild();

//     const props: WidgetMoveCommandProps = {
//       commandID: CommandEnum.WIDGET_MOVE_END,
//       targetModels: movedWidgetModels as WidgetModel[],
//       useRefPosition: true,
//       deltaX: widgetEditInfoContainer.getDeltaX(),
//       deltaY: widgetEditInfoContainer.getDeltaY(),
//       pinnedDirections,
//       changeTopWidgetModel:
//         checkTopParentIsWorkArea(movedWidgetModels[0].getParent()) !== checkTopParentIsWorkArea(targetModel)
//           ? destParent
//           : undefined,
//       container:
//         nestedContainer !== selectionContainer?.getEditingNewWorkArea() &&
//         nestedContainer !== selectionContainer?.getEditingNewWorkArea()?.getFirstChild() &&
//         nestedContainer.getWidgetType() !== 'InnerPageLayout' &&
//         nestedContainer instanceof WidgetModel &&
//         nestedContainer.getDragHovered()
//           ? nestedContainer
//           : undefined,
//       isMovedToPage:
//         !checkPageOrWorkAreaModel(movedWidgetModels[0].getParent()) &&
//         (nestedContainer === selectionContainer?.getEditingNewWorkArea() ||
//           nestedContainer === selectionContainer?.getEditingNewWorkArea()?.getFirstChild()),
//       mousePosition: isLayoutWidgetType(nestedContainer.getWidgetType())
//         ? { x: event.getClientX(), y: event.getClientY() }
//         : undefined,
//       desModel:
//         targetModel.getWidgetTypeId() === SystemComponentType.WorkArea ||
//         (targetModel as WidgetModel).getEditingState() === WidgetEditingState.NONE
//           ? targetModel
//           : undefined,
//     };
//     ctx.setCommandProps(props);

//     // 원래 단위로 복원
//     if (hitModel instanceof WidgetModel) {
//       const originalUnit = this.originalUnits.get(hitModel.getID().toString());
//       const currentParent = hitModel.getParent();

//       if (originalUnit && currentParent) {
//         runInAction(() => {
//           if (originalUnit.width === '%' && currentParent instanceof WidgetModel) {
//             const pxWidth = hitModel.getWidth().value;
//             const parentWidth = currentParent.getRefWidth() ?? 0;
//             const percentValue = (Number(pxWidth) / Number(parentWidth)) * 100;
//             hitModel.setWidth({ value: percentValue, unit: '%' });
//           }
//           if (originalUnit.height === '%' && currentParent instanceof WidgetModel) {
//             const pxHeight = hitModel.getHeight().value;
//             const parentHeight = currentParent.getRefHeight() ?? 0;
//             const percentValue = (Number(pxHeight) / Number(parentHeight)) * 100;
//             hitModel.setHeight({ value: percentValue, unit: '%' });
//           }
//         });
//       }

//       this.originalUnits.delete(hitModel.getID().toString());
//     }

//     ctx.getSmartGuideContainer().setDragHovered(false);
//     ctx.getSmartGuideContainer().setDragHoveredNewWidget(undefined);
//     ctx.getSmartGuideContainer().setContainerGuidelineStartPosition({
//       x: 0,
//       y: 0,
//     });

//     ctx.getWidgetEditInfoContainer().setRealTimePosition(null);
//     this.originalPositions.clear();

//     return true;
//   }

//   /**
//    * Mouse Leave
//    */
//   public override onMouseLeave(event: MouseEvent<WidgetModel>, ctx: AppContext): boolean {
//     this.finishMoveOnInterrupted(ctx);

//     return true;
//   }

//   /**
//    * onKeyDown
//    */
//   public override onKeyDown(event: KeyEvent<WidgetModel>, ctx: AppContext): boolean {
//     switch (true) {
//       case /^Escape$/.test(event.getKey()): {
//         event.stopPropagation();
//         this.finishMoveOnInterrupted(ctx);

//         return true;
//       }
//       case /^Delete$/.test(event.getKey()): {
//         // edit context 초기화를 위해 호출
//         clearWidgetModelEditContext(ctx);

//         // useGlobalHokeyHandler에서 이후 과정 처리
//         return true;
//       }
//       default: {
//         break;
//       }
//     }

//     event.stopPropagation();

//     return true;
//   }

//   /**
//    * onKeyUp
//    */
//   public override onKeyUp(event: KeyEvent<WidgetModel>): boolean {
//     event.stopPropagation();

//     return true;
//   }

//   /**
//    * Widget Move Event onMouseMove event의 valid를 check하는 함수
//    *
//    * @param eventState AppContext에 저장되어있는 현재 event state
//    * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
//    * @returns true: **valid**, false: **Invalid** -> should abort
//    */
//   private onMouseMoveValidCheck(eventState: EventState, widgetEditInfoContainer: WidgetEditInfoContainer): boolean {
//     const widgetEditEventSubState = widgetEditInfoContainer.getWidgetEditSubEventState();

//     if (eventState !== EventState.WIDGET_MOVE || widgetEditEventSubState !== WidgetEditSubEventState.DRAG) {
//       return false;
//     }

//     return true;
//   }

//   /**
//    * Widget Move Event onMouseUp event의 valid를 check하는 함수
//    *
//    * @param eventState AppContext에 저장되어있는 현재 event state
//    * @param widgetEditInfoContainer widgetModel의 편집 정보가 담겨있는 container
//    * @param selectionContainer selection 정보가 담겨있는 container
//    * @returns true: **valid** , false: **Invalid** -> should abort
//    */
//   private onMouseUpValidCheck(
//     eventState: EventState,
//     widgetEditInfoContainer: WidgetEditInfoContainer,
//     selectionContainer: Nullable<SelectionContainer>
//   ): boolean {
//     if (
//       eventState !== EventState.WIDGET_MOVE ||
//       !selectionContainer ||
//       (selectionContainer.getSelectedWidgets().length === 0 &&
//         selectionContainer.getSelectedCompositeModels().length === 0) ||
//       !(
//         selectionContainer.getSelectedWidgets().includes(widgetEditInfoContainer.getEditingWidgetModels()[0]) ||
//         selectionContainer
//           .getSelectedCompositeKeyModels()
//           .includes(widgetEditInfoContainer.getEditingWidgetModels()[0] as WidgetModel)
//       )
//     ) {
//       return false;
//     }
//     return true;
//   }

//   /**
//    * 마우스 드래그를 통한 move 도중 ESC 키 입력, 우클릭 등의 이벤트로 인해 종료되는 경우에 호출
//    */
//   private finishMoveOnInterrupted(ctx: AppContext): void {
//     const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//     const selectionContainer = ctx.getSelectionContainer();

//     if (isUndefined(selectionContainer)) {
//       ctx.getSmartGuideContainer().setDragHovered(false);
//       return;
//     }

//     const startHitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
//     if (startHitModel instanceof WidgetModel) {
//       const originalUnit = this.originalUnits.get(startHitModel.getID().toString());
//       const currentParent = startHitModel.getParent();

//       if (originalUnit && currentParent) {
//         runInAction(() => {
//           if (originalUnit.width === '%') {
//             const pxWidth = startHitModel.getWidth().value;
//             const parentWidth = currentParent instanceof WidgetModel ? (currentParent.getRefWidth() ?? 0) : 0;
//             const percentValue = (Number(pxWidth) / Number(parentWidth)) * 100;
//             startHitModel.setWidth({ value: percentValue, unit: '%' });
//           }
//           if (originalUnit.height === '%') {
//             const pxHeight = startHitModel.getHeight().value;
//             const parentHeight = (currentParent as WidgetModel).getRefHeight() ?? 0;
//             const percentValue = (Number(pxHeight) / Number(parentHeight)) * 100;
//             startHitModel.setHeight({ value: percentValue, unit: '%' });
//           }
//         });
//       }

//       this.originalUnits.clear();
//       this.originalPositions.clear();
//     }

//     const selectedWidgets = selectionContainer.getSelectedWidgets();
//     const editingWidgets = widgetEditInfoContainer.getEditingWidgetModels();

//     const needToChangeSelection = editingWidgets.length > 0 && !selectedWidgets.includes(editingWidgets[0]);
//     const selectedWidgetsOnFinish = needToChangeSelection ? editingWidgets : selectedWidgets;

//     if (selectedWidgetsOnFinish.length > 0) {
//       const mainWidget = selectedWidgetsOnFinish[0];
//       const pinDirections = mainWidget instanceof WidgetModel ? mainWidget.getPinnedDirections() : [];

//       const commandProps: WidgetMoveCommandProps = {
//         commandID: CommandEnum.WIDGET_MOVE_END,
//         targetModels: selectedWidgetsOnFinish as WidgetModel[],
//         deltaX: widgetEditInfoContainer.getDeltaX(),
//         deltaY: widgetEditInfoContainer.getDeltaY(),
//         pinnedDirections: pinDirections,
//       };
//       ctx.setCommandProps(commandProps);

//       const selectionPropObj: ISelectionProp = {
//         selectionType: SelectionEnum.WIDGET,
//         widgetModels: selectedWidgetsOnFinish ?? [],
//       };
//       ctx.setCommandProps({ ...commandProps, selectionProp: selectionPropObj });
//     }

//     ctx.getWidgetEditInfoContainer().setRealTimePosition(null);
//     clearWidgetModelEditContext(ctx);
//     ctx.getSmartGuideContainer().setDragHovered(false);
//   }

//   /**
//    * 이동 가능한 방향을 판단하는 함수
//    */
//   private shouldKeepPosition(pinnedDirections: string[]): { keepX: boolean; keepY: boolean } {
//     if (
//       pinnedDirections.includes('center') ||
//       (pinnedDirections.includes('top') &&
//         pinnedDirections.includes('bottom') &&
//         pinnedDirections.includes('left') &&
//         pinnedDirections.includes('right'))
//     ) {
//       return { keepX: true, keepY: true };
//     }

//     return {
//       keepX: pinnedDirections.includes('left') || pinnedDirections.includes('right'),
//       keepY: pinnedDirections.includes('top') || pinnedDirections.includes('bottom'),
//     };
//   }
// }

// export default WidgetMoveEventHandler;
