// import { IWidgetCommonProperties, BaseWidgetModel, isUndefined, dError, isDefined } from "@akron/runner";
// import { boundMethod } from "autobind-decorator";
// import { runInAction } from "mobx";
// import PageModel from "models/node/PageModel";
// import WidgetModel, { WidgetTypeID, WidgetID } from "models/node/WidgetModel";
// import CommandEnum from "models/store/command/common/CommandEnum";
// import CommandHandler from "models/store/command/common/CommandHandler";
// import WidgetCommandProps from "models/store/command/widget/WidgetCommandProps";
// import NewAppendWidgetCommand from "models/store/command/widget/AppendWidgetCommand";
// import NewRemoveWidgetCommand from "models/store/command/widget/RemoveWidgetCommand";
// import { WidgetEditingState } from "models/store/command/widget/WidgetModelTypes";
// import { DragInsertWidgetInfo, WidgetResizeHandle, WidgetPosition, isVerticalCenterHandle, isHorizontalCenterHandle } from "models/store/container/WidgetEditInfoContainer";
// import SelectionEnum from "models/store/selection/SelectionEnum";

// /**
//  * 삽입과 동시에 속성을 특정 값으로 설정해야 할 때 사용.
//  * 현재 방식: 속성의 메타데이터 ID를 가지고, 모델의 props에 일치하는 ID의 속성들을 덮어씀.
//  * 이유: 속성 ID는 모델 생성 뒤에 나옴.
//  */
// type InitializeProperties = Array<WidgetProp>;

// /**
//  * Widget 삽입 시 필요한 Props
//  */
// export type NewInsertWidgetCommandProps<Props extends IWidgetCommonProperties = IWidgetCommonProperties> =
//     WidgetCommandProps & {
//         commandID: CommandEnum.INSERT_WIDGET;
//         widgetTypeId: WidgetTypeID;
//         widgetType: string;
//         initializeProperties?: InitializeProperties;
//         widgetName?: string;
//     };

// /**
//  * Widget 을 특정 위치에 삽입 시 필요한 Props
//  */
// export type NewInsertWidgetAtCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET_AT;
//     widgetTypeId: WidgetTypeID;
//     widgetID: WidgetID;
//     widgetType: string;
//     posX: number;
//     posY: number;
//     initializeProperties?: InitializeProperties;
//     parentWidgetModel?: BaseWidgetModel; // 내부 로직에서 parent가 없다면 parent를 찾도록 함
//     cloneWidget?: NewWidgetModel;

//     libraryID?: number;
//     libraryDependencyData?: LibraryDependencyData;
//     insertedPuxLibraryInfoMap?: InsertedPuxLibraryInfoMap;
// };

// /**
//  * Widget 삽입 시 필요한 Props
//  */
// export type InsertWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET;
//     widgetType: InsertableWidgetType;
//     widgetID: WidgetID;
//     // 부모 Widget을 지정해줘야할 때 사용.
//     parentWidgetModel?: NewWidgetModel;
//     // 삽입과 동시에 속성을 특정 값으로 설정해야 할 때 사용. (기존 속성 => 새 속성)
//     initializeProperties?: (defaultProperties: WidgetModelProperties) => WidgetModelProperties;
// };

// /**
//  * Widget 을 특정 위치에 삽입 시 필요한 Props
//  */
// export type InsertWidgetAtCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET_AT;
//     widgetType: InsertableWidgetType;
//     widgetID: WidgetID;
//     posX: number;
//     posY: number;
//     initializeProperties?: (defaultProperties: WidgetModelProperties) => WidgetModelProperties;
//     // clone으로 삽입하는 경우
//     cloneWidget?: NewWidgetModel;
//     mousePosition?: NewWidgetModel;
//     // clone으로 삽입 시 name 신규 부여할지 여부
//     reName?: boolean;
// };

// /**
//  * Widget drag 삽입 시작 시 필요한 작업을 위한 command
//  */
// export type SetInfoForInsertDragWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.SET_INFO_FOR_INSERT_DRAG_WIDGET;
//     dragInsertWidgetInfo: DragInsertWidgetInfo | undefined;
// };

// /**
//  * Widget 템플릿의 복사본을 삽입 시 필요한 Props
//  */
// export type InsertWidgetCloneCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET_CLONE;
//     widgetModel: NewWidgetModel;
//     libraryID?: number;
//     widgetType?: string;
//     libraryDependencyData?: LibraryDependencyData;
//     insertedPuxLibraryInfoMap?: InsertedPuxLibraryInfoMap;
// };

// /**
//  * Widget 템플릿의 복사본을 삽입 시 필요한 Props
//  */
// export type NewInsertWidgetFragmentModelCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET_FRAGMENT_MODEL;
//     parentWidgetModel: NewWidgetModel;
//     widgetName: string;
//     initializeProperties?: InitializeProperties;
//     preserveSelection?: boolean;
// };

// /**
//  * Widget 삭제 시 필요한 Props
//  */
// export type NewDeleteWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.DELETE_WIDGET | CommandEnum.CLIPBOARD_CUT_PROCESS;
//     targetModels?: (NewWidgetModel | BaseWidgetModel)[];
// };

// /**
//  * Widget 삭제 시 필요한 Props
//  */
// export type DeleteWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.DELETE_WIDGET | CommandEnum.CLIPBOARD_CUT_PROCESS;
// };

// /**
//  * Widget 이름 변경시 필요한 Props
//  */
// export type RenameWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.RENAME_WIDGET;
//     targetModel: WidgetModel;
//     componentNewName: string;
// };

// /**
//  * Widget 숨김 시 필요한 Props
//  */
// export type HideWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.HIDE_WIDGET;
//     targetModel: WidgetModel;
//     hidden: boolean;
//     compositeModel?: CompositeModel;
// };

// /**
//  * Widget 잠금 시 필요한 Props
//  */
// export type LockWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.LOCK_WIDGET;
//     targetModel: NewWidgetModel;
//     locked: boolean;
//     compositeModel?: CompositeModel;
// };

// /**
//  * Widget 끌어서 이동 시작 시 필요한 Props
//  */
// export type WidgetMoveStartCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_MOVE_START;
//     targetModels: NewWidgetModel[];
// };

// /**
//  * Widget 끌어서 이동 종료 시 필요한 Props
//  */
// type WidgetMoveEndCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_MOVE_END;
//     targetModels: NewWidgetModel[];
//     useRefPosition?: boolean;
//     byKeyEvent?: boolean;
//     deltaX: number;
//     deltaY: number;
//     pinnedDirections: string[];
//     changeTopWidgetModel?: NewWidgetModel | undefined;
//     container?: NewWidgetModel | undefined;
//     isMovedToPage?: boolean;
//     mousePosition?: { x: number; y: number };
//     desModel?: NewWidgetModel | WorkAreaModel;
// };

// /**
//  * Widget 끌어서 ReactNode type prop으로 drop 시 필요한 Props
//  */
// export type WidgetMoveToReactNodePropCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_MOVE_REACTNODE_PROP;
//     propName: string;
// };

// /**
//  * Widget을 끌어서 이동하는 기능에 필요한 Props
//  */
// export type WidgetMoveCommandProps =
//     | WidgetMoveStartCommandProps
//     | WidgetMoveEndCommandProps
//     | WidgetMoveToReactNodePropCommandProps;

// /**
//  * Widget update 시 필요한 Props
//  */
// export type WidgetUpdateCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_UPDATE_PROPERTIES;
//     targetModel: NewWidgetModel[];
//     newWidgetProps: IWidgetPartofProperties;
//     prevWidgetProps?: IWidgetCommonProperties;
// };

// /**
//  * Widget의 Props update 시 필요한 Props
//  */
// export type NewUpdateWidgetCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_UPDATE_PROPERTIES;
//     targetModel: NewWidgetModel[];
//     newWidgetProps: IWidgetPropValueData[];
//     prevWidgetProps?: IWidgetPropValueData[];
// };

// /**
//  * Widget의 Sub Component Count update 시 필요한 Props
//  */
// export type NewUpdateWidgetSubComponentCountCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_UPDATE_SUB_COMPONENT_COUNT;
//     targetModel: NewWidgetModel[];
//     newWidgetProps: IWidgetPropValueData[];
//     prevWidgetProps?: IWidgetPropValueData[];
//     controlSubComponentCounts?: ControlSubComponentCount[];
// };

// /**
//  * widget property binding 해제 및 value 초기화
//  */
// export type resetWidgetContentCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.RESET_WIDGET_CONTENT;
//     propertyKey: string;
//     newWidgetProps: IWidgetPartofProperties;
// };

// /**
//  * Widget 끌어서 resize 시작 시 필요한 Props
//  */
// type WidgetResizeStartCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_RESIZE_START;
//     targetModels: NewWidgetModel[];
// };

// /**
//  * Widget 끌어서 resize 종료 시 필요한 Props
//  */
// export type WidgetResizeEndCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_RESIZE_END;
//     targetModels: NewWidgetModel[];
//     deltaX: number;
//     deltaY: number;
//     deltaWidth: number;
//     deltaHeight: number;
// };

// /**
//  * Widget 끌어서 resize 종료 시 필요한 Props
//  */
// export type WidgetResizingCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.WIDGET_RESIZING;
//     targetModels: NewWidgetModel[];
//     deltaX: number;
//     deltaY: number;
//     deltaWidth: number;
//     deltaHeight: number;
// };

// /**
//  * widget을 끌어서 resize할 때 필요한 Props
//  */
// export type WidgetResizeCommandProps =
//     | WidgetResizeStartCommandProps
//     | WidgetResizeEndCommandProps
//     | WidgetResizingCommandProps;
// // | AbortWidgetResizeCommandProps;

// /**
//  * widgetModel의 repeatablePropsDTOMap을 업데이트할 때 필요한 Props
//  */
// export type UpdateRepeatablePropsDTOMapCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.UPDATE_REPEATABLE_PROPS_DTO_MAP;
//     dataBindingContainer: DataBindingContainer;
//     widgetModel: NewWidgetModel;
//     DTOID: number;
//     customPropName: string;
//     DTODataValueName: string;
// };

// /**
//  * widgetModel의 repeatablePropsDTOMap에서 데이터를 제거할 때 필요한 Props
//  */
// export type DeleteRepeatablePropsDTOMapCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.DELETE_REPEATABLE_PROPS_DTO_MAP;
//     dataBindingContainer: DataBindingContainer;
//     widgetModel: NewWidgetModel;
//     DTOID: number;
//     customPropName: string;
// };

// /**
//  * widgetModel의 customPropsVariableMap을 업데이트할 때 필요한 Props
//  */
// export type UpdateCustomPropsVariableMapCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.UPDATE_CUSTOM_PROPS_VARIABLE_MAP;
//     dataBindingContainer: DataBindingContainer;
//     widgetModel: NewWidgetModel;
//     variableID: number;
//     customPropID: DataID;
//     variableMemberName: string;
// };

// /**
//  * widgetModel의 customPropsVariableMap 삭제시 필요한 Props
//  */
// export type DeleteCustomPropsVariableMapCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.DELETE_CUSTOM_PROPS_VARIABLE_MAP;
//     dataBindingContainer: DataBindingContainer;
//     widgetModel: NewWidgetModel;
//     variableID?: number;
//     customPropID?: DataID;
// };

// /**
//  * Conditional Layout에 프레임(Fragment Layout) 추가 시 필요한 Props
//  */
// export type InsertConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_CONDITIONAL_LAYOUT_FRAME;
//     conditionalModel: NewWidgetModel;
//     newFrameName: string;
//     newWidgetID: WidgetID;
// };

// /**
//  * Conditional Layout에서 프레임(Fragment Layout) 삭제 시 필요한 Props
//  */
// export type DeleteConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.DELETE_CONDITIONAL_LAYOUT_FRAME;
//     conditionalModel: NewWidgetModel;
//     frameName: string;
// };

// /**
//  * Conditional Layout에서 프레임(Fragment Layout) 수정 시 필요한 Props
//  */
// export type UpdateConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//     commandID: CommandEnum.UPDATE_CONDITIONAL_LAYOUT_FRAME;
//     conditionalModel: NewWidgetModel;
//     frameName: string;
//     newFrameName: string;
// };

// /**
//  * Widget Size 업데이트시 필요한 Props
//  */
// export type UpdateWidgetSizeProps = {
//     commandID: CommandEnum.UPDATE_SIZE;
//     newSize: { width: WidgetSize; height: WidgetSize };
//     newWidgetModel: NewWidgetModel;
// };

// /**
//  * Widget Position 업데이트시 필요한 Props
//  */
// export type UpdateWidgetPositionProps = {
//     commandID: CommandEnum.UPDATE_POSITION;
//     newPosition: UpdatePosition;
//     newWidgetModel: NewWidgetModel;
// };

// /**
//  * WidgetCommandProp의 집합입니다.
//  */
// type WidgetEditCommandProps =
//     | NewInsertWidgetCommandProps
//     | NewInsertWidgetAtCommandProps
//     | NewDeleteWidgetCommandProps
//     | SetInfoForInsertDragWidgetCommandProps
//     // | InsertWidgetAtCommandProps
//     | InsertWidgetCloneCommandProps
//     | NewInsertWidgetFragmentModelCommandProps
//     // | DeleteWidgetCommandProps
//     | RenameWidgetCommandProps
//     | HideWidgetCommandProps
//     | LockWidgetCommandProps
//     | WidgetMoveCommandProps
//     // | WidgetUpdateCommandProps
//     | NewUpdateWidgetCommandProps
//     | NewUpdateWidgetSubComponentCountCommandProps
//     | WidgetResizeCommandProps
//     | UpdateRepeatablePropsDTOMapCommandProps
//     | DeleteRepeatablePropsDTOMapCommandProps
//     | UpdateCustomPropsVariableMapCommandProps
//     | DeleteCustomPropsVariableMapCommandProps
//     | resetWidgetContentCommandProps
//     | InsertConditionalLayoutFrameCommandProps
//     | DeleteConditionalLayoutFrameCommandProps
//     | UpdateConditionalLayoutFrameCommandProps
//     | UpdateWidgetSizeProps
//     | UpdateWidgetPositionProps;

// /**
//  * WidgetModel의 숨김 상태를 반영하는 함수
//  */
// export function applyHiddenCommand(ctx: AppContext, widgetModel: NewWidgetModel, hidden: boolean): void {
//     const hiddenCommand = new UpdateHiddenCommand(widgetModel, hidden);
//     ctx.getCommand()?.append(hiddenCommand);
// }

