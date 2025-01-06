import { WidgetCategory } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import UpdateMessage from 'models/message/UpdateMessage';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import { HandlerID, ChainID } from 'models/widget/WidgetPropTypes';
import { AppInfo } from 'store/app/AppInfo';

/**
 * 서버로 보낼 메시지 객체입니다.
 */
export default class UpdateWidgetMessage extends UpdateMessage {
  private parentID?: WidgetID;

  private childID?: WidgetID;

  private nextID?: WidgetID;

  //   private componentType?: AnyWidgetType | OSobjectWidgetType;

  private data: string | undefined;

  private componentSpecificProperties: string | undefined;

  private propertyKey: string | undefined;

  private propertyValue: any | undefined;

  private name: string | undefined;

  private widgetCategory: WidgetCategory | undefined;

  private appInfo: string | undefined;

  // dataStore의 dataID, widgetModel의 viewDataID에서 사용합니다.
  //   private dataID?: DataID;

  private dataName?: string;

  // dataStore의 dto data에서 사용합니다
  //   private dtoDataID?: DataID;

  private contentPropertiesString?: string;

  private stylePropertiesString?: string;

  private logicPropertiesString?: string;

  private dataTypeID?: number;

  private dataValueString?: string;

  //   private DTOtype?: ServiceDataTransferObjectType;

  private dtoMemberString?: string;

  // wigdetModel의 variableDataIDs에서 사용합니다.
  private referenceString?: string;

  private referenceDtoString?: string;

  private dataStoreCustomPropsString?: string | undefined;

  private dataStoreCustomStatesString?: string | undefined;

  private widgetCustomPropsMapString?: string | undefined;

  private widgetCustomStatesMapString?: string | undefined;

  private variableID?: number | undefined;

  private customPropID?: number | undefined;

  private variableMemberKey?: string | undefined;

  private customPropsVariableMemberMapString?: string | undefined;

  //   private argumentKey?: ArgumentKey | undefined;

  private isGXTopLevel?: string;

  // Business Component Event Chain을 위한 멤버 변수
  private componentID: number | undefined;

  //   private eventType: BCEventType | undefined;

  private handlerID: HandlerID | undefined;

  private condition: string | undefined;

  private chainID: ChainID | undefined;

  private nextHandlerID: HandlerID | undefined;

  // private businessComponentChainModel;
  //   private businessLogicEnum: BusinessLogicEnum | undefined;

  private businessLogicArgs: string | undefined;

  private nextChainID: ChainID | undefined;

  private dataTypeName?: string;

  private dataTypeString?: string;

  private isList?: string;

  private isPreset?: string;

  private isLibrary?: string;

  private typeReferenceString?: string;

  private functionName?: string;

  private description?: string;

  private code?: string;

