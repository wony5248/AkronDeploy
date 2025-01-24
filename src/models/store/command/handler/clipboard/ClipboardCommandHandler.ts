import { dLog, Nullable, isDefined, dError, dWarn, isUndefined, IWidgetCommonProperties } from '@akron/runner';
import PageModel from 'models/node/PageModel';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';
import CommandEnum from 'models/store/command/common/CommandEnum';
import CommandHandler from 'models/store/command/common/CommandHandler';
import { findPageModelByID } from 'models/store/command/handler/PageCommandHandler';
import AppendWidgetRecursiveCommand from 'models/store/command/widget/AppendWidgetRecursiveCommand';
import MoveWidgetCommand from 'models/store/command/widget/MoveWidgetCommand';
import RenameWidgetCommand from 'models/store/command/widget/RenameWidgetCommand';
import WidgetCommandProps, { SelectionProp } from 'models/store/command/widget/WidgetCommandProps';
import { WidgetModelIndexInfo } from 'models/store/container/ClipboardContainer';
import AkronContext from 'models/store/context/AkronContext';
import SelectionEnum from 'models/store/selection/SelectionEnum';
import { basicChildWidgetTypeNamesSet } from 'models/widget/ParentChildRelMap';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { isPagesDeletable, getDeletablePageModels, getPageList, getSectionIdxByPageIdx } from 'util/PageUtil';
import {
  checkPageModel,
  isWidgetsDeletable,
  getDeletableWidgetModels,
  getCopyableWidgetModels,
  checkInsertableItem,
  findInsertPosition,
} from 'util/WidgetUtil';

/**
 * Clipboard 관련 command props.
 */
export type ClipboardCommandProps = WidgetCommandProps & {
  commandID:
    | CommandEnum.CLIPBOARD_COPY_PROCESS
    | CommandEnum.CLIPBOARD_CUT_PROCESS
    | CommandEnum.CLIPBOARD_PASTE_PROCESS;
};

/**
 * 복사하기, 잘라내기, 붙여넣기 등의 command들을 수행하는 command handler.
 */
class ClipboardCommandHandler extends CommandHandler {
  /**
   * Clipboard 관련 command를 처리.
   */
  public processCommand(props: ClipboardCommandProps, ctx: AkronContext): boolean {
    switch (props.commandID) {
      case CommandEnum.CLIPBOARD_COPY_PROCESS:
        this.performCopyProcess(ctx);
        break;
      case CommandEnum.CLIPBOARD_CUT_PROCESS:
        return !this.performCopyProcess(ctx, true);
      case CommandEnum.CLIPBOARD_PASTE_PROCESS:
        this.performPasteProcess(ctx);
        break;
      default:
        return false;
    }

    return true;
  }