// /**
//  * Widget 편집 동작을 처리하는 CommandHandler
//  */
// class WidgetEditCommandHandler extends CommandHandler {
//     /**
//      * Widget 편집  관련 커맨드를 처리합니다
//      */
//     public processCommand(props: WidgetEditCommandProps, ctx: AppContext): boolean {
//         switch (props.commandID) {
//             case CommandEnum.INSERT_WIDGET:
//                 this.insertWidget(ctx, props);
//                 break;
//             case CommandEnum.INSERT_WIDGET_AT:
//                 this.insertWidgetAt(ctx, props);
//                 break;
//             case CommandEnum.INSERT_WIDGET_CLONE:
//                 this.insertWidgetClone(ctx, props);
//                 break;
//             case CommandEnum.INSERT_WIDGET_FRAGMENT_MODEL:
//                 this.insertWidgetFragmentModel(ctx, props);
//                 break;
//             case CommandEnum.DELETE_WIDGET:
//                 this.deleteWidget(ctx, props);
//                 break;
//             case CommandEnum.CLIPBOARD_CUT_PROCESS:
//                 if (
//                     isUndefined(ctx.getSelectionContainer()) ||
//                     !isWidgetsDeletable([
//                         ...ctx.getSelectionContainer().getSelectedWidgets(),
//                         ...ctx.getSelectionContainer().getSelectedCompositeKeyModels(),
//                     ])
//                 ) {
//                     return false;
//                 }
//                 this.deleteWidget(ctx, props);
//                 return true;
//             case CommandEnum.RENAME_WIDGET:
//                 this.renameWidget(ctx, props);
//                 break;
//             case CommandEnum.HIDE_WIDGET:
//                 this.hideWidget(ctx, props);
//                 break;
//             case CommandEnum.LOCK_WIDGET:
//                 this.lockWidget(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_RESIZE_START:
//                 this.resizeWidgetStart(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_RESIZING:
//                 this.resizingWidget(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_RESIZE_END:
//                 this.resizeWidgetEnd(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_MOVE_START:
//                 this.moveWidgetStart(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_MOVE_END:
//                 this.moveWidgetEnd(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_MOVE_REACTNODE_PROP:
//                 this.moveToReactNodeProp(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_UPDATE_PROPERTIES:
//                 this.updateWidgetProps(ctx, props);
//                 break;
//             case CommandEnum.WIDGET_UPDATE_SUB_COMPONENT_COUNT:
//                 this.updateWidgetSubComponentCount(ctx, props);
//                 break;
//                 break;
//             case CommandEnum.UPDATE_REPEATABLE_PROPS_DTO_MAP:
//                 // ctx.getCommand()?.append(
//                 //     new UpdateRepeatablePropsDTOMapCommand(
//                 //         props.widgetModel,
//                 //         props.dataBindingContainer,
//                 //         props.DTOID,
//                 //         props.customPropName,
//                 //         props.DTODataValueName
//                 //     )
//                 // );
//                 break;
//             case CommandEnum.DELETE_REPEATABLE_PROPS_DTO_MAP:
//                 // ctx.getCommand()?.append(
//                 //     new DeleteRepeatablePropsDTOMapCommand(
//                 //         props.widgetModel,
//                 //         props.dataBindingContainer,
//                 //         props.DTOID,
//                 //         props.customPropName
//                 //     )
//                 // );
//                 break;
//             case CommandEnum.UPDATE_CUSTOM_PROPS_VARIABLE_MAP:
//                 ctx.getCommand()?.append(
//                     new UpdateCustomPropsVariableMapCommand(
//                         props.widgetModel.getID(),
//                         props.dataBindingContainer,
//                         props.variableID,
//                         Number(props.customPropID),
//                         props.variableMemberName
//                     )
//                 );
//                 break;
//             case CommandEnum.DELETE_CUSTOM_PROPS_VARIABLE_MAP:
//                 // ctx.getCommand()?.append(
//                 //     new DeleteCustomPropsVariableMapCommand(
//                 //         props.widgetModel,
//                 //         props.dataBindingContainer,
//                 //         props.variableID,
//                 //         Number(props.customPropID)
//                 //     )
//                 // );
//                 break;
//             case CommandEnum.RESET_WIDGET_CONTENT:
//                 this.resetWidgetContent(ctx, props);
//                 break;
//             case CommandEnum.INSERT_CONDITIONAL_LAYOUT_FRAME:
//                 this.insertConditionalLayoutFrame(ctx, props);
//                 break;
//             case CommandEnum.DELETE_CONDITIONAL_LAYOUT_FRAME:
//                 this.deleteConditionalLayoutFrame(ctx, props);
//                 break;
//             case CommandEnum.UPDATE_CONDITIONAL_LAYOUT_FRAME:
//                 this.updateConditionalLayoutFrame(ctx, props);
//                 break;
//             case CommandEnum.SET_INFO_FOR_INSERT_DRAG_WIDGET:
//                 this.setInfoForInsertDragWidget(ctx, props);
//                 break;
//             case CommandEnum.UPDATE_SIZE:
//                 this.updateWidgetSize(ctx, props);
//                 break;
//             case CommandEnum.UPDATE_POSITION:
//                 this.updateWidgetPosition(ctx, props);
//                 break;
//             default:
//                 return false;
//         }
//         return true;
//     }

//     /**
//      * Widget 삽입
//      */
//     @boundMethod
//     private insertWidget(ctx: AppContext, props: NewInsertWidgetCommandProps) {
//         const newWidgetModel = this.newCreateNewWidgetModel(
//             ctx,
//             props.widgetTypeId,
//             props.widgetType,
//             props.widgetName
//         ) as WorkAreaModel | NewWidgetModel | undefined;

//         if (isUndefined(newWidgetModel)) {
//             dError(`Widget 생성에 쓸 default model이 없습니다! (Type Id: ${props.widgetTypeId})`);
//             return;
//         }

//         this.insertGivenWidgetModel(ctx, {
//             newWidgetModel,
//             isClone: false,
//             initializeProperties: props.initializeProperties,
//             widgetTypeID: props.widgetTypeId,
//         });

//         ctx.getEditorUIStore().setIsLogicToolpaneOpen(false);
//         ctx.getEditorUIStore().setIsConditionalTypeToolpaneOpen(false);
//     }

//     /**
//      * Widget 삽입 at pos
//      */
//     @boundMethod
//     private insertWidgetAt(ctx: AppContext, props: NewInsertWidgetAtCommandProps) {
//         const workAreaModel = ctx.getSelectionContainer().getEditingNewWorkArea();
//         let newWidgetModel;
//         if (isDefined(props.cloneWidget)) {
//             newWidgetModel = props.cloneWidget.cloneNode(ctx.getIdContainerController()) as NewWidgetModel;
//             const { libraryID, libraryDependencyData, insertedPuxLibraryInfoMap } = props;

//             if (isDefined(libraryDependencyData) && isDefined(insertedPuxLibraryInfoMap) && isDefined(libraryID)) {
//                 appendDependencyTemplateData(ctx, libraryID, libraryDependencyData, insertedPuxLibraryInfoMap);

//                 const libraryInfoMap = ctx.getInsertedPuxLibraryInfoMap().get(libraryID);

//                 if (isDefined(libraryInfoMap)) {
//                     updatePropsOldIdToNewId(ctx.getDataStore(), newWidgetModel, libraryInfoMap);
//                 }
//             }

//             if (props.widgetType === ComponentTypeEnum.PUX) {
//                 const fileContainer = ctx.getFileContainer();
//                 const { fileComponentRelationMap } = ctx.getLibraryContainer();
//                 const widgetArray = props.cloneWidget.changeTreeToArray();
//                 const copiedWidgetArray = newWidgetModel.changeTreeToArray();
//                 const newFileComponentRelationMap = copyFileComponentRelation(
//                     fileComponentRelationMap,
//                     widgetArray,
//                     copiedWidgetArray
//                 );
//                 newFileComponentRelationMap.forEach(fileComponentRelations => {
//                     fileComponentRelations.forEach(relation => {
//                         const insertFileComponentRelationCommandProps = new InsertFileComponentRelationCommand(
//                             fileContainer,
//                             relation
//                         );
//                         ctx.getCommand()?.append(insertFileComponentRelationCommandProps);
//                     });
//                 });
//             }
//         } else {
//             newWidgetModel = this.newCreateNewWidgetModel(ctx, props.widgetTypeId, props.widgetType) as
//                 | NewWidgetModel
//                 | undefined;
//         }

//         if (!newWidgetModel) {
//             return;
//         }

//         newWidgetModel.getPosition().left = {
//             value: props.posX,
//             unit: 'px',
//         };
//         newWidgetModel.getPosition().top = {
//             value: props.posY,
//             unit: 'px',
//         };

//         if (isUndefined(newWidgetModel)) {
//             dError(`Widget 생성에 쓸 default model이 없습니다! (Type Id: ${props.widgetTypeId})`);
//             return;
//         }
//         this.insertGivenWidgetModel(ctx, {
//             newWidgetModel,
//             isClone: false,
//             initializeProperties: props.initializeProperties,
//             isPositioned: true,
//             parentWidgetModel: checkDialogComponent(newWidgetModel) ? workAreaModel : props.parentWidgetModel,
//             widgetTypeID: props.widgetTypeId,
//         });
//     }

//     /**
//      * 주어진 widget model을 복사하여 app에 삽입.
//      */
//     @boundMethod
//     private insertWidgetClone(ctx: AppContext, props: InsertWidgetCloneCommandProps) {
//         const newWidgetModel = props.widgetModel.cloneNode(ctx.getIdContainerController()) as NewWidgetModel;
//         const appID = ctx.getAppID();

//         const { libraryDependencyData, insertedPuxLibraryInfoMap, libraryID } = props;
//         if (isUndefined(libraryID)) {
//             // 오류 case
//             return;
//         }
//         if (isDefined(libraryDependencyData) && isDefined(insertedPuxLibraryInfoMap)) {
//             appendDependencyTemplateData(ctx, libraryID, libraryDependencyData, insertedPuxLibraryInfoMap);

//             const libraryInfoMap = ctx.getInsertedPuxLibraryInfoMap().get(libraryID);

//             if (isDefined(libraryInfoMap)) {
//                 updatePropsOldIdToNewId(ctx.getDataStore(), newWidgetModel, libraryInfoMap);
//             }
//         }

//         if (props.widgetType === ComponentTypeEnum.PUX) {
//             // 파일-컴포넌트 매핑 정보 복사
//             const widgetArray = props.widgetModel.changeTreeToArray();
//             const copiedWidgetArray = newWidgetModel.changeTreeToArray();
//             copyLibraryFileRelationsAndApply({
//                 ctx,
//                 libraryId: props.libraryID,
//                 widgetArray,
//                 copiedWidgetArray,
//             });

//             // eventModel 새로 생성
//             const eventHandlerMap = new Map<number, NewEventHandlerModel>(); // <originHandlerId, model>
//             const eventHandlers = ctx.getNewBusinessContainer().getPUXEventHandlerMap(libraryID);
//             const eventChains = ctx.getNewBusinessContainer().getPUXEventChainMap(libraryID);
//             eventHandlers?.forEach(eventHandler => {
//                 const chain: number[] = [];
//                 const newHandlerId = ctx.getIdContainerController().generatePropsEventHandlerId();

//                 eventHandler.chain.forEach(chainId => {
//                     const puxChainModel = eventChains?.get(chainId);
//                     if (puxChainModel) {
//                         const newChainId = ctx.getIdContainerController().generatePropsEventChainId();
//                         chain.push(newChainId);

//                         const newChainModel: NewEventChainModel = new NewEventChainModel({
//                             appID,
//                             chainID: newChainId,
//                             businessLogicTypeID: puxChainModel.businessLogicTypeID,
//                             args: puxChainModel.args,
//                         });

//                         const command = new InsertNewEventChainCommand(ctx.getNewBusinessContainer(), newChainModel);
//                         ctx.getCommand()?.append(command);
//                     }
//                 });

//                 const newHandlerModel: NewEventHandlerModel = new NewEventHandlerModel({
//                     appID,
//                     handlerID: newHandlerId,
//                     condition: eventHandler.condition,
//                     chain,
//                 });

//                 const command = new InsertNewEventHandlerCommand(ctx.getNewBusinessContainer(), newHandlerModel);
//                 ctx.getCommand()?.append(command);

//                 eventHandlerMap.set(eventHandler.handlerID, newHandlerModel);
//             });

//             newWidgetModel.getProps().forEach(prop => {
//                 const handlerModel = eventHandlerMap.get(prop.eventHandler[0]);
//                 if (handlerModel) {
//                     prop.eventHandler = [handlerModel.handlerID];
//                 }
//             });
//         }

//         this.insertGivenWidgetModel(ctx, {
//             newWidgetModel,
//             isClone: true,
//         });
//     }

//     /**
//      * 주어진 widget model을 복사하여 app에 삽입.
//      */
//     @boundMethod
//     private insertWidgetFragmentModel(ctx: AppContext, props: NewInsertWidgetFragmentModelCommandProps) {
//         const newWidgetModel = this.newCreateNewWidgetModel(
//             ctx,
//             SystemComponentType.Fragment,
//             'Fragment',
//             props.widgetName
//         ) as NewWidgetModel | undefined;

//         if (isUndefined(newWidgetModel)) {
//             dError(`Widget 생성에 쓸 default model이 없습니다! (Type Id: ${147})`);
//             return;
//         }

//         this.insertGivenWidgetModel(ctx, {
//             newWidgetModel,
//             isClone: false,
//             initializeProperties: props.initializeProperties,
//             widgetTypeID: 147,
//             parentWidgetModel: props.parentWidgetModel,
//             preserveSelection: props.preserveSelection,
//         });

//         ctx.getEditorUIStore().setIsLogicToolpaneOpen(false);
//     }

//     /**
//      * 주어진 type에 해당하는 새 widget을 생성.
//      */
//     @boundMethod
//     private newCreateNewWidgetModel(
//         ctx: AppContext,
//         widgetTypeId: WidgetTypeID,
//         widgetType: string,
//         widgetName?: string
//     ) {
//         const defaultWidgetModel = ctx.getNewMetaDataContainer().getDefaultWidgetModelMap().get(widgetTypeId);

//         if (isUndefined(defaultWidgetModel)) {
//             return undefined;
//         }
//         const newWidgetModel = defaultWidgetModel.cloneNode(ctx.getIdContainerController()) as NewWidgetModel;

//         (newWidgetModel as WorkAreaModel | NewWidgetModel).setName(
//             widgetName ?? `${widgetType} ${newWidgetModel.getID() % 100}`
//         );

//         if (newWidgetModel instanceof SystemComponentModel) {
//             const userDefaultCompThemeId = getUserDefaultCompThemeId(
//                 ctx.getCompThemeContainer(),
//                 newWidgetModel.getWidgetTypeId()
//             );
//             newWidgetModel.setCompThemeId(userDefaultCompThemeId ?? undefined);
//         }

//         if (newWidgetModel instanceof PublishedComponentModel) {
//             newWidgetModel.setLibraryType(widgetType === ComponentTypeEnum.PGX ? 'PGX' : 'PUX');
//         }

//         return newWidgetModel;
//     }

//     /**
//      * 주어진 type에 해당하는 새 widget을 생성.
//      */
//     @boundMethod
//     private createNewWidgetModel(ctx: AppContext, widgetType: AnyWidgetType, widgetID: WidgetID) {
//         return undefined;
//         // const defaultWidgetModel = ctx.getMetaDataContainer().getDefaultWidgetModelMap().get(widgetType);
//         // const pageWidth = ctx.getAppWidgetModel().getFirstChild()?.getFirstChild()?.getProperties().getStyle()
//         //     .width.absolute;
//         // const pageHeight = ctx.getAppWidgetModel().getFirstChild()?.getFirstChild()?.getProperties().getStyle()
//         //     .height.absolute;

//         // if (isUndefined(defaultWidgetModel)) {
//         //     return undefined;
//         // }