  /**
   * constructor
   */
  public constructor(
    appID?: number,
    modelID?: number,
    parentID?: number,
    childID?: number,
    nextID?: number,
    // componentType?: AnyWidgetType,
    data?: string,
    behavior?: string,
    name?: string,
    widgetCategory?: WidgetCategory,
    componentSpecificProperties?: string,
    appInfo?: string,
    dataID?: number,
    dataName?: string,
    dtoDataID?: number,
    contentPropertiesString?: string,
    stylePropertiesString?: string,
    logicPropertiesString?: string,
    dataTypeID?: number,
    // DTOtype?: ServiceDataTransferObjectType,
    dataValueString?: string,
    dtoMemberString?: string,
    referenceString?: string,
    referenceDtoString?: string,
    dataStoreCustomPropsString?: string,
    dataStoreCustomStatesString?: string,
    widgetCustomPropsMapString?: string,
    widgetCustomStatesMapString?: string,
    variableID?: number,
    customPropID?: number,
    DTODataValueName?: string,
    // argumentKey?: ArgumentKey,
    variableMemberKey?: string,
    customPropsVariableMemberMapString?: string,
    isGXTopLevel?: string,
    componentID?: number,
    // eventType?: BCEventType,
    handlerID?: HandlerID,
    condition?: string,
    chainID?: ChainID,
    nextHandlerID?: HandlerID,
    // businessLogicEnum?: BusinessLogicEnum,
    businessLogicArgs?: string,
    nextChainID?: ChainID,
    dataTypeName?: string,
    dataTypeString?: string,
    isList?: string,
    isPreset?: string,
    isLibrary?: string,
    typeReferenceString?: string,
    functionName?: string,
    description?: string,
    code?: string
  ) {
    super(appID, modelID, behavior);
    this.parentID = parentID;
    this.childID = childID;
    this.nextID = nextID;
    // this.componentType = componentType;
    this.data = data;
    this.appInfo = appInfo;
    this.name = name;
    this.widgetCategory = widgetCategory;
    this.componentSpecificProperties = componentSpecificProperties;
    // this.dataID = dataID;
    this.dataName = dataName;
    // this.dtoDataID = dtoDataID;
    this.contentPropertiesString = contentPropertiesString;
    this.stylePropertiesString = stylePropertiesString;
    this.logicPropertiesString = logicPropertiesString;
    this.dataTypeID = dataTypeID;
    // this.DTOtype = DTOtype;
    this.dtoMemberString = dtoMemberString;
    this.dataValueString = dataValueString;
    this.referenceString = referenceString;
    this.referenceDtoString = referenceDtoString;
    this.dataStoreCustomPropsString = dataStoreCustomPropsString;
    this.dataStoreCustomStatesString = dataStoreCustomStatesString;
    this.widgetCustomPropsMapString = widgetCustomPropsMapString;
    this.widgetCustomStatesMapString = widgetCustomStatesMapString;
    this.variableID = variableID;
    this.customPropID = customPropID;
    // this.argumentKey = argumentKey;
    this.variableMemberKey = variableMemberKey;
    this.customPropsVariableMemberMapString = customPropsVariableMemberMapString;
    this.isGXTopLevel = isGXTopLevel;
    this.componentID = componentID;
    // this.eventType = eventType;
    this.handlerID = handlerID;
    this.condition = condition;
    this.chainID = chainID;
    this.nextHandlerID = nextHandlerID;
    // this.businessLogicEnum = businessLogicEnum;
    this.businessLogicArgs = businessLogicArgs;
    this.nextChainID = nextChainID;
    this.dataTypeName = dataTypeName;
    this.dataTypeString = dataTypeString;
    this.isList = isList;
    this.isPreset = isPreset;
    this.isLibrary = isLibrary;
    this.typeReferenceString = typeReferenceString;
    this.functionName = functionName;
    this.description = description;
    this.code = code;
  }

  /**
   * parentID setter
   */
  @boundMethod
  public setParentID(id: number): void {
    this.parentID = id;
  }

  /**
   * childID setter
   */
  @boundMethod
  public setChildID(id?: number): void {
    this.childID = id;
  }

  /**
   * next sibling id setter
   */
  @boundMethod
  public setNextID(id: number | undefined): void {
    this.nextID = id;
  }

  //   /**
  //    * component type setter
  //    */
  //   @boundMethod
  //   public setComponentType(type?: AnyWidgetType | OSobjectWidgetType): void {
  //     this.componentType = type;
  //   }

  /**
   * data setter
   */
  @boundMethod
  public setData(data?: string): void {
    this.data = data;
  }

  /**
   * set appInfo
   */
  @boundMethod
  public setAppInfo(appInfo?: string): void {
    this.appInfo = appInfo;
  }

  //   /**
  //    * Set dataID.
  //    */
  //   @boundMethod
  //   public setDataID(dataID?: number): void {
  //     this.dataID = dataID;
  //   }

  /**
   * Set dataName.
   */
  @boundMethod
  public setDataName(dataName?: string): void {
    this.dataName = dataName;
  }

  /**
   * Set Component Specific Properties.
   */
  @boundMethod
  public setComponenentSpecificProperties(componentSpecificProperties?: string): void {
    this.componentSpecificProperties = componentSpecificProperties;
  }

  /**
   * Set contentPropertiesString.
   */
  @boundMethod
  public setContentPropertiesString(contentPropertiesString: string): void {
    this.contentPropertiesString = contentPropertiesString;
  }

  /**
   * Set stylePropertiesString.
   */
  @boundMethod
  public setStylePropertiesString(stylePropertiesString: string): void {
    this.stylePropertiesString = stylePropertiesString;
  }

  /**
   * Set logicPropertiesString.
   */
  @boundMethod
  public setLogicPropertiesString(logicPropertiesString: string): void {
    this.logicPropertiesString = logicPropertiesString;
  }

  /**
   * Set dataType.
   */
  @boundMethod
  public setDataTypeID(dataTypeID: number): void {
    this.dataTypeID = dataTypeID;
  }