  /**
   * 복사 동작 수행.
   *
   * @returns commandhandler chain 동작을 위한 boolean 값 (복사 동작이 수행된 경우 true, 실패한 경우 false 반환)
   */
  private performCopyProcess(ctx: AkronContext, isCutProcess = false): boolean {
    const selectionContainer = ctx.getSelectionContainer();
    const clipboardContainer = ctx.getClipboardContainer();
    const appModeContainer = ctx.getAppModeContainer();
    const appWidgetModel = ctx.getAppModel();
    if (isUndefined(selectionContainer)) {
      dLog('Clipboard: Selection 없음. Copy 불가!');
      return false;
    }

    const selectedWidgetModels = selectionContainer.getSelectedWidgets();
    if (selectedWidgetModels.length === 0) {
      return false;
    }

    const firstWidgetModel = selectedWidgetModels[0];

    // 선택된 개체가 Page일 경우, 선택된 페이지들을 복사
    if (checkPageModel(firstWidgetModel)) {
      const selectedPages = selectionContainer.getSelectedPages();
      if (
        selectedPages.length > 0 &&
        (!isCutProcess || isPagesDeletable(selectedPages, appWidgetModel, appModeContainer))
      ) {
        const targetPageModels = isCutProcess
          ? getDeletablePageModels(selectedPages, appWidgetModel, appModeContainer)
          : selectedPages;

        const copiedPages = targetPageModels.map(page => ({
          widgetModel: page.cloneNode(ctx.getIdContainerController()),
          siblingIndex: page.getSiblingIndex(),
        }));
        clipboardContainer.setLocalWidgetModels(copiedPages);
        // clipboardContainer.copyBusinessLogic(
        //   copiedPages.map(({ widgetModel }) => widgetModel),
        //   ctx.businessContainer.getEventHandlerMap(),
        //   ctx.businessContainer.getBusinessComponentChainMap(),
        //   ctx.dataBindingContainer.getBusinessArgumentVariableDataMap(),
        //   ctx.businessContainer.getCallbackMap()
        // );

        return true;
      }
      return false;
    }

    // 선택된 개체가 Page가 아닌 일반 Widget일 경우, selectedWidget들을 복사
    if (!isCutProcess || isWidgetsDeletable(selectionContainer.getSelectedWidgets())) {
      const targetWidgetModels = isCutProcess
        ? getDeletableWidgetModels(selectedWidgetModels)
        : getCopyableWidgetModels(selectedWidgetModels);

      if (targetWidgetModels.length === 0) {
        return false;
      }

      const copiedWidgets = targetWidgetModels
        .map(widgetModel => {
          const newWidgetModel = widgetModel.cloneNode(ctx.getIdContainerController());

          return {
            widgetModel: newWidgetModel,
            siblingIndex: widgetModel.getSiblingIndex(),
          };
        })
        .sort((widgetModelIndex1, widgetModelIndex2) => {
          return (
            widgetModelIndex1.widgetModel.getProperties().style.x.value -
            widgetModelIndex2.widgetModel.getProperties().style.x.value
          );
        });

      clipboardContainer.setLocalWidgetModels(copiedWidgets);
      //   clipboardContainer.copyBusinessLogic(
      //     copiedWidgets.map(({ widgetModel }) => widgetModel),
      //     ctx.businessContainer.getEventHandlerMap(),
      //     ctx.businessContainer.getBusinessComponentChainMap(),
      //     ctx.dataBindingContainer.getBusinessArgumentVariableDataMap(),
      //     ctx.businessContainer.getCallbackMap()
      //   );
      return true;
    }

    return false;
  }

  // TODO
  // 잘라내기 동작을 복사, 삭제 command를 활용하도록 수정함
  // 아래 작성된 로직 중 복사, 삭제 command에 누락된 로직이 없는지 확인 후 함수 제거 필요
  /**
   * 잘라내기 동작 수행.
   */
  // private performCutProcess(ctx: AkronContext) {
  //     if (isUndefined(ctx.selectionContainer)) {
  //         dLog('Clipboard: Selection 없음. Copy 불가!');
  //         return;
  //     }

  //     let selectedWidgets: Array<WidgetModel> = [];
  //     // 선택된 개체가 Page가 아닌 일반 Widget일 경우, selectedWidget들을 잘라내기
  //     if (
  //         ctx.selectionContainer.getSelectedWidgets()?.length !== 0 &&
  //         !checkPageModel(ctx.selectionContainer.getSelectedWidgets()[0])
  //     ) {
  //         selectedWidgets = ctx.selectionContainer.getSelectedWidgets();
  //     } else {
  //         // 선택된 개체가 Page일 경우, 선택된 페이지들을 잘라내기
  //         selectedWidgets = ctx.selectionContainer.getSelectedPages();
  //         // 모든 페이지 선택 시 첫 페이지는 하위 컴포넌트만 삭제
  //         if (selectedWidgets.length === ctx.appWidgetModel.getChildCount()) {
  //             const firstPage = ctx.appWidgetModel.getFirstChild()!;
  //             selectedWidgets = selectedWidgets.filter(page => page !== firstPage);

  //             firstPage.forEachChild(child => {
  //                 const removeWidgetCommand = new RemoveWidgetCommand(child, firstPage);
  //                 ctx.command?.append(removeWidgetCommand);
  //             });
  //         }
  //         // page 삭제 시, appWidgetModel prop 갱신
  //         const parentWidgetModel = ctx.appWidgetModel;
  //         const { sectionList } = parentWidgetModel.getProperties().content;