//         // if (defaultWidgetModel.getWidgetType() === 'Studio') {
//         //     defaultWidgetModel.getProperties().setStyles({
//         //         ...defaultWidgetModel.getProperties().getStyle(),
//         //         width: {
//         //             ...defaultWidgetModel.getProperties().getStyle().width,
//         //             type: 'relative',
//         //             unit: '%',
//         //             absolute: pageWidth ?? 100,
//         //             relative: 100,
//         //         },
//         //         height: {
//         //             ...defaultWidgetModel.getProperties().getStyle().height,
//         //             type: 'relative',
//         //             unit: '%',
//         //             absolute: pageHeight ?? 100,
//         //             relative: 100,
//         //         },
//         //     });
//         // }

//         // const newWidgetModel = defaultWidgetModel.cloneNode(widgetID);
//         // newWidgetModel.setName(`${widgetType.replace('Basic', '')} ${widgetID % 100}`);
//         // return newWidgetModel;
//     }

//     /**
//      * 주어진 widget을 적절한 위치에 삽입해주는 함수.
//      */
//     @boundMethod
//     private insertGivenWidgetModel(
//         ctx: AppContext,
//         args: {
//             newWidgetModel: BaseWidgetModel;
//             isClone: boolean;
//             initializeProperties?: InitializeProperties;
//             isPositioned?: boolean;
//             parentWidgetModel?: BaseWidgetModel;
//             libraryID?: number;
//             widgetTypeID?: number;
//             preserveSelection?: boolean;
//         }
//     ) {
//         const {
//             newWidgetModel,
//             isClone,
//             initializeProperties,
//             libraryID,
//             isPositioned,
//             parentWidgetModel,
//             widgetTypeID,
//         } = args;
//         const isGxProject = checkGXProject(ctx.getAppModeContainer());
//         const zoomRatio = ctx.getZoomRatio() / 100;
//         // 삽입 전에 속성 세팅하고 싶을 경우 진행.
//         if (isDefined(initializeProperties) && newWidgetModel instanceof NewWidgetModel) {
//             const props = newWidgetModel.getProps();

//             // Meta ID에 해당하는 props 빠르게 찾기.
//             const metaIdToPropIdMap = new Map<number, number>();

//             props.forEach((value, propId) => {
//                 metaIdToPropIdMap.set(value.propTypeId, propId);
//             });

//             // Props 세팅.
//             initializeProperties.forEach(item => {
//                 const propId = metaIdToPropIdMap.get(item?.propTypeId);

//                 if (isDefined(propId)) {
//                     props.set(propId, item);
//                 }
//             });
//         }

//         let parent: BaseWidgetModel =
//             args.parentWidgetModel ?? this.getParentToInsert(ctx, newWidgetModel as NewWidgetModel, isGxProject);

//         if (!isInsertableItem(ctx.getCompositeComponentContainer(), parent, newWidgetModel)) {
//             return;
//         }

//         // const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets();
//         // const properties = newWidgetModel.getProperties();
//         // const isParentChildable =
//         //     !isPositioned && selectedWidgets?.length === 1 && checkInsertableItem(selectedWidgets[0], newWidgetModel);

//         // const isParentWorkArea = checkWorkAreaModel(parentWidgetModel);

//         if (!isPositioned) {
//             // (크기가 커서) (0, 0)에 배치할 컴포넌트.
//             const isLargeModel = newWidgetModel.getWidgetTypeId() === SystemComponentType.Studio;

//             if (isLargeModel) {
//                 this.setPositionSafely(newWidgetModel, {
//                     left: { value: 0, unit: 'px' },
//                     top: { value: 0, unit: 'px' },
//                 });
//             } else if (
//                 checkDialogFrameWidget(parent) ||
//                 checkPageModel(parent) ||
//                 parent.getWidgetTypeId() === SystemComponentType.Frame
//             ) {
//                 // 부모가 Page or DialogPage
//                 const parentRefWidth = (parent as NewWidgetModel).getRefWidth();
//                 const parentRefHeight = (parent as NewWidgetModel).getRefHeight();
//                 const parentWidth = parentRefWidth ? parentRefWidth / zoomRatio : 1;
//                 const parentHeight = parentRefHeight ? parentRefHeight / zoomRatio : 1;
//                 const centerX = parentWidth / 2;
//                 const centerY = parentHeight / 2;

//                 this.setPositionSafely(newWidgetModel, {
//                     left: { value: centerX, unit: 'px' },
//                     top: { value: centerY, unit: 'px' },
//                 });
//             } else {
//                 const viewPortInfo = document.getElementById('editorWrapper');
//                 const leftToolpane = document.getElementById('leftToolPane');
//                 const rightToolpane = document.getElementById('rightToolPane');
//                 // 중심이 (50000, 50000) 고정이라면 util 함수로 만드는 것이 좋아보임
//                 const originCenterInfo = ctx.getSelectionContainer().getEditingNewWorkArea()?.getPagePosition() ?? {
//                     x: 50000,
//                     y: 50000,
//                 };
//                 if (originCenterInfo && viewPortInfo) {
//                     const leftToolPaneWidth = leftToolpane?.getBoundingClientRect().width ?? 0;
//                     const rigthtToolPaneWidth = rightToolpane?.getBoundingClientRect().width ?? 0;
//                     const centerX =
//                         viewPortInfo.scrollLeft / zoomRatio -
//                         originCenterInfo.x +
//                         (viewPortInfo.getBoundingClientRect().width + leftToolPaneWidth - rigthtToolPaneWidth) /
//                             2 /
//                             zoomRatio;
//                     const centerY =
//                         viewPortInfo.scrollTop / zoomRatio -
//                         originCenterInfo.y +
//                         viewPortInfo.getBoundingClientRect().height / 2 / zoomRatio;

//                     this.setPositionSafely(newWidgetModel, {
//                         left: { value: centerX, unit: 'px' },
//                         top: { value: centerY, unit: 'px' },
//                     });
//                 }
//             }

//             // click 삽입 때 부모가 parent라면 뷰포트 중앙에 오도록 scroll해주어야함
//             if (parent instanceof PageModel) {
//                 // render 이후에 scroll해야하므로 setTimeout 사용
//                 const moveViewportCenterFn = () =>
//                     setTimeout(() => {
//                         // ref값이 있을 때까지 재귀
//                         if ((newWidgetModel as NewWidgetModel).getRefX() !== undefined) {
//                             moveViewPortCenter(ctx, newWidgetModel as NewWidgetModel);
//                         } else {
//                             moveViewportCenterFn();
//                         }
//                     });
//                 moveViewportCenterFn();
//             }
//         }

//         if (checkDialogComponent(newWidgetModel)) {
//             // 클릭 시 Dialog PGX 컴포넌트는 WorkArea 하위에 배치되도록 함.
//             const workAreaModel =
//                 ctx.getSelectionContainer()?.getEditingNewWorkArea() ??
//                 (ctx.getEditingNewWidgetModel().getFirstChild() as WorkAreaModel);
//             parent = workAreaModel;
//         }

//         // Append command 날려줌.
//         if (isUndefined(ctx.getCommand())) {
//             throw new Error('ctx.getCommand()가 undefined입니다!');
//         }

//         // const appendWidgetCommand = new (isClone ? AppendWidgetRecursiveCommand : AppendWidgetCommand)(
//         const appendWidgetCommand = new NewAppendWidgetCommand(
//             ctx,
//             newWidgetModel,
//             parent,
//             parent.getLastChild()?.getNextSibling()
//         );
//         ctx.getCommand()?.append(appendWidgetCommand);

//         // file 정보를 가지고 있는 컴포넌트의 경우 아래 로직을 수행함
//         if (widgetTypeID) {
//             const metaDataContainer = ctx.getNewMetaDataContainer();
//             const files = metaDataContainer.getWidgetCompMetaDataMap().get(widgetTypeID)?.files;

//             if (files) {
//                 const filesArr: Array<{ [key: number]: string }> = JSON.parse(files);
//                 filesArr.forEach(file => {
//                     const id = Number(Object.keys(file)[0]);
//                     const name = file[id];

//                     const fileComponentRelation: FileComponentRelation = {
//                         appID: ctx.getAppID(),
//                         componentID: newWidgetModel.getID(),
//                         id,
//                         name,
//                     };

//                     const insertFileComponentRelationCommand = new InsertFileComponentRelationCommand(
//                         ctx.getFileContainer(),
//                         fileComponentRelation
//                     );

//                     ctx.getCommand()?.append(insertFileComponentRelationCommand);
//                 });
//             }
//         }

//         // component 별 추가적인 component 삽입을 위한 simple command 추가
//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.Accordion) {
//             // Accordion component 삽입
//             this.appendSubComponentCommand(
//                 ctx,
//                 SystemComponentType.AccordionSummary,
//                 'AccordionSummary',
//                 newWidgetModel
//             );
//             this.appendSubComponentCommand(ctx, SystemComponentType.AccordionDetail, 'AccordionDetail', newWidgetModel);
//         }
//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.List) {
//             // list component 삽입
//             const insertListItemNum = 3;
//             for (let modelCount = 0; modelCount < insertListItemNum; modelCount++) {
//                 this.appendSubComponentCommand(ctx, SystemComponentType.ListItem, 'ListItem', newWidgetModel);
//             }
//         }
//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.ToggleButtonGroup) {
//             // toggleButtonGroup component 삽입
//             const insertToggleButtonNum = 4;
//             for (let modelCount = 0; modelCount < insertToggleButtonNum; modelCount++) {
//                 this.appendSubComponentCommand(ctx, SystemComponentType.ToggleButton, 'ToggleButton', newWidgetModel);
//             }
//         }

//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.Table) {
//             // Table Component삽입

//             // Table BodyComponent 삽입
//             this.appendSubComponentCommand(ctx, SystemComponentType.TableBody, 'TableBody', newWidgetModel);
//             // Table Header Component 삽입
//             this.appendSubComponentCommand(ctx, SystemComponentType.TableHead, 'TableHead', newWidgetModel);
//         }
//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.Tabs) {
//             // Tabs component 삽입
//             const insertTabNum = 3;
//             for (let modelCount = 0; modelCount < insertTabNum; modelCount++) {
//                 this.appendSubComponentCommand(ctx, SystemComponentType.Tab, 'Tab', newWidgetModel);
//                 this.appendSubComponentCommand(ctx, SystemComponentType.TabPanel, 'TabPanel', newWidgetModel);
//             }
//         }
//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.Stepper) {
//             // Stepper component 삽입
//             const insertTabNum = 3;
//             for (let modelCount = 0; modelCount < insertTabNum; modelCount++) {
//                 this.appendSubComponentCommand(ctx, SystemComponentType.Step, 'Step', newWidgetModel);
//                 this.appendSubComponentCommand(ctx, SystemComponentType.StepContent, 'StepContent', newWidgetModel);
//                 this.appendSubComponentCommand(
//                     ctx,
//                     SystemComponentType.StepPrevButton,
//                     'StepPrevButton',
//                     newWidgetModel
//                 );
//                 this.appendSubComponentCommand(
//                     ctx,
//                     SystemComponentType.StepNextButton,
//                     'StepNextButton',
//                     newWidgetModel
//                 );
//             }
//         }
//         // if (newWidgetModel.getWidgetTypeId() >= 141 && newWidgetModel.getWidgetTypeId() <= 145) {
//         //     const labelWidget = getChildLabelWidget(ctx, newWidgetModel.getWidgetTypeId());
//         //     const iconWidget = getChildIconWidget(ctx, newWidgetModel.getWidgetTypeId());
//         //     if (iconWidget) {
//         //         const appendIconWidgetCommand = new NewAppendWidgetCommand(ctx, iconWidget, newWidgetModel);

//         //         ctx.getCommand()?.append(appendIconWidgetCommand);
//         //     }
//         //     if (labelWidget) {
//         //         const appendLabelWidgetCommand = new NewAppendWidgetCommand(ctx, labelWidget, newWidgetModel);
//         //         ctx.getCommand()?.append(appendLabelWidgetCommand);
//         //     }
//         // }

//         if (newWidgetModel.getWidgetTypeId() === SystemComponentType.TemplateList) {
//             this.appendSubComponentCommand(
//                 ctx,
//                 SystemComponentType.TemplateCreateProjectButton,
//                 'TemplateCreateProjectButton',
//                 newWidgetModel
//             );
//             this.appendSubComponentCommand(
//                 ctx,
//                 SystemComponentType.TemplateNewProjectNameTextField,
//                 'TemplateNewProjectNameTextField',
//                 newWidgetModel
//             );
//             const cardListFrame = this.appendSubComponentCommand(
//                 ctx,
//                 SystemComponentType.TemplateCardListFrame,
//                 'TemplateCardListFrame',
//                 newWidgetModel
//             );

//             const cardFrame = this.appendSubComponentCommand(
//                 ctx,
//                 SystemComponentType.TemplateCardFrame,
//                 'TemplateCardFrame',
//                 cardListFrame
//             );
//             this.appendSubComponentCommand(ctx, SystemComponentType.TemplateImage, 'TemplateImage', cardFrame);
//             this.appendSubComponentCommand(ctx, SystemComponentType.TemplateTitle, 'TemplateTitle', cardFrame);
//         }

//         const selectionPropObj: ISelectionProp = {
//             selectionType: SelectionEnum.WIDGET,
//             widgetModels: [newWidgetModel],
//             editingPageModel: undefined,
//             onlyWorkArea: true,
//         };
//         const commandProps = ctx.getCommandProps();
//         if (isDefined(commandProps)) {
//             ctx.setCommandProps({
//                 ...commandProps,
//                 selectionProp: args.preserveSelection === true ? undefined : selectionPropObj,
//             });
//         }

//         // 컨테이너 내부에 item 삽입 시 sibling re-render
//         // 윗 줄 커밋의 설명 읽어보면 부모가 flex인지 확인하는게 맞을 듯함
//         const widgetType = newWidgetModel.getWidgetType();
//         if (['Page', 'WorkArea'].includes(widgetType)) {
//             parent.forEachChild(child => {
//                 if (child !== newWidgetModel) {
//                     child.triggerRerender();
//                 }
//             });
//         }
//     }

//     /**
//      * 컴포넌트가 위치 설정을 지원할 때, 위치 설정을 해줍니다.
//      */
//     private setPositionSafely(model: BaseWidgetModel, position: Partial<UpdatePosition>) {
//         const typedModel = model as BaseWidgetModel & Pick<NewWidgetModel, 'getPosition' | 'setPosition'>;

//         if (typeof typedModel.getPosition === 'function' || typeof typedModel.setPosition === 'function') {
//             typedModel.setPosition({ ...typedModel.getPosition(), ...position });
//         }
//     }

