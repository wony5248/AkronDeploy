import { IWidgetCommonProperties, isUndefined, dError, isDefined, DeepReadonly, WidgetTypeEnum } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { runInAction } from 'mobx';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import NewAppendWidgetCommand from 'models/store/command/widget/AppendWidgetCommand';
import {
  AnyWidgetType,
  InsertableWidgetType,
  IWidgetPartofProperties,
  WidgetEditingState,
} from 'models/store/command/widget/WidgetModelTypes';
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
  checkBusinessOrPageDialogModel,
  checkConditionalLayout,
  checkInsertableItem,
  checkPageModel,
  clearWidgetModelEditContext,
  findInsertPosition,
  getDeletableWidgetModels,
  isWidgetsDeletable,
} from 'util/WidgetUtil';
import UpdateWidgetCommand from 'models/store/command/widget/UpdateWidgetCommand';
import AppendWidgetCommand from 'models/store/command/widget/AppendWidgetCommand';
import AppendWidgetRecursiveCommand from 'models/store/command/widget/AppendWidgetRecursiveCommand';
import { isEditAppMode, isEditWidgetMode } from 'util/AppModeUtil';
import RenameWidgetCommand from 'models/store/command/widget/RenameWidgetCommand';
import { WidgetStyle, Position, Length, Constraint } from 'models/widget/WidgetPropTypes';

const widgetModelDemo = new WidgetModel({
  id: 1000000,
  widgetType: WidgetTypeEnum.BasicButton,
  widgetCategory: '',
  name: 'button',
  properties: {
    content: { text: { value: 'afsdfasd', defaultValue: 'adsfzcv', variableId: 0 } },
    style: { backgroundColor: { value: 'black', defaultValue: 'black', variableId: 1 } },
  },
});

const widgetModelDemo2 = new WidgetModel({
  id: 1000001,
  widgetType: WidgetTypeEnum.BasicButton,
  widgetCategory: '',
  name: 'button',
  properties: {
    content: { text: { value: 'afsdfasd', defaultValue: 'adsfzcv', variableId: 0 } },
    style: { backgroundColor: { value: 'black', defaultValue: 'black', variableId: 1 } },
  },
});

const widgetModelDemo3 = new WidgetModel({
  id: 1000002,
  widgetType: WidgetTypeEnum.BasicButton,
  widgetCategory: '',
  name: 'button',
  properties: {
    content: { text: { value: 'afsdfasd', defaultValue: 'adsfzcv', variableId: 0 } },
    style: { backgroundColor: { value: 'black', defaultValue: 'black', variableId: 1 } },
  },
});

/**
 * 삽입과 동시에 속성을 특정 값으로 설정해야 할 때 사용.
 * 현재 방식: 속성의 메타데이터 ID를 가지고, 모델의 props에 일치하는 ID의 속성들을 덮어씀.
 * 이유: 속성 ID는 모델 생성 뒤에 나옴.
 */
// type InitializeProperties = Array<WidgetProp>;

/**
 * Widget 삽입 시 필요한 Props
 */
// export type NewInsertWidgetCommandProps<Props extends IWidgetCommonProperties = IWidgetCommonProperties> =
//   WidgetCommandProps & {
//     commandID: CommandEnum.INSERT_WIDGET;
//     widgetTypeId: WidgetTypeID;
//     widgetType: string;
//     initializeProperties?: InitializeProperties;
//     widgetName?: string;
//   };

/**
 * Widget 을 특정 위치에 삽입 시 필요한 Props
 */
// export type NewInsertWidgetAtCommandProps = WidgetCommandProps & {
//   commandID: CommandEnum.INSERT_WIDGET_AT;
//   widgetTypeId: WidgetTypeID;
//   widgetID: WidgetID;
//   widgetType: string;
//   posX: number;
//   posY: number;
//   initializeProperties?: InitializeProperties;
//   parentWidgetModel?: BaseWidgetModel; // 내부 로직에서 parent가 없다면 parent를 찾도록 함
//   cloneWidget?: WidgetModel;

//   libraryID?: number;
//   libraryDependencyData?: LibraryDependencyData;
//   insertedPuxLibraryInfoMap?: InsertedPuxLibraryInfoMap;
// };

/**
 * Widget 삽입 시 필요한 Props
 */
