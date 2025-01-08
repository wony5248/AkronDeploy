import WidgetModel from 'models/node/WidgetModel';

/**
 * WidgetModel과 siblingIndex.
 */
export interface WidgetModelIndexInfo {
  widgetModel: WidgetModel;
  siblingIndex: number;
}

/**
 * WidgetModel과 siblingIndex.
 */
export interface NewWidgetModelIndexInfo {
  widgetModel: WidgetModel;
  siblingIndex: number;
  //   compositeModel?: CompositeModel;
}

/**
 * Clipboard의 정보를 저장하는 class입니다.
 */
export default class ClipboardContainer {
  /**
   * 현재 복사한 widget들과 child index.
   * child index는 붙여넣기 시 sibling 순서 유지를 위함.
   */
  private localWidgetModels: readonly NewWidgetModelIndexInfo[];

  // 복사할 컴포넌트의 business logic 정보
  //   private localEventHandlerMap: Map<HandlerID, EventHandlerModel>;

  //   private localBusinessComponentChainMap: Map<ChainID, BusinessComponentChainModel>;

  //   private localBusinessArgumentVariableDataMap: BusinessChainArgumentVariableDataMap;

  //   private localCallbackMap: Map<ChainID, HandlerID>;

  //   private localFileComponentRelationMap: Map<WidgetID, Array<FileComponentRelation>>;

  /**
   * 생성자.
   */
  constructor() {
    this.localWidgetModels = [];
    // this.localEventHandlerMap = new Map();
    // this.localBusinessComponentChainMap = new Map();
    // this.localBusinessArgumentVariableDataMap = new Map();
    // this.localCallbackMap = new Map();
    // this.localFileComponentRelationMap = new Map();
  }

  /**
   * 복사할 widgetModel들을 저장.
   */
  public setLocalWidgetModels(widgetModels: readonly NewWidgetModelIndexInfo[]) {
    this.localWidgetModels = widgetModels;
  }

  /**
   * 복사할 widgetModel들을 꺼냄.
   */
  public getLocalWidgetModels() {
    return this.localWidgetModels;
  }

  /**
   * 복사된 eventHandlerMap 반환
   */
  //   public getLocalEventHandlerMap() {
  //     return this.localEventHandlerMap;
  //   }

  //   /**
  //    * 복사된 businessComponentChainMap 반환
  //    */
  //   public getLocalBusinessComponentChainMap() {
  //     return this.localBusinessComponentChainMap;
  //   }

  //   /**
  //    * 복사된 businessArgumentVariableDataMap 반환
  //    */
  //   public getLocalBusinessArgumentVariableDataMap() {
  //     return this.localBusinessArgumentVariableDataMap;
  //   }

  //   /**
  //    * 복사된 callbackMap 반환
  //    */
  //   public getLocalCallbackMap() {
  //     return this.localCallbackMap;
  //   }

  //   /**
  //    * ClipboardContainer의 business logic 관련 정보 초기화
  //    */
  //   private initClipboardBusinessLogic() {
  //     this.localEventHandlerMap = new Map();
  //     this.localBusinessComponentChainMap = new Map();
  //     this.localBusinessArgumentVariableDataMap = new Map();
  //     this.localCallbackMap = new Map();
  //   }

  // /**
  //  * widget model의 business logic을 복사
  //  */
  // public copyBusinessLogic(
  //     widgetModels: Array<WidgetModel>,
  //     eventHandlerMap: Map<HandlerID, EventHandlerModel>,
  //     businessComponentChainMap: Map<ChainID, BusinessComponentChainModel>,
  //     businessArgumentVariableDataMap: BusinessChainArgumentVariableDataMap,
  //     callbackMap: Map<ChainID, HandlerID>
  // ) {
  //     this.initClipboardBusinessLogic();

  //     widgetModels.forEach(widgetModel => {
  //         this.copyBusinessLogicRecursive(
  //             widgetModel,
  //             eventHandlerMap,
  //             businessComponentChainMap,
  //             businessArgumentVariableDataMap,
  //             callbackMap
  //         );
  //     });
  // }

  // /**
  //  *  Business Logic을 Recursive하게 Children 까지 Copy 해주는 function
  //  */
  // private copyBusinessLogicRecursive(
  //     widgetModel: WidgetModel,
  //     eventHandlerMap: Map<HandlerID, EventHandlerModel>,
  //     businessComponentChainMap: Map<ChainID, BusinessComponentChainModel>,
  //     businessArgumentVariableDataMap: BusinessChainArgumentVariableDataMap,
  //     callbackMap: Map<ChainID, HandlerID>
  // ) {
  //     widgetModel.forEachChild((childModel: WidgetModel) => {
  //         const childModelFirstHandlerIDs = Array.from(childModel.getEventMapChain().values());
  //         childModelFirstHandlerIDs.forEach(childFirstHandlerID => {
  //             this.copyEventHandler(
  //                 childFirstHandlerID,
  //                 eventHandlerMap,
  //                 businessComponentChainMap,
  //                 businessArgumentVariableDataMap,
  //                 callbackMap
  //             );
  //         });
  //     });