//     /**
//      * Widget을 어디 밑에 삽입할지 결정하는 함수.
//      * - 단일 선택 중이면 그것을 parent로 설정, 다중 선택 중이면 작업중인 page을 parent로 설정.
//      * - 단일 선택이어도 childable하지 않으면 page에 삽입됨.
//      */
//     @boundMethod
//     private getParentToInsert(ctx: AppContext, curWidget: BaseWidgetModel, isGxProject: boolean) {
//         const topWidgetModel =
//             ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getEditingNewWidgetModel().getFirstChild();
//         // 단일 selection
//         if (ctx.getSelectionContainer()?.getSelectedWidgets().length === 1) {
//             const selectedWidget = ctx.getSelectionContainer()?.getSelectedWidgets()[0];
//             // if (selectedWidget.getWidgetTypeId() === 1) {
//             //     // workArea selcetion일 때 workArea 반환
//             //     if (!isGxProject) {
//             //         // ux의 경우 page가 잠금이 아니라면 page로 무조건 삽입
//             //         const page = selectedWidget.getFirstChild() as PageModel;
//             //         if (!page.getLocked()) {
//             //             return page;
//             //         }
//             //     }
//             //     return selectedWidget;
//             // }
//             if (
//                 (selectedWidget instanceof PageModel || selectedWidget instanceof SystemComponentModel) &&
//                 selectedWidget.getLocked()
//             ) {
//                 // 부모가 될 model이 잠금 상태일 때 workArea 반환
//                 return topWidgetModel;
//             }
//             const childable = isInsertableItem(
//                 ctx.getCompositeComponentContainer(),
//                 selectedWidget as NewWidgetModel,
//                 curWidget
//             );
//             if (childable) {
//                 return selectedWidget;
//             }
//             if (!isGxProject && !checkDialogComponent(curWidget)) {
//                 // ux의 경우 page가 잠금이 아니라면 page로 무조건 삽입
//                 const page = topWidgetModel.getFirstChild() as PageModel;
//                 if (!page.getLocked()) {
//                     return page;
//                 }
//             }
//             // childable 하지 않을 경우 workArea 삽입
//             return topWidgetModel;
//         }
//         // composite model 선택 시, 최상위 model의 parent 반환
//         if (ctx.getSelectionContainer().getSelectedCompositeKeyModels().length === 1) {
//             const keyModel = ctx.getSelectionContainer().getSelectedCompositeKeyModels()[0];
//             return keyModel.getParent();
//         }
//         if (!isGxProject && !checkDialogComponent(curWidget)) {
//             // ux의 경우 page가 잠금이 아니라면 page로 무조건 삽입
//             const page = topWidgetModel.getFirstChild() as PageModel;
//             if (!page.getLocked()) {
//                 return page;
//             }
//         }
//         return topWidgetModel;
//     }

//     /**
//      * targetModels에 업로드된 파일-컴포넌트 관계 정보 삭제
//      */
//     private deleteFileRelation(ctx: AppContext, targetModels: (BaseWidgetModel | NewWidgetModel)[]) {
//         const fileContainer = ctx.getFileContainer();
//         targetModels.forEach(model => {
//             const fileComponentRelations = fileContainer.fileComponentRelationMap.get(model.getID());

//             fileComponentRelations?.forEach(fileComponentRelation => {
//                 const commandProps = new DeleteFileComponentRelationCommand(fileContainer, fileComponentRelation);
//                 ctx.getCommand()?.append(commandProps);
//             });
//         });
//     }

//     /**
//      * targetModels에 대해 제거하는 커맨드 수행
//      */
//     private deleteTargetModels(
//         targetModels: (BaseWidgetModel | NewWidgetModel)[],
//         ctx: AppContext,
//         props: NewDeleteWidgetCommandProps
//     ) {
//         targetModels.forEach(widgetModel => {
//             // composite model 삭제
//             removeCompositeComponent(ctx, widgetModel as NewWidgetModel);
//             if (checkPageModel(widgetModel)) {
//                 // 페이지 선택 후 DELETE 키 누를 시 페이지 하위에 있는 컴포넌트 삭제되는 기능
//                 (widgetModel as PageModel).forEachChild(pageChild => {
//                     newAppendDeleteWidgetCommandsRecursive(pageChild, ctx, props.commandID);
//                 });
//                 return;
//             }
//             newAppendDeleteWidgetCommandsRecursive(widgetModel as BaseWidgetModel, ctx, props.commandID);
//         });
//     }

//     /**
//      * Widget 삭제
//      */
//     @boundMethod
//     public deleteWidget(ctx: AppContext, props: NewDeleteWidgetCommandProps) {
//         const appWidgetModel = ctx.getNewAppModel();
//         const command = ctx.getCommand();
//         const selectionContainer = ctx.getSelectionContainer();
//         const appModeContainer = ctx.getAppModeContainer();
//         const compositeKeyModels = selectionContainer.getSelectedCompositeKeyModels();

//         // 입력값 검증
//         if (isUndefined(appWidgetModel)) {
//             dError('dom is not exist');
//             return;
//         }
//         if (isUndefined(command)) {
//             dError('command is not exist');
//             return;
//         }
//         if (isUndefined(selectionContainer)) {
//             return;
//         }

//         const selectedWidgets = selectionContainer.getSelectedWidgets();
//         let { targetModels } = props;
//         if (targetModels === undefined) {
//             targetModels = selectedWidgets.filter(widgetModel => {
//                 if (widgetModel instanceof NewWidgetModel && widgetModel.getLocked()) {
//                     return false;
//                 }
//                 if (isSubComponent(widgetModel)) {
//                     // SubComponent로 추가되는 컴포넌트들
//                     return false;
//                 }
//                 return true;
//             });

//             // 에셋화 된 컴포넌트 추가
//             targetModels.push(
//                 ...compositeKeyModels.filter(widgetModel => {
//                     if (widgetModel instanceof NewWidgetModel && widgetModel.getLocked()) {
//                         return false;
//                     }
//                     return true;
//                 })
//             );
//         }

//         this.deleteFileRelation(ctx, targetModels);

//         if (targetModels.some(model => model instanceof PageModel)) {
//             const pageModelsToDelete = getDeletablePageModels(
//                 targetModels,
//                 appWidgetModel,
//                 appModeContainer,
//                 selectionContainer
//             );
//             pageModelsToDelete.forEach(model => {
//                 const commandProps = new NewRemoveWidgetCommand(model.getParent() as WorkAreaModel, appWidgetModel);
//                 ctx.getCommand()?.append(commandProps);
//             });
//             return;
//         }

//         if (targetModels.some(model => model instanceof WorkAreaModel)) {
//             const workAreaToDelete = getDeletablePageModels(
//                 targetModels,
//                 appWidgetModel,
//                 appModeContainer,
//                 selectionContainer
//             );
//             workAreaToDelete.forEach(model => {
//                 const commandProps = new NewRemoveWidgetCommand(model.getParent() as WorkAreaModel, appWidgetModel);
//                 ctx.getCommand()?.append(commandProps);
//             });
//             return;
//         }

//         this.deleteTargetModels(targetModels, ctx, props);

//         if (targetModels.some(model => selectedWidgets.includes(model))) {
//             const editingTopWidgetModel: BaseWidgetModel =
//                 ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getNewAppModel();

//             this.createWidgetSelectionProp(ctx, editingTopWidgetModel);
//         }

//         // if (checkPageModel(targetModels[0])) {
//         //     // 페이지 선택 후 DELETE 키 누를 시 페이지 하위에 있는 컴포넌트 삭제되는 기능
//         //     const findInnerPageLayout = ctx.getPageContainer().findInnerPageLayoutComponent(targetModels[0]);
//         //     if (isDefined(findInnerPageLayout)) {
//         //         const editingPageId = ctx.getSelectionContainer().getEditingNewWorkArea()?.getFirstChild()?.getID();
//         //         if (editingPageId) {
//         //             const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
//         //                 ctx,
//         //                 CommandEnum.DELETE_WIDGET,
//         //                 editingPageId
//         //             );
//         //             ctx.getCommand()?.append(updateInnerPageMapCommand);
//         //         }
//         //     }
//         //     targetModels[0].forEachChild(pageChild => {
//         //         appendDeleteWidgetCommandsRecursive(pageChild, ctx, props.commandID);
//         //     });
//         //     return;
//         // }

//         // if (!isWidgetsDeletable(targetModels)) {
//         //     return;
//         // }

//         // const deletableModels = getDeletableWidgetModels(targetModels);
//         // deletableModels.forEach(targetModel => {
//         //     const findInnerPageLayout = ctx.getPageContainer().findInnerPageLayoutComponent(targetModel);
//         //     if (isDefined(findInnerPageLayout)) {
//         //         const editingPageId = ctx.getSelectionContainer().getEditingNewWorkArea()?.getFirstChild()?.getID();
//         //         if (editingPageId) {
//         //             const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
//         //                 ctx,
//         //                 CommandEnum.DELETE_WIDGET,
//         //                 editingPageId
//         //             );
//         //             ctx.getCommand()?.append(updateInnerPageMapCommand);
//         //         }
//         //     }
//         //     appendDeleteWidgetCommandsRecursive(targetModel, ctx, props.commandID);
//         // });

//         // const appModeContainer = ctx.getAppModeContainer();
//         // let editingTopWidgetModel = ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getAppWidgetModel();
//         // // GX EDIT_APP 모드 및 Dialog 편집 모드에서는 편집 화면 상 최상단 model인 Composite Model or Dialog Model 설정
//         // if (isEditWidgetMode(appModeContainer)) {
//         //     editingTopWidgetModel = ctx.getEditingWidgetModel();
//         // }
//         // this.createWidgetSelectionProp(ctx, editingTopWidgetModel);
//     }

//     /**
//      * Widget 이름 변경
//      */
//     @boundMethod
//     private renameWidget(ctx: AppContext, props: RenameWidgetCommandProps) {
//         const { targetModel, componentNewName } = props;
//         const updateWidgetCommand = new RenameWidgetCommand(targetModel, componentNewName);

//         ctx.getCommand()?.append(updateWidgetCommand);
//     }

//     /**
//      * Context 내에 SelectionProperty 값 생성
//      */
//     @boundMethod
//     private createWidgetSelectionProp(ctx: AppContext, newWidgetModel: BaseWidgetModel): void {
//         const appModeContainer = ctx.getAppModeContainer();
//         const editingTopWidgetModel: BaseWidgetModel =
//             ctx.getSelectionContainer()?.getEditingNewWorkArea() ?? ctx.getNewAppModel();
//         const selectionProp: ISelectionProp = {
//             selectionType: SelectionEnum.WIDGET,
//             widgetModels: [newWidgetModel],
//             editingPageModel: editingTopWidgetModel,
//         };
//         const commandProps = ctx.getCommandProps();
//         if (commandProps !== undefined) {
//             ctx.setCommandProps({ ...commandProps, selectionProp });
//         }
//     }

//     /**
//      * Widget 끌어서 리사이즈 시작
//      */
//     @boundMethod
//     private resizeWidgetStart(ctx: AppContext, props: WidgetResizeStartCommandProps): void {
//         const appModeContainer = ctx.getAppModeContainer();
//         const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//         const { targetModels } = props;
//         const editingWidgetModel = ctx.getEditingNewWidgetModel();
//         const selectionContainer = ctx.getSelectionContainer();
//         const zoomRatio = ctx.getZoomRatio() / 100;
//         if (isUndefined(selectionContainer)) {
//             return;
//         }
//         const editingWorkArea =
//             selectionContainer.getEditingNewWorkArea() ?? (ctx.getNewAppModel().getFirstChild() as WorkAreaModel);

//         const pagePosition = editingWorkArea.getPagePosition();
//         const editingWorkAreaRect = editingWorkArea.getWorkAreaRect();

//         selectionContainer.setFloatingWidgetModels(
//             targetModels.map(widgetModel => {
//                 const copiedWidgetModel = widgetModel.cloneNode(ctx.getIdContainerController());
//                 copiedWidgetModel.setEditingState(WidgetEditingState.FLOATING);
//                 const targetRefWidth = widgetModel.getRefStyle()?.width;
//                 const targetRefHeight = widgetModel.getRefStyle()?.height;
//                 const targetRefLeft = widgetModel.getRefStyle()?.left;
//                 const targetRefTop = widgetModel.getRefStyle()?.top;
//                 const targetRefWidthToPx =
//                     targetRefWidth !== undefined ? Number(targetRefWidth.slice(0, targetRefWidth.length - 2)) : 0;
//                 const targetRefHeightToPx =
//                     targetRefHeight !== undefined ? Number(targetRefHeight.slice(0, targetRefHeight.length - 2)) : 0;
//                 copiedWidgetModel.getProps().forEach((prop, propId) => {
//                     if (prop.propMeta.name === 'width') {
//                         prop.value = targetRefWidthToPx;
//                     } else if (prop.propMeta.name === 'height') {
//                         prop.value = targetRefHeightToPx;
//                     }
//                 });
//                 const widgetX = widgetModel.getRefX();
//                 // const parentX = parent?.getRefX();
//                 const leftValue =
//                     widgetX !== undefined && editingWorkAreaRect.x !== undefined ? widgetX - editingWorkAreaRect.x : 0;

//                 const widgetY = widgetModel.getRefY();
//                 // const parentY = parent?.getRefY();
//                 const topValue =
//                     widgetY !== undefined && editingWorkAreaRect.y !== undefined ? widgetY - editingWorkAreaRect.y : 0;

//                 copiedWidgetModel.setPosition({
//                     left: { value: leftValue / zoomRatio, unit: 'px' },
//                     top: { value: topValue / zoomRatio, unit: 'px' },
//                 });
//                 copiedWidgetModel.append(editingWorkArea);
//                 widgetEditInfoContainer.setEditingFloatingWidget(copiedWidgetModel, widgetModel);

//                 const refPosition = {
//                     x: leftValue / zoomRatio,
//                     y: topValue / zoomRatio,
//                     width: targetRefWidthToPx,
//                     height: targetRefHeightToPx,
//                 };
//                 widgetEditInfoContainer.setRefPositionMap(copiedWidgetModel, refPosition);

//                 return copiedWidgetModel;
//             })
//         );
//         // editingState 변경
//         targetModels.forEach(targetWidgetModel => {
//             targetWidgetModel.setEditingState(WidgetEditingState.RESIZE);
//         });

//         widgetEditInfoContainer.setEditingState(WidgetEditingState.RESIZE);
//         widgetEditInfoContainer.setEditingWidgetModels(targetModels);
//     }

//     /**
//      * Absolute X값 계산
//      */
//     @boundMethod
//     private calculateX(
//         resizeHandle: WidgetResizeHandle,
//         refPosition: { x: number; width: number },
//         deltaWidth: number,
//         deltaX: number
//     ) {
//         return refPosition.x + deltaX;
//     }

//     /**
//      * Absolute Y값 계산
//      */
//     @boundMethod
//     private calculateY(
//         resizeHandle: WidgetResizeHandle,
//         refPosition: { y: number; height: number },
//         deltaHeight: number,
//         deltaY: number
//     ) {
//         return refPosition.y + deltaY;
//     }

//     /**
//      * Relative Position 계산
//      */
//     private calculateRelativePosition(position: number, parentSize: number) {
//         return Math.round((position / parentSize) * 100);
//     }

//     /**
//      * Bound 관련 style 계산
//      */
//     private calculateStyle(
//         widgetStyle: WidgetStyle,
//         resizeHandle: WidgetResizeHandle,
//         refPosition: WidgetPosition,
//         deltaWidth: number,
//         deltaHeight: number,
//         deltaX: number,
//         deltaY: number,
//         pageModelWidth: number,
//         pageModelHeight: number,
//         parentWidth: number,
//         parentHeight: number
//     ) {
//         const x: Position = isVerticalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.x,
//               }
//             : {
//                   ...widgetStyle.x,
//                   absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
//                   relative: this.calculateRelativePosition(
//                       this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
//                       parentWidth
//                   ),
//               };