export type InsertWidgetCommandProps<Props extends IWidgetCommonProperties = IWidgetCommonProperties> =
  WidgetCommandProps & {
    commandID: CommandEnum.INSERT_WIDGET;
    widgetType: InsertableWidgetType;
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
  widgetType: InsertableWidgetType;
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
  pinnedDirections: string[];
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
  newWidgetProps: IWidgetPartofProperties;
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
  newWidgetProps: IWidgetPartofProperties;
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
          !isWidgetsDeletable(ctx.getSelectionContainer().getSelectedWidgets())
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
        const parentWidgetModel =
          ctx.getMouseMode() === 'InsertContainer'
            ? (ctx.getSelectionContainer()?.getEditingPage() ?? this.getParentToInsert(ctx, newWidgetModel))
            : this.getParentToInsert(ctx, newWidgetModel);
        const parentWidth = parentWidgetModel.getProperties().style.width.value;
        const parentHeight = parentWidgetModel.getProperties().style.height.value;

        return {
          ...defaultProperties,
          ...initialProps,
          style: {
            ...defaultProperties.style,
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
  private createNewWidgetModel(ctx: AkronContext, widgetType: AnyWidgetType, widgetID: WidgetID) {
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
    return widgetModelDemo;
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

    if (isDefined(parentWidgetModel) && checkConditionalLayout(parentWidgetModel)) {
      const fragmentLayoutModels = parentWidgetModel.mapChild((childWidgetModel: WidgetModel) => childWidgetModel);
      const renderedChildIndex = parentWidgetModel.getProperties().content.flag.value ? 0 : 1;
      parentWidgetModel = fragmentLayoutModels[renderedChildIndex];
    }

    // // layout type의 repeatable component 하위에는 하나의 gx library component만 삽입 가능
    // if (!isInsertableRepeatableLayout(parentWidgetModel, newWidgetModel, editorUIStore)) {
    //   return;
    // }

    const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets();
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
    if (!checkBusinessOrPageDialogModel(parentWidgetModel)) {
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
        return selectedWidget;
      }
      // childable하지 않은 경우 페이지에 삽입
      if (isEditAppMode(ctx.getAppModeContainer())) {
        return ctx.getSelectionContainer().getEditingPage() ?? ctx.getEditingWidgetModel().getFirstChild()!;
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
    const editingTopWidgetModel: WidgetModel = ctx.getNewAppModel();
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
    const editingWidgetModel = ctx.getEditingWidgetModel();
    const selectionContainer = ctx.getSelectionContainer();
    const zoomRatio = ctx.getZoomRatio() / 100;
    if (isUndefined(selectionContainer)) {
      return;
    }

    selectionContainer.setFloatingWidgetModels(
      targetModels.map(widgetModel => {
        const copiedWidgetModel = widgetModel.cloneNode(ctx.getIdContainerController());
        copiedWidgetModel.setEditingState(WidgetEditingState.FLOATING);
        const targetRefWidth = widgetModel.getRefStyle()?.width;
        const targetRefHeight = widgetModel.getRefStyle()?.height;
        const targetRefLeft = widgetModel.getRefStyle()?.left;
        const targetRefTop = widgetModel.getRefStyle()?.top;
        const targetRefWidthToPx =
          targetRefWidth !== undefined ? Number(targetRefWidth.slice(0, targetRefWidth.length - 2)) : 0;
        const targetRefHeightToPx =
          targetRefHeight !== undefined ? Number(targetRefHeight.slice(0, targetRefHeight.length - 2)) : 0;
        // copiedWidgetModel.getProperties().forEach((prop, propId) => {
        //   if (prop.propMeta.name === 'width') {
        //     prop.value = targetRefWidthToPx;
        //   } else if (prop.propMeta.name === 'height') {
        //     prop.value = targetRefHeightToPx;
        //   }
        // });
        const widgetX = widgetModel.getRefX();
        // const parentX = parent?.getRefX();
        const leftValue = widgetX !== undefined ? widgetX : 0;

        const widgetY = widgetModel.getRefY();
        // const parentY = parent?.getRefY();
        const topValue = widgetY !== undefined ? widgetY : 0;

        // copiedWidgetModel.setPosition({
        //   left: { value: leftValue / zoomRatio, unit: 'px' },
        //   top: { value: topValue / zoomRatio, unit: 'px' },
        // });
        widgetEditInfoContainer.setEditingFloatingWidget(copiedWidgetModel, widgetModel);

        const refPosition = {
          x: leftValue / zoomRatio,
          y: topValue / zoomRatio,
          width: targetRefWidthToPx,
          height: targetRefHeightToPx,
        };
        widgetEditInfoContainer.setRefPositionMap(copiedWidgetModel, refPosition);

        return copiedWidgetModel;
      })
    );
    // editingState 변경
    targetModels.forEach(targetWidgetModel => {
      targetWidgetModel.setEditingState(WidgetEditingState.RESIZE);
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
    widgetStyle: WidgetStyle,
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
  ) {
    const x: Position = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.x,
        }
      : {
          ...widgetStyle.x,
          absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
          relative: this.calculateRelativePosition(
            this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
            parentWidth
          ),
        };

    const y: Position = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.y,
        }
      : {
          ...widgetStyle.y,
          absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
          relative: this.calculateRelativePosition(
            this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
            parentHeight
          ),
        };

    const width: Length = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.width,
        }
      : {
          ...widgetStyle.width,
          absolute: refPosition.width * deltaWidth,
          relative: ((refPosition.width * deltaWidth) / pageModelWidth) * 100,
          type: widgetStyle.width.type === 'relative' ? 'relative' : 'absolute',
          unit: widgetStyle.width.type === 'relative' ? '%' : 'px',
        };

    const height: Length = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.height,
        }
      : {
          ...widgetStyle.height,
          absolute: refPosition.height * deltaHeight,
          relative: ((refPosition.height * deltaHeight) / pageModelHeight) * 100,
          type: widgetStyle.height.type === 'relative' ? 'relative' : 'absolute',
          unit: widgetStyle.height.type === 'relative' ? '%' : 'px',
        };

    const { frameType } = widgetStyle;

    const left: Constraint = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.left,
        }
      : {
          ...widgetStyle.left,
          absolute: this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
          relative: this.calculateRelativePosition(
            this.calculateX(resizeHandle, refPosition, deltaWidth, deltaX),
            parentWidth
          ),
        };

    const top: Constraint = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.top,
        }
      : {
          ...widgetStyle.top,
          absolute: this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
          relative: this.calculateRelativePosition(
            this.calculateY(resizeHandle, refPosition, deltaHeight, deltaY),
            parentHeight
          ),
        };

    const right: Constraint = isVerticalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.right,
        }
      : {
          ...widgetStyle.right,
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
        };

    const bottom: Constraint = isHorizontalCenterHandle(resizeHandle)
      ? {
          ...widgetStyle.bottom,
        }
      : {
          ...widgetStyle.bottom,
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
        };

    return {
      style: {
        x,
        y,
        width,
        height,
        frameType,
        left,
        top,
        right,
        bottom,
      },
    };
  }

  /**
   * Bound 관련 style 계산
   */
  private calculateNewStyle(
    widgetRefStyle: WidgetPosition | undefined,
    deltaWidth: number,
    deltaHeight: number,
    deltaX: number,
    deltaY: number
  ) {
    if (widgetRefStyle === undefined) {
      return undefined;
    }

    const leftValue = widgetRefStyle.x ?? 0;

    const topValue = widgetRefStyle.y ?? 0;

    const widthValue = widgetRefStyle.width ?? 0;

    const heightValue = widgetRefStyle.height ?? 0;

    const left = leftValue + deltaX;
    const top = topValue + deltaY;
    const width = widthValue * deltaWidth;
    const height = heightValue * deltaHeight;

    return {
      style: {
        left,
        top,
        width,
        height,
      },
    };
  }

  /**
   * Widget 끌어서 Resize 종료
   */
  @boundMethod
  private resizeWidgetEnd(ctx: AkronContext, props: WidgetResizeEndCommandProps): void {
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    const command = ctx.getCommand();
    const selectionContainer = ctx.getSelectionContainer();

    const { targetModels: widgetModels, deltaX, deltaY, deltaWidth, deltaHeight } = props;
    const models = [widgetModelDemo, widgetModelDemo2, widgetModelDemo3];
    const model = widgetModelDemo;
    const resizeHandle = widgetEditInfoContainer.getResizeHandle();

    const isPage = models.find(widgetModel => checkPageModel(widgetModel)) !== undefined;
    if (isPage) {
      return;
    }
    if (command === undefined) {
      dError('command is not exist');
      return;
    }

    models.forEach(widgetModel => {
      // editingState 변경
      widgetModel.setEditingState(WidgetEditingState.NONE);

      // style 변경용 Command 생성
      const widgetProps = widgetModel.getProperties();

      // const targetFloatingModel = widgetEditInfoContainer.getEditingFloatingWidget(widgetModel);

      // if (isUndefined(targetFloatingModel)) {
      //   return;
      // }
      // const refPositionMap = widgetEditInfoContainer.getRefPositionMap(targetFloatingModel);

      // const widgetStyle = widgetProps.getStyle();

      // parent의 absolute 값으로 relative 계산
      // const parentWidget = widgetModel.getParent();
      // if (!parentWidget) {
      //   return;
      // }

      // const updatedStyle = this.calculateNewStyle(refPositionMap, deltaWidth, deltaHeight, deltaX, deltaY);

      // if (updatedStyle === undefined) {
      //   return;
      // }

      // 임시 포지션
      // const position = widgetModel.getPosition();
      let newLeft;
      let leftUnit = 'px';
      let newTop;
      let topUnit = 'px';

      if (deltaX !== 0) {
        newLeft = deltaX;
      }

      if (deltaY !== 0) {
        newTop = deltaY;
      }

      // dialog의 경우 내부에서 absolute로 위치하기 때문에 부모 position을 반영한 후처리가 필요
      // if (checkDialogFrameWidget(parentWidget) && newLeft && newTop) {
      //   const parentPosition = (parentWidget as WidgetModel).getPosition();
      //   // gx에서 string으로 된 position이 없음
      //   const parentLeft = typeof parentPosition.left === 'string' ? 0 : parentPosition.left.value;
      //   const parentTop = typeof parentPosition.top === 'string' ? 0 : parentPosition.top.value;

      //   newLeft -= parentLeft;
      //   newTop -= parentTop;
      // }

      // command화 필요
      // const newPosition = {
      //   left: newLeft !== undefined ? { value: newLeft, unit: leftUnit } : position.left,
      //   top: newTop !== undefined ? { value: newTop, unit: topUnit } : position.top,
      // };
      const updateWidgetCommand = new UpdateWidgetCommand(widgetModel, widgetProps);
      command.append(updateWidgetCommand);
      // for (const [key, value] of Object.entries(updatedStyle.style)) {
      //     const updateWidgetCommand = new UpdateWidgetCommand(widgetModel, key, true, value);
      //     command.append(updateWidgetCommand);
      // }

      // width,height setting
      const width = widgetModel.getRefWidth();
      const height = widgetModel.getRefHeight();
      const newWidth = { value: width, unit: width };
      const newHeight = { value: height, unit: height };
      // switch (width?.unit) {
      //   case 'px':
      //     newWidth.value = updatedStyle.style.width;
      //     break;
      //   case '%':
      //     newWidth.value = (updatedStyle.style.width / parentWidth) * 100;
      //     break;
      //   case 'auto':
      //     newWidth.value = updatedStyle.style.width;
      //     newWidth.unit = 'px';
      //     break;
      //   default:
      //     break;
      // }
      // switch (height?.unit) {
      //   case 'px':
      //     newHeight.value = updatedStyle.style.height;
      //     break;
      //   case '%':
      //     newHeight.value = (updatedStyle.style.height / parentHeight) * 100;
      //     break;
      //   case 'auto':
      //     newHeight.value = updatedStyle.style.height;
      //     newHeight.unit = 'px';
      //     break;
      //   default:
      //     break;
      // }
      const updateSizeCommand = new UpdateWidgetCommand(widgetModel, {
        width: newWidth,
        height: newHeight,
      });
      command.append(updateSizeCommand);
      // updatePinnedChildren(widgetModel, Number(newWidth.value), Number(newHeight.value), ctx);
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
        const refX = widgetModel.getRefX();
        const refY = widgetModel.getRefY();
        // const content = {
        //   ...getWidgetContentProperty(widgetModel, dataStore, metaDataContainer),
        // };
        // const style = { ...getWidgetStyleProperty(widgetModel, dataStore) };

        // copiedWidgetModel.setOriginWidgetPosition(
        //   refX ? (refX - editingPageRefPosition.x) / (zoomRatio / 100) : widgetModel.getProperties().style.x.absolute,
        //   refY ? (refY - editingPageRefPosition.y) / (zoomRatio / 100) : widgetModel.getProperties().style.y.absolute
        // );
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
      // if (widgetModel.getComponentSpecificProperties().locked) {
      //   return;
      // }

      widgetModel.setProperties({
        ...curProps,
      });
      widgetModel.setEditingState(WidgetEditingState.MOVE);
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
    // const { desModel, deltaX, deltaY, useRefPosition, isMovedToPage, changeTopWidgetModel, byKeyEvent } = props;
    const widgetEditInfoContainer = ctx.getWidgetEditInfoContainer();
    // const compositeComponentContainer = ctx.getCompositeComponentContainer();
    const zoomRatio = ctx.getZoomRatio() / 100;

    // ConditionalLayout이 end container일 경우 하위 FragmentLayout를 container로 지정
    // if (container && checkConditionalLayout(container)) {
    //     container = getConditionalLayoutEditedFrameModel(container) as WidgetModel; // Conditional Layout
    // }

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

    // if (isDefined(container) && !isInsertableRepeatableLayout(container, widgetModels[0], editorUIStore)) {
    //     this.clearWidgetModelEditContext(ctx);
    //     widgetModels.forEach(widgetModel => {
    //         widgetModel.getProperties().setEditingState(WidgetEditingState.NONE);
    //     });
    //     return;
    // }

    const forceParentChange = false;
    // const isSelectReactNodeProp =
    //     isDefined(desModel) &&
    // isDefined(ctx.getMetaDataContainer().getReactNodeTypePropMap().get(desModel?.getWidgetType()));

    widgetModels.forEach(widgetModel => {
      // const pinnedDirections = widgetModel.getPinnedDirections();
      // const position = widgetModel.getPosition();
      let newLeftUnit = 'px';
      let newTopUnit = 'px';
      let newLeftValue = 0;
      let newTopValue = 0;

      // app 별 parent rect style 가져오기
      // const {
      //   parentRefX,
      //   parentRefY,
      //   parentRefWidth: parentWidth,
      //   parentRefHeight: parentHeight,
      // } = getTargetParentRectStyle(ctx, widgetModel.getParent());

      // 먼저 pinned 방향을 확인하여 이동 가능 여부 결정
      // const { keepX, keepY } = this.shouldKeepPosition(pinnedDirections);

      // if (typeof position.left === 'string') {
      //   const oldX = widgetModel.getRefX();
      //   const parentX = parentRefX;
      //   const oldValue = oldX !== undefined && parentX !== undefined ? oldX - parentX : 0;
      //   newLeftValue = keepX ? oldValue : oldValue + deltaX;
      // } else {
      //   const oldLeft = position.left;
      //   const { unit } = oldLeft;
      //   const oldValue = oldLeft.value;
      //   if (unit === 'px') {
      //     newLeftValue = keepX ? oldValue : oldValue + deltaX;
      //   } else {
      //     const oldValueToPx = parentWidth * (oldValue / 100);
      //     newLeftValue = keepX ? oldValue : ((oldValueToPx + deltaX) / parentWidth) * 100;
      //     newLeftUnit = '%';
      //   }
      // }

      // if (typeof position.top === 'string') {
      //   const oldY = widgetModel.getRefY();
      //   const parentY = parentRefY;
      //   const oldValue = oldY !== undefined && parentY !== undefined ? oldY - parentY : 0;
      //   newTopValue = keepY ? oldValue : oldValue + deltaY;
      // } else {
      //   const oldTop = position.top;
      //   const { unit } = oldTop;
      //   const oldValue = oldTop.value;
      //   if (unit === 'px') {
      //     newTopValue = keepY ? oldValue : oldValue + deltaY;
      //   } else {
      //     const oldValueToPx = parentHeight * (oldValue / 100);
      //     newTopValue = keepY ? oldValue : ((oldValueToPx + deltaY) / parentHeight) * 100;
      //     newTopUnit = '%';
      //   }
      // }

      // const newPosition = {
      //   left: { value: newLeftValue, unit: newLeftUnit },
      //   top: { value: newTopValue, unit: newTopUnit },
      //   pinnedDirections: widgetModel.getPinnedDirections().join(','),
      // };

      // // pinnedDirections 먼저 설정하고 position 업데이트
      // widgetModel.setPinnedDirections(pinnedDirections);
      // const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
      // ctx.getCommand()?.append(updatePositionCommand);

      // widgetModel.setEditingState(WidgetEditingState.NONE);

      // const widgetProps = widgetModel.getProperties();
      // const canInsertToWidget = checkInsertableItem(container, widgetModel);

      // widgetModel.getProperties().setEditingState(WidgetEditingState.NONE);

      // const refPositionMap = widgetEditInfoContainer.getRefPositionMap(widgetModel);

      // const styleProperties = widgetModel.getProperties().getStyle();

      // // 마우스를 통한 이동 시 absolute 계산
      // const isRelative = byKeyEvent && styleProperties.frameType === 'relative';

      // const xAbsolute = styleProperties.x.absolute;
      // const yAbsolute = styleProperties.y.absolute;

      // const referenceX =
      //     useRefPosition && refPositionMap ? refPositionMap.x : xAbsolute + pagePosition.x;
      // const referenceY =
      //     useRefPosition && refPositionMap ? refPositionMap.y : yAbsolute + pagePosition.y;

      // // parent의 absolute 값으로 relative 계산
      // const parentWidget = widgetModel.getParent();
      // const pageModel = workAreaModel.getFirstChild();
      // if (!parentWidget || !pageModel) {
      //     return;
      // }

      // let dragEndTargetModel: 'Page' | 'WorkArea' = 'Page';
      // let parentWidth = parentWidget.getRefWidth() ?? parentWidget?.getProperties().getStyle().width.absolute;
      // let parentHeight =
      //     parentWidget.getRefHeight() ?? parentWidget?.getProperties().getStyle().height.absolute;

      // let resultX = isRelative
      //     ? referenceX + (parentWidget.getRefWidth() ?? 0) * deltaX * 0.01
      //     : referenceX + deltaX;
      // let resultY = isRelative
      //     ? referenceY + (parentWidget.getRefHeight() ?? 0) * deltaY * 0.01
      //     : referenceY + deltaY;

      // if (
      //     (isDefined(changeTopWidgetModel) && !checkTopParentIsWorkArea(parentWidget)) ||
      //     (!isDefined(changeTopWidgetModel) && checkTopParentIsWorkArea(parentWidget))
      // ) {
      //     // Page -> WorkArea or  WorkArea -> WorkArea
      //     dragEndTargetModel = 'WorkArea';
      //     parentWidth = workAreaModel.getProperties().getStyle().width.absolute;
      //     parentHeight = workAreaModel.getProperties().getStyle().height.absolute;

      //     resultX -= pagePosition.x;
      //     resultY -= pagePosition.y;
      // } else if (
      //     isEditAppMode(ctx.getAppModeContainer()) &&
      //     (!isSelectReactNodeProp || desModel?.getID() !== widgetModel.getID())
      // ) {
      //     // WorkArea -> Page or Page -> Page
      //     resultX -= pagePosition.x;
      //     resultY -= pagePosition.y;

      //     parentWidth = pageModel.getProperties().getStyle().width.absolute;
      //     parentHeight = pageModel.getProperties().getStyle().height.absolute;

      //     const isOutOfPage =
      //         resultX <= 0 ||
      //         resultY <= 0 ||
      //         resultX >= parentWidth - (widgetModel.getRefWidth() ?? 0) / (zoomRatio / 100) ||
      //         resultY >= parentHeight - (widgetModel.getRefHeight() ?? 0) / (zoomRatio / 100);

      //     const isChildExclusive = basicChildWidgetTypeNamesSet.has(widgetModel.getWidgetType());

      //     if (!byKeyEvent && isOutOfPage && !isChildExclusive) {
      //         // 비정상적 동작으로 페이지 내 컴포넌트가 페이지 밖에 배치될 경우 강제로 parent를 workArea로 이동
      //         forceParentChange = true;
      //         dragEndTargetModel = 'WorkArea';
      //         parentWidth = workAreaModel.getProperties().getStyle().width.absolute;
      //         parentHeight = workAreaModel.getProperties().getStyle().height.absolute;
      //     }
      // }

      // if (!byKeyEvent) {
      //     // 키보드 이동이 아닌 마우스 드래그 이동 중에 viewPort 밖으로 나간 경우 다시 viewPort 안쪽으로 위치 시킴
      //     // view port의 좌측 최상단 좌표
      //     const viewportCoordinates = getViewportCoordinates(
      //         editorRect,
      //         workAreaRect,
      //         zoomRatio,
      //         pagePosition
      //     );

      //     if (resultY <= viewportCoordinates.y) {
      //         // 위쪽으로 나간 경우
      //         resultY = viewportCoordinates.y;
      //     } else if (
      //         resultY >=
      //         viewportCoordinates.y +
      //             (editorRect.height - (widgetModel.getRefHeight() ?? 0)) / (zoomRatio / 100)
      //     ) {
      //         // 아래쪽으로 나간 경우
      //         resultY =
      //             viewportCoordinates.y +
      //             (editorRect.height - (widgetModel.getRefHeight() ?? 0)) / (zoomRatio / 100);
      //     }
      //     if (resultX <= viewportCoordinates.x) {
      //         // 왼쪽으로 나간 경우
      //         resultX = viewportCoordinates.x;
      //     } else if (
      //         resultX >=
      //         viewportCoordinates.x +
      //             (editorRect.width - (widgetModel.getRefWidth() ?? 0)) / (zoomRatio / 100)
      //     ) {
      //         // 오른쪽으로 나간 경우
      //         resultX =
      //             viewportCoordinates.x +
      //             (editorRect.width - (widgetModel.getRefWidth() ?? 0)) / (zoomRatio / 100);
      //     }
      // }
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'x', true, {
      //         ...widgetProps.getStyle().x,
      //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
      //         relative:
      //             isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultX) / parentWidth) * 100),
      //     })
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'y', true, {
      //         ...widgetProps.getStyle().y,
      //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
      //         relative:
      //             isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultY) / parentHeight) * 100),
      //     })
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(
      //         widgetModel,
      //         'frameType',
      //         true,
      //         dragEndTargetModel === 'WorkArea' ? 'absolute' : widgetProps.getStyle().frameType
      //     )
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'left', true, {
      //         ...widgetProps.getStyle().left,
      //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultX,
      //         relative:
      //             isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultX) / parentWidth) * 100),
      //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().left.anchor,
      //     })
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'top', true, {
      //         ...widgetProps.getStyle().top,
      //         absolute: isDefined(container) && canInsertToWidget ? 0 : resultY,
      //         relative:
      //             isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultY) / parentHeight) * 100),
      //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().top.anchor,
      //     })
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'right', true, {
      //         ...widgetProps.getStyle().right,
      //         absolute:
      //             parentWidth -
      //             (isDefined(container) && canInsertToWidget ? 0 : resultX) -
      //             widgetProps.getStyle().width.absolute,
      //         relative:
      //             100 -
      //             (isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultX) / parentWidth) * 100) +
      //                   widgetProps.getStyle().width.relative),
      //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().right.anchor,
      //     })
      // );
      // ctx.getCommand()?.append(
      //     new UpdateWidgetCommand(widgetModel, 'bottom', true, {
      //         ...widgetProps.getStyle().bottom,
      //         absolute:
      //             parentHeight -
      //             (isDefined(container) && canInsertToWidget ? 0 : resultY) -
      //             widgetProps.getStyle().height.absolute,
      //         relative:
      //             100 -
      //             (isDefined(container) && canInsertToWidget
      //                 ? 0
      //                 : Math.round((Number(resultY) / parentHeight) * 100) +
      //                   widgetProps.getStyle().height.relative),
      //         anchor: dragEndTargetModel === 'WorkArea' ? false : widgetProps.getStyle().bottom.anchor,
      //     })
      // );
    });
    // console.log(newParentChildPermittedRelationMap.get(desModel?.getWidgetTypeId() as number));
    // console.log(
    //     newParentChildPermittedRelationMap
    //         .get(desModel?.getWidgetTypeId() as number)
    //         ?.has(widgetModel.getWidgetTypeId())
    // );

    const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets();

    // VERSION2_FIXME: 셀렉션 및 이동관련 세부 기획 필요, Composite인 경우, Tree 관계 변경 불가
    // if (desModel && selectedWidgets) {
    //   if (
    //     checkCompositeChildModel(compositeComponentContainer, desModel) ||
    //     checkCompositeChildModel(compositeComponentContainer, selectedWidgets[0])
    //   ) {
    //     ctx.getHitContainer().setStartHitItem(undefined);
    //     this.clearWidgetModelEditContext(ctx);
    //     return;
    //   }
    // }

    // if (isDefined(desModel)) {
    //   if (
    //     desModel.getWidgetTypeId() === SystemComponentType.WorkArea ||
    //     desModel.getWidgetTypeId() === SystemComponentType.Page ||
    //     checkWidgetForAbsoluteChild(desModel)
    //   ) {
    //     const { pureWidgetModels } = classifyWidgetModelsForSelection(ctx, widgetModels);
    //     // workArea 혹은 page로 이동
    //     pureWidgetModels.forEach(widgetModel => {
    //       const parentWidgetModel = widgetModel.getParent();
    //       // 특정 컴포넌트 하위에만 존재해야 하는 컴포넌트는 이동 불가하도록 추가
    //       if (!isInsertableItemToWorkAreaOrPage(widgetModel) || !(widgetModel instanceof NewWidgetModel)) {
    //         return;
    //       }
    //       // app 별 parent rect style 가져오기
    //       const {
    //         parentRefX,
    //         parentRefY,
    //         parentRefWidth: parentWidth,
    //         parentRefHeight: parentHeight,
    //       } = getTargetParentRectStyle(ctx, desModel);
    //       if (parentWidgetModel && parentWidgetModel !== desModel) {
    //         const removeWidgetCommand = new NewRemoveWidgetCommand(widgetModel, parentWidgetModel);
    //         ctx.getCommand()?.append(removeWidgetCommand);

    //         const appendCompositeCommand = new NewAppendWidgetCommand(ctx, widgetModel, desModel);
    //         ctx.getCommand()?.append(appendCompositeCommand);

    //         const targetFloatingModel = widgetEditInfoContainer.getEditingFloatingWidget(widgetModel);
    //         if (
    //           targetFloatingModel &&
    //           (widgetModel.getParent() instanceof SystemComponentModel || checkWidgetForAbsoluteChild(desModel))
    //         ) {
    //           // frame에서 page 혹은 workArea로 이동 시 postion의 계산이 필요함
    //           const position = targetFloatingModel.getPosition();

    //           const leftUnit = typeof position.left === 'string' ? 'px' : position.left.unit;
    //           const widgetX = targetFloatingModel.getRefX();
    //           const parentX = parentRefX;
    //           const leftValue = widgetX !== undefined && parentX !== undefined ? (widgetX - parentX) / zoomRatio : 0;

    //           const topUnit = typeof position.top === 'string' ? 'px' : position.top.unit;
    //           const widgetY = targetFloatingModel.getRefY();
    //           const parentY = parentRefY;
    //           const topValue = widgetY !== undefined && parentY !== undefined ? (widgetY - parentY) / zoomRatio : 0;

    //           const newPosition = {
    //             left: {
    //               value: leftUnit === 'px' ? leftValue : (leftValue / parentWidth) * 100,
    //               unit: leftUnit,
    //             },
    //             top: {
    //               value: topUnit === 'px' ? topValue : (topValue / parentHeight) * 100,
    //               unit: topUnit,
    //             },
    //             pinnedDirections: widgetModel.getPinnedDirections().join(','),
    //           };
    //           const updatePositionCommand = new UpdatePositionCommand(widgetModel, newPosition);
    //           ctx.getCommand()?.append(updatePositionCommand);
    //         }
    //       }
    //     });
    //   } else {
    //     widgetModels.forEach(widgetModel => {
    //       // frame 하위로 이동
    //       const childCapable = // desModel이 widgetModel을 child로 가질 수 있는지 판단
    //         newParentChildPermittedRelationMap.get(desModel.getWidgetTypeId()) &&
    //         newParentChildPermittedRelationMap.get(desModel.getWidgetTypeId())?.has(widgetModel.getWidgetTypeId());
    //       if (childCapable) {
    //         const removeWidgetCommand = new NewRemoveWidgetCommand(
    //           widgetModel,
    //           widgetModel.getParent() as BaseWidgetModel
    //         );
    //         ctx.getCommand()?.append(removeWidgetCommand);

    //         const appendCompositeCommand = new NewAppendWidgetCommand(ctx, widgetModel, desModel);
    //         ctx.getCommand()?.append(appendCompositeCommand);
    //       } else if (desModel instanceof PublishedComponentModel) {
    //         // PGX 하위로 삽입 시도 시 최상위 부모가 변경되게 되면 workArea or page로 parent 변경
    //         const removeWidgetCommand = new NewRemoveWidgetCommand(
    //           widgetModel,
    //           widgetModel.getParent() as BaseWidgetModel
    //         );
    //         ctx.getCommand()?.append(removeWidgetCommand);

    //         const appendCompositeCommand = new NewAppendWidgetCommand(
    //           ctx,
    //           widgetModel,
    //           checkTopParentIsWorkArea(desModel) ? workAreaModel : workAreaModel.getFirstChild()
    //         );
    //         ctx.getCommand()?.append(appendCompositeCommand);
    //       }
    //     });
    //   }
    // }
    // if (isSelectReactNodeProp) {
    //     runInAction(() => {
    //         ctx.setDialogType(ribbonDialogContentMap.SelectReactNodeProp);
    //         ctx.setDialogOpen(true);
    //     });
    //     ctx.setDragDesModel(desModel);

    //     if (isDefined(changeTopWidgetModel)) {
    //         // 컴포넌트 내 속성 다이얼로그 조건 충족 시에 WorkArea에서 Page로 이동했을 경우 parent 변경
    //         widgetModels.forEach(widgetModel => {
    //             const parentWidgetModel = widgetModel.getParent();
    //             if (parentWidgetModel) {
    //                 const moveWidgetCommand = new MoveWidgetCommand(
    //                     widgetModel,
    //                     parentWidgetModel,
    //                     changeTopWidgetModel
    //                 );
    //                 ctx.getCommand()?.append(moveWidgetCommand);
    //             }
    //         });
    //     }
    // } else if (isDefined(container)) {
    //     // 마우스 커서가 위치한 곳으로 삽입하기 위해 next sibling 찾음
    //     const { mousePosition } = props;
    //     const hitModel = ctx.getHitContainer().getStartHitItem()?.getModel();
    //     let nextSibling: WidgetModel | undefined;
    //     if (isDefined(mousePosition) && isDefined(hitModel)) {
    //         nextSibling = findNextSiblingDragInContainer(
    //             container,
    //             mousePosition,
    //             selectedWidgets?.includes(hitModel) ? selectedWidgets : selectedWidgets?.concat(hitModel)
    //         );
    //     }

    //     widgetModels.forEach(widgetModel => {
    //         if (
    //             isDefined(container) &&
    //             checkInsertableItem(container, widgetModel) &&
    //             !isErrorWidgetModelsInTree(ctx.getErrorBoundaryContainer(), [container])
    //         ) {
    //             // Widget node 이동시킴
    //             const moveWidgetCommand = new MoveWidgetCommand(
    //                 widgetModel,
    //                 widgetModel.getParent()!,
    //                 container,
    //                 nextSibling
    //             );
    //             ctx.getCommand()?.append(moveWidgetCommand);

    //             // 컨테이너 내부에 item 삽입 시 sibling re-render
    //             container.forEachChild(child => {
    //                 if (child !== widgetModel) {
    //                     child.triggerRerender();
    //                 }
    //             });
    //         }
    //     });
    // } else if (isDefined(changeTopWidgetModel)) {
    //     widgetModels.forEach(widgetModel => {
    //         const parentWidgetModel = widgetModel.getParent();
    //         if (parentWidgetModel) {
    //             const moveWidgetCommand = new MoveWidgetCommand(
    //                 widgetModel,
    //                 parentWidgetModel,
    //                 changeTopWidgetModel
    //             );
    //             ctx.getCommand()?.append(moveWidgetCommand);
    //         }
    //     });
    // } else if (forceParentChange) {
    //     // 정상적인 마우스 이벤트 종료가 아닌 Page 내 컴포넌트가 비정상적인 방식으로
    //     //  WorkArea로의 좌표 이동이 일어났을 경우 parent WorkArea로 이동
    //     widgetModels.forEach(widgetModel => {
    //         const parentWidgetModel = widgetModel.getParent();
    //         if (parentWidgetModel) {
    //             const moveWidgetCommand = new MoveWidgetCommand(widgetModel, parentWidgetModel, workAreaModel);
    //             ctx.getCommand()?.append(moveWidgetCommand);
    //         }
    //     });
    // } else if (isMovedToPage) {
    //     const destParent = checkTopParentIsWorkArea(desModel) ? workAreaModel : workAreaModel.getFirstChild()!;
    //     widgetModels.forEach(widgetModel => {
    //         const parentWidgetModel = widgetModel.getParent();
    //         if (parentWidgetModel && !checkBusinessOrPageDialogModel(widgetModel.getParent())) {
    //             const moveWidgetCommand = new MoveWidgetCommand(widgetModel, parentWidgetModel, destParent);
    //             ctx.getCommand()?.append(moveWidgetCommand);
    //         }
    //     });
    // }
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
    componentType: string,
    parentModel: WidgetModel,
    nextSibling?: WidgetModel
  ) {
    const idContainerController = ctx.getIdContainerController();
    const model = this.createNewWidgetModel(ctx, componentType, idContainerController.generateComponentId());
    const appendComponentCommand = new NewAppendWidgetCommand(ctx, model, parentModel, nextSibling);
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
