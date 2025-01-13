import {
  IWidgetCommonProperties,
  isUndefined,
  dError,
  isDefined,
  DeepReadonly,
  WidgetTypeEnum,
  WidgetEditingState,
  IWidgetStyleProperties,
} from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { runInAction } from 'mobx';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import AppendWidgetCommand from 'models/store/command/widget/AppendWidgetCommand';
import {
  WidgetResizeHandle,
  WidgetPosition,
  isVerticalCenterHandle,
  isHorizontalCenterHandle,
} from 'models/store/container/WidgetEditInfoContainer';
import SelectionEnum from 'models/store/selection/SelectionEnum';
import AkronContext from 'models/store/context/AkronContext';
import CompositeModel from 'store/component/CompositeModel';
import {
  appendDeleteWidgetCommandsRecursive,
  checkInsertableItem,
  checkPageModel,
  clearWidgetModelEditContext,
  findNextSiblingDragInContainer,
  getDeletableWidgetModels,
  isWidgetsDeletable,
} from 'util/WidgetUtil';
import UpdateWidgetCommand from 'models/store/command/widget/UpdateWidgetCommand';
import AppendWidgetRecursiveCommand from 'models/store/command/widget/AppendWidgetRecursiveCommand';
import { isEditAppMode, isEditWidgetMode } from 'util/AppModeUtil';
import RenameWidgetCommand from 'models/store/command/widget/RenameWidgetCommand';
import { WidgetStyle, Position, Length, Constraint } from 'models/widget/WidgetPropTypes';
import { commonStyleMeta, getMetaDataByType } from 'models/util/LocalMetaData';
import PageModel from 'models/node/PageModel';
import MoveWidgetCommand from 'models/store/command/widget/MoveWidgetCommand';
import { applyStyleByEditingState } from 'util/WidgetEditUtil';

/**
 * 삽입과 동시에 속성을 특정 값으로 설정해야 할 때 사용.
 * 현재 방식: 속성의 메타데이터 ID를 가지고, 모델의 props에 일치하는 ID의 속성들을 덮어씀.
 * 이유: 속성 ID는 모델 생성 뒤에 나옴.
 */
// type InitializeProperties = Array<WidgetProp>;

let widgetId = 1000;

/**
 * Widget 삽입 시 필요한 Props
 */
export type InsertWidgetCommandProps<Props extends IWidgetCommonProperties = IWidgetCommonProperties> =
  WidgetCommandProps & {
    commandID: CommandEnum.INSERT_WIDGET;
    widgetType: WidgetTypeEnum;
    widgetID: WidgetID;
    // 부모 Widget을 지정해줘야할 때 사용.
    parentWidgetModel?: WidgetModel;
    // 삽입과 동시에 속성을 특정 값으로 설정해야 할 때 사용. (기존 속성 => 새 속성)
    initializeProperties?: (defaultProperties: DeepReadonly<Props>) => Props;
  };
/**
 * Widget 을 특정 위치에 삽입 시 필요한 Props
 */
export type InsertWidgetAtCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.INSERT_WIDGET_AT;
  widgetType: WidgetTypeEnum;
  widgetID: WidgetID;
  posX: number;
  posY: number;
  initializeProperties?: (defaultProperties: DeepReadonly<IWidgetCommonProperties>) => IWidgetCommonProperties;
  // clone으로 삽입하는 경우
  cloneWidget?: WidgetModel;
};

/**
 * Widget 템플릿의 복사본을 삽입 시 필요한 Props
 */
export type InsertWidgetCloneCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.INSERT_WIDGET_CLONE;
  widgetModel: WidgetModel;
  widgetID: WidgetID;
};

/**
 * Widget 삭제 시 필요한 Props
 */
export type DeleteWidgetCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.DELETE_WIDGET | CommandEnum.CLIPBOARD_CUT_PROCESS;
};

/**
 * Widget 이름 변경시 필요한 Props
 */
export type RenameWidgetCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.RENAME_WIDGET;
  targetModel: WidgetModel;
  componentNewName: string;
};

/**
 * Widget 숨김 시 필요한 Props
 */
export type HideWidgetCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.HIDE_WIDGET;
  targetModel: WidgetModel;
  hidden: boolean;
  compositeModel?: CompositeModel;
};

/**
 * Widget 잠금 시 필요한 Props
 */
export type LockWidgetCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.LOCK_WIDGET;
  targetModel: WidgetModel;
  locked: boolean;
  compositeModel?: CompositeModel;
};

/**
 * Widget 끌어서 이동 시작 시 필요한 Props
 */
export type WidgetMoveStartCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_MOVE_START;
  targetModels: WidgetModel[];
};

/**
 * Widget 끌어서 이동 종료 시 필요한 Props
 */
type WidgetMoveEndCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_MOVE_END;
  targetModels: WidgetModel[];
  useRefPosition?: boolean;
  byKeyEvent?: boolean;
  deltaX: number;
  deltaY: number;
  pinnedDirections?: string[];
  changeTopWidgetModel?: WidgetModel | undefined;
  container?: WidgetModel | undefined;
  isMovedToPage?: boolean;
  mousePosition?: { x: number; y: number };
  desModel?: WidgetModel;
};

/**
 * Widget 끌어서 ReactNode type prop으로 drop 시 필요한 Props
 */
export type WidgetMoveToReactNodePropCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_MOVE_REACTNODE_PROP;
  propName: string;
};

/**
 * Widget을 끌어서 이동하는 기능에 필요한 Props
 */
export type WidgetMoveCommandProps =
  | WidgetMoveStartCommandProps
  | WidgetMoveEndCommandProps
  | WidgetMoveToReactNodePropCommandProps;

/**
 * Widget update 시 필요한 Props
 */
export type WidgetUpdateCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_UPDATE_PROPERTIES;
  targetModel: WidgetModel[];
  newWidgetProps: IWidgetCommonProperties;
};

// /**
//  * Widget의 Sub Component Count update 시 필요한 Props
//  */
// export type NewUpdateWidgetSubComponentCountCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.WIDGET_UPDATE_SUB_COMPONENT_COUNT;
//   targetModel: WidgetModel[];
//   newWidgetProps: IWidgetPropValueData[];
//   prevWidgetProps?: IWidgetPropValueData[];
//   controlSubComponentCounts?: ControlSubComponentCount[];
// };

/**
 * widget property binding 해제 및 value 초기화
 */
export type ResetWidgetContentCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.RESET_WIDGET_CONTENT;
  propertyKey: string;
  newWidgetProps: IWidgetCommonProperties;
};

/**
 * Widget 끌어서 resize 시작 시 필요한 Props
 */
export type WidgetResizeStartCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_RESIZE_START;
  targetModels: WidgetModel[];
};

/**
 * Widget 끌어서 resize 종료 시 필요한 Props
 */
export type WidgetResizeEndCommandProps = WidgetCommandProps & {
  commandID: CommandEnum.WIDGET_RESIZE_END;
  targetModels: WidgetModel[];
  deltaX: number;
  deltaY: number;
  deltaWidth: number;
  deltaHeight: number;
};

export type WidgetResizeCommandProps = WidgetResizeStartCommandProps | WidgetResizeEndCommandProps;

// /**
//  * widgetModel의 repeatablePropsDTOMap을 업데이트할 때 필요한 Props
//  */
// export type UpdateRepeatablePropsDTOMapCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.UPDATE_REPEATABLE_PROPS_DTO_MAP;
//   dataBindingContainer: DataBindingContainer;
//   widgetModel: WidgetModel;
//   DTOID: number;
//   customPropName: string;
//   DTODataValueName: string;
// };

// /**
//  * widgetModel의 repeatablePropsDTOMap에서 데이터를 제거할 때 필요한 Props
//  */
// export type DeleteRepeatablePropsDTOMapCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.DELETE_REPEATABLE_PROPS_DTO_MAP;
//   dataBindingContainer: DataBindingContainer;
//   widgetModel: WidgetModel;
//   DTOID: number;
//   customPropName: string;
// };

// /**
//  * widgetModel의 customPropsVariableMap을 업데이트할 때 필요한 Props
//  */
// export type UpdateCustomPropsVariableMapCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.UPDATE_CUSTOM_PROPS_VARIABLE_MAP;
//   dataBindingContainer: DataBindingContainer;
//   widgetModel: WidgetModel;
//   variableID: number;
//   customPropID: DataID;
//   variableMemberName: string;
// };

// /**
//  * widgetModel의 customPropsVariableMap 삭제시 필요한 Props
//  */
// export type DeleteCustomPropsVariableMapCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.DELETE_CUSTOM_PROPS_VARIABLE_MAP;
//   dataBindingContainer: DataBindingContainer;
//   widgetModel: WidgetModel;
//   variableID?: number;
//   customPropID?: DataID;
// };