//         const y: Position = isHorizontalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.y,
//               }
//             : {
//                   ...widgetStyle.y,
//                   absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
//                   relative: this.calculateRelativePosition(
//                       this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
//                       parentHeight
//                   ),
//               };

//         const width: Length = isVerticalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.width,
//               }
//             : {
//                   ...widgetStyle.width,
//                   absolute: refPosition.width * deltaWidth,
//                   relative: ((refPosition.width * deltaWidth) / pageModelWidth) * 100,
//                   type: widgetStyle.width.type === 'relative' ? 'relative' : 'absolute',
//                   unit: widgetStyle.width.type === 'relative' ? '%' : 'px',
//               };

//         const height: Length = isHorizontalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.height,
//               }
//             : {
//                   ...widgetStyle.height,
//                   absolute: refPosition.height * deltaHeight,
//                   relative: ((refPosition.height * deltaHeight) / pageModelHeight) * 100,
//                   type: widgetStyle.height.type === 'relative' ? 'relative' : 'absolute',
//                   unit: widgetStyle.height.type === 'relative' ? '%' : 'px',
//               };

//         const { frameType } = widgetStyle;

//         const left: Constraint = isVerticalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.left,
//               }
//             : {
//                   ...widgetStyle.left,
//                   absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
//                   relative: this.calculateRelativePosition(
//                       this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
//                       parentWidth
//                   ),
//               };

//         const top: Constraint = isHorizontalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.top,
//               }
//             : {
//                   ...widgetStyle.top,
//                   absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
//                   relative: this.calculateRelativePosition(
//                       this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
//                       parentHeight
//                   ),
//               };

//         const right: Constraint = isVerticalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.right,
//               }
//             : {
//                   ...widgetStyle.right,
//                   absolute:
//                       parentWidth -
//                       this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX) -
//                       refPosition.width * deltaWidth,
//                   relative:
//                       100 -
//                       this.calculateRelativePosition(
//                           this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
//                           parentWidth
//                       ) -
//                       ((refPosition.width * deltaWidth) / parentWidth) * 100,
//               };

//         const bottom: Constraint = isHorizontalCenterHandle(resizeHandle)
//             ? {
//                   ...widgetStyle.bottom,
//               }
//             : {
//                   ...widgetStyle.bottom,
//                   absolute:
//                       parentHeight -
//                       this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY) -
//                       refPosition.height * deltaHeight,
//                   relative:
//                       100 -
//                       this.calculateRelativePosition(
//                           this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
//                           parentHeight
//                       ) -
//                       ((refPosition.height * deltaHeight) / parentHeight) * 100,
//               };

//         return {
//             style: {
//                 x,
//                 y,
//                 width,
//                 height,
//                 frameType,
//                 left,
//                 top,
//                 right,
//                 bottom,
//             },
//         };
//     }

//     /**
//      * Bound 관련 style 계산
//      */
//     private calculateNewStyle(
//         widgetRefStyle: WidgetPosition | undefined,
//         deltaWidth: number,
//         deltaHeight: number,
//         deltaX: number,
//         deltaY: number
//     ) {
//         if (widgetRefStyle === undefined) {
//             return undefined;
//         }

//         const leftValue = widgetRefStyle.x ?? 0;

//         const topValue = widgetRefStyle.y ?? 0;

//         const widthValue = widgetRefStyle.width ?? 0;

//         const heightValue = widgetRefStyle.height ?? 0;

//         const left = leftValue + deltaX;
//         const top = topValue + deltaY;
//         const width = widthValue * deltaWidth;
//         const height = heightValue * deltaHeight;

//         return {
//             style: {
//                 left,
//                 top,
//                 width,
//                 height,
//             },
//         };
//     }

//     /**
//      * Widget 끌어서 Resize 종료
//      */
//     @boundMethod
//     private resizeWidgetEnd(ctx: AppContext, props: WidgetResizeEndCommandProps): void {
//         const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//         const command = ctx.getCommand();
//         const selectionContainer = ctx.getSelectionContainer();

//         const { targetModels: widgetModels, deltaX, deltaY, deltaWidth, deltaHeight } = props;

//         const workAreaModel = selectionContainer?.getEditingNewWorkArea();
//         const pageModel = isEditAppMode(ctx.getAppModeContainer()) ? workAreaModel?.getFirstChild() : undefined;

//         const resizeHandle = widgetEditInfoContainer.getResizeHandle();

//         const isPage =
//             widgetModels.find(widgetModel => checkPageModel(widgetModel) || checkWorkAreaModel(widgetModel)) !==
//             undefined;
//         if (isPage) {
//             return;
//         }

//         if (isUndefined(command)) {
//             dError('command is not exist');
//             return;
//         }

//         widgetModels.forEach(widgetModel => {
//             // editingState 변경
//             widgetModel.setEditingState(WidgetEditingState.NONE);

//             // style 변경용 Command 생성
//             const widgetProps = widgetModel.getProps();
//             const targetFloatingModel = widgetEditInfoContainer.getEditingFloatingWidget(widgetModel);
//             if (isUndefined(targetFloatingModel)) {
//                 return;
//             }
//             const refPositionMap = widgetEditInfoContainer.getRefPositionMap(targetFloatingModel);

//             // const widgetStyle = widgetProps.getStyle();

//             // parent의 absolute 값으로 relative 계산
//             const parentWidget = widgetModel.getParent();
//             if (!parentWidget || !workAreaModel) {
//                 return;
//             }

//             const pagePosition = workAreaModel.getPagePosition();

//             const updatedStyle = this.calculateNewStyle(refPositionMap, deltaWidth, deltaHeight, deltaX, deltaY);

//             if (isUndefined(updatedStyle)) {
//                 return;
//             }

//             // app 별 parent rect style 가져오기
//             const {
//                 parentRefX,
//                 parentRefY,
//                 parentRefWidth: parentWidth,
//                 parentRefHeight: parentHeight,
//             } = getTargetParentRectStyle(ctx, parentWidget);

//             // 임시 포지션
//             const position = widgetModel.getPosition();
//             let newLeft;
//             let leftUnit = 'px';
//             let newTop;
//             let topUnit = 'px';

//             if (deltaX !== 0) {
//                 // left의 변화
//                 if (typeof position.left === 'string') {
//                     // px로 변환
//                     newLeft = updatedStyle.style.left - pagePosition.x;
//                 } else {
//                     // numberUnit
//                     const { unit, value } = position.left;
//                     if (unit === 'px') {
//                         newLeft = value + deltaX;
//                     } else {
//                         // '%'
//                         newLeft = ((updatedStyle.style.left - pagePosition.x) / parentWidth) * 100;
//                         leftUnit = '%';
//                     }
//                 }
//             }

//             if (deltaY !== 0) {
//                 // top의 변화
//                 if (typeof position.top === 'string') {
//                     newTop = updatedStyle.style.top - pagePosition.y;
//                 } else {
//                     // numberUnit
//                     const { unit, value } = position.top;
//                     if (unit === 'px') {
//                         newTop = value + deltaY;
//                     } else {
//                         // '%'
//                         newTop = ((updatedStyle.style.top - pagePosition.y) / parentHeight) * 100;
//                         topUnit = '%';
//                     }
//                 }
//             }

//             // dialog의 경우 내부에서 absolute로 위치하기 때문에 부모 position을 반영한 후처리가 필요
//             if (checkDialogFrameWidget(parentWidget) && newLeft && newTop) {
//                 const parentPosition = (parentWidget as NewWidgetModel).getPosition();
//                 // gx에서 string으로 된 position이 없음
//                 const parentLeft = typeof parentPosition.left === 'string' ? 0 : parentPosition.left.value;
//                 const parentTop = typeof parentPosition.top === 'string' ? 0 : parentPosition.top.value;

//                 newLeft -= parentLeft;
//                 newTop -= parentTop;
//             }

//             // command화 필요
//             const newPosition = {
//                 left: newLeft !== undefined ? { value: newLeft, unit: leftUnit } : position.left,
//                 top: newTop !== undefined ? { value: newTop, unit: topUnit } : position.top,
//             };
//             const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
//             ctx.getCommand()?.append(updatePositionCommand);
//             // for (const [key, value] of Object.entries(updatedStyle.style)) {
//             //     const updateWidgetCommand = new UpdateWidgetCommand(widgetModel, key, true, value);
//             //     command.append(updateWidgetCommand);
//             // }

//             // width,height setting
//             const width = widgetModel.getWidth();
//             const height = widgetModel.getHeight();
//             const newWidth = { value: width?.value, unit: width?.unit };
//             const newHeight = { value: height?.value, unit: height?.unit };
//             switch (width?.unit) {
//                 case 'px':
//                     newWidth.value = updatedStyle.style.width;
//                     break;
//                 case '%':
//                     newWidth.value = (updatedStyle.style.width / parentWidth) * 100;
//                     break;
//                 case 'auto':
//                     newWidth.value = updatedStyle.style.width;
//                     newWidth.unit = 'px';
//                     break;
//                 default:
//                     break;
//             }
//             switch (height?.unit) {
//                 case 'px':
//                     newHeight.value = updatedStyle.style.height;
//                     break;
//                 case '%':
//                     newHeight.value = (updatedStyle.style.height / parentHeight) * 100;
//                     break;
//                 case 'auto':
//                     newHeight.value = updatedStyle.style.height;
//                     newHeight.unit = 'px';
//                     break;
//                 default:
//                     break;
//             }
//             const updateSizeCommand = new UpdateSizeCommand(widgetModel, {
//                 width: newWidth as WidgetSize,
//                 height: newHeight as WidgetSize,
//             });
//             ctx.getCommand()?.append(updateSizeCommand);
//             // widgetProps.forEach((prop, propId) => {
//             //     const { name } = prop.propMeta;
//             //     if (name === 'width') {
//             //         // initialStyle 적용
//             //         prop.value = refPositionMap?.width;

//             //         const newProp = { ...prop };
//             //         newProp.value = updatedStyle.style.width;
//             //         const updatePropsCommand = new UpdatePropsCommand(
//             //             widgetModel,
//             //             Number(propId),
//             //             updatedStyle.style.width
//             //         );
//             //         ctx.getCommand()?.append(updatePropsCommand);
//             //     } else if (name === 'height') {
//             //         // initialStyle 적용
//             //         prop.value = refPositionMap?.height;

//             //         const newProp = { ...prop };
//             //         newProp.value = updatedStyle.style.height;
//             //         const updatePropsCommand = new UpdatePropsCommand(
//             //             widgetModel,
//             //             Number(propId),
//             //             updatedStyle.style.height
//             //         );
//             //         ctx.getCommand()?.append(updatePropsCommand);
//             //     }
//             // });
//             updatePinnedChildren(widgetModel, Number(newWidth.value), Number(newHeight.value), ctx);
//         });

//         runInAction(() => {
//             ctx.setMouseMode('Normal');
//         });

//         this.clearWidgetModelEditContext(ctx);
//     }

//     /**
//      * Widget 끌어서 Resize 종료
//      */
//     @boundMethod
//     private resizingWidget(ctx: AppContext, props: WidgetResizingCommandProps): void {
//         const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//         const command = ctx.getCommand();
//         const selectionContainer = ctx.getSelectionContainer();

//         const { targetModels: widgetModels, deltaX, deltaY, deltaWidth, deltaHeight } = props;

//         const workAreaModel =
//             selectionContainer.getEditingNewWorkArea() ?? (ctx.getNewAppModel().getFirstChild() as WorkAreaModel);
//         const pagePosition = workAreaModel.getPagePosition();

//         const isPage =
//             widgetModels.find(widgetModel => checkPageModel(widgetModel) || checkWorkAreaModel(widgetModel)) !==
//             undefined;
//         if (isPage) {
//             return;
//         }

//         if (isUndefined(command)) {
//             dError('command is not exist');
//             return;
//         }

//         widgetModels.forEach(widgetModel => {
//             // style 변경용 Command 생성
//             // const widgetProps = widgetModel.getProps();
//             // const widgetStyle = widgetProps.getStyle();
//             const refPositionMap = widgetEditInfoContainer.getRefPositionMap(widgetModel);
//             // parent의 absolute 값으로 relative 계산
//             const parentWidget = widgetModel.getParent();
//             if (!parentWidget) {
//                 return;
//             }

//             const updatedStyle = this.calculateNewStyle(refPositionMap, deltaWidth, deltaHeight, deltaX, deltaY);

//             if (isUndefined(updatedStyle)) {
//                 return;
//             }

//             // app 별 parent rect style 가져오기
//             const {
//                 parentRefX,
//                 parentRefY,
//                 parentRefWidth: parentWidth,
//                 parentRefHeight: parentHeight,
//             } = getTargetParentRectStyle(ctx, widgetModel.getParent());

//             // 임시 포지션
//             const position = widgetModel.getPosition();
//             let newLeft;
//             let leftUnit = 'px';
//             let newTop;
//             let topUnit = 'px';

//             if (deltaX !== 0) {
//                 // left의 변화
//                 if (typeof position.left === 'string') {
//                     // px로 변환
//                     newLeft = updatedStyle.style.left - pagePosition.x;
//                 } else {
//                     // numberUnit
//                     const { unit } = position.left;
//                     if (unit === 'px') {
//                         newLeft = updatedStyle.style.left - pagePosition.x;
//                     } else {
//                         // '%'
//                         newLeft = ((updatedStyle.style.left - pagePosition.x) / parentWidth) * 100;
//                         leftUnit = '%';
//                     }
//                 }
//             }

//             if (deltaY !== 0) {
//                 // top의 변화
//                 if (typeof position.top === 'string') {
//                     newTop = updatedStyle.style.top - pagePosition.y;
//                 } else {
//                     // numberUnit
//                     const { unit } = position.top;
//                     if (unit === 'px') {
//                         newTop = updatedStyle.style.top - pagePosition.y;
//                     } else {
//                         // '%'
//                         newTop = ((updatedStyle.style.top - pagePosition.y) / parentHeight) * 100;
//                         topUnit = '%';
//                     }
//                 }
//             }

//             const newPosition = {
//                 left: newLeft !== undefined ? { value: newLeft, unit: leftUnit } : position.left,
//                 top: newTop !== undefined ? { value: newTop, unit: topUnit } : position.top,
//             };
//             const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
//             ctx.getCommand()?.append(updatePositionCommand);