  //         if (isDefined(sectionList)) {
  //             const pageArr: WidgetModel<IPageComponentProperties, IPageWidgetProperties>[] = getPageList(
  //                 ctx.appWidgetModel
  //             );
  //             const sectionPageCountArr = ctx.appWidgetModel
  //                 .getProperties()
  //                 .content.sectionList?.value?.map((section: PageSection) => {
  //                     return section.pageCount;
  //                 });

  //             const sectionCounter = Array(sectionPageCountArr?.length).fill(0);
  //             pageArr.forEach((pageModel, idx) => {
  //                 if (
  //                     selectedWidgets?.some(selectModel => {
  //                         return pageModel.getID() === selectModel.getID();
  //                     })
  //                 ) {
  //                     const sectionIdx = getSectionIdxByPageIdx(sectionPageCountArr, idx);
  //                     sectionCounter[sectionIdx] += 1;
  //                 }
  //             });

  //             const newSectionList: PageSection[] = [];
  //             const appProp = ctx.appWidgetModel.getProperties();
  //             sectionList?.value.forEach((section: PageSection, idx: number) => {
  //                 newSectionList.push({
  //                     ...section,
  //                     pageCount: section.pageCount - sectionCounter[idx],
  //                 });
  //             });

  //             const newAppProp: IAppWidgetProperties = {
  //                 ...appProp,
  //                 content: {
  //                     ...appProp.content,
  //                     sectionList: { ...appProp.content.sectionList, value: newSectionList },
  //                 },
  //             };
  //             const updateWidgetCommand = new UpdateWidgetCommand(ctx.appWidgetModel, newAppProp);
  //             ctx.command?.append(updateWidgetCommand);
  //         }
  //     }

  //     // .forEach() 대신 .filter() 써서 선언 따로 안 하고 할당까지 한번에 할 수도 있지만...
  //     // .filter() 안에서 command를 날리는 것(= side-effect)은 좋지 않은 패턴 같아 이렇게 함.
  //     const removableWidgets: Array<WidgetModelIndexInfo> = [];

  //     // 잘라내기 실행 시, 잘라낼 데이터들의 Business Argument Binding 정보 초기화 작업
  //     ctx.clipboardContainer.getLocalBusinessArgumentVariableDataMap().clear();

  //     selectedWidgets.forEach(widgetModel => {
  //         // Widget 삭제 시 dataStore의 reference를 동기화합니다..
  //         syncSubstrackDataStoreReference(widgetModel, ctx.dataStore, ctx.command);