  /**
   * Set dataValueString.
   */
  @boundMethod
  public setDataValueString(dataValueString: string): void {
    this.dataValueString = dataValueString;
  }

  /**
   * Set referenceString.
   */
  @boundMethod
  public setReferenceString(referenceString: string): void {
    this.referenceString = referenceString;
  }

  /**
   * Set widgetCustomPropsMap of WidgetModel.
   */
  @boundMethod
  public setCustomPropsMapString(customPropsMapString?: string): void {
    this.widgetCustomPropsMapString = customPropsMapString;
  }

  /**
   * Set widgetCustomStatesMap of WidgetModel.
   */
  @boundMethod
  public setCustomStatesMapString(customStatesMapString?: string): void {
    this.widgetCustomStatesMapString = customStatesMapString;
  }

  /**
   * Set CustomPropsMapString of DataStore.
   */
  @boundMethod
  public setDataStoreCustomPropsString(dataStoreCustomPropsString?: string): void {
    this.dataStoreCustomPropsString = dataStoreCustomPropsString;
  }

  /**
   * Set CustomStatesMapString of DataStore.
   */
  @boundMethod
  public setDataStoreCustomStatesString(dataStoreCustomStatesString?: string): void {
    this.dataStoreCustomStatesString = dataStoreCustomStatesString;
  }

  /**
   * setter of functionName
   */
  setFunctionName(functionName: string) {
    this.functionName = functionName;
  }

  /**
   * setter of functionName
   */
  setDescription(description: string) {
    this.description = description;
  }

  /**
   * setter of functionName
   */
  setCode(code: string) {
    this.code = code;
  }

  /**
   * isGXTopLevel getter
   */
  @boundMethod
  public getIsGXTopLevel(): string | undefined {
    return this.isGXTopLevel;
  }

  /**
   * parentID getter
   */
  @boundMethod
  public getParentID(): number | undefined {
    return this.parentID;
  }

  /**
   * childID getter
   */
  @boundMethod
  public getChildID(): number | undefined {
    return this.childID;
  }

  /**
   * next sibling id getter
   */
  @boundMethod
  public getNextID(): number | undefined {
    return this.nextID;
  }

  //   /**
  //    * componentType getter
  //    */
  //   @boundMethod
  //   public getComponentType(): AnyWidgetType | OSobjectWidgetType | undefined {
  //     return this.componentType;
  //   }

  /**
   * Data getter
   */
  @boundMethod
  public getData(): string | undefined {
    return this.data;
  }

  /**
   * name getter
   */
  @boundMethod
  public getName(): string | undefined {
    return this.name;
  }

  /**
   * widgetCategory getter
   */
  @boundMethod
  public getWidgetCategory(): WidgetCategory | undefined {
    return this.widgetCategory;
  }

  /**
   * PropertyKey getter
   */
  @boundMethod
  public getPropertyKey(): string | undefined {
    return this.propertyKey;
  }

  /**
   * PropertyValue getter
   */
  @boundMethod
  public getPropertyValue(): any | undefined {
    return this.propertyValue;
  }

  /**
   * get appInfo
   */
  @boundMethod
  public getAppInfo(): string | undefined {
    return this.appInfo;
  }

  //   /**
  //    * Get dataID.
  //    */
  //   @boundMethod
  //   public getDataID(): DataID | undefined {
  //     return this.dataID;
  //   }

  /**
   * Get dataID.
   */
  @boundMethod
  public getDataName(): string | undefined {
    return this.dataName;
  }

  /**
   * Get Component Properties
   */
  @boundMethod
  public getComponentSpecificProperties(): string | undefined {
    return this.componentSpecificProperties;
  }

  /**
   * Get contentPropertiesString.
   */
  @boundMethod
  public getContentPropertiesString(): string | undefined {
    return this.contentPropertiesString;
  }

  /**
   * Get stylePropertiesString.
   */
  @boundMethod
  public getStylePropertiesString(): string | undefined {
    return this.stylePropertiesString;
  }

  /**
   * Get logicPropertiesString.
   */
  @boundMethod
  public getLogicPropertiesString(): string | undefined {
    return this.logicPropertiesString;
  }

  /**
   * Get dataType.
   */
  @boundMethod
  public getDataTypeID(): number | undefined {
    return this.dataTypeID;
  }

  /**
   * Get dataValueString.
   */
  @boundMethod
  public getDataValueString(): string | undefined {
    return this.dataValueString;
  }