//             // width,height setting
//             const width = widgetModel.getWidth();
//             const height = widgetModel.getHeight();
//             const newWidth = { value: width?.value, unit: width?.unit };
//             const newHeight = { value: height?.value, unit: height?.unit };
//             switch (width?.unit) {
//                 case 'px':
//                     newWidth.value = updatedStyle.style.width;
//                     break;
//                 case '%':
//                     newWidth.value = (updatedStyle.style.width / parentWidth) * 100;
//                     break;
//                 case 'auto':
//                     newWidth.value = updatedStyle.style.width;
//                     newWidth.unit = 'px';
//                     break;
//                 default:
//                     break;
//             }
//             switch (height?.unit) {
//                 case 'px':
//                     newHeight.value = updatedStyle.style.height;
//                     break;
//                 case '%':
//                     newHeight.value = (updatedStyle.style.height / parentHeight) * 100;
//                     break;
//                 case 'auto':
//                     newHeight.value = updatedStyle.style.height;
//                     newHeight.unit = 'px';
//                     break;
//                 default:
//                     break;
//             }
//             const updateSizeCommand = new UpdateSizeCommand(widgetModel, {
//                 width: newWidth as WidgetSize,
//                 height: newHeight as WidgetSize,
//             });
//             ctx.getCommand()?.append(updateSizeCommand);
//             // widgetProps.forEach((prop, propId) => {
//             //     const { name } = prop.propMeta;
//             //     if (name === 'width') {
//             //         const newProp = { ...prop };
//             //         newProp.value = updatedStyle.style.width;
//             //         const updatePropsCommand = new UpdatePropsCommand(
//             //             widgetModel,
//             //             Number(propId),
//             //             updatedStyle.style.width
//             //         );
//             //         ctx.getCommand()?.append(updatePropsCommand);
//             //         ctx.getCommand()?.setUndoable(false);
//             //     } else if (name === 'height') {
//             //         const newProp = { ...prop };
//             //         newProp.value = updatedStyle.style.height;
//             //         const updatePropsCommand = new UpdatePropsCommand(
//             //             widgetModel,
//             //             Number(propId),
//             //             updatedStyle.style.height
//             //         );
//             //         ctx.getCommand()?.append(updatePropsCommand);
//             //         ctx.getCommand()?.setUndoable(false);
//             //     }
//             // });
//         });
//     }

//     /**
//      * 편집 관련 정보를 초기화합니다.
//      */
//     @boundMethod
//     private clearWidgetModelEditContext(ctx: AppContext): void {
//         clearWidgetModelEditContext(ctx);
//     }

//     /**
//      * Widget 끌어서 이동 시작
//      */
//     @boundMethod
//     private moveWidgetStart(ctx: AppContext, props: WidgetMoveStartCommandProps): void {
//         const appModeContainer = ctx.getAppModeContainer();
//         const selectionContainer = ctx.getSelectionContainer();
//         const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//         // const metaDataContainer = ctx.getMetaDataContainer();
//         const dataStore = ctx.getDataStore();
//         const editingWidgetModel = ctx.getEditingNewWidgetModel();
//         const zoomRatio = ctx.getZoomRatio() / 100;

//         const targetModels = props.targetModels.filter(model => !isSubComponent(model));

//         if (isUndefined(selectionContainer)) {
//             return;
//         }

//         const editingWorkArea =
//             selectionContainer.getEditingNewWorkArea() ?? (ctx.getNewAppModel().getFirstChild() as WorkAreaModel);
//         const editingWorkAreaRect = editingWorkArea.getWorkAreaRect();

//         selectionContainer.setFloatingWidgetModels(
//             targetModels.map(widgetModel => {
//                 const copiedWidgetModel = widgetModel.cloneNode(ctx.getIdContainerController());
//                 if (widgetModel instanceof NewWidgetModel) {
//                     copiedWidgetModel.setPinnedDirections(widgetModel.getPinnedDirections());
//                 }
//                 const refX = widgetModel.getRefX();
//                 const refY = widgetModel.getRefY();
//                 const content = {
//                     className: { value: '', locked: true },
//                     // ...getWidgetContentProperty(widgetModel, dataStore, metaDataContainer),
//                 };
//                 // const style = { ...getWidgetStyleProperty(widgetModel, dataStore) };

//                 const editingPageModel = isEditAppMode(appModeContainer) ? editingWorkArea?.getFirstChild() : undefined;

//                 const widgetX = widgetModel.getRefX();
//                 // const parentX = parent?.getRefX();
//                 const leftValue =
//                     widgetX !== undefined && editingWorkAreaRect.x !== undefined ? widgetX - editingWorkAreaRect.x : 0;

//                 const widgetY = widgetModel.getRefY();
//                 // const parentY = parent?.getRefY();
//                 const topValue =
//                     widgetY !== undefined && editingWorkAreaRect.y !== undefined ? widgetY - editingWorkAreaRect.y : 0;

//                 copiedWidgetModel.setPosition({
//                     left: { value: leftValue / zoomRatio, unit: 'px' },
//                     top: { value: topValue / zoomRatio, unit: 'px' },
//                 });
//                 // if (isDefined(editingPageModel)) {
//                 //     const pageModelWidth =
//                 //         editingPageModel.getRefWidth() ?? editingPageModel.getProperties().getStyle().width.absolute;
//                 //     const pageModelHeight =
//                 //         editingPageModel.getRefHeight() ?? editingPageModel.getProperties().getStyle().height.absolute;

//                 //     if (style.width.type === 'relative' || style.width.type === 'fill') {
//                 //         style.width = {
//                 //             ...style.width,
//                 //             absolute: (pageModelWidth * style.width.relative) / 100 / (zoomRatio / 100),
//                 //             type: 'absolute',
//                 //             unit: 'px',
//                 //         };
//                 //     }
//                 //     if (style.height.type === 'relative' || style.height.type === 'fill') {
//                 //         style.height = {
//                 //             ...style.height,
//                 //             absolute: (pageModelHeight * style.height.relative) / 100 / (zoomRatio / 100),
//                 //             type: 'absolute',
//                 //             unit: 'px',
//                 //         };
//                 //     }
//                 // }

//                 // copiedWidgetModel.setOriginWidgetPosition(
//                 //     refX
//                 //         ? (refX - editingWorkAreaRect.x) / (zoomRatio / 100)
//                 //         : widgetModel.getProperties().getStyle().x.absolute,
//                 //     refY
//                 //         ? (refY - editingWorkAreaRect.y) / (zoomRatio / 100)
//                 //         : widgetModel.getProperties().getStyle().y.absolute
//                 // );
//                 // copiedWidgetModel.setProperties(
//                 //     new WidgetModelProperties({
//                 //         content,
//                 //         style,
//                 //         themeInfo: copiedWidgetModel.getProperties().getThemeInfo(),
//                 //         selected: copiedWidgetModel.getProperties().getSelected(),
//                 //         editingState: WidgetEditingState.FLOATING,
//                 //         textEditing: copiedWidgetModel.getProperties().getTextEditing(),
//                 //         dragHovered: copiedWidgetModel.getProperties().getDragHovered(),
//                 //     })
//                 // );
//                 widgetEditInfoContainer.setEditingFloatingWidget(copiedWidgetModel, widgetModel);
//                 chageEditinStateForChild(copiedWidgetModel, WidgetEditingState.FLOATING);
//                 copiedWidgetModel.append(editingWorkArea);
//                 const refPosition = {
//                     x: leftValue / zoomRatio,
//                     y: topValue / zoomRatio,
//                     width: widgetModel.getRefWidth() ?? 0,
//                     height: widgetModel.getRefHeight() ?? 0,
//                 };
//                 widgetEditInfoContainer.setRefPositionMap(copiedWidgetModel, refPosition);
//                 return copiedWidgetModel;
//             })
//         );

//         targetModels.forEach(widgetModel => {
//             // 입력값 검증
//             if (!widgetModel || widgetModel.getEditingState() !== WidgetEditingState.NONE) {
//                 dError('moveWidgetStart assertion failed.');
//                 return;
//             }
//             if (widgetModel.getLocked()) {
//                 return;
//             }

//             widgetModel.setEditingState(WidgetEditingState.MOVE);
//         });
//         widgetEditInfoContainer.setEditingState(WidgetEditingState.MOVE);
//     }

//     /**
//      * Widget 끌어서 이동 끝
//      */
//     @boundMethod
//     private moveWidgetEnd(ctx: AppContext, props: WidgetMoveEndCommandProps): void {
//         if (isUndefined(ctx.getCommand())) {
//             dError('command is not exist');
//             return;
//         }
//         const { container } = props;
//         const { desModel, deltaX, deltaY, useRefPosition, isMovedToPage, changeTopWidgetModel, byKeyEvent } = props;
//         const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
//         const compositeComponentContainer = ctx.getCompositeComponentContainer();
//         const zoomRatio = ctx.getZoomRatio() / 100;

//         // ConditionalLayout이 end container일 경우 하위 FragmentLayout를 container로 지정
//         // if (container && checkConditionalLayout(container)) {
//         //     container = getConditionalLayoutEditedFrameModel(container) as WidgetModel; // Conditional Layout
//         // }

//         const widgetModels = props.targetModels;
//         // floating widget 제거
//         ctx.getSelectionContainer()
//             ?.getFloatingWidgetModels()
//             .forEach(floatingWidgetModel => {
//                 floatingWidgetModel.remove(floatingWidgetModel.getParent());
//             });
//         ctx.getSelectionContainer()?.clearFloatingWidgetModels();

//         const workAreaModel =
//             ctx.getSelectionContainer()?.getEditingNewWorkArea() ??
//             (ctx.getNewAppModel().getFirstChild() as WorkAreaModel);

//         const editorRect = workAreaModel.getEditorRect();
//         const pagePosition = workAreaModel.getPagePosition();
//         const workAreaRect = workAreaModel.getWorkAreaRect();

//         // if (isDefined(container) && !isInsertableRepeatableLayout(container, widgetModels[0], editorUIStore)) {
//         //     this.clearWidgetModelEditContext(ctx);
//         //     widgetModels.forEach(widgetModel => {
//         //         widgetModel.getProperties().setEditingState(WidgetEditingState.NONE);
//         //     });
//         //     return;
//         // }

//         const forceParentChange: boolean = false;
//         // const isSelectReactNodeProp =
//         //     isDefined(desModel) &&
//         // isDefined(ctx.getMetaDataContainer().getReactNodeTypePropMap().get(desModel?.getWidgetType()));

//         widgetModels.forEach(widgetModel => {
//             const pinnedDirections = widgetModel.getPinnedDirections();
//             const position = widgetModel.getPosition();
//             let newLeftUnit = 'px';
//             let newTopUnit = 'px';
//             let newLeftValue = 0;
//             let newTopValue = 0;

//             // app 별 parent rect style 가져오기
//             const {
//                 parentRefX,
//                 parentRefY,
//                 parentRefWidth: parentWidth,
//                 parentRefHeight: parentHeight,
//             } = getTargetParentRectStyle(ctx, widgetModel.getParent());

//             // 먼저 pinned 방향을 확인하여 이동 가능 여부 결정
//             const { keepX, keepY } = this.shouldKeepPosition(pinnedDirections);

//             if (typeof position.left === 'string') {
//                 const oldX = widgetModel.getRefX();
//                 const parentX = parentRefX;
//                 const oldValue = oldX !== undefined && parentX !== undefined ? oldX - parentX : 0;
//                 newLeftValue = keepX ? oldValue : oldValue + deltaX;
//             } else {
//                 const oldLeft = position.left;
//                 const { unit } = oldLeft;
//                 const oldValue = oldLeft.value;
//                 if (unit === 'px') {
//                     newLeftValue = keepX ? oldValue : oldValue + deltaX;
//                 } else {
//                     const oldValueToPx = parentWidth * (oldValue / 100);
//                     newLeftValue = keepX ? oldValue : ((oldValueToPx + deltaX) / parentWidth) * 100;
//                     newLeftUnit = '%';
//                 }
//             }

//             if (typeof position.top === 'string') {
//                 const oldY = widgetModel.getRefY();
//                 const parentY = parentRefY;
//                 const oldValue = oldY !== undefined && parentY !== undefined ? oldY - parentY : 0;
//                 newTopValue = keepY ? oldValue : oldValue + deltaY;
//             } else {
//                 const oldTop = position.top;
//                 const { unit } = oldTop;
//                 const oldValue = oldTop.value;
//                 if (unit === 'px') {
//                     newTopValue = keepY ? oldValue : oldValue + deltaY;
//                 } else {
//                     const oldValueToPx = parentHeight * (oldValue / 100);
//                     newTopValue = keepY ? oldValue : ((oldValueToPx + deltaY) / parentHeight) * 100;
//                     newTopUnit = '%';
//                 }
//             }

//             const newPosition = {
//                 left: { value: newLeftValue, unit: newLeftUnit },
//                 top: { value: newTopValue, unit: newTopUnit },
//                 pinnedDirections: widgetModel.getPinnedDirections().join(','),
//             };

//             // pinnedDirections 먼저 설정하고 position 업데이트
//             widgetModel.setPinnedDirections(pinnedDirections);
//             const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
//             ctx.getCommand()?.append(updatePositionCommand);

//             widgetModel.setEditingState(WidgetEditingState.NONE);

//             // const widgetProps = widgetModel.getProperties();
//             // const canInsertToWidget = checkInsertableItem(container, widgetModel);

//             // widgetModel.getProperties().setEditingState(WidgetEditingState.NONE);

//             // const refPositionMap = widgetEditInfoContainer.getRefPositionMap(widgetModel);

//             // const styleProperties = widgetModel.getProperties().getStyle();

//             // // 마우스를 통한 이동 시 absolute 계산
//             // const isRelative = byKeyEvent && styleProperties.frameType === 'relative';

//             // const xAbsolute = styleProperties.x.absolute;
//             // const yAbsolute = styleProperties.y.absolute;

//             // const referenceX =
//             //     useRefPosition && refPositionMap ? refPositionMap.x : xAbsolute + pagePosition.x;
//             // const referenceY =
//             //     useRefPosition && refPositionMap ? refPositionMap.y : yAbsolute + pagePosition.y;

//             // // parent의 absolute 값으로 relative 계산
//             // const parentWidget = widgetModel.getParent();
//             // const pageModel = workAreaModel.getFirstChild();
//             // if (!parentWidget || !pageModel) {
//             //     return;
//             // }

//             // let dragEndTargetModel: 'Page' | 'WorkArea' = 'Page';
//             // let parentWidth = parentWidget.getRefWidth() ?? parentWidget?.getProperties().getStyle().width.absolute;
//             // let parentHeight =
//             //     parentWidget.getRefHeight() ?? parentWidget?.getProperties().getStyle().height.absolute;

//             // let resultX = isRelative
//             //     ? referenceX + (parentWidget.getRefWidth() ?? 0) * deltaX * 0.01
//             //     : referenceX + deltaX;
//             // let resultY = isRelative
//             //     ? referenceY + (parentWidget.getRefHeight() ?? 0) * deltaY * 0.01
//             //     : referenceY + deltaY;

//             // if (
//             //     (isDefined(changeTopWidgetModel) && !checkTopParentIsWorkArea(parentWidget)) ||
//             //     (!isDefined(changeTopWidgetModel) && checkTopParentIsWorkArea(parentWidget))
//             // ) {
//             //     // Page -> WorkArea or  WorkArea -> WorkArea
//             //     dragEndTargetModel = 'WorkArea';
//             //     parentWidth = workAreaModel.getProperties().getStyle().width.absolute;
//             //     parentHeight = workAreaModel.getProperties().getStyle().height.absolute;

//             //     resultX -= pagePosition.x;
//             //     resultY -= pagePosition.y;
//             // } else if (
//             //     isEditAppMode(ctx.getAppModeContainer()) &&
//             //     (!isSelectReactNodeProp || desModel?.getID() !== widgetModel.getID())
//             // ) {
//             //     // WorkArea -> Page or Page -> Page
//             //     resultX -= pagePosition.x;
//             //     resultY -= pagePosition.y;