  //         if (checkPageModel(widgetModel)) {
  //             // 잘라내는 대상이 Page인 경우
  //             // TODO: Page 삭제 시 innerPage를 가진 경우 처리 로직과 동일하므로 추후 재사용 가능하도록 변경
  //             const innerPageInfo = ctx.pageContainer.getInnerPageMap().get(widgetModel.getID());
  //             if (isDefined(innerPageInfo)) {
  //                 // 삭제 대상 page의 innerPageInfo가 존재할 대, innerPageMap Update 필요
  //                 const { referencedPageIDs } = innerPageInfo;
  //                 if (referencedPageIDs) {
  //                     // referencedPageIDs가 존재한다면, 해당 page의 innerPageLayout 속성을 undefined로 변경한 뒤, map 구조 반영
  //                     referencedPageIDs.forEach(pageID => {
  //                         const innerPage = ctx.pageContainer.getInnerPageMap().get(pageID)?.innerPageLayout;
  //                         if (isDefined(innerPage)) {
  //                             const innerPageProps: IInnerPageLayoutWidgetProperties = innerPage.getProperties();
  //                             const newInnerPageProps: IInnerPageLayoutWidgetProperties = {
  //                                 ...innerPageProps,
  //                                 content: {
  //                                     ...innerPageProps.content,
  //                                     pageID: {
  //                                         ...innerPageProps.content.pageID,
  //                                         value: '',
  //                                     },
  //                                 },
  //                             };
  //                             const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
  //                                 ctx,
  //                                 CommandEnum.WIDGET_UPDATE_PROPERTIES,
  //                                 pageID,
  //                                 innerPage,
  //                                 newInnerPageProps
  //                             );
  //                             ctx.command?.append(updateInnerPageMapCommand);
  //                         }
  //                     });
  //                 }
  //                 // 해당 page의 key를 InnerPageMap에서 delete 하는 command 수행.
  //                 const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
  //                     ctx,
  //                     CommandEnum.DELETE_PAGE,
  //                     widgetModel.getID()
  //                 );
  //                 ctx.command?.append(updateInnerPageMapCommand);
  //             }
  //         } else if (widgetModel.getWidgetType() === 'InnerPageLayout') {
  //             // 잘라내는 대상이 InnerPageLayout인 경우
  //             // TODO: InnerPageLayout 삭제시 처리 로직과 동일하므로 추후 재사용 가능하도록 변경
  //             const editingPageID = ctx.selectionContainer?.getEditingPage()?.getID();
  //             if (isDefined(editingPageID)) {
  //                 const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
  //                     ctx,
  //                     CommandEnum.DELETE_WIDGET,
  //                     editingPageID,
  //                     widgetModel
  //                 );
  //                 ctx.command?.append(updateInnerPageMapCommand);
  //             }
  //         } // TODO : Layout 내에 존재하는 InnerPageLayout 잘라내기, 붙여넣기 로직은 추후 Layout 내부 widget 붙여넣기가 추가 된 후 반영 예정.

  //         const parentModel = widgetModel.getParent();

  //         if (isUndefined(parentModel)) {
  //             dError(`Clipboard: Widget ${widgetModel.getName()}에 부모가 없음. Cut 불가!`);
  //             return;
  //         }

  //         // 비즈니스 로직 삭제 커맨드 이전 Business Argument Binding 정보 Container에 복사 및 삭제
  //         const businessArgumentVariableDataMap = ctx.dataBindingContainer.getBusinessArgumentVariableDataMap();
  //         // Clipboard Container에 바인딩 정보 복사
  //         this.copyBusinessLogicArgumentBindingInfo(ctx, widgetModel, widgetModel, businessArgumentVariableDataMap);

  //         const removeWidgetCommand = new RemoveWidgetCommand(widgetModel, parentModel);
  //         ctx.command?.append(removeWidgetCommand);
  //         removableWidgets.push({ widgetModel, siblingIndex: widgetModel.getSiblingIndex() });
  //     });

  //     removableWidgets.sort((widgetModelIndex1, widgetModelIndex2) => {
  //         return (
  //             widgetModelIndex1.widgetModel.getProperties().style.x.absolute -
  //             widgetModelIndex2.widgetModel.getProperties().style.x.absolute
  //         );
  //     });
  //     ctx.clipboardContainer.setLocalWidgetModels(removableWidgets);
  // }