  /**
   * Get referenceString.
   */
  @boundMethod
  public getReferenceString(): string | undefined {
    return this.referenceString;
  }

  /**
   * Get referenceDtoString.
   */
  @boundMethod
  public getReferenceDtoString(): string | undefined {
    return this.referenceDtoString;
  }

  /**
   * get widgetCustomPropsMap of widgetModel
   */
  @boundMethod
  public getWidgetCustomPropsMapString(): string | undefined {
    return this.widgetCustomPropsMapString;
  }

  /**
   * get widgetCustomStatesMap of widgetModel
   */
  @boundMethod
  public getWidgetCustomStatesMapString(): string | undefined {
    return this.widgetCustomStatesMapString;
  }

  /**
   * get dataStoreCustomPropsString
   */
  @boundMethod
  public getDataStoreCustomPropsString(): string | undefined {
    return this.dataStoreCustomPropsString;
  }

  /**
   * get dataStoreCustomStatesString
   */
  @boundMethod
  public getDataStoreCustomStatesString(): string | undefined {
    return this.dataStoreCustomStatesString;
  }

  /**
   * get VariableID
   */
  @boundMethod
  public getVariableID(): number | undefined {
    return this.variableID;
  }

  /**
   * get isList
   */
  @boundMethod
  public getIsList(): string | undefined {
    return this.isList;
  }

  /**
   * get isPreset
   */
  @boundMethod
  public getIsPreset(): string | undefined {
    return this.isPreset;
  }

  /**
   * get isLibrary
   */
  @boundMethod
  public getIsLibrary(): string | undefined {
    return this.isLibrary;
  }

  /**
   * get isList
   */
  @boundMethod
  public getDataTypeName(): string | undefined {
    return this.dataTypeName;
  }

  /**
   * get isPreset
   */
  @boundMethod
  public getDataTypeString(): string | undefined {
    return this.dataTypeString;
  }

  /**
   * get typeReferenceString
   */
  @boundMethod
  public getTypeReferenceString(): string | undefined {
    return this.typeReferenceString;
  }

  /**
   * get customPropID
   */
  @boundMethod
  public getCustomPropID(): number | undefined {
    return this.customPropID;
  }

  /**
   * get variable data member name
   */
  @boundMethod
  public getVariableMemberName(): string | undefined {
    return this.variableMemberKey;
  }

  /**
   * get custom props and variable member map string
   */
  @boundMethod
  public getCustomPropsVariableMapString(): string | undefined {
    return this.customPropsVariableMemberMapString;
  }

  //   /**
  //    * get argumentKey
  //    */
  //   @boundMethod
  //   public getArgumentKey(): ArgumentKey | undefined {
  //     return this.argumentKey;
  //   }

  /**
   * getter of componentID
   */
  getComponentID() {
    return this.componentID;
  }

  //   /**
  //    * getter of eventType
  //    */
  //   getEventType() {
  //     return this.eventType;
  //   }

  /**
   * getter of handlerID
   */
  getHandlerID() {
    return this.handlerID;
  }

  /**
   * getter of condition
   */
  getCondition() {
    return this.condition;
  }

  /**
   * getter of chainID
   */
  getChainID() {
    return this.chainID;
  }

  /**
   * getter of nextID
   */
  getNextHandlerID() {
    return this.nextHandlerID;
  }

  //   /**
  //    * getter of businessLogicEnumLogic
  //    */
  //   getBusinessLogicEnum() {
  //     return this.businessLogicEnum;
  //   }

  /**
   * getter of businessLogicArgs
   */
  getBusinessLogicArgs() {
    return this.businessLogicArgs;
  }

  /**
   * getter of nextID
   */
  getNextChainID() {
    return this.nextChainID;
  }

  /**
   * getter of functionName
   */
  getFunctionName() {
    return this.functionName;
  }

  /**
   * getter of functionName
   */
  getDescription() {
    return this.description;
  }

  /**
   * getter of functionName
   */
  getCode() {
    return this.code;
  }