//             //     parentWidth = pageModel.getProperties().getStyle().width.absolute;
//             //     parentHeight = pageModel.getProperties().getStyle().height.absolute;

//             //     const isOutOfPage =
//             //         resultX <= 0 ||
//             //         resultY <= 0 ||
//             //         resultX >= parentWidth - (widgetModel.getRefWidth() ?? 0) / (zoomRatio / 100) ||
//             //         resultY >= parentHeight - (widgetModel.getRefHeight() ?? 0) / (zoomRatio / 100);

//             //     const isChildExclusive = basicChildWidgetTypeNamesSet.has(widgetModel.getWidgetType());

//             //     if (!byKeyEvent && isOutOfPage && !isChildExclusive) {
//             //         // 비정상적 동작으로 페이지 내 컴포넌트가 페이지 밖에 배치될 경우 강제로 parent를 workArea로 이동
//             //         forceParentChange = true;
//             //         dragEndTargetModel = 'WorkArea';
//             //         parentWidth = workAreaModel.getProperties().getStyle().width.absolute;
//             //         parentHeight = workAreaModel.getProperties().getStyle().height.absolute;
//             //     }
//             // }

//             // if (!byKeyEvent) {
//             //     // 키보드 이동이 아닌 마우스 드래그 이동 중에 viewPort 밖으로 나간 경우 다시 viewPort 안쪽으로 위치 시킴
//             //     // view port의 좌측 최상단 좌표
//             //     const viewportCoordinates = getViewportCoordinates(
//             //         editorRect,
//             //         workAreaRect,
//             //         zoomRatio,
//             //         pagePosition
//             //     );