  /**
   * 붙여넣기 동작 수행.
   */
  private performPasteProcess(ctx: AkronContext) {
    const selectionContainer = ctx.getSelectionContainer();
    const clipboardContainer = ctx.getClipboardContainer();
    const command = ctx.getCommand();
    const appWidgetModel = ctx.getAppModel();
    const commandProps = ctx.getCommandProps();
    if (!selectionContainer || !command || !commandProps) {
      return;
    }

    let parentWidgetModel: Nullable<WidgetModel>;
    let isParentContainer = false;

    const selectedWidgets = selectionContainer.getSelectedWidgets();
    const firstSelectedWidgets = selectedWidgets[0];

    const localWidgetModelIndexInfos = clipboardContainer.getLocalWidgetModels();
    const firstLocalWidgetModelIndexInfo = localWidgetModelIndexInfos[0];

    const isPageCopied = checkPageModel(firstLocalWidgetModelIndexInfo.widgetModel);
    const copiedPageID: number[] = [];
    // 복사된 개체가 Page일 경우, AppWidgetModel 하위에 붙여넣기 수행
    if (isPageCopied) {
      clipboardContainer.getLocalWidgetModels().forEach(pageWidgetModel => {
        copiedPageID.push(pageWidgetModel.widgetModel.getID());
      });
      parentWidgetModel = appWidgetModel;
    } else if (
      selectedWidgets.length === 1 &&
      clipboardContainer.getLocalWidgetModels().every(widgetModelIndex => {
        const { widgetModel } = widgetModelIndex;
        return checkInsertableItem(firstSelectedWidgets, widgetModel);
      })
    ) {
      [parentWidgetModel] = selectedWidgets;

      if (isDefined(parentWidgetModel) /* && checkConditionalLayout(parentWidgetModel) */) {
        const fragmentLayoutModels = parentWidgetModel.mapChild(childWidgetModel => childWidgetModel);
        const renderedChildIndex = parentWidgetModel.getProperties().content.flag.value ? 0 : 1;
        parentWidgetModel = fragmentLayoutModels[renderedChildIndex];
      }

      isParentContainer = true;
    } else if (
      clipboardContainer.getLocalWidgetModels().some(widgetModelIndex => {
        const { widgetModel } = widgetModelIndex;
        return basicChildWidgetTypeNamesSet.has(widgetModel.getWidgetType());
      })
    ) {
      // 어디에도 붙여넣을 수 없는 컴포넌트가 존재함. 어떤 동작을 할진 추후 UX가이드에 따름.
      dError('Clipboard: 선택중인 컴포넌트 또는 페이지에 삽입될 수 없는 컴포넌트가 있음. Paste 불가!');
      return;
    } else {
      parentWidgetModel = selectionContainer.getEditingPage();
    }

    if (!parentWidgetModel) {
      dError('Clipboard: 선택한 page가 없음. Paste 불가!');
      return;
    }

    // 다중선택의 경우 widget이 아직 widget tree에 삽입되지 않아서 이후 widget position 찾는 로직에서 누락됨
    // widget tree에는 없지만 삽입될 widget의 position 임시로 저장
    const insertingPositionSet = new Set<string>();

    const newWidgetModels = Array<WidgetModelIndexInfo>();
    clipboardContainer.getLocalWidgetModels().forEach(widgetModelIndex => {
      const { widgetModel } = widgetModelIndex;
      // 다중 붙여넣기를 위한 clone 작업
      const newWidgetModel = widgetModel.cloneNode(ctx.getIdContainerController());
      const newWidgetStyle = newWidgetModel.getProperties().style;

      // 붙여넣기 시, InnerPage 관련 로직
      if (checkPageModel(newWidgetModel)) {
        // 붙여넣기 대상이 Page 인 경우, 해당 Page가 innerPageLayout을 가지고 있을 때,
        // 잘라낸 page라면 map으로 확인 불가함. 따라서, child 돌면서 확인 해야함.
        newWidgetModel.forEachChild(widget => {
          //   if (widget.getWidgetType() === 'InnerPageLayout') {
          //     // InnerPageLayout이 있을 경우
          //     this.updateInnerPageMapWhenPagePasted(ctx, newWidgetModel, widget);
          //   }
          //   if (widget.getWidgetType() === 'LayoutHorizontalFrame' || widget.getWidgetType() === 'LayoutVerticalFrame') {
          //     widget.forEachChild(child => {
          //       if (child.getWidgetType() === 'InnerPageLayout') {
          //         // InnerPageLayout이 있을 경우
          //         this.updateInnerPageMapWhenPagePasted(ctx, newWidgetModel, child);
          //       }
          //     });
          //   }
        });
      }

      // 붙여넣기 대상이 InnerPageLayout인 경우, 붙여넣을 수 있는지 확인이 필요.
      // 붙여넣기 불가하다면 return.
      // forEach 내부에서 return으로 break 불가하여, try...catch를 사용하여 forEach 루프 종료함.
      try {
        if (!parentWidgetModel) {
          throw new Error('parentWidgetModel is undefined');
        }
        // if (widgetModel.getWidgetType() === 'InnerPageLayout') {
        //   const editingPage = selectionContainer.getEditingPage();
        //   if (isDefined(editingPage)) {
        //     // 현재 편집중인 Page에 InnerPageLayout이 있을 경우 추가 불가. InnerPageLayout은 한 Page 내 1개만 추가 가능함.
        //     editingPage.forEachChild(widget => {
        //       if (widget.getWidgetType() === 'InnerPageLayout') {
        //         throw new Error('InnerPageLayout은 Page 내 1개만 추가 가능함. \n InnerPageLayout 붙여넣기 실패');
        //       }
        //       if (
        //         // Layout Widget 내부의 InnerPage 존재할 경우
        //         widget.getWidgetType() === 'LayoutHorizontalFrame' ||
        //         widget.getWidgetType() === 'LayoutVerticalFrame'
        //       ) {
        //         widget.forEachChild(child => {
        //           if (child.getWidgetType() === 'InnerPageLayout') {
        //             throw new Error('InnerPageLayout은 Page 내 1개만 추가 가능함. \n InnerPageLayout 붙여넣기 실패');
        //           }
        //         });
        //       }
        //     });

        //     const innerPageID = widgetModel.getProperties().content.pageID?.value;
        //     if (isDefined(innerPageID) && innerPageID !== '') {
        //       // 붙여넣은 InnerPageLayout의 pageID가 null 값이 아닌 경우
        //       const innerPageModel = findPageModelByID(ctx.getAppModel(), Number(innerPageID));
        //       if (isDefined(innerPageModel)) {
        //         const innerPageLevel = innerPageModel.getProperties().pageLevel;
        //         const editingPageLevel = (editingPage.getComponentSpecificProperties() as IPageComponentProperties)
        //           .pageLevel;
        //         // 붙여넣을 InnerPageLayout에 들어가있는 pageID의 pageLevel이 현재 편집 중인 Page의 level보다 1 높아야 추가 가능.
        //         if (Number(editingPageLevel) + 1 !== Number(innerPageLevel)) {
        //           throw new Error('붙여넣기 불가능한 InnerPageLayout이 존재함. \n InnerPageLayout 붙여넣기 실패');
        //         } else {
        //           const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
        //             ctx,
        //             CommandEnum.CLIPBOARD_PASTE_PROCESS,
        //             editingPage.getID(),
        //             widgetModel
        //           );
        //           command.append(updateInnerPageMapCommand);
        //         }
        //       }
        //     }
        //   }
        // }
      } catch (e) {
        dWarn(e);
        return;
      }

      dLog(`Clipboard: Pasting ${newWidgetModel.getName()} on ${parentWidgetModel.getName()}...`);

      if (isParentContainer || isPageCopied) {
        newWidgetModel.setProperties({
          ...newWidgetModel.getProperties(),
          style: {
            ...newWidgetModel.getProperties().style,
            x: {
              value: 0,
              defaultValue: 0,
              variableId: 0,
            },
            y: {
              value: 0,
              defaultValue: 0,
              variableId: 0,
            },
            frameType: parentWidgetModel.getProperties().style.frameType,
            left: {
              value: 0,
              defaultValue: 0,
              variableId: 0,
            },
            top: {
              value: 0,
              defaultValue: 0,
              variableId: 0,
            },
            right: {
              value:
                parentWidgetModel.getProperties().style.width.value - newWidgetModel.getProperties().style.width.value,
              defaultValue:
                ((parentWidgetModel.getProperties().style.width.value -
                  newWidgetModel.getProperties().style.width.value) /
                  parentWidgetModel.getProperties().style.width.value) *
                100,
              variableId: 0,
            },
            bottom: {
              value:
                parentWidgetModel.getProperties().style.height.value -
                newWidgetModel.getProperties().style.height.value,
              defaultValue:
                ((parentWidgetModel.getProperties().style.height.value -
                  newWidgetModel.getProperties().style.height.value) /
                  parentWidgetModel.getProperties().style.height.value) *
                100,
              variableId: 0,
            },
          },
        });
      } else {
        const originWidgetStyle = widgetModel.getProperties().style;
        const { x: newX, y: newY } = findInsertPosition(
          newWidgetModel,
          ctx,
          {
            x: originWidgetStyle.x.value,
            y: originWidgetStyle.y.value,
          },
          insertingPositionSet
        );
        insertingPositionSet.add(
          `${newX.toString()}/${newY.toString()}/${newWidgetStyle.width.value.toString()}/${newWidgetStyle.height.value.toString()}`
        );
        // 복사할 때와 붙여넣을 때 parent width가 다른 경우 다른 위치에 붙여넣어지는 이슈로 인한 처리
        // 붙여넣는 위치가 같은 경우 화면상으로 같은 위치에 붙여넣어지도록 반응형 계산하지 않음
        if (originWidgetStyle.x.value === newX) {
          newWidgetModel.setProperties({
            ...newWidgetModel.getProperties(),
            style: {
              ...newWidgetModel.getProperties().style,
            },
          });
        } else {
          newWidgetModel.setProperties({
            ...newWidgetModel.getProperties(),
            style: {
              ...newWidgetModel.getProperties().style,
            },
          });
        }
      }

      // DataStore의 reference 동기화 작업.
      //   syncAddDataStoreReference(newWidgetModel, ctx.dataStore, ctx.command);

      newWidgetModels.push({ widgetModel: newWidgetModel, siblingIndex: widgetModelIndex.siblingIndex });
    });

    const selectedPageID = selectionContainer
      .getSelectedPages()
      [selectionContainer.getSelectedPages().length - 1].getID();

    if (isPageCopied) {
      const selectionPropObj: SelectionProp = {
        selectionType: SelectionEnum.WIDGET,
        widgetModels: newWidgetModels.map(widgetModelIndex => widgetModelIndex.widgetModel),
        editingPageModel: newWidgetModels[0].widgetModel as PageModel,
        thumbnailModels: newWidgetModels.map(widgetModelIndex => widgetModelIndex.widgetModel),
      };
      commandProps.selectionProp = selectionPropObj;
    } else if (newWidgetModels.length === 0) {
      // 붙여넣기 전체 실패의 경우, 이전에 선택된 Page로 selection 반영
      const selectionPropObj: SelectionProp = {
        selectionType: SelectionEnum.WIDGET,
        widgetModels: selectionContainer.getSelectedPages(),
      };
      commandProps.selectionProp = selectionPropObj;
    } else {
      const selectionPropObj: SelectionProp = {
        selectionType: SelectionEnum.WIDGET,
        widgetModels: newWidgetModels.map(widgetModelIndex => widgetModelIndex.widgetModel),
      };
      commandProps.selectionProp = selectionPropObj;
    }

    let preWidgetModel: WidgetModel | undefined;
    newWidgetModels
      .sort((widgetModelIndex1, widgetModelIndex2) => {
        return widgetModelIndex2.siblingIndex - widgetModelIndex1.siblingIndex;
      })
      .forEach(widgetModelIndex => {
        // 이 시점에서는 아직 Widget tree에 삽입되지 않아서 다중선택인 경우 AppendWidgetCommand에서 다 같은 node가 sibling으로 지정되는 이슈(DB에 하나만 추가됨)
        // 이전 WidgetModel을 sibling으로 설정함
        if (!parentWidgetModel) {
          return;
        }

        const appendWidgetCommand = new AppendWidgetRecursiveCommand(
          ctx,
          widgetModelIndex.widgetModel,
          parentWidgetModel,
          preWidgetModel
        );
        preWidgetModel = widgetModelIndex.widgetModel;

        command.append(appendWidgetCommand);
      });
    newWidgetModels.forEach(widgetModelIndex => {
      const newWidgetModel = widgetModelIndex.widgetModel;

      // paste business logic
      //   pasteBusinessLogicRecursive(ctx, newWidgetModel);
    });

    // Page가 복사 된 경우, 현재 선택된 페이지들 맨 뒤 위치로 이동시킴
    if (isPageCopied) {
      const pageList: WidgetModel<IWidgetCommonProperties>[] = getPageList(ctx.getAppModel());
      const pageNameList: string[] = pageList.map(pageModel => pageModel.getName());
      const isSameElementID = (widgetModel: WidgetModel) => selectedPageID === widgetModel.getID();
      const copiedPageIndex = Array.prototype.findIndex.call(pageList, isSameElementID);
      const nextPageModel = copiedPageIndex + 1 >= pageList.length ? undefined : pageList[copiedPageIndex + 1];

      const appProp = ctx.getAppModel().getProperties();

      copiedPageID.forEach((pageID, idx) => {
        if (isDefined(newWidgetModels)) {
          const pageName = this.getDuplicatedPageName(
            pageNameList,
            newWidgetModels[copiedPageID.length - idx - 1].widgetModel.getName(),
            newWidgetModels[copiedPageID.length - idx - 1].widgetModel.getName(),
            0
          );
          const renameWidgetCommand = new RenameWidgetCommand(
            newWidgetModels[copiedPageID.length - idx - 1].widgetModel,
            pageName
          );
          command.append(renameWidgetCommand);
          const moveWidgetCommand = new MoveWidgetCommand(
            newWidgetModels[copiedPageID.length - idx - 1].widgetModel,
            ctx.getAppModel(),
            ctx.getAppModel(),
            nextPageModel
          );
          command.append(moveWidgetCommand);
        }
      });
    }
  }