/**
 * WidgetCommandProp의 집합입니다.
 */
type WidgetEditCommandProps =
  | InsertWidgetCommandProps
  | InsertWidgetAtCommandProps
  | InsertWidgetCloneCommandProps
  | DeleteWidgetCommandProps
  | RenameWidgetCommandProps
  | HideWidgetCommandProps
  | LockWidgetCommandProps
  | WidgetMoveCommandProps
  | WidgetUpdateCommandProps
  | WidgetResizeCommandProps
  //   | UpdateRepeatablePropsDTOMapCommandProps
  //   | DeleteRepeatablePropsDTOMapCommandProps
  //   | UpdateCustomPropsVariableMapCommandProps
  //   | DeleteCustomPropsVariableMapCommandProps
  | ResetWidgetContentCommandProps;

// /**
//  * Conditional Layout에 프레임(Fragment Layout) 추가 시 필요한 Props
//  */
// export type InsertConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.INSERT_CONDITIONAL_LAYOUT_FRAME;
//   conditionalModel: WidgetModel;
//   newFrameName: string;
//   newWidgetID: WidgetID;
// };

// /**
//  * Conditional Layout에서 프레임(Fragment Layout) 삭제 시 필요한 Props
//  */
// export type DeleteConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.DELETE_CONDITIONAL_LAYOUT_FRAME;
//   conditionalModel: WidgetModel;
//   frameName: string;
// };

// /**
//  * Conditional Layout에서 프레임(Fragment Layout) 수정 시 필요한 Props
//  */
// export type UpdateConditionalLayoutFrameCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.UPDATE_CONDITIONAL_LAYOUT_FRAME;
//   conditionalModel: WidgetModel;
//   frameName: string;
//   newFrameName: string;
// };

// /**
//  * Widget Size 업데이트시 필요한 Props
//  */
// export type UpdateWidgetSizeProps = {
//   commandID: CommandEnum.UPDATE_SIZE;
//   newSize: { width: WidgetSize; height: WidgetSize };
//   newWidgetModel: WidgetModel;
// };

// /**
//  * Widget Position 업데이트시 필요한 Props
//  */
// export type UpdateWidgetPositionProps = {
//   commandID: CommandEnum.UPDATE_POSITION;
//   newPosition: UpdatePosition;
//   newWidgetModel: WidgetModel;
// };

/**
 * WidgetModel의 잠금 상태를 반영하는 함수
 */
// export function applyLockCommand(ctx: AppContext, widgetModel: WidgetModel, locked: boolean): void {
//     const lockCommand = new UpdateComponentProperties(widgetModel, 'locked', locked);
//     ctx.command?.append(lockCommand);
// }

// /**
//  * WidgetModel의 숨김 상태를 반영하는 함수
//  */
// export function applyHiddenCommand(ctx: AkronContext, widgetModel: WidgetModel, hidden: boolean): void {
//   const hiddenCommand = new UpdateHiddenCommand(widgetModel, hidden);
//   ctx.getCommand()?.append(hiddenCommand);
// }

/**
 * Widget 편집 동작을 처리하는 CommandHandler
 */