//             //     if (resultY <= viewportCoordinates.y) {
//             //         // 위쪽으로 나간 경우
//             //         resultY = viewportCoordinates.y;
//             //     } else if (
//             //         resultY >=
//             //         viewportCoordinates.y +
//             //             (editorRect.height - (widgetModel.getRefHeight() ?? 0)) / (zoomRatio / 100)
//             //     ) {
//             //         // 아래쪽으로 나간 경우
//             //         resultY =
//             //             viewportCoordinates.y +
//             //             (editorRect.height - (widgetModel.getRefHeight() ?? 0)) / (zoomRatio / 100);
//             //     }
//             //     if (resultX <= viewportCoordinates.x) {
//             //         // 왼쪽으로 나간 경우
//             //         resultX = viewportCoordinates.x;
//             //     } else if (
//             //         resultX >=
//             //         viewportCoordinates.x +
//             //             (editorRect.width - (widgetModel.getRefWidth() ?? 0)) / (zoomRatio / 100)
//             //     ) {
//             //         // 오른쪽으로 나간 경우
//             //         resultX =
//             //             viewportCoordinates.x +
//             //             (editorRect.width - (widgetModel.getRefWidth() ?? 0)) / (zoomRatio / 100);
//             //     }
//             // }
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'x', true, {
//             //         ...widgetProps.getStyle().x,
//             //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
//             //         relative:
//             //             isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultX) / parentWidth) * 100),
//             //     })
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'y', true, {
//             //         ...widgetProps.getStyle().y,
//             //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
//             //         relative:
//             //             isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultY) / parentHeight) * 100),
//             //     })
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(
//             //         widgetModel,
//             //         'frameType',
//             //         true,
//             //         dragEndTargetModel === 'WorkArea' ? 'absolute' : widgetProps.getStyle().frameType
//             //     )
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'left', true, {
//             //         ...widgetProps.getStyle().left,
//             //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
//             //         relative:
//             //             isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultX) / parentWidth) * 100),
//             //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().left.anchor,
//             //     })
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'top', true, {
//             //         ...widgetProps.getStyle().top,
//             //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
//             //         relative:
//             //             isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultY) / parentHeight) * 100),
//             //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().top.anchor,
//             //     })
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'right', true, {
//             //         ...widgetProps.getStyle().right,
//             //         absolute:
//             //             parentWidth -
//             //             (isDefined(container) && canInsertToWidget ? 0 : resultX) -
//             //             widgetProps.getStyle().width.absolute,
//             //         relative:
//             //             100 -
//             //             (isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultX) / parentWidth) * 100) +
//             //                   widgetProps.getStyle().width.relative),
//             //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().right.anchor,
//             //     })
//             // );
//             // ctx.getCommand()?.append(
//             //     new UpdateWidgetCommand(widgetModel, 'bottom', true, {
//             //         ...widgetProps.getStyle().bottom,
//             //         absolute:
//             //             parentHeight -
//             //             (isDefined(container) && canInsertToWidget ? 0 : resultY) -
//             //             widgetProps.getStyle().height.absolute,
//             //         relative:
//             //             100 -
//             //             (isDefined(container) && canInsertToWidget
//             //                 ? 0
//             //                 : Math.round((Number(resultY) / parentHeight) * 100) +
//             //                   widgetProps.getStyle().height.relative),
//             //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().bottom.anchor,
//             //     })
//             // );
//         });
//         // console.log(newParentChildPermittedRelationMap.get(desModel?.getWidgetTypeId() as number));
//         // console.log(
//         //     newParentChildPermittedRelationMap
//         //         .get(desModel?.getWidgetTypeId() as number)
//         //         ?.has(widgetModel.getWidgetTypeId())
//         // );

//         const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets();

//         // VERSION2_FIXME: 셀렉션 및 이동관련 세부 기획 필요, Composite인 경우, Tree 관계 변경 불가
//         if (desModel && selectedWidgets) {
//             if (
//                 checkCompositeChildModel(compositeComponentContainer, desModel) ||
//                 checkCompositeChildModel(compositeComponentContainer, selectedWidgets[0])
//             ) {
//                 ctx.getHitContainer().setStartHitItem(undefined);
//                 this.clearWidgetModelEditContext(ctx);
//                 return;
//             }
//         }

//         if (isDefined(desModel)) {
//             if (
//                 desModel.getWidgetTypeId() === SystemComponentType.WorkArea ||
//                 desModel.getWidgetTypeId() === SystemComponentType.Page ||
//                 checkWidgetForAbsoluteChild(desModel)
//             ) {
//                 const { pureWidgetModels } = classifyWidgetModelsForSelection(ctx, widgetModels);
//                 // workArea 혹은 page로 이동
//                 pureWidgetModels.forEach(widgetModel => {
//                     const parentWidgetModel = widgetModel.getParent();
//                     // 특정 컴포넌트 하위에만 존재해야 하는 컴포넌트는 이동 불가하도록 추가
//                     if (!isInsertableItemToWorkAreaOrPage(widgetModel) || !(widgetModel instanceof NewWidgetModel)) {
//                         return;
//                     }
//                     // app 별 parent rect style 가져오기
//                     const {
//                         parentRefX,
//                         parentRefY,
//                         parentRefWidth: parentWidth,
//                         parentRefHeight: parentHeight,
//                     } = getTargetParentRectStyle(ctx, desModel);
//                     if (parentWidgetModel && parentWidgetModel !== desModel) {
//                         const removeWidgetCommand = new NewRemoveWidgetCommand(widgetModel, parentWidgetModel);
//                         ctx.getCommand()?.append(removeWidgetCommand);

//                         const appendCompositeCommand = new NewAppendWidgetCommand(ctx, widgetModel, desModel);
//                         ctx.getCommand()?.append(appendCompositeCommand);

//                         const targetFloatingModel = widgetEditInfoContainer.getEditingFloatingWidget(widgetModel);
//                         if (
//                             targetFloatingModel &&
//                             (widgetModel.getParent() instanceof SystemComponentModel ||
//                                 checkWidgetForAbsoluteChild(desModel))
//                         ) {
//                             // frame에서 page 혹은 workArea로 이동 시 postion의 계산이 필요함
//                             const position = targetFloatingModel.getPosition();

//                             const leftUnit = typeof position.left === 'string' ? 'px' : position.left.unit;
//                             const widgetX = targetFloatingModel.getRefX();
//                             const parentX = parentRefX;
//                             const leftValue =
//                                 widgetX !== undefined && parentX !== undefined ? (widgetX - parentX) / zoomRatio : 0;

//                             const topUnit = typeof position.top === 'string' ? 'px' : position.top.unit;
//                             const widgetY = targetFloatingModel.getRefY();
//                             const parentY = parentRefY;
//                             const topValue =
//                                 widgetY !== undefined && parentY !== undefined ? (widgetY - parentY) / zoomRatio : 0;

//                             const newPosition = {
//                                 left: {
//                                     value: leftUnit === 'px' ? leftValue : (leftValue / parentWidth) * 100,
//                                     unit: leftUnit,
//                                 },
//                                 top: {
//                                     value: topUnit === 'px' ? topValue : (topValue / parentHeight) * 100,
//                                     unit: topUnit,
//                                 },
//                                 pinnedDirections: widgetModel.getPinnedDirections().join(','),
//                             };
//                             const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
//                             ctx.getCommand()?.append(updatePositionCommand);
//                         }
//                     }
//                 });
//             } else {
//                 widgetModels.forEach(widgetModel => {
//                     // frame 하위로 이동
//                     const childCapable = // desModel이 widgetModel을 child로 가질 수 있는지 판단
//                         newParentChildPermittedRelationMap.get(desModel.getWidgetTypeId()) &&
//                         newParentChildPermittedRelationMap
//                             .get(desModel.getWidgetTypeId())
//                             ?.has(widgetModel.getWidgetTypeId());
//                     if (childCapable) {
//                         const removeWidgetCommand = new NewRemoveWidgetCommand(
//                             widgetModel,
//                             widgetModel.getParent() as BaseWidgetModel
//                         );
//                         ctx.getCommand()?.append(removeWidgetCommand);

//                         const appendCompositeCommand = new NewAppendWidgetCommand(ctx, widgetModel, desModel);
//                         ctx.getCommand()?.append(appendCompositeCommand);
//                     } else if (desModel instanceof PublishedComponentModel) {
//                         // PGX 하위로 삽입 시도 시 최상위 부모가 변경되게 되면 workArea or page로 parent 변경
//                         const removeWidgetCommand = new NewRemoveWidgetCommand(
//                             widgetModel,
//                             widgetModel.getParent() as BaseWidgetModel
//                         );
//                         ctx.getCommand()?.append(removeWidgetCommand);

//                         const appendCompositeCommand = new NewAppendWidgetCommand(
//                             ctx,
//                             widgetModel,
//                             checkTopParentIsWorkArea(desModel) ? workAreaModel : workAreaModel.getFirstChild()
//                         );
//                         ctx.getCommand()?.append(appendCompositeCommand);
//                     }
//                 });
//             }
//         }
//         // if (isSelectReactNodeProp) {
//         //     runInAction(() => {
//         //         ctx.setDialogType(ribbonDialogContentMap.SelectReactNodeProp);
//         //         ctx.setDialogOpen(true);
//         //     });
//         //     ctx.setDragDesModel(desModel);

//         //     if (isDefined(changeTopWidgetModel)) {
//         //         // 컴포넌트 내 속성 다이얼로그 조건 충족 시에 WorkArea에서 Page로 이동했을 경우 parent 변경
//         //         widgetModels.forEach(widgetModel => {
//         //             const parentWidgetModel = widgetModel.getParent();
//         //             if (parentWidgetModel) {
//         //                 const moveWidgetCommand = new MoveWidgetCommand(
//         //                     widgetModel,
//         //                     parentWidgetModel,
//         //                     changeTopWidgetModel
//         //                 );
//         //                 ctx.getCommand()?.append(moveWidgetCommand);
//         //             }
//         //         });
//         //     }
//         // } else if (isDefined(container)) {
//         //     // 마우스 커서가 위치한 곳으로 삽입하기 위해 next sibling 찾음
//         //     const { mousePosition } = props;
//         //     const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
//         //     let nextSibling: WidgetModel | undefined;
//         //     if (isDefined(mousePosition) && isDefined(hitModel)) {
//         //         nextSibling = findNextSiblingDragInContainer(
//         //             container,
//         //             mousePosition,
//         //             selectedWidgets?.includes(hitModel) ? selectedWidgets : selectedWidgets?.concat(hitModel)
//         //         );
//         //     }

//         //     widgetModels.forEach(widgetModel => {
//         //         if (
//         //             isDefined(container) &&
//         //             checkInsertableItem(container, widgetModel) &&
//         //             !isErrorWidgetModelsInTree(ctx.getErrorBoundaryContainer(), [container])
//         //         ) {
//         //             // Widget node 이동시킴
//         //             const moveWidgetCommand = new MoveWidgetCommand(
//         //                 widgetModel,
//         //                 widgetModel.getParent()!,
//         //                 container,
//         //                 nextSibling
//         //             );
//         //             ctx.getCommand()?.append(moveWidgetCommand);

//         //             // 컨테이너 내부에 item 삽입 시 sibling re-render
//         //             container.forEachChild(child => {
//         //                 if (child !== widgetModel) {
//         //                     child.triggerRerender();
//         //                 }
//         //             });
//         //         }
//         //     });
//         // } else if (isDefined(changeTopWidgetModel)) {
//         //     widgetModels.forEach(widgetModel => {
//         //         const parentWidgetModel = widgetModel.getParent();
//         //         if (parentWidgetModel) {
//         //             const moveWidgetCommand = new MoveWidgetCommand(
//         //                 widgetModel,
//         //                 parentWidgetModel,
//         //                 changeTopWidgetModel
//         //             );
//         //             ctx.getCommand()?.append(moveWidgetCommand);
//         //         }
//         //     });
//         // } else if (forceParentChange) {
//         //     // 정상적인 마우스 이벤트 종료가 아닌 Page 내 컴포넌트가 비정상적인 방식으로
//         //     //  WorkArea로의 좌표 이동이 일어났을 경우 parent WorkArea로 이동
//         //     widgetModels.forEach(widgetModel => {
//         //         const parentWidgetModel = widgetModel.getParent();
//         //         if (parentWidgetModel) {
//         //             const moveWidgetCommand = new MoveWidgetCommand(widgetModel, parentWidgetModel, workAreaModel);
//         //             ctx.getCommand()?.append(moveWidgetCommand);
//         //         }
//         //     });
//         // } else if (isMovedToPage) {
//         //     const destParent = checkTopParentIsWorkArea(desModel) ? workAreaModel : workAreaModel.getFirstChild()!;
//         //     widgetModels.forEach(widgetModel => {
//         //         const parentWidgetModel = widgetModel.getParent();
//         //         if (parentWidgetModel && !checkBusinessOrPageDialogModel(widgetModel.getParent())) {
//         //             const moveWidgetCommand = new MoveWidgetCommand(widgetModel, parentWidgetModel, destParent);
//         //             ctx.getCommand()?.append(moveWidgetCommand);
//         //         }
//         //     });
//         // }
//         ctx.getHitContainer().setStartHitItem(undefined);
//         this.clearWidgetModelEditContext(ctx);
//     }

//     /**
//      * Widget을 ReactNode type prop으로 drop.
//      */
//     @boundMethod
//     private moveToReactNodeProp(ctx: AppContext, props: WidgetMoveToReactNodePropCommandProps): void {
//         const widgetModels = ctx.getSelectionContainer()?.getSelectedWidgets();
//         const desModel = ctx.getDragDesModel();
//         if (isUndefined(widgetModels) || isUndefined(desModel)) {
//             return;
//         }
//         const { propName } = props;
//         // XXX: 일단 단일선택만 고려
//         // ctx.setButtonPropsIconWidgetMap(widgetModels[0].getID(), widgetModels[0] as NewWidgetModel);

//         // const propModelProp = desModel.getProperties();
//         // const updateWidgetCommand = new UpdateWidgetCommand(desModel, propName, false, {
//         //     ...propModelProp.getContent()[propName],
//         //     value: widgetModels[0],
//         // });
//         // ctx.getCommand()?.append(updateWidgetCommand);

//         // const removeWidgetCommand = new RemoveWidgetForPropsCommand(widgetModels[0] as WidgetModel, desModel, propName);
//         // ctx.getCommand()?.append(removeWidgetCommand);
//     }

//     /**
//      * Widget의 Props 변경
//      */
//     @boundMethod
//     private updateWidgetProps(ctx: AppContext, props: NewUpdateWidgetCommandProps): void {
//         if (isUndefined(ctx.getCommand())) {
//             dError('command is not exist');

//             return;
//         }

//         const { newWidgetProps, targetModel: widgetModels } = props;

//         widgetModels.forEach((widgetModel: NewWidgetModel) => {
//             newWidgetProps.forEach(newWidgetProp => {
//                 const { propId, value } = newWidgetProp;
//                 const updatePropsCommand = new UpdatePropsCommand(
//                     widgetModel,
//                     Number(propId),
//                     value,
//                     undefined,
//                     ctx.getDataStore().getNonBindableDataReferenceContainer()
//                 );
//                 ctx.getCommand()?.append(updatePropsCommand);
//             });
//         });
//     }

//     /**
//      * Widget의 Props 변경 및 Sub component 삽입/삭제
//      */
//     @boundMethod
//     private updateWidgetSubComponentCount(ctx: AppContext, props: NewUpdateWidgetSubComponentCountCommandProps): void {
//         if (isUndefined(ctx.getCommand())) {
//             dError('command is not exist');

//             return;
//         }

//         const { newWidgetProps, targetModel: widgetModels, controlSubComponentCounts, prevWidgetProps } = props;

//         widgetModels.forEach((widgetModel: NewWidgetModel) => {
//             for (let idx = 0; idx < newWidgetProps.length; idx++) {
//                 const { propId, value } = newWidgetProps[idx];
//                 const updatePropsCommand = new UpdatePropsCommand(widgetModel, Number(propId), value);
//                 ctx.getCommand()?.append(updatePropsCommand);

//                 if (prevWidgetProps && controlSubComponentCounts) {
//                     const { value: prevValue } = prevWidgetProps[idx];

//                     if (value > prevValue) {
//                         // 값이 증가했을 때 sub component 삽입
//                         for (let itr = 0; itr < value - prevValue; itr++) {
//                             const controlSubComponentCount = controlSubComponentCounts[idx];
//                             controlSubComponentCount.forEach(([subComponentTypeId, subComponentType]) => {
//                                 this.appendSubComponentCommand(ctx, subComponentTypeId, subComponentType, widgetModel);
//                             });
//                         }
//                     } else if (value < prevValue) {
//                         // 값이 감소했을 때 sub component 제거
//                         const deleteModels: (BaseWidgetModel | NewWidgetModel)[] = [];
//                         for (let itr = 0; itr < prevValue - value; itr++) {
//                             const controlSubComponentCount = controlSubComponentCounts[idx];
//                             controlSubComponentCount
//                                 .slice()
//                                 .reverse()
//                                 .forEach(([subComponentTypeId]) => {
//                                     let curWidget = widgetModel.getLastChild();

//                                     while (
//                                         curWidget &&
//                                         (curWidget.getWidgetTypeId() !== subComponentTypeId ||
//                                             deleteModels.includes(curWidget))
//                                     ) {
//                                         curWidget = curWidget.getPrevSibling();
//                                     }

//                                     if (curWidget && curWidget.getWidgetTypeId() === subComponentTypeId) {
//                                         deleteModels.push(curWidget);
//                                     }
//                                 });
//                         }
//                         this.deleteFileRelation(ctx, deleteModels);
//                         this.deleteTargetModels(deleteModels, ctx, {
//                             commandID: CommandEnum.DELETE_WIDGET,
//                         });
//                     }
//                 }
//             }
//         });
//     }

//     /**
//      * pinned 방향에 따라 position을 유지할지 결정하는 함수
//      */
//     private shouldKeepPosition(pinnedDirections: string[]): { keepX: boolean; keepY: boolean } {
//         if (
//             pinnedDirections.includes('center') ||
//             (pinnedDirections.includes('top') &&
//                 pinnedDirections.includes('bottom') &&
//                 pinnedDirections.includes('left') &&
//                 pinnedDirections.includes('right'))
//         ) {
//             return { keepX: true, keepY: true };
//         }

//         return {
//             keepX: pinnedDirections.includes('left') || pinnedDirections.includes('right'),
//             keepY: pinnedDirections.includes('top') || pinnedDirections.includes('bottom'),
//         };
//     }

//     /**
//      * 특정 컴포넌트의 하위에 컴포넌트를 추가하는 함수
//      */
//     private appendSubComponentCommand(
//         ctx: AppContext,
//         componentTypeId: number,
//         componentType: string,
//         parentModel: BaseWidgetModel,
//         nextSibling?: BaseWidgetModel
//     ) {
//         const model = this.newCreateNewWidgetModel(ctx, componentTypeId, componentType) as SystemComponentModel;
//         const appendComponentCommand = new NewAppendWidgetCommand(ctx, model, parentModel, nextSibling);
//         ctx.getCommand()?.append(appendComponentCommand);
//         return model;
//     }

//     /**
//      * Widget 보이기/숨기기 여부 변경 (hidden properties 변경)
//      */
//     @boundMethod
//     private hideWidget(ctx: AppContext, props: HideWidgetCommandProps): void {
//         if (isUndefined(ctx.getCommand())) {
//             dError('command is not exist');
//             return;
//         }
//         const { targetModel, hidden, compositeModel } = props;
//         // 에셋 보이기/숨기기 여부 변경
//         if (compositeModel) {
//             const hiddenCommand = new UpdateHiddenAssetCommand(compositeModel, targetModel.getID(), hidden);
//             ctx.getCommand()?.append(hiddenCommand);
//         }

//         const hiddenComponent = (component: NewWidgetModel) => {
//             applyHiddenCommand(ctx, component, hidden);
//             component.forEachChild(hiddenComponent);
//         };

//         hiddenComponent(targetModel);
//     }

//     /**
//      * Widget 잠금 여부 변경 (locked properties 변경)
//      */
//     @boundMethod
//     private lockWidget(ctx: AppContext, props: LockWidgetCommandProps): void {
//         if (isUndefined(ctx.getCommand())) {
//             dError('command is not exist');
//             return;
//         }
//         const { targetModel, locked, compositeModel } = props;
//         // 에셋 잠금 여부 변경
//         if (compositeModel) {
//             const hiddenCommand = new UpdateLockAssetCommand(compositeModel, targetModel.getID(), locked);
//             ctx.getCommand()?.append(hiddenCommand);
//         }

//         const lockComponent = (component: NewWidgetModel) => {
//             applyLockCommand(ctx, component, locked);
//             component.forEachChild(child => {
//                 lockComponent(child as NewWidgetModel);
//             });
//         };

//         lockComponent(targetModel);
//     }

//     /**
//      * widget content property 초기화
//      */
//     @boundMethod
//     private resetWidgetContent(ctx: AppContext, props: resetWidgetContentCommandProps): void {
//         // const { propertyKey, newWidgetProps } = props;
//         // const selectedWidgets = ctx.getSelectionContainer().getSelectedWidgets();
//         // if (isDefined(selectedWidgets)) {
//         //     const updateCommandProps: WidgetUpdateCommandProps = {
//         //         commandID: CommandEnum.WIDGET_UPDATE_PROPERTIES,
//         //         targetModel: selectedWidgets,
//         //         newWidgetProps,
//         //     };
//         //     this.updateWidgetProps(ctx, updateCommandProps);
//         //     // binding 정보 초기화
//         //     selectedWidgets.forEach(widget => {
//         //         deleteWidgetStateInfo(ctx, propertyKey, widget);
//         //         deleteWidgetPropInfo(ctx, propertyKey, widget);
//         //         deleteWidgetVariableInfo(ctx, `content_${propertyKey}`, widget);
//         //     });
//         // }
//     }

//     /**
//      * Conditional Layout에 프레임 추가
//      */
//     @boundMethod
//     private insertConditionalLayoutFrame(ctx: AppContext, props: InsertConditionalLayoutFrameCommandProps) {
//         const { conditionalModel, newFrameName, newWidgetID } = props;

//         // 1. 프레임(Fragment Layout) 생성
//         const newFrameModel = this.createNewWidgetModel(ctx, 'FragmentLayout', newWidgetID);
//         if (isUndefined(newFrameModel)) {
//             dError(`insertConditionalLayoutFrame: Cannot create FragmentLayout widget model`);
//             // return;
//         }

//         // 2. 생성된 프레임에 프레임 이름 부여
//         // const FRAME_NAME_KEY: string = 'frameName';
//         // const oldWidgetProps = newFrameModel.getProperties();
//         // newFrameModel.getProperties().setContent(FRAME_NAME_KEY, {
//         //     ...oldWidgetProps.getContent()[FRAME_NAME_KEY],
//         //     value: newFrameName,
//         //     locked: true, // 프레임 이름를 직접 Fragment Layout의 속성 패널에서 수정하지 못하게 막아둠
//         // });

//         // 3. 생성된 프레임을 ConditionalLayout에 삽입
//         // const appendFragmentLayoutWidgetCommand = new AppendWidgetCommand(ctx, newFrameModel, conditionalModel);
//         // ctx.getCommand()?.append(appendFragmentLayoutWidgetCommand);
//     }

//     /**
//      * Conditional Layout에서 프레임 삭제
//      */
//     @boundMethod
//     private deleteConditionalLayoutFrame(ctx: AppContext, props: DeleteConditionalLayoutFrameCommandProps) {
//         // const { conditionalModel, frameName } = props;
//         // if (conditionalModel.getChildCount() <= 1) {
//         //     dError('deleteConditionalLayoutFrame: ConditionalLayout should have at least 1 child.');
//         //     return;
//         // }
//         // const frameModel: WidgetModel | undefined = getConditionalLayoutFrameModel(conditionalModel, frameName);
//         // if (isUndefined(frameModel)) {
//         //     dError(`deleteConditionalLayoutFrame: Frame ${frameName} not found`);
//         //     return;
//         // }
//         // appendDeleteWidgetCommandsRecursive(frameModel, ctx, props.commandID);
//     }

//     /**
//      * Conditional Layout에서 프레임 이름 수정
//      */
//     @boundMethod
//     private updateConditionalLayoutFrame(ctx: AppContext, props: UpdateConditionalLayoutFrameCommandProps) {
//         // const { conditionalModel, frameName, newFrameName } = props;
//         // const frameModel: WidgetModel | undefined = getConditionalLayoutFrameModel(conditionalModel, frameName);
//         // if (isUndefined(frameModel)) {
//         //     dError(`updateConditionalLayoutFrame: Frame ${frameName} not found`);
//         //     return;
//         // }
//         // // 속성 변경
//         // const FRAME_NAME_KEY: string = 'frameName';
//         // const oldWidgetProps = frameModel.getProperties();
//         // const newWidgetProps: IWidgetPartofProperties = {
//         //     content: {
//         //         [FRAME_NAME_KEY]: {
//         //             ...oldWidgetProps.getContent()[FRAME_NAME_KEY],
//         //             value: newFrameName,
//         //             locked: true,
//         //         },
//         //     },
//         // };
//         // const updateWidgetCommmandProps: WidgetUpdateCommandProps = {
//         //     commandID: CommandEnum.WIDGET_UPDATE_PROPERTIES,
//         //     targetModel: [frameModel],
//         //     newWidgetProps,
//         // };
//         // this.updateWidgetProps(ctx, updateWidgetCommmandProps);
//     }

//     /**
//      * ux에서 parent를 workArea에서 page로 바꿔주는 함수
//      */
//     @boundMethod
//     private changeWorkAreaToPage(
//         ctx: AppContext,
//         parent: BaseWidgetModel,
//         newWidgetModel: BaseWidgetModel
//     ): BaseWidgetModel {
//         if (parent instanceof WorkAreaModel && newWidgetModel instanceof NewWidgetModel) {
//             if (parent.getFirstChild().getLocked()) {
//                 // 페이지 잠금 시 페이지로의 부모 변환 없음
//                 return parent;
//             }
//             if (checkPageStudioComponent(parent.getFirstChild())) {
//                 // 스튜디오 페이지 하위로 삽입 시 페이지로의 부모 변화 없음
//                 return parent;
//             }
//             const position = newWidgetModel.getPosition();
//             const widgetLeft = typeof position.left === 'string' ? 0 : position.left.value;
//             const widgetTop = typeof position.top === 'string' ? 0 : position.top.value;
//             // pixel로 변환된 값을 사용
//             const { width: widgetWidth, height: widgetHeight } = convertSizeToPixel(newWidgetModel);

//             const widgetRight = widgetLeft + widgetWidth;
//             const widgetBottom = widgetTop + widgetHeight;

//             // workArea의 parent는 appModel
//             const deviceInfo = parent.getParent().getDeviceInfo();
//             const deviceInfoMetaDataMap = ctx.getNewMetaDataContainer().getDeviceInfoMetaDataMap();
//             const deviceSize = getDeviceSize(deviceInfoMetaDataMap, deviceInfo);

//             // page 영역 안에 있는가
//             if (widgetLeft > 0 && widgetRight < deviceSize.width && widgetTop > 0 && widgetBottom < deviceSize.height) {
//                 return parent.getFirstChild();
//             }
//         }
//         return parent;
//     }

//     /**
//      * widget 삽입 위치에 대한 postProcess 함수
//      */
//     @boundMethod
//     private setInfoForInsertDragWidget(ctx: AppContext, props: SetInfoForInsertDragWidgetCommandProps): void {
//         const { dragInsertWidgetInfo } = props;
//         if (dragInsertWidgetInfo) {
//             // dataTransfer의 item은 dragOver시 확인할 수 없은 정보이므로 따로 id를 저장
//             ctx.getWidgetEditInfoContainer().setDragInsertWidgetInfo(dragInsertWidgetInfo);
//         }
//     }

//     /**
//      * widget의 사이즈 업데이트 함수
//      */
//     @boundMethod
//     private updateWidgetSize(ctx: AppContext, props: UpdateWidgetSizeProps) {
//         const updateComand = new UpdateSizeCommand(props.newWidgetModel, props.newSize);
//         ctx.getCommand()?.append(updateComand);
//     }

//     /**
//      * widget의 포지션 업데이트 함수
//      */
//     @boundMethod
//     private updateWidgetPosition(ctx: AppContext, props: UpdateWidgetPositionProps) {
//         const updateComand = new UpdatePositionCommand(props.newWidgetModel, props.newPosition);
//         ctx.getCommand()?.append(updateComand);
//     }
// }

// export default WidgetEditCommandHandler;