  //   /**
  //    * Page 붙여넣기 시, InnerPage 관련 업데이트를 위한 로직입니다.
  //    * 붙여넣을 Page 내 innerPageLayout이 존재하는지 확인한 후, 해당 값에 들어가는 innerPage가 실제로 존재하는지 체크 하여,
  //    * innerPageLayout의 props 및 innerPageMap을 update합니다.
  //    */
  //   private updateInnerPageMapWhenPagePasted(
  //     ctx: AkronContext,
  //     newPageModel: WidgetModel,
  //     innerPageLayoutModel: WidgetModel
  //   ) {
  //     const innerPageID = innerPageLayoutModel.getProperties().content.pageID?.value;
  //     if (isDefined(innerPageID) && innerPageID !== '') {
  //       // InnerPageID가 공백이 아닐 경우, 해당 Page가 존재하는지 찾음
  //       const innerPage = findPageModelByID(ctx.getAppModel(), Number(innerPageID));
  //       if (isUndefined(innerPage)) {
  //         // innerPage가 붙여넣기 전 삭제되어서 존재하지 않을 경우
  //         // innerPageLayout의 pageID props undefined로 update 해야함
  //         const innerPageProps: IWidgetCommonProperties = innerPageLayoutModel.getProperties();
  //         const newInnerPageProps: IWidgetCommonProperties = {
  //           ...innerPageProps,
  //           content: {
  //             ...innerPageProps.content,
  //             pageID: { ...innerPageProps.content.pageID, value: '' },
  //           },
  //         };
  //         const updateWidgetCommand = new UpdateWidgetCommand(innerPageLayoutModel, {
  //           ...newInnerPageProps,
  //         });
  //         ctx.getCommand()?.append(updateWidgetCommand);
  //       } else {
  //         // 붙여넣을 newWidgetModel ID와 innerPageLayoutModel을 Map에 추가
  //         const updateInnerPageMapCommand = new UpdateInnerPageMapCommand(
  //           ctx,
  //           CommandEnum.CLIPBOARD_PASTE_PROCESS,
  //           newPageModel.getID(),
  //           innerPageLayoutModel
  //         );
  //         ctx.getCommand()?.append(updateInnerPageMapCommand);
  //       }
  //     }
  //   }

  /**
   * 페이지 복사 시, 페이지 이름 계산
   */
  private getDuplicatedPageName(
    pageNameList: string[],
    originPageName: string,
    pageName: string,
    pageNameNumber: number
  ): string {
    if (pageNameList.includes(pageName)) {
      return this.getDuplicatedPageName(
        pageNameList,
        originPageName,
        `${originPageName} (${(pageNameNumber + 1).toString()})`,
        pageNameNumber + 1
      );
    }
    return pageName;
  }
}

export default ClipboardCommandHandler;