  /**
   * fill updateMessage
   */
  @boundMethod
  public fillUpdateMessage(widgetModel: Readonly<WidgetModel>, behavior: string): void {
    this.setAppID(undefined);
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
    this.parentID = widgetModel.getParent()?.getID();
    this.childID = widgetModel.getFirstChild()?.getID();
    this.nextID = widgetModel.getNextSibling()?.getID();
    // this.componentType = widgetModel.getContentType();
    // this.data = widgetModel.getContentJsonString();
    this.name = widgetModel.getName();
    this.widgetCategory = widgetModel.getWidgetCategory();
    // this.componentSpecificProperties = widgetModel.getComponentSpecificPropertiesJsonString();
    // if (isDefined(widgetModel.getVariableDataIDs()) && isNotNull(widgetModel.getVariableDataIDs())) {
    //   this.referenceString = data2json(widgetModel.getVariableDataIDs());
    // }
    // this.widgetCustomPropsMapString = widgetModel.getParentPropsMapString();
    // this.widgetCustomStatesMapString = widgetModel.getParentStatesMapString();
    // this.isGXTopLevel = widgetModel.getIsGXTopLevel().toString();
  }

  /**
   * fill updateMessage to update component properties
   */
  @boundMethod
  public fillUpdateMessageComponentProperties(
    widgetModel: Readonly<WidgetModel>,
    behavior: string,
    key: string,
    value: any
  ): void {
    this.setAppID(undefined);
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
    // this.componentType = widgetModel.getWidgetType();
    this.propertyKey = key;
    this.propertyValue = value;
  }

  /**
   * fill updateMessage to update parent props and states of widgetModel
   */
  @boundMethod
  public fillUpdateMessageParentPropsStatesMap(widgetModel: Readonly<WidgetModel>, behavior: string): void {
    this.setAppID(undefined);
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
    this.parentID = widgetModel.getParent()?.getID();
    this.childID = widgetModel.getFirstChild()?.getID();
    this.nextID = widgetModel.getNextSibling()?.getID();
    // this.componentType = widgetModel.getContentType();
    this.name = widgetModel.getName();
    this.widgetCategory = widgetModel.getWidgetCategory();
    // this.widgetCustomPropsMapString = widgetModel.getParentPropsMapString();
    // this.widgetCustomStatesMapString = widgetModel.getParentStatesMapString();
  }

  //   /**
  //    * fill updateMessage to update component event type
  //    */
  //   @boundMethod
  //   public fillUpdateMessageComponentEventType(
  //     { componentID, eventType, handlerID }: { componentID: number; eventType: BCEventType; handlerID: number },
  //     behavior: 'ice' | 'uce' | 'dce' | 'ide' | 'dde'
  //   ): void {
  //     this.setBehavior(behavior);
  //     this.setAppID(undefined);
  //     this.componentID = componentID;
  //     this.eventType = eventType;
  //     this.handlerID = handlerID;
  //   }

  //   /**
  //    * fill updateMessage to update event handler
  //    */
  //   @boundMethod
  //   public fillUpdateMessageEventHandler(
  //     { handlerID, condition, chainID, nextHandlerID }: IEventHandlerModel,
  //     behavior: 'ieh' | 'ueh' | 'deh'
  //   ): void {
  //     this.setBehavior(behavior);
  //     this.setAppID(undefined);
  //     this.handlerID = handlerID;
  //     this.condition = condition;
  //     this.chainID = chainID;
  //     this.nextHandlerID = nextHandlerID;
  //   }

  //   /**
  //    * fill updateMessage to update business component chain
  //    */
  //   @boundMethod
  //   public fillUpdateMessageBusinessComponentChain(
  //     { chainID, businessLogicEnum, businessLogicArgs, nextChainID }: IBusinessComponentChainModel,
  //     behavior: 'ibcc' | 'ubcc' | 'dbcc'
  //   ): void {
  //     this.setBehavior(behavior);
  //     this.setAppID(undefined);
  //     this.chainID = chainID;
  //     this.businessLogicEnum = businessLogicEnum;
  //     this.businessLogicArgs = businessLogicArgs;
  //     this.nextChainID = nextChainID;
  //   }

  /**
   * fill updateMessage to update callback
   */
  @boundMethod
  public fillUpdateMessageCallback(
    { handlerID, chainID }: { handlerID?: HandlerID; chainID: ChainID },
    behavior: 'ic' | 'dc'
  ): void {
    this.setBehavior(behavior);
    this.setAppID(undefined);
    this.handlerID = handlerID;
    this.chainID = chainID;
  }