class WidgetEditCommandHandler extends CommandHandler {
  /**
   * Widget 편집  관련 커맨드를 처리합니다
   */
  public processCommand(props: WidgetEditCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.INSERT_WIDGET:
        this.insertWidget(ctx, props);
        break;
      case CommandEnum.INSERT_WIDGET_AT:
        this.insertWidgetAt(ctx, props);
        break;
      case CommandEnum.INSERT_WIDGET_CLONE:
        // this.insertWidgetClone(ctx, props);
        break;
      case CommandEnum.DELETE_WIDGET:
        this.deleteWidget(ctx, props);
        break;
      case CommandEnum.CLIPBOARD_CUT_PROCESS:
        if (
          isUndefined(ctx.getSelectionContainer()) ||
          !isWidgetsDeletable(ctx.getSelectionContainer()?.getSelectedWidgets() ?? [])
        ) {
          return false;
        }
        this.deleteWidget(ctx, props);
        return true;
      case CommandEnum.RENAME_WIDGET:
        this.renameWidget(ctx, props);
        break;
      case CommandEnum.HIDE_WIDGET:
        // this.hideWidget(ctx, props);
        break;
      case CommandEnum.LOCK_WIDGET:
        this.lockWidget(ctx, props);
        break;
      case CommandEnum.WIDGET_RESIZE_START:
        this.resizeWidgetStart(ctx, props);
        break;
      //   case CommandEnum.WIDGET_RESIZING:
      //     this.resizingWidget(ctx, props);
      //     break;
      case CommandEnum.WIDGET_RESIZE_END:
        this.resizeWidgetEnd(ctx, props);
        break;
      case CommandEnum.WIDGET_MOVE_START:
        this.moveWidgetStart(ctx, props);
        break;
      case CommandEnum.WIDGET_MOVE_END:
        this.moveWidgetEnd(ctx, props);
        break;
      case CommandEnum.WIDGET_MOVE_REACTNODE_PROP:
        this.moveToReactNodeProp(ctx, props);
        break;
      case CommandEnum.WIDGET_UPDATE_PROPERTIES:
        this.updateWidgetProps(ctx, props);
        break;
      //   case CommandEnum.WIDGET_UPDATE_SUB_COMPONENT_COUNT:
      //     this.updateWidgetSubComponentCount(ctx, props);
      //     break;
      //     break;
      //   case CommandEnum.UPDATE_REPEATABLE_PROPS_DTO_MAP:
      //     // ctx.getCommand()?.append(
      //     //     new UpdateRepeatablePropsDTOMapCommand(
      //     //         props.widgetModel,
      //     //         props.dataBindingContainer,
      //     //         props.DTOID,
      //     //         props.customPropName,
      //     //         props.DTODataValueName
      //     //     )
      //     // );
      //     break;
      //   case CommandEnum.DELETE_REPEATABLE_PROPS_DTO_MAP:
      //     // ctx.getCommand()?.append(
      //     //     new DeleteRepeatablePropsDTOMapCommand(
      //     //         props.widgetModel,
      //     //         props.dataBindingContainer,
      //     //         props.DTOID,
      //     //         props.customPropName
      //     //     )
      //     // );
      //     break;
      //   case CommandEnum.UPDATE_CUSTOM_PROPS_VARIABLE_MAP:
      //     ctx
      //       .getCommand()
      //       ?.append(
      //         new UpdateCustomPropsVariableMapCommand(
      //           props.widgetModel.getID(),
      //           props.dataBindingContainer,
      //           props.variableID,
      //           Number(props.customPropID),
      //           props.variableMemberName
      //         )
      //       );
      //     break;
      //   case CommandEnum.DELETE_CUSTOM_PROPS_VARIABLE_MAP:
      //     // ctx.getCommand()?.append(
      //     //     new DeleteCustomPropsVariableMapCommand(
      //     //         props.widgetModel,
      //     //         props.dataBindingContainer,
      //     //         props.variableID,
      //     //         Number(props.customPropID)
      //     //     )
      //     // );
      //     break;
      //   case CommandEnum.RESET_WIDGET_CONTENT:
      //     this.resetWidgetContent(ctx, props);
      //     break;
      //   case CommandEnum.INSERT_CONDITIONAL_LAYOUT_FRAME:
      //     this.insertConditionalLayoutFrame(ctx, props);
      //     break;
      //   case CommandEnum.DELETE_CONDITIONAL_LAYOUT_FRAME:
      //     this.deleteConditionalLayoutFrame(ctx, props);
      //     break;
      //   case CommandEnum.UPDATE_CONDITIONAL_LAYOUT_FRAME:
      //     this.updateConditionalLayoutFrame(ctx, props);
      //     break;
      //   case CommandEnum.SET_INFO_FOR_INSERT_DRAG_WIDGET:
      //     this.setInfoForInsertDragWidget(ctx, props);
      //     break;
      // case CommandEnum.UPDATE_SIZE:
      //   this.updateWidgetSize(ctx, props);
      //   break;
      // case CommandEnum.UPDATE_POSITION:
      //   this.updateWidgetPosition(ctx, props);
      //   break;
      default:
        return false;
    }
    return true;
  }

  /**
   * Widget 삽입
   */
  @boundMethod
  private insertWidget(ctx: AkronContext, props: InsertWidgetCommandProps) {
    const newWidgetModel = this.createNewWidgetModel(ctx, props.widgetType, props.widgetID);

    if (isUndefined(newWidgetModel)) {
      dError(`Widget 생성에 쓸 default model이 없습니다! (Type: ${props.widgetType})`);
      return;
    }

    this.insertGivenWidgetModel(ctx, {
      newWidgetModel,
      isClone: false,
      parentWidgetModel: props.parentWidgetModel,
      initializeProperties: props.initializeProperties,
    });
  }

  /**
   * Widget 삽입 at pos
   */
  @boundMethod
  private insertWidgetAt(ctx: AkronContext, props: InsertWidgetAtCommandProps) {
    const newWidgetModel =
      props.cloneWidget === undefined
        ? this.createNewWidgetModel(ctx, props.widgetType, props.widgetID)
        : props.cloneWidget.cloneNode(ctx.getIdContainerController());

    if (newWidgetModel === undefined) {
      dError(`Widget 생성에 쓸 default model이 없습니다! (Type: ${props.widgetType})`);
      return;
    }

    let initialProps: IWidgetCommonProperties;
    if (props.initializeProperties) {
      initialProps = props.initializeProperties(newWidgetModel.getProperties());
    }
    this.insertGivenWidgetModel(ctx, {
      newWidgetModel,
      isClone: isDefined(props.cloneWidget),
      initializeProperties: defaultProperties => {
        const parentWidgetModel = this.getParentToInsert(ctx, newWidgetModel);
        const parentWidth = parentWidgetModel?.getProperties().style.width.value;
        const parentHeight = parentWidgetModel?.getProperties().style.height.value;

        return {
          ...defaultProperties,
          ...initialProps,
          style: {
            ...defaultProperties.style,
            x: {
              ...newWidgetModel.getProperties().style.x,
              value: { absolute: props.posX, relative: Math.round((props.posX / parentWidth) * 100), unit: 'px' },
            },
            y: {
              ...newWidgetModel.getProperties().style.y,
              value: { absolute: props.posY, relative: Math.round((props.posY / parentHeight) * 100), unit: 'px' },
            },
            left: {
              ...newWidgetModel.getProperties().style.left,
              value: { absolute: props.posX, relative: Math.round((props.posX / parentWidth) * 100), unit: 'px' },
            },
            top: {
              ...newWidgetModel.getProperties().style.top,
              value: { absolute: props.posY, relative: Math.round((props.posY / parentHeight) * 100), unit: 'px' },
            },
            right: {
              ...newWidgetModel.getProperties().style.right,
              value: {
                absolute: parentWidth - props.posX - defaultProperties.style.width.defaultValue.absolute,
                relative:
                  100 -
                  Math.round((props.posX / parentWidth) * 100) -
                  defaultProperties.style.width.defaultValue.relative,
                unit: 'px',
              },
            },
            bottom: {
              ...newWidgetModel.getProperties().style.bottom,
              value: {
                absolute: parentHeight - props.posY - defaultProperties.style.height.defaultValue.absolute,
                relative:
                  100 -
                  Math.round((props.posY / parentHeight) * 100) -
                  defaultProperties.style.height.defaultValue.relative,
                unit: 'px',
              },
            },
          },
        };
      },
      isPositioned: true,
      parentWidgetModel:
        ctx.getMouseMode() === 'InsertContainer' ? ctx.getSelectionContainer()?.getEditingPage() : undefined,
    });

    // if (checkConditionalLayout(newWidgetModel)) {
    //   const MAX_CHILD_FRAGMENT_LAYOUT = 2;
    //   for (let i = 0; i < MAX_CHILD_FRAGMENT_LAYOUT; i++) {
    //     const fragmentLayoutWidgetModel = this.createNewWidgetModel(
    //       ctx,
    //       'FragmentLayout',
    //       WidgetRepository.generateWidgetID()
    //     );
    //     if (isDefined(fragmentLayoutWidgetModel)) {
    //       const appendFragmentLayoutWidgetCommand = new AppendWidgetCommand(
    //         ctx,
    //         fragmentLayoutWidgetModel,
    //         newWidgetModel
    //       );
    //       ctx.getCommand()?.append(appendFragmentLayoutWidgetCommand);
    //     }
    //   }
    // }
  }

  // /**
  //  * 주어진 widget model을 복사하여 app에 삽입.
  //  */
  // @boundMethod
  // private insertWidgetClone(ctx: AkronContext, props: InsertWidgetCloneCommandProps) {
  //   const newWidgetModel = props.widgetModel.cloneNode(ctx.getIdContainerController()) as NewWidgetModel;
  //   const appID = ctx.getAppID();

  //   const { libraryDependencyData, insertedPuxLibraryInfoMap, libraryID } = props;
  //   if (isUndefined(libraryID)) {
  //     // 오류 case
  //     return;
  //   }
  //   if (isDefined(libraryDependencyData) && isDefined(insertedPuxLibraryInfoMap)) {
  //     appendDependencyTemplateData(ctx, libraryID, libraryDependencyData, insertedPuxLibraryInfoMap);

  //     const libraryInfoMap = ctx.getInsertedPuxLibraryInfoMap().get(libraryID);

  //     if (isDefined(libraryInfoMap)) {
  //       updatePropsOldIdToNewId(ctx.getDataStore(), newWidgetModel, libraryInfoMap);
  //     }
  //   }

  //   if (props.widgetType === ComponentTypeEnum.PUX) {
  //     // 파일-컴포넌트 매핑 정보 복사
  //     const widgetArray = props.widgetModel.changeTreeToArray();
  //     const copiedWidgetArray = newWidgetModel.changeTreeToArray();
  //     copyLibraryFileRelationsAndApply({
  //       ctx,
  //       libraryId: props.libraryID,
  //       widgetArray,
  //       copiedWidgetArray,
  //     });

  //     // eventModel 새로 생성
  //     const eventHandlerMap = new Map<number, EventHandlerModel>(); // <originHandlerId, model>
  //     const eventHandlers = ctx.getNewBusinessContainer().getPUXEventHandlerMap(libraryID);
  //     const eventChains = ctx.getNewBusinessContainer().getPUXEventChainMap(libraryID);
  //     eventHandlers?.forEach(eventHandler => {
  //       const chain: number[] = [];
  //       const newHandlerId = ctx.getIdContainerController().generatePropsEventHandlerId();

  //       eventHandler.chain.forEach(chainId => {
  //         const puxChainModel = eventChains?.get(chainId);
  //         if (puxChainModel) {
  //           const newChainId = ctx.getIdContainerController().generatePropsEventChainId();
  //           chain.push(newChainId);

  //           const newChainModel: NewEventChainModel = new NewEventChainModel({
  //             appID,
  //             chainID: newChainId,
  //             businessLogicTypeID: puxChainModel.businessLogicTypeID,
  //             args: puxChainModel.args,
  //           });

  //           const command = new InsertNewEventChainCommand(ctx.getNewBusinessContainer(), newChainModel);
  //           ctx.getCommand()?.append(command);
  //         }
  //       });

  //       const newHandlerModel: NewEventHandlerModel = new NewEventHandlerModel({
  //         appID,
  //         handlerID: newHandlerId,
  //         condition: eventHandler.condition,
  //         chain,
  //       });

  //       const command = new InsertNewEventHandlerCommand(ctx.getNewBusinessContainer(), newHandlerModel);
  //       ctx.getCommand()?.append(command);

  //       eventHandlerMap.set(eventHandler.handlerID, newHandlerModel);
  //     });

  //     newWidgetModel.getProps().forEach(prop => {
  //       const handlerModel = eventHandlerMap.get(prop.eventHandler[0]);
  //       if (handlerModel) {
  //         prop.eventHandler = [handlerModel.handlerID];
  //       }
  //     });
  //   }

  //   this.insertGivenWidgetModel(ctx, {
  //     newWidgetModel,
  //     isClone: true,
  //   });
  // }

  /**
   * 주어진 type에 해당하는 새 widget을 생성.
   */
  @boundMethod
  private createNewWidgetModel(ctx: AkronContext, widgetType: WidgetTypeEnum, widgetID: WidgetID) {
    const { metaData, name } = getMetaDataByType(widgetType);
    const widget = new WidgetModel({
      id: widgetId,
      widgetType: widgetType,
      widgetCategory: '',
      name: name,
      properties: {
        content: metaData,
        style: commonStyleMeta,
      },
      ref: undefined,
    });
    widgetId += 1;
    return widget;
    // const defaultWidgetModel = ctx.getMetaDataContainer().getDefaultWidgetModelMap().get(widgetType);
    // const pageWidth = ctx.getNewAppModel().getFirstChild()?.getFirstChild()?.getProperties().getStyle().width.absolute;
    // const pageHeight = ctx.getNewAppModel().getFirstChild()?.getFirstChild()?.getProperties().getStyle()
    //   .height.absolute;
    // if (isUndefined(defaultWidgetModel)) {
    //   return undefined;
    // }
    // if (defaultWidgetModel.getWidgetType() === 'Studio') {
    //   defaultWidgetModel.getProperties().setStyles({
    //     ...defaultWidgetModel.getProperties().getStyle(),
    //     width: {
    //       ...defaultWidgetModel.getProperties().getStyle().width,
    //       type: 'relative',
    //       unit: '%',
    //       absolute: pageWidth ?? 100,
    //       relative: 100,
    //     },
    //     height: {
    //       ...defaultWidgetModel.getProperties().getStyle().height,
    //       type: 'relative',
    //       unit: '%',
    //       absolute: pageHeight ?? 100,
    //       relative: 100,
    //     },
    //   });
    // }
    // const newWidgetModel = defaultWidgetModel.cloneNode(widgetID);
    // newWidgetModel.setName(`${widgetType.replace('Basic', '')} ${widgetID % 100}`);
    // return newWidgetModel;
  }

  /**
   * 주어진 widget을 적절한 위치에 삽입해주는 함수.
   */
  @boundMethod
  private insertGivenWidgetModel(
    ctx: AkronContext,
    args: {
      newWidgetModel: WidgetModel;
      isClone: boolean;
      initializeProperties?: (properties: DeepReadonly<IWidgetCommonProperties>) => IWidgetCommonProperties;
      isPositioned?: boolean;
      parentWidgetModel?: WidgetModel;
      libraryID?: number;
      widgetTypeID?: number;
      preserveSelection?: boolean;
    }
  ) {
    const { newWidgetModel, isClone, initializeProperties } = args;
    const editorUIStore = ctx.getEditorUIStore();

    // 삽입 전에 속성 세팅하고 싶을 경우 진행.
    if (initializeProperties) {
      newWidgetModel.setProperties(initializeProperties(newWidgetModel.getProperties()));
    }

    let parentWidgetModel = args.parentWidgetModel ?? this.getParentToInsert(ctx, newWidgetModel);

    // if (isDefined(parentWidgetModel)) {
    //   const fragmentLayoutModels = parentWidgetModel.mapChild((childWidgetModel: WidgetModel) => childWidgetModel);
    //   const renderedChildIndex = parentWidgetModel.getProperties().content.flag.value ? 0 : 1;
    //   parentWidgetModel = fragmentLayoutModels[renderedChildIndex];
    // }

    // // layout type의 repeatable component 하위에는 하나의 gx library component만 삽입 가능
    // if (!isInsertableRepeatableLayout(parentWidgetModel, newWidgetModel, editorUIStore)) {
    //   return;
    // }
    const selectionContainer = ctx.getSelectionContainer();
    if (selectionContainer === undefined) {
      return;
    }

    const selectedWidgets = selectionContainer.getSelectedWidgets();
    const properties = newWidgetModel.getProperties();
    const isParentChildable = selectedWidgets?.length === 1 && checkInsertableItem(selectedWidgets[0], newWidgetModel);

    const parentStyle =
      // parentWidgetModel.getWidgetType() === 'FragmentLayout'
      //   ? parentWidgetModel.getParent()!.getProperties().style
      parentWidgetModel.getProperties().style;

    if (isParentChildable) {
      // 단일 선택일 때, 부모가 Layout이거나 Childable한 경우에는 부모 컴포넌트가 알아서 위치를 잡아주므로, x,y값 설정 필요 X.
      newWidgetModel.setProperties({
        ...properties,
        style: {
          ...properties.style,
          x: {
            ...properties.style.x,
            // unit: parentStyle.x.unit,
          },
          y: {
            ...properties.style.y,
          },
          width: {
            ...properties.style.width,
            value: (Math.abs(properties.style.width.value) / parentStyle.width.value) * 100,
          },
          height: {
            ...properties.style.height,
          },
          frameType: parentStyle.frameType,
          left: {
            ...properties.style.left,
          },
          top: {
            ...properties.style.top,
          },
          right: {
            ...properties.style.right,
          },
          bottom: {
            ...properties.style.bottom,
          },
        },
      });
    } else if (!args.isPositioned) {
      // size type이 undefined(default)이 아니고 해당 컴포넌트의 MetaData에 명시되어 있는 경우 페이지 반응형에 따라 처리함.
      const isSized = properties.style.width.value === 'absolute' || properties.style.width.value === 'relative';
      if (isSized) {
        newWidgetModel.setProperties({
          ...properties,
          style: {
            ...properties.style,
          },
        });
      } else {
        // size type이 없는 경우 x, y만 셋팅
        newWidgetModel.setProperties({
          ...properties,
          style: {
            ...properties.style,
          },
        });
      }
    }

    // Append command 날려줌.
    if (isUndefined(ctx.getCommand())) {
      throw new Error('ctx.command가 undefined입니다!');
    }

    // creatSampleAppforStudio(newWidgetModel);
    // setCreateProjectButtonProperties(ctx, newWidgetModel);

    const appendWidgetCommand = new (isClone ? AppendWidgetRecursiveCommand : AppendWidgetCommand)(
      ctx,
      newWidgetModel,
      parentWidgetModel,
      parentWidgetModel.getLastChild()?.getNextSibling()
    );

    // 컨테이너 내부에 item 삽입 시 sibling re-render
    if (!checkPageModel(parentWidgetModel)) {
      parentWidgetModel.forEachChild((child: WidgetModel) => {
        if (child !== newWidgetModel) {
          child.triggerRerender();
        }
      });
    }

    ctx.getCommand()?.append(appendWidgetCommand);

    // pasteBusinessLogicRecursive(ctx, newWidgetModel);

    // Selection 진행.
    this.createWidgetSelectionProp(ctx, newWidgetModel);

    // DataStore의 reference 동기화 작업.
    // if (isClone) {
    //   syncAddDataStoreReference(newWidgetModel, ctx.dataStore, ctx.command);
    // }
  }

  /**
   * Widget을 어디 밑에 삽입할지 결정하는 함수.
   * - 단일 선택 중이면 그것을 parent로 설정, 다중 선택 중이면 작업중인 page을 parent로 설정.
   * - 단일 선택이어도 childable하지 않으면 page에 삽입됨.
   */
  @boundMethod
  private getParentToInsert(ctx: AkronContext, curWidget: WidgetModel) {
    if (ctx.getSelectionContainer()?.getSelectedWidgets().length === 1) {
      const selectedWidget = ctx.getSelectionContainer()?.getSelectedWidgets()[0];
      const childable = checkInsertableItem(selectedWidget, curWidget);
      if (childable) {
        return selectedWidget as WidgetModel;
      }
      // childable하지 않은 경우 페이지에 삽입
      if (isEditAppMode(ctx.getAppModeContainer())) {
        return ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel().getFirstChild()!;
      }
      return ctx.getEditingWidgetModel();
    }
    if (isEditAppMode(ctx.getAppModeContainer())) {
      return ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getEditingWidgetModel().getFirstChild()!;
    }
    return ctx.getEditingWidgetModel();
  }

  /**
   * 컴포넌트가 위치 설정을 지원할 때, 위치 설정을 해줍니다.
   */
  // private setPositionSafely(model: BaseWidgetModel, position: Partial<UpdatePosition>) {
  //   const typedModel = model as BaseWidgetModel & Pick<WidgetModel, 'getPosition' | 'setPosition'>;

  //   if (typeof typedModel.getPosition === 'function' || typeof typedModel.setPosition === 'function') {
  //     typedModel.setPosition({ ...typedModel.getPosition(), ...position });
  //   }
  // }

  // /**
  //  * targetModels에 업로드된 파일-컴포넌트 관계 정보 삭제
  //  */
  // private deleteFileRelation(ctx: AkronContext, targetModels: (BaseWidgetModel | NewWidgetModel)[]) {
  //   const fileContainer = ctx.getFileContainer();
  //   targetModels.forEach(model => {
  //     const fileComponentRelations = fileContainer.fileComponentRelationMap.get(model.getID());

  //     fileComponentRelations?.forEach(fileComponentRelation => {
  //       const commandProps = new DeleteFileComponentRelationCommand(fileContainer, fileComponentRelation);
  //       ctx.getCommand()?.append(commandProps);
  //     });
  //   });
  // }

  // /**
  //  * targetModels에 대해 제거하는 커맨드 수행
  //  */
  // private deleteTargetModels(
  //   targetModels: (BaseWidgetModel | WidgetModel)[],
  //   ctx: AkronContext,
  //   props: DeleteWidgetCommandProps
  // ) {
  //   targetModels.forEach(widgetModel => {
  //     // composite model 삭제
  //     removeCompositeComponent(ctx, widgetModel as WidgetModel);
  //     if (checkPageModel(widgetModel)) {
  //       // 페이지 선택 후 DELETE 키 누를 시 페이지 하위에 있는 컴포넌트 삭제되는 기능
  //       (widgetModel as PageModel).forEachChild(pageChild => {
  //         newAppendDeleteWidgetCommandsRecursive(pageChild, ctx, props.commandID);
  //       });
  //       return;
  //     }
  //     newAppendDeleteWidgetCommandsRecursive(widgetModel as BaseWidgetModel, ctx, props.commandID);
  //   });
  // }

  /**
   * Widget 삭제
   */
  @boundMethod
  private deleteWidget(ctx: AkronContext, props: DeleteWidgetCommandProps) {
    const appWidgetModel = ctx.getNewAppModel();
    const command = ctx.getCommand();
    const selectionContainer = ctx.getSelectionContainer();
    // 입력값 검증
    if (isUndefined(appWidgetModel)) {
      dError('dom is not exist');
      return;
    }
    if (isUndefined(command)) {
      dError('command is not exist');
      return;
    }
    if (isUndefined(selectionContainer)) {
      return;
    }

    const targetModels = selectionContainer.getSelectedWidgets();
    if (!isWidgetsDeletable(targetModels)) {
      return;
    }

    const deletableModels = getDeletableWidgetModels(targetModels);
    deletableModels.forEach(targetModel => {
      appendDeleteWidgetCommandsRecursive(targetModel, ctx, props.commandID);
    });

    const appModeContainer = ctx.getAppModeContainer();
    let editingTopWidgetModel = ctx.getSelectionContainer()?.getEditingPage() ?? ctx.getNewAppModel();
    // GX EDIT_APP 모드 및 Dialog 편집 모드에서는 편집 화면 상 최상단 model인 Composite Model or Dialog Model 설정
    if (isEditWidgetMode(appModeContainer)) {
      editingTopWidgetModel = ctx.getEditingWidgetModel();
    }
    this.createWidgetSelectionProp(ctx, editingTopWidgetModel);
  }

  /**
   * Widget 이름 변경
   */
  @boundMethod
  private renameWidget(ctx: AkronContext, props: RenameWidgetCommandProps) {
    const { targetModel, componentNewName } = props;
    const updateWidgetCommand = new RenameWidgetCommand(targetModel, componentNewName);

    ctx.getCommand()?.append(updateWidgetCommand);
  }

  /**
   * Context 내에 SelectionProperty 값 생성
   */
  @boundMethod
  private createWidgetSelectionProp(ctx: AkronContext, newWidgetModel: WidgetModel): void {
    // 셀렉트된 페이지. 없다면 첫번째 페이지
    const editingTopWidgetModel =
      ctx.getSelectionContainer()?.getEditingPage() ?? (ctx.getNewAppModel().getFirstChild() as PageModel);
    const selectionProp: SelectionProp = {
      selectionType: SelectionEnum.WIDGET,
      widgetModels: [newWidgetModel],
      editingPageModel: editingTopWidgetModel,
    };
    const commandProps = ctx.getCommandProps();
    if (commandProps !== undefined) {
      ctx.setCommandProps({ ...commandProps, selectionProp });
    }
  }

  /**
   * Widget 끌어서 리사이즈 시작
   */
  @boundMethod
  private resizeWidgetStart(ctx: AkronContext, props: WidgetResizeStartCommandProps): void {
    const appModeContainer = ctx.getAppModeContainer();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const { targetModels } = props;
    const idContainerController = ctx.getIdContainerController();
    const editingWidgetModel = ctx.getEditingWidgetModel();
    const selectionContainer = ctx.getSelectionContainer();
    const zoomRatio = ctx.getZoomRatio() / 100;
    if (isUndefined(selectionContainer)) {
      return;
    }

    const editingPage = isEditAppMode(appModeContainer) ? selectionContainer.getEditingPage() : editingWidgetModel;

    if (isUndefined(editingPage)) {
      return;
    }

    selectionContainer.setFloatingWidgetModels(
      targetModels.map(widgetModel => {
        const copiedWidgetModel = widgetModel.cloneNode(idContainerController);
        copiedWidgetModel.setProperties({
          ...copiedWidgetModel.getProperties(),
        });
        copiedWidgetModel.setEditingState(WidgetEditingState.FLOATING);

        copiedWidgetModel.append(editingPage);
        return copiedWidgetModel;
      })
    );
    // editingState 변경
    targetModels.forEach(targetWidgetModel => {
      targetWidgetModel.setEditingState(WidgetEditingState.RESIZE);
      applyStyleByEditingState(targetWidgetModel);
    });

    widgetEditInfoContainer.setEditingState(WidgetEditingState.RESIZE);
    widgetEditInfoContainer.setEditingWidgetModels(targetModels);
  }

  /**
   * Absolute X값 계산
   */
  @boundMethod
  private calculateX(
    resizeHandle: WidgetResizeHandle,
    refPosition: { x: number; width: number },
    deltaWidth: number,
    deltaX: number
  ) {
    return refPosition.x + deltaX;
  }

  /**
   * Absolute Y값 계산
   */
  @boundMethod
  private calculateY(
    resizeHandle: WidgetResizeHandle,
    refPosition: { y: number; height: number },
    deltaHeight: number,
    deltaY: number
  ) {
    return refPosition.y + deltaY;
  }

  /**
   * Relative Position 계산
   */
  private calculateRelativePosition(position: number, parentSize: number) {
    return Math.round((position / parentSize) * 100);
  }

  /**
   * Bound 관련 style 계산
   */
  private calculateStyle(
    widgetModel: WidgetModel,
    resizeHandle: WidgetResizeHandle,
    refPosition: WidgetPosition,
    deltaWidth: number,
    deltaHeight: number,
    deltaX: number,
    deltaY: number,
    pageModelWidth: number,
    pageModelHeight: number,
    parentWidth: number,
    parentHeight: number
  ): IWidgetStyleProperties {
    const x = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.x,
        }
      : {
          ...widgetModel.getProperties().style.x,
          value: {
            absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
            relative: this.calculateRelativePosition(
              this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
              parentWidth
            ),
            unit: widgetModel.getStyleProperties('x').unit,
          },
        };

    const y = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.y,
        }
      : {
          ...widgetModel.getProperties().style.y,
          value: {
            absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
            relative: this.calculateRelativePosition(
              this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
              parentHeight
            ),
            unit: widgetModel.getStyleProperties('y').unit,
          },
        };

    const width = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.width,
        }
      : {
          ...widgetModel.getProperties().style.width,
          value: {
            absolute: refPosition.width * deltaWidth,
            relative: ((refPosition.width * deltaWidth) / pageModelWidth) * 100,
            unit: widgetModel.getStyleProperties('width').unit,
          },
        };

    const height = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.height,
        }
      : {
          ...widgetModel.getProperties().style.height,
          value: {
            absolute: refPosition.height * deltaHeight,
            relative: ((refPosition.height * deltaHeight) / pageModelHeight) * 100,
            unit: widgetModel.getStyleProperties('height').unit,
          },
        };

    const frameType = widgetModel.getProperties().style.frameType;

    const left = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.left,
        }
      : {
          ...widgetModel.getProperties().style.left,
          value: {
            absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
            relative: this.calculateRelativePosition(
              this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
              parentWidth
            ),
            unit: widgetModel.getStyleProperties('left').unit,
          },
        };

    const top = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.top,
        }
      : {
          ...widgetModel.getProperties().style.top,
          value: {
            absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
            relative: this.calculateRelativePosition(
              this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
              parentHeight
            ),
            unit: widgetModel.getStyleProperties('top').unit,
          },
        };

    const right = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.right,
        }
      : {
          ...widgetModel.getProperties().style.right,
          value: {
            absolute:
              parentWidth -
              this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX) -
              refPosition.width * deltaWidth,
            relative:
              100 -
              this.calculateRelativePosition(
                this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
                parentWidth
              ) -
              ((refPosition.width * deltaWidth) / parentWidth) * 100,
            unit: widgetModel.getStyleProperties('right').unit,
          },
        };

    const bottom = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetModel.getProperties().style.bottom,
        }
      : {
          ...widgetModel.getProperties().style.bottomv,
          value: {
            absolute:
              parentHeight -
              this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY) -
              refPosition.height * deltaHeight,
            relative:
              100 -
              this.calculateRelativePosition(
                this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
                parentHeight
              ) -
              ((refPosition.height * deltaHeight) / parentHeight) * 100,
            unit: widgetModel.getStyleProperties('bottom').unit,
          },
        };

    const calcStyle: IWidgetStyleProperties = {
      x,
      y,
      width,
      height,
      frameType,
      left,
      top,
      right,
      bottom,
    };

    return calcStyle;
  }

  /**
   * Widget 끌어서 Resize 종료
   */
  @boundMethod
  private resizeWidgetEnd(ctx: AkronContext, props: WidgetResizeEndCommandProps): void {
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const command = ctx.getCommand();
    const { targetModels: widgetModels, deltaX, deltaY, deltaWidth, deltaHeight } = props;

    const resizeHandle = widgetEditInfoContainer.getResizeHandle();

    const isPage = widgetModels.find(widgetModel => checkPageModel(widgetModel)) !== undefined;
    if (isPage) {
      return;
    }

    if (isUndefined(command)) {
      dError('command is not exist');
      return;
    }

    const page = ctx.getSelectionContainer()?.getEditingPage();
    if (isUndefined(page)) {
      return;
    }
    const pageModelWidth = page.getStyleProperties('width').absolute;
    const pageModelHeight = page.getStyleProperties('height').absolute;

    ctx
      .getSelectionContainer()
      ?.getFloatingWidgetModels()
      .forEach(floatingWidgetModel => {
        const parent = floatingWidgetModel.getParent();
        if (isDefined(parent)) {
          floatingWidgetModel.remove(parent);
        }
      });
    ctx.getSelectionContainer()?.clearFloatingWidgetModels();

    widgetModels.forEach(widgetModel => {
      // editingState 변경
      widgetModel.setEditingState(WidgetEditingState.NONE);
      applyStyleByEditingState(widgetModel);

      // parent의 absolute 값으로 relative 계산
      const parentWidget = widgetModel.getParent();
      if (!parentWidget) {
        return;
      }
      const parentWidth = parentWidget.getStyleProperties('width').absolute;
      const parentHeight = parentWidget.getStyleProperties('height').absolute;

      const refPosition = widgetEditInfoContainer.getRefPositionMap(widgetModel) ?? {
        x: widgetModel.getStyleProperties('x').absolute,
        y: widgetModel.getStyleProperties('y').absolute,
        width: widgetModel.getStyleProperties('width').absolute,
        height: widgetModel.getStyleProperties('height').absolute,
      };

      const updatedStyle = this.calculateStyle(
        widgetModel,
        resizeHandle,
        refPosition,
        deltaWidth,
        deltaHeight,
        deltaX,
        deltaY,
        pageModelWidth,
        pageModelHeight,
        parentWidth,
        parentHeight
      );

      const updateWidgetCommand = new UpdateWidgetCommand(widgetModel, {
        content: widgetModel.getProperties().content,
        style: { ...widgetModel.getProperties().style, ...updatedStyle },
      });

      command.append(updateWidgetCommand);
    });

    runInAction(() => {
      ctx.setMouseMode('Normal');
    });

    this.clearWidgetModelEditContext(ctx);
  }

  // /**
  //  * Widget 끌어서 Resize 종료
  //  */
  // @boundMethod
  // private resizingWidget(ctx: AkronContext, props: WidgetR): void {
  //   const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
  //   const command = ctx.getCommand();
  //   const selectionContainer = ctx.getSelectionContainer();

  //   const { targetModels: widgetModels, deltaX, deltaY, deltaWidth, deltaHeight } = props;

  //   const workAreaModel =
  //     selectionContainer.getEditingNewWorkArea() ?? (ctx.getNewAppModel().getFirstChild() as WorkAreaModel);
  //   const pagePosition = workAreaModel.getPagePosition();

  //   const isPage =
  //     widgetModels.find(widgetModel => checkPageModel(widgetModel) || checkWorkAreaModel(widgetModel)) !== undefined;
  //   if (isPage) {
  //     return;
  //   }

  //   if (isUndefined(command)) {
  //     dError('command is not exist');
  //     return;
  //   }

  //   widgetModels.forEach(widgetModel => {
  //     // style 변경용 Command 생성
  //     // const widgetProps = widgetModel.getProps();
  //     // const widgetStyle = widgetProps.getStyle();
  //     const refPositionMap = widgetEditInfoContainer.getRefPositionMap(widgetModel);
  //     // parent의 absolute 값으로 relative 계산
  //     const parentWidget = widgetModel.getParent();
  //     if (!parentWidget) {
  //       return;
  //     }

  //     const updatedStyle = this.calculateNewStyle(refPositionMap, deltaWidth, deltaHeight, deltaX, deltaY);

  //     if (isUndefined(updatedStyle)) {
  //       return;
  //     }

  //     // app 별 parent rect style 가져오기
  //     const {
  //       parentRefX,
  //       parentRefY,
  //       parentRefWidth: parentWidth,
  //       parentRefHeight: parentHeight,
  //     } = getTargetParentRectStyle(ctx, widgetModel.getParent());

  //     // 임시 포지션
  //     const position = widgetModel.getPosition();
  //     let newLeft;
  //     let leftUnit = 'px';
  //     let newTop;
  //     let topUnit = 'px';

  //     if (deltaX !== 0) {
  //       // left의 변화
  //       if (typeof position.left === 'string') {
  //         // px로 변환
  //         newLeft = updatedStyle.style.left - pagePosition.x;
  //       } else {
  //         // numberUnit
  //         const { unit } = position.left;
  //         if (unit === 'px') {
  //           newLeft = updatedStyle.style.left - pagePosition.x;
  //         } else {
  //           // '%'
  //           newLeft = ((updatedStyle.style.left - pagePosition.x) / parentWidth) * 100;
  //           leftUnit = '%';
  //         }
  //       }
  //     }

  //     if (deltaY !== 0) {
  //       // top의 변화
  //       if (typeof position.top === 'string') {
  //         newTop = updatedStyle.style.top - pagePosition.y;
  //       } else {
  //         // numberUnit
  //         const { unit } = position.top;
  //         if (unit === 'px') {
  //           newTop = updatedStyle.style.top - pagePosition.y;
  //         } else {
  //           // '%'
  //           newTop = ((updatedStyle.style.top - pagePosition.y) / parentHeight) * 100;
  //           topUnit = '%';
  //         }
  //       }
  //     }

  //     const newPosition = {
  //       left: newLeft !== undefined ? { value: newLeft, unit: leftUnit } : position.left,
  //       top: newTop !== undefined ? { value: newTop, unit: topUnit } : position.top,
  //     };
  //     const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
  //     ctx.getCommand()?.append(updatePositionCommand);

  //     // width,height setting
  //     const width = widgetModel.getWidth();
  //     const height = widgetModel.getHeight();
  //     const newWidth = { value: width?.value, unit: width?.unit };
  //     const newHeight = { value: height?.value, unit: height?.unit };
  //     switch (width?.unit) {
  //       case 'px':
  //         newWidth.value = updatedStyle.style.width;
  //         break;
  //       case '%':
  //         newWidth.value = (updatedStyle.style.width / parentWidth) * 100;
  //         break;
  //       case 'auto':
  //         newWidth.value = updatedStyle.style.width;
  //         newWidth.unit = 'px';
  //         break;
  //       default:
  //         break;
  //     }
  //     switch (height?.unit) {
  //       case 'px':
  //         newHeight.value = updatedStyle.style.height;
  //         break;
  //       case '%':
  //         newHeight.value = (updatedStyle.style.height / parentHeight) * 100;
  //         break;
  //       case 'auto':
  //         newHeight.value = updatedStyle.style.height;
  //         newHeight.unit = 'px';
  //         break;
  //       default:
  //         break;
  //     }
  //     const updateSizeCommand = new UpdateSizeCommand(widgetModel, {
  //       width: newWidth as WidgetSize,
  //       height: newHeight as WidgetSize,
  //     });
  //     ctx.getCommand()?.append(updateSizeCommand);
  //     // widgetProps.forEach((prop, propId) => {
  //     //     const { name } = prop.propMeta;
  //     //     if (name === 'width') {
  //     //         const newProp = { ...prop };
  //     //         newProp.value = updatedStyle.style.width;
  //     //         const updatePropsCommand = new UpdatePropsCommand(
  //     //             widgetModel,
  //     //             Number(propId),
  //     //             updatedStyle.style.width
  //     //         );
  //     //         ctx.getCommand()?.append(updatePropsCommand);
  //     //         ctx.getCommand()?.setUndoable(false);
  //     //     } else if (name === 'height') {
  //     //         const newProp = { ...prop };
  //     //         newProp.value = updatedStyle.style.height;
  //     //         const updatePropsCommand = new UpdatePropsCommand(
  //     //             widgetModel,
  //     //             Number(propId),
  //     //             updatedStyle.style.height
  //     //         );
  //     //         ctx.getCommand()?.append(updatePropsCommand);
  //     //         ctx.getCommand()?.setUndoable(false);
  //     //     }
  //     // });
  //   });
  // }

  /**
   * 편집 관련 정보를 초기화합니다.
   */
  @boundMethod
  private clearWidgetModelEditContext(ctx: AkronContext): void {
    clearWidgetModelEditContext(ctx);
  }

  /**
   * Widget 끌어서 이동 시작
   */
  @boundMethod
  private moveWidgetStart(ctx: AkronContext, props: WidgetMoveStartCommandProps): void {
    const appModeContainer = ctx.getAppModeContainer();
    const selectionContainer = ctx.getSelectionContainer();
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    // const metaDataContainer = ctx.getM;
    // const dataStore;
    const idContainerController = ctx.getIdContainerController();
    const editingWidgetModel = ctx.getEditingWidgetModel();
    const editingPageRefPosition = ctx.getEditingPageRefPosition();
    const zoomRatio = ctx.getZoomRatio();
    const { targetModels } = props;

    if (isUndefined(selectionContainer)) {
      return;
    }

    const editingPage = isEditAppMode(appModeContainer) ? selectionContainer.getEditingPage() : editingWidgetModel;

    if (isUndefined(editingPage)) {
      return;
    }

    selectionContainer.setFloatingWidgetModels(
      targetModels.map(widgetModel => {
        const copiedWidgetModel = widgetModel.cloneNode(idContainerController);
        copiedWidgetModel.setProperties({
          ...copiedWidgetModel.getProperties(),
        });
        copiedWidgetModel.setEditingState(WidgetEditingState.FLOATING);

        copiedWidgetModel.append(editingPage);
        return copiedWidgetModel;
      })
    );

    targetModels.forEach(widgetModel => {
      const curProps = widgetModel.getProperties();
      // 입력값 검증
      if (!widgetModel || !curProps || widgetModel.getEditingState() !== WidgetEditingState.NONE) {
        dError('moveWidgetStart assertion failed.');
        return;
      }

      widgetModel.setProperties({
        ...curProps,
      });
      widgetModel.setEditingState(WidgetEditingState.MOVE);
      applyStyleByEditingState(widgetModel);
    });
    widgetEditInfoContainer.setEditingState(WidgetEditingState.MOVE);
  }

  /**
   * Widget 끌어서 이동 끝
   */
  @boundMethod
  private moveWidgetEnd(ctx: AkronContext, props: WidgetMoveEndCommandProps): void {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }
    const { container } = props;
    const { desModel, deltaX, deltaY, useRefPosition, isMovedToPage, changeTopWidgetModel, byKeyEvent } = props;
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    // const compositeComponentContainer = ctx.getCompositeComponentContainer();
    const zoomRatio = ctx.getZoomRatio() / 100;
    const editingPageRefPosition = ctx.getEditingPageRefPosition();

    const page = ctx.getSelectionContainer()?.getEditingPage();
    if (isUndefined(page)) {
      return;
    }

    const widgetModels = props.targetModels;
    // floating widget 제거
    ctx
      .getSelectionContainer()
      ?.getFloatingWidgetModels()
      .forEach(floatingWidgetModel => {
        const parent = floatingWidgetModel.getParent();
        if (isDefined(parent)) {
          floatingWidgetModel.remove(parent);
        }
      });
    ctx.getSelectionContainer()?.clearFloatingWidgetModels();

    widgetModels.forEach(widgetModel => {
      const widgetProps = widgetModel.getProperties();
      const canInsertToWidget = checkInsertableItem(container, widgetModel);

      widgetModel.setEditingState(WidgetEditingState.NONE);
      applyStyleByEditingState(widgetModel);

      const refPositionMap = widgetEditInfoContainer.getRefPositionMap(widgetModel);

      // 마우스를 통한 이동 시 absolute 계산
      const isRelative = byKeyEvent && widgetModel.getStyleProperties('frameType') === 'relative';

      const xAbsolute = widgetModel.getStyleProperties('x').absolute;
      const yAbsolute = widgetModel.getStyleProperties('y').absolute;

      const referenceX = useRefPosition && refPositionMap ? refPositionMap.x : xAbsolute;
      const referenceY = useRefPosition && refPositionMap ? refPositionMap.y : yAbsolute;

      // parent의 absolute 값으로 relative 계산
      const parentWidget = widgetModel.getParent();
      if (!parentWidget) {
        return;
      }

      let resultX = isRelative ? referenceX + (parentWidget.getRefWidth() ?? 0) * deltaX * 0.01 : referenceX + deltaX;
      let resultY = isRelative ? referenceY + (parentWidget.getRefHeight() ?? 0) * deltaY * 0.01 : referenceY + deltaY;

      const parentWidth = isMovedToPage
        ? page.getStyleProperties('width').absolute
        : parentWidget.getStyleProperties('width').absolute;
      const parentHeight = isMovedToPage
        ? page.getStyleProperties('height').absolute
        : parentWidget.getStyleProperties('height').absolute;

      const updateWidgetCommand = new UpdateWidgetCommand(widgetModel, {
        ...widgetProps,
        style: {
          ...widgetProps.style,
          x: {
            ...widgetProps.style.x,
            value: {
              absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
              relative:
                isDefined(container) && canInsertToWidget ? 0 : Math.round((Number(resultX) / parentWidth) * 100),
              unit: widgetModel.getStyleProperties('x').unit,
            },
          },
          y: {
            ...widgetProps.style.y,
            value: {
              absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
              relative:
                isDefined(container) && canInsertToWidget ? 0 : Math.round((Number(resultY) / parentHeight) * 100),
              unit: widgetModel.getStyleProperties('y').unit,
            },
          },
          frameType: widgetProps.style.frameType,
          left: {
            ...widgetProps.style.left,
            value: {
              absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
              relative:
                isDefined(container) && canInsertToWidget ? 0 : Math.round((Number(resultX) / parentWidth) * 100),
              unit: widgetModel.getStyleProperties('left').unit,
            },
          },
          top: {
            ...widgetProps.style.top,
            value: {
              absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
              relative:
                isDefined(container) && canInsertToWidget ? 0 : Math.round((Number(resultY) / parentHeight) * 100),
              unit: widgetModel.getStyleProperties('top').unit,
            },
          },
          right: {
            ...widgetProps.style.right,
            value: {
              absolute:
                parentWidth -
                (isDefined(container) && canInsertToWidget ? 0 : resultX) -
                widgetModel.getStyleProperties('width').absolute,
              relative:
                100 -
                (isDefined(container) && canInsertToWidget
                  ? 0
                  : Math.round(
                      ((Number(resultX) + widgetModel.getStyleProperties('width').relative) / parentWidth) * 100
                    )),
              unit: widgetModel.getStyleProperties('right').unit,
            },
          },
          bottom: {
            ...widgetProps.style.bottom,
            value: {
              absolute:
                parentHeight -
                (isDefined(container) && canInsertToWidget ? 0 : resultY) -
                widgetModel.getStyleProperties('height').absolute,
              relative:
                100 -
                (isDefined(container) && canInsertToWidget
                  ? 0
                  : Math.round(
                      ((Number(resultY) + widgetModel.getStyleProperties('height').relative) / parentHeight) * 100
                    )),
              unit: widgetModel.getStyleProperties('bottom').unit,
            },
          },
        },
      });
      ctx.getCommand()?.append(updateWidgetCommand);
    });

    const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets();

    if (isDefined(container)) {
      // 마우스 커서가 위치한 곳으로 삽입하기 위해 next sibling 찾음
      const { mousePosition } = props;
      const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
      let nextSibling: WidgetModel | undefined;
      if (isDefined(mousePosition) && isDefined(hitModel)) {
        nextSibling = findNextSiblingDragInContainer(
          container,
          mousePosition,
          selectedWidgets?.includes(hitModel) ? selectedWidgets : selectedWidgets?.concat(hitModel)
        );
      }

      widgetModels.forEach(widgetModel => {
        if (isDefined(container) && checkInsertableItem(container, widgetModel)) {
          // Widget node 이동시킴
          const moveWidgetCommand = new MoveWidgetCommand(
            widgetModel,
            widgetModel.getParent()!,
            container,
            nextSibling
          );
          ctx.getCommand()?.append(moveWidgetCommand);

          // 컨테이너 내부에 item 삽입 시 sibling re-render
          container.forEachChild(child => {
            if (child !== widgetModel) {
              child.triggerRerender();
            }
          });
        }
      });
    } else if (isMovedToPage) {
      widgetModels.forEach(widgetModel => {
        const parentWidgetModel = widgetModel.getParent();
        if (parentWidgetModel && !checkPageModel(widgetModel.getParent())) {
          const moveWidgetCommand = new MoveWidgetCommand(widgetModel, parentWidgetModel, page);
          ctx.getCommand()?.append(moveWidgetCommand);
        }
      });
    }
    ctx.getHitContainer().setStartHitItem(undefined);
    this.clearWidgetModelEditContext(ctx);
  }

  /**
   * Widget을 ReactNode type prop으로 drop.
   */
  @boundMethod
  private moveToReactNodeProp(ctx: AkronContext, props: WidgetMoveToReactNodePropCommandProps): void {
    const widgetModels = ctx.getSelectionContainer()?.getSelectedWidgets();
    const desModel = ctx.getDragDesModel();
    if (isUndefined(widgetModels) || isUndefined(desModel)) {
      return;
    }
    const { propName } = props;
    // XXX: 일단 단일선택만 고려
    // ctx.setButtonPropsIconWidgetMap(widgetModels[0].getID(), widgetModels[0] as NewWidgetModel);

    // const propModelProp = desModel.getProperties();
    // const updateWidgetCommand = new UpdateWidgetCommand(desModel, propName, false, {
    //     ...propModelProp.getContent()[propName],
    //     value: widgetModels[0],
    // });
    // ctx.getCommand()?.append(updateWidgetCommand);

    // const removeWidgetCommand = new RemoveWidgetForPropsCommand(widgetModels[0] as WidgetModel, desModel, propName);
    // ctx.getCommand()?.append(removeWidgetCommand);
  }

  /**
   * Widget의 Properties 변경
   */
  @boundMethod
  private updateWidgetProps(ctx: AkronContext, props: WidgetUpdateCommandProps): void {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');

      return;
    }

    const { newWidgetProps, targetModel: widgetModels } = props;

    widgetModels.forEach((widgetModel: WidgetModel) => {
      const updatePropsCommand = new UpdateWidgetCommand(
        widgetModel,
        newWidgetProps,
        undefined
        // ctx.getDataStore().getNonBindableDataReferenceContainer()
      );
    });
  }

  // /**
  //  * Widget의 Props 변경 및 Sub component 삽입/삭제
  //  */
  // @boundMethod
  // private updateWidgetSubComponentCount(ctx: AkronContext, props: NewUpdateWidgetSubComponentCountCommandProps): void {
  //   if (isUndefined(ctx.getCommand())) {
  //     dError('command is not exist');

  //     return;
  //   }

  //   const { newWidgetProps, targetModel: widgetModels, controlSubComponentCounts, prevWidgetProps } = props;

  //   widgetModels.forEach((widgetModel: WidgetModel) => {
  //     for (let idx = 0; idx < newWidgetProps.length; idx++) {
  //       const { propId, value } = newWidgetProps[idx];
  //       const updatePropsCommand = new UpdatePropsCommand(widgetModel, Number(propId), value);
  //       ctx.getCommand()?.append(updatePropsCommand);

  //       if (prevWidgetProps && controlSubComponentCounts) {
  //         const { value: prevValue } = prevWidgetProps[idx];

  //         if (value > prevValue) {
  //           // 값이 증가했을 때 sub component 삽입
  //           for (let itr = 0; itr < value - prevValue; itr++) {
  //             const controlSubComponentCount = controlSubComponentCounts[idx];
  //             controlSubComponentCount.forEach(([subComponentTypeId, subComponentType]) => {
  //               this.appendSubComponentCommand(ctx, subComponentTypeId, subComponentType, widgetModel);
  //             });
  //           }
  //         } else if (value < prevValue) {
  //           // 값이 감소했을 때 sub component 제거
  //           const deleteModels: (BaseWidgetModel | NewWidgetModel)[] = [];
  //           for (let itr = 0; itr < prevValue - value; itr++) {
  //             const controlSubComponentCount = controlSubComponentCounts[idx];
  //             controlSubComponentCount
  //               .slice()
  //               .reverse()
  //               .forEach(([subComponentTypeId]) => {
  //                 let curWidget = widgetModel.getLastChild();

  //                 while (
  //                   curWidget &&
  //                   (curWidget.getWidgetTypeId() !== subComponentTypeId || deleteModels.includes(curWidget))
  //                 ) {
  //                   curWidget = curWidget.getPrevSibling();
  //                 }

  //                 if (curWidget && curWidget.getWidgetTypeId() === subComponentTypeId) {
  //                   deleteModels.push(curWidget);
  //                 }
  //               });
  //           }
  //           this.deleteFileRelation(ctx, deleteModels);
  //           this.deleteTargetModels(deleteModels, ctx, {
  //             commandID: CommandEnum.DELETE_WIDGET,
  //           });
  //         }
  //       }
  //     }
  //   });
  // }

  /**
   * pinned 방향에 따라 position을 유지할지 결정하는 함수
   */
  private shouldKeepPosition(pinnedDirections: string[]): { keepX: boolean; keepY: boolean } {
    if (
      pinnedDirections.includes('center') ||
      (pinnedDirections.includes('top') &&
        pinnedDirections.includes('bottom') &&
        pinnedDirections.includes('left') &&
        pinnedDirections.includes('right'))
    ) {
      return { keepX: true, keepY: true };
    }

    return {
      keepX: pinnedDirections.includes('left') || pinnedDirections.includes('right'),
      keepY: pinnedDirections.includes('top') || pinnedDirections.includes('bottom'),
    };
  }

  /**
   * 특정 컴포넌트의 하위에 컴포넌트를 추가하는 함수
   */
  private appendSubComponentCommand(
    ctx: AkronContext,
    componentType: WidgetTypeEnum,
    parentModel: WidgetModel,
    nextSibling?: WidgetModel
  ) {
    const idContainerController = ctx.getIdContainerController();
    const model = this.createNewWidgetModel(ctx, componentType, idContainerController.generateComponentId());
    const appendComponentCommand = new AppendWidgetCommand(ctx, model, parentModel, nextSibling);
    ctx.getCommand()?.append(appendComponentCommand);
    return model;
  }

  // /**
  //  * Widget 보이기/숨기기 여부 변경 (hidden properties 변경)
  //  */
  // @boundMethod
  // private hideWidget(ctx: AkronContext, props: HideWidgetCommandProps): void {
  //   if (isUndefined(ctx.getCommand())) {
  //     dError('command is not exist');
  //     return;
  //   }
  //   const { targetModel, hidden, compositeModel } = props;
  //   // 에셋 보이기/숨기기 여부 변경
  //   if (compositeModel) {
  //     const hiddenCommand = new UpdateHiddenAssetCommand(compositeModel, targetModel.getID(), hidden);
  //     ctx.getCommand()?.append(hiddenCommand);
  //   }

  //   const hiddenComponent = (component: WidgetModel) => {
  //     applyHiddenCommand(ctx, component, hidden);
  //     component.forEachChild(hiddenComponent);
  //   };

  //   hiddenComponent(targetModel);
  // }

  /**
   * Widget 잠금 여부 변경 (locked properties 변경)
   */
  @boundMethod
  private lockWidget(ctx: AkronContext, props: LockWidgetCommandProps): void {
    if (isUndefined(ctx.getCommand())) {
      dError('command is not exist');
      return;
    }
    const { targetModel, locked, compositeModel } = props;
    // 에셋 잠금 여부 변경
    if (compositeModel) {
      //   const hiddenCommand = new UpdateLockAssetCommand(compositeModel, targetModel.getID(), locked);
      //   ctx.getCommand()?.append(hiddenCommand);
    }

    const lockComponent = (component: WidgetModel) => {
      //   applyLockCommand(ctx, component, locked);
      component.forEachChild(child => {
        lockComponent(child as WidgetModel);
      });
    };

    lockComponent(targetModel);
  }

  // /**
  //  * widget 삽입 위치에 대한 postProcess 함수
  //  */
  // @boundMethod
  // private setInfoForInsertDragWidget(ctx: AkronContext, props: SetInfoForInsertDragWidgetCommandProps): void {
  //   const { dragInsertWidgetInfo } = props;
  //   if (dragInsertWidgetInfo) {
  //     // dataTransfer의 item은 dragOver시 확인할 수 없은 정보이므로 따로 id를 저장
  //     ctx.getWidgetEditInfoContainer().setDragInsertWidgetInfo(dragInsertWidgetInfo);
  //   }
  // }

  // /**
  //  * widget의 사이즈 업데이트 함수
  //  */
  // @boundMethod
  // private updateWidgetSize(ctx: AkronContext, props: UpdateWidgetSizeProps) {
  //   const updateComand = new UpdateSizeCommand(props.newWidgetModel, props.newSize);
  //   ctx.getCommand()?.append(updateComand);
  // }

  // /**
  //  * widget의 포지션 업데이트 함수
  //  */
  // @boundMethod
  // private updateWidgetPosition(ctx: AkronContext, props: UpdateWidgetPositionProps) {
  //   const updateComand = new UpdatePositionCommand(props.newWidgetModel, props.newPosition);
  //   ctx.getCommand()?.append(updateComand);
  // }
}

export default WidgetEditCommandHandler;