  //     const firstHandlerIDs = Array.from(widgetModel.getEventMapChain().values());
  //     firstHandlerIDs.forEach(firstHandlerID => {
  //         this.copyEventHandler(
  //             firstHandlerID,
  //             eventHandlerMap,
  //             businessComponentChainMap,
  //             businessArgumentVariableDataMap,
  //             callbackMap
  //         );
  //     });
  // }

  /**
   * Copy Business Event Handler and Chain on Clipboard Container
   *
   * @param firstHandlerID
   * @param eventHandlerMap
   * @param businessComponentChainMap
   * @param businessArgumentVariableDataMap
   * @param callbackMap
   */
  //   private copyEventHandler = (
  //     firstHandlerID: HandlerID,
  //     eventHandlerMap: Map<HandlerID, EventHandlerModel>,
  //     businessComponentChainMap: Map<ChainID, BusinessComponentChainModel>,
  //     businessArgumentVariableDataMap: BusinessChainArgumentVariableDataMap,
  //     callbackMap: Map<ChainID, HandlerID>
  //   ) => {
  //     for (let handlerID: HandlerID | undefined = firstHandlerID; isDefined(handlerID); ) {
  //       const eventHandlerModel = eventHandlerMap.get(handlerID);
  //       if (eventHandlerModel) {
  //         const copiedEventHandlerModel = new EventHandlerModel({
  //           appID: eventHandlerModel.getAppID(),
  //           handlerID: eventHandlerModel.getHandlerID(),
  //           condition: eventHandlerModel.getCondition(),
  //           chainID: eventHandlerModel.getChainID(),
  //           nextHandlerID: eventHandlerModel.getNextHandlerID(),
  //         });
  //         this.localEventHandlerMap.set(handlerID, copiedEventHandlerModel);

  //         const firstChainID = eventHandlerModel.getChainID();
  //         for (let chainID: ChainID | undefined = firstChainID; isDefined(chainID); ) {
  //           const businessComponentChainModel = businessComponentChainMap.get(chainID);
  //           if (businessComponentChainModel) {
  //             const copiedBusinessComponentChainModel = new BusinessComponentChainModel({
  //               appID: businessComponentChainModel.getAppID(),
  //               businessLogicEnum: businessComponentChainModel.getBusinessLogicEnum(),
  //               businessLogicArgs: businessComponentChainModel.getBusinessLogicArgs(),
  //               chainID: businessComponentChainModel.getChainID(),
  //               nextChainID: businessComponentChainModel.getNextChainID(),
  //             });
  //             this.localBusinessComponentChainMap.set(chainID, copiedBusinessComponentChainModel);

  //             const argumentDataMap = businessArgumentVariableDataMap.get(chainID);
  //             if (argumentDataMap) {
  //               const copiedArgumentDataMap = new Map(argumentDataMap);
  //               this.localBusinessArgumentVariableDataMap.set(chainID, copiedArgumentDataMap);
  //             }

  //             const callbackHandlerID = callbackMap.get(chainID);
  //             if (callbackHandlerID) {
  //               this.localCallbackMap.set(chainID, callbackHandlerID);
  //               this.copyEventHandler(
  //                 callbackHandlerID,
  //                 eventHandlerMap,
  //                 businessComponentChainMap,
  //                 businessArgumentVariableDataMap,
  //                 callbackMap
  //               );
  //             }

  //             chainID = businessComponentChainModel.getNextChainID();
  //           }
  //         }

  //         handlerID = eventHandlerModel.getNextHandlerID();
  //       }
  //     }
  //   };

  //   /**
  //    * 복사할 file component relation 저장.
  //    */
  //   public setLocalFileComponentRelation(fileComponentRelation: Map<WidgetID, Array<FileComponentRelation>>) {
  //     fileComponentRelation.forEach((relations, widgetId) => {
  //       this.localFileComponentRelationMap.set(widgetId, [...relations]);
  //     });
  //   }

  //   /**
  //    * 복사할 file component relation 꺼냄.
  //    */
  //   public getLocalFileComponentRelationMap() {
  //     return this.localFileComponentRelationMap;
  //   }
}