  //   /**
  //    * fill updateMessage to update custom props variable map of widgetModel
  //    */
  //   @boundMethod
  //   public fillUpdateMessageCustomPropsVariableMap(
  //     widgetModelID: number,
  //     variableID: number,
  //     customPropsVariableMap: Map<DataID, string>,
  //     behavior: string
  //   ): void {
  //     this.setAppID(undefined);
  //     this.setModelID(widgetModelID);
  //     this.setBehavior(behavior);
  //     this.variableID = variableID;
  //     this.customPropsVariableMemberMapString = JSON.stringify(Array.from(customPropsVariableMap.entries()));
  //   }

  /**
   * fill updateMessage to delete repeatable props variable map of the widgetModel
   */
  @boundMethod
  public fillDeleteMessageRepeatablePropsVariableMap(
    widgetModel: Readonly<WidgetModel>,
    variableID: number,
    customPropID: number,
    behavior: string
  ): void {
    this.setAppID(undefined);
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
    this.variableID = variableID;
    this.customPropID = customPropID;
  }

  /**
   * fill updateMessage to delete repeatable props variable map of the widgetModel
   */
  @boundMethod
  public fillDeleteMessageRepeatablePropsVariableMaps(widgetModelID: number, behavior: string): void {
    this.setAppID(undefined);
    this.setModelID(widgetModelID);
    this.setBehavior(behavior);
  }

  /**
   * fill updateMessage to delete all repeatable props dto map of the widgetModel
   */
  @boundMethod
  public fillDeleteMessageRepeatablePropsDTOMaps(widgetModel: Readonly<WidgetModel>, behavior: string): void {
    this.setAppID(undefined);
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
  }

  //   /**
  //    * fill updateMessage to update Business Argument Data Binding Info of widgetModel
  //    */
  //   @boundMethod
  //   public fillUpdateMessageBusinessArgumentDataBindingInfo(
  //     widgetModel: Readonly<SelectedModel>,
  //     chainID: ChainID,
  //     argumentKey: ArgumentKey,
  //     dataID: DataID,
  //     behavior: string
  //   ): void {
  //     this.setAppID(undefined); // container에서 처리
  //     this.setModelID(widgetModel.getID());
  //     this.setBehavior(behavior);
  //     this.chainID = chainID;
  //     this.argumentKey = argumentKey;
  //     this.dataID = dataID;
  //   }

  //   /**
  //    * fill updateMessage to delete Business Argument Data Binding Info of widgetModel
  //    */
  //   @boundMethod
  //   public fillDeleteMessageBusinessArgumentDataBindingInfo(
  //     chainID: ChainID,
  //     argumentKey: ArgumentKey,
  //     dataID: DataID,
  //     behavior: string
  //   ): void {
  //     this.setAppID(undefined); // container에서 처리
  //     this.setBehavior(behavior);
  //     this.chainID = chainID;
  //     this.argumentKey = argumentKey;
  //     this.dataID = dataID;
  //   }

  /**
   * fill updateMessage to delete all Business Argument Data Binding Info of widgetModel
   */
  @boundMethod
  public fillDeleteMessageBusinessArgumentDataBindingInfos(widgetModel: Readonly<WidgetModel>, behavior: string): void {
    this.setAppID(undefined); // container에서 처리
    this.setModelID(widgetModel.getID());
    this.setBehavior(behavior);
  }

  //   /**
  //    * fill updateMessage to update variableDataIDs of WidgetModel.
  //    */
  //   @boundMethod
  //   public fillUpdateMessageVariableDataIDs(
  //     behavior: string,
  //     widgetID: WidgetID,
  //     variableDataIDs: ReferenceVariableDataIDs
  //   ) {
  //     this.setAppID(undefined);
  //     this.setModelID(widgetID);
  //     this.setBehavior(behavior);
  //     if (isDefined(variableDataIDs) && isNotNull(variableDataIDs)) {
  //       this.referenceString = data2json(variableDataIDs);
  //     }
  //   }

  /**
   * fill updateMessage
   */
  @boundMethod
  public fillUpdateMessageAppInfo(appInfo: Readonly<AppInfo>, behavior: string): void {
    this.appInfo = JSON.stringify(appInfo);
    this.setBehavior(behavior);
  }

  //   /**
  //    * fill updateMessage for VariableData of DataStore.
  //    */
  //   @boundMethod
  //   public fillUpdateMessageVariableData(behavior: string, dataID: DataID, variableValue?: VariableValue): void {
  //     this.setAppID(undefined);
  //     this.setBehavior(behavior);
  //     this.dataID = dataID;
  //     if (isDefined(variableValue)) {
  //       const { dataName, dataTypeID, dataValue, isList, isPreset, isLibrary } = variableValue;
  //       this.dataName = dataName;
  //       this.dataTypeID = dataTypeID;
  //       if (isList) {
  //         this.dataValueString = JSON.stringify(dataValue);
  //       } else {
  //         this.dataValueString = primitiveTypeID.includes(dataTypeID) ? dataValue : JSON.stringify(dataValue);
  //       }
  //       this.isList = isList.toString();
  //       this.isPreset = isPreset.toString();
  //       this.isLibrary = isDefined(isLibrary) ? isLibrary.toString() : String(false);
  //     }
  //   }

  //   /**
  //    * fill updateMessage for VariableDataType of DataStore.
  //    */
  //   @boundMethod
  //   public fillUpdateMessageVariableDataType(
  //     behavior: string,
  //     dataTypeID: number,
  //     variableDataObjectType?: VariableDataObjectType
  //   ): void {
  //     this.setAppID(undefined);
  //     this.setBehavior(behavior);
  //     this.dataTypeID = dataTypeID;
  //     if (isDefined(variableDataObjectType)) {
  //       const { dataTypeName, dataMember, reference, typeReference, isLibrary } = variableDataObjectType;
  //       this.dataTypeName = dataTypeName;
  //       this.dataTypeString = isDefined(dataMember) ? JSON.stringify(Array.from(dataMember)) : undefined;
  //       this.referenceString = JSON.stringify(Array.from(reference));
  //       this.typeReferenceString = JSON.stringify(Array.from(typeReference));
  //       this.isLibrary = isDefined(isLibrary) ? isLibrary.toString() : String(false);
  //     }
  //   }

  //   /**
  //    * fill updateMessage with WidgetCustomProps or States String of DataStore
  //    */
  //   @boundMethod
  //   public fillDataStoreWidgetCustomPropsStatesMessage(
  //     targetWidgetID: WidgetID,
  //     behavior: string,
  //     dataID: DataID,
  //     customPropsValue: WidgetCustomPropsType | undefined
  //   ): void {
  //     this.setModelID(targetWidgetID);
  //     this.setBehavior(behavior);
  //     this.dataID = dataID;
  //     if (isDefined(customPropsValue)) {
  //       const { dataName, dataTypeID, dataValue, isList } = customPropsValue;
  //       this.setDataName(dataName);
  //       this.setDataTypeID(dataTypeID);
  //       if (isList) {
  //         this.dataValueString = JSON.stringify(dataValue);
  //       } else {
  //         this.dataValueString = primitiveTypeID.includes(dataTypeID) ? dataValue : JSON.stringify(dataValue);
  //       }
  //       this.isList = isList.toString();
  //     }
  //   }

  //   /**
  //    * fill updateMessage with All Custom Props and States of DataStore
  //    */
  //   @boundMethod
  //   public fillUpdateMessageAllCustomPropsStates(
  //     behavior: string,
  //     customProps: Map<WidgetID, Map<string, WidgetCustomPropsType>>,
  //     customStates: Map<WidgetID, Map<string, WidgetCustomPropsType>>
  //   ): void {
  //     this.setBehavior(behavior);
  //     this.dataStoreCustomPropsString = data2json(customProps);
  //     this.dataStoreCustomStatesString = data2json(customStates);
  //   }

  //   /**
  //    * fill updateOSobjectMessage
  //    */
  //   @boundMethod
  //   public fillUpdateOSobjectMessage(OSmodel: Readonly<OSobjectModel>, behavior: string): void {
  //     this.setBehavior(behavior);
  //     this.setModelID(OSmodel.getID());
  //     this.setComponentType(OSmodel.getObjectType());
  //     this.name = OSmodel.getName();
  //     this.data = OSmodel.getContentJsonString();
  //     // this.dataID = model.getViewDataID();
  //     // if (isDefined(model.getVariableDataIDs()) && isNotNull(model.getVariableDataIDs())) {
  //     //     this.referenceString = data2json(model.getVariableDataIDs());
  //     // }
  //   }

  /**
   * fill delete Message
   */
  @boundMethod
  public filldeleteCustomCodeMessage(functionName: string): void {
    this.setBehavior('dccd');
    this.setAppID(undefined);
    this.setFunctionName(functionName);
  }
}
