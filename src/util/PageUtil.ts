import { Nullable, AppStore, isDefined, IWidgetCommonProperties, isUndefined } from '@akron/runner';
import { THUMBNAIL_WIDTH } from 'components/toolpane/PageThumbnailComponent';
import AppModel from 'models/node/AppModel';
import PageModel from 'models/node/PageModel';
import WidgetModel from 'models/node/WidgetModel';
import AppRepository, { LibraryType } from 'models/repository/AppRepository';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { InsertWidgetAtCommandProps } from 'models/store/command/handler/WidgetEditCommandHandler';
import { AnyWidgetType, InsertableWidgetType } from 'models/store/command/widget/WidgetModelTypes';
import AppModeContainer from 'models/store/container/AppModeContainer';
import { PageSection } from 'models/widget/WidgetPropTypes';
import { isEditWidgetMode } from 'util/AppModeUtil';
import { checkPageModel } from 'util/WidgetUtil';

/**
 * 페이지 리스트 드래깅 시, 실제 렌더된 돔트리에 접근하기 위해 id를 부여하는 함수
 */
export function getThumbnailDomID(pageWidgetModel: WidgetModel): string {
  const id = pageWidgetModel.getID();
  return id ? id.toString() : '';
}

/**
 * 페이지 구역 드래깅 시, 실제 렌더된 돔트리에 접근하기 위해 id를 부여하는 함수
 */
// export function getSectionDomID(pageSection: PageSection): string {
//    const id = pageSection.id;
//    return id ? id.toString() : '';
// }

/**
 * 페이지 리스트에서 PageThumbnailImgComponent에 접근하기 위한 ClassName을 부여하는 함수
 */
export function getPageThumbnailImgDomClassName(pageWidgetModel: WidgetModel): string {
  return `SuperUX-Page-Thumbnail-Img-${pageWidgetModel.getID()}`;
}

/**
 * PageViewOnlyComponent에서 transform의 scale을 설정할 때 쓰이는 함수입니다.
 */
export function getPageViewOnlyScale(pageWidgetModel: WidgetModel): number {
  const pageWidth = pageWidgetModel.getProperties().style.width;
  return THUMBNAIL_WIDTH / pageWidth.value;
}

/**
 * root model 하위의 Page model들을 array로 반환하는 함수입니다.
 */
export function getPageList(appModel: AppModel): PageModel[] {
  const pageList: PageModel[] = [];
  appModel.forEachChild(workArea => {
    const page = workArea.getFirstChild();
    if (isDefined(page)) {
      pageList.push(page as PageModel);
    }
  });

  return pageList;
}

/**
 * html element을 이용하여 Page WidgetModel을 반환하는 함수
 * 드래그 후의 html dom tree는 widgetmodel tree와 상이하고 이를 동기화 시키기 위해 접근이 필요함
 */
export function getPageModelByHTML(
  appWidgetModel: WidgetModel<IWidgetCommonProperties>,
  html?: Element
): Nullable<WidgetModel<IWidgetCommonProperties>> {
  if (!html) {
    return undefined;
  }

  const splitList = html.id.split('-');
  const htmlID = Number(splitList[splitList.length - 1]);
  const pageList = getPageList(appWidgetModel);

  let targetPage;
  pageList.forEach(page => {
    if (page.getID() === htmlID) {
      targetPage = page;
    }
  });

  return targetPage;
}

/**
 * html element을 이용하여 PageSectionIdx를 반환하는 함수
 * 드래그 후의 html dom tree는 widgetmodel tree와 상이하고 이를 동기화 시키기 위해 접근이 필요함
 */
export function getSectionIndexByHTML(
  appWidgetModel: WidgetModel<IWidgetCommonProperties>,
  html?: Element
): Nullable<number> {
  if (!html) {
    return undefined;
  }

  const splitList = html.id.split('-');
  const htmlID = Number(splitList[splitList.length - 1]);
  const { sectionList } = appWidgetModel.getProperties().content;

  let sectionIndex;
  sectionList?.value?.forEach((section: PageSection, idx: number) => {
    if (section.id === htmlID) {
      sectionIndex = idx;
    }
  });

  return sectionIndex;
}

/**
 * pageIdx와 pageCount array를 파라미터로 page가 속한 구역 index를 반환하는 함수입니다.
 *
 * @param sectionArr section 별 pageCount 값들을 리스트로 표현한 값 입니다.
 * @param pageIdx page 인덱스 입니다. 해당 index를 이용하여 페이지가 어느 구역에 속한지 계산 합니다.
 * @returns pageIdx와 pageCount array를 파라미터로 page가 속한 구역 index를 반환합니다.
 */
export function getSectionIdxByPageIdx(sectionArr: Nullable<Array<number>>, pageIdx: number): number {
  let sectionIdx = 0;
  let accumPageIdx = 0;
  sectionArr?.forEach((count, idx) => {
    if (accumPageIdx <= pageIdx && pageIdx < accumPageIdx + count) {
      sectionIdx = idx;
    }
    accumPageIdx += count;
  });

  return sectionIdx;
}

/**
 * Section의 첫 페이지 인덱스를 반환하는 함수입니다.
 */
export function getFirstPageOfSection(sectionArr: Nullable<Array<number>>, sectionIdx: number) {
  let accumPageIdx = 0;
  sectionArr?.forEach((count, idx) => {
    if (idx < sectionIdx) {
      accumPageIdx += count;
    }
  });
  return accumPageIdx;
}

/**
 * page에 component를 drop헀을 때 삽입되는 함수입니다.
 * mode에 따라 Composite, Dialog 등에서도 사용됩니다.
 */
// export async function pageHandleDrop(e: React.DragEvent<HTMLDivElement>, appStore: AppStore) {
//   e.preventDefault();
//   const widgetID = Number(e.dataTransfer.getData('widgetID'));
//   const widgetType = e.dataTransfer.getData('widgetType');
//   const posX = e.pageX - e.currentTarget.getBoundingClientRect().x;
//   const posY = e.pageY - e.currentTarget.getBoundingClientRect().y;
//   let propsContent: Partial<IWidgetCommonProperties['content']> = {};
//   let propsStyle: Partial<IWidgetCommonProperties['style']> = {};
//   let gxPageID: number = -1;
//   let primaryComponent: WidgetModel | undefined;
//   let targetAppID: number = -1;
//   //   let dataStoreObj: DataStoreInfo | undefined;

//   //   const metadataContainer = appStore.getMetaDataContainer();

//   // TODO: 'ComponentPage' type은 실제로 존재하지 않는 임시 코드로 제거 필요
//   //   if (!(getInsertableWidgetTypeNames().includes(widgetType) || widgetType === 'ComponentPage')) {
//   //     return;
//   //   }

//   if (widgetType === 'BasicIcon') {
//     propsContent = {

//     };
//     propsStyle = {
//       width: {
//         absolute: Number(e.dataTransfer.getData('size')),
//         relative: 5,
//         unit: 'px',
//         type: 'absolute',
//       },
//       height: {
//         absolute: Number(e.dataTransfer.getData('size')),
//         relative: 5,
//         unit: 'px',
//         type: 'absolute',
//       },
//       color: e.dataTransfer.getData('color'),
//     };
//   } else if (widgetType === 'BasicImageGallery') {
//     const fileList = await openFileDialog('image/*', true);
//     const editorUIStore = appStore.getEditorUIStore();

//     if (!checkFilesSizes(editorUIStore, fileList, 'image')) {
//       return;
//     }

//     const appID = appStore.getAppModel().getID();
//     const userID = 0;

//     const results = await AppRepository.uploadFile({
//       appID,
//       userID,
//       fileList,
//     });

//     const urls = results.map(result => result.fileName);
//     const contetTyes = results.map(result => result.contentType);
//     propsContent = {
//       src: { value: JSON.stringify(urls), locked: true },
//       contentType: { value: JSON.stringify(contetTyes), locked: true },
//     };
//   } else if (widgetType === 'ComponentPage') {
//     const notInsertedComponentList: Set<number> = new Set<number>();
//     const resourceList: Set<string> = new Set<string>();

//     const primaryComponentID = Number(e.dataTransfer.getData('primaryComponentID'));
//     targetAppID = Number(e.dataTransfer.getData('targetAppID'));
//     gxPageID = Number(e.dataTransfer.getData('gxPageID'));

//     const libraryInfoMap = appStore.getRegisteredLibraryInfoMap();

//     // TODO: 프로젝트 별로 구분.
//     const libraryType: LibraryType = 'GXComponent';
//     const libraryInfo = libraryInfoMap[libraryType].get(targetAppID) ?? appStore.getPresetLibraryInfo();
//     if (!libraryInfo) {
//       return;
//     }

//     const targetAppWidgetModel = libraryInfo.appWidgetModel;
//     primaryComponent = appStore.findWidgetModelByID(Number(primaryComponentID), targetAppWidgetModel);
//     if (primaryComponent) {
//       findUsedComponentResources(primaryComponent, resourceList);
//       await copyComponentResources(appStore.getAppID(), targetAppID, resourceList);
//       findUsedBaseComponentTypes(primaryComponent, metadataContainer, notInsertedComponentList);
//       await importComponentsDependencies(notInsertedComponentList);
//       await insertComponentsToWidgetComponentFactory(notInsertedComponentList);

//       // clone 전 수행, 발행된 library의 Custom Props/State 삽입
//       if (primaryComponent) {
//         dataStoreObj = await loadPublishedDataStoreObject(gxPageID, widgetID, targetAppID, appStore, primaryComponent);
//       }
//     }
//   }

//   if (
//     isDefined(ComponentTypeToIDMap.get(widgetType as AnyWidgetType)) &&
//     isUndefined(getWidgetComponent(widgetType as AnyWidgetType))
//   ) {
//     const defaultWidgetModel = appStore.getMetaDataContainer().getDefaultWidgetModelMap().get(widgetType);

//     if (isDefined(defaultWidgetModel)) {
//       const notInsertedComponentList: Set<number> = new Set<number>();

//       findUsedBaseComponentTypes(defaultWidgetModel, metadataContainer, notInsertedComponentList);
//       await importComponentsDependencies(notInsertedComponentList);
//       await insertComponentsToWidgetComponentFactory(notInsertedComponentList);
//     }
//   }

//   const props: InsertWidgetAtCommandProps = {
//     commandID: CommandEnum.INSERT_WIDGET_AT,
//     widgetType: widgetType as InsertableWidgetType,
//     widgetID,
//     posX,
//     posY,
//     initializeProperties: defaultProperties => {
//       const tempContent: WidgetContent = {
//         className: {
//           value: '',
//           locked: true,
//         },
//       };

//       Object.keys(defaultProperties.content).forEach(key => {
//         const contentValues = defaultProperties.content[key];
//         tempContent[key] = {
//           locked: contentValues.locked,
//           value: contentValues.value,
//         } as WidgetContentValue;
//       });

//       Object.keys(propsContent).forEach(key => {
//         const contentValues = propsContent[key];
//         if (contentValues !== undefined) {
//           tempContent[key] = {
//             locked: contentValues.locked,
//             value: contentValues.value,
//           } as WidgetContentValue;
//         }
//       });

//       return {
//         ...defaultProperties,
//         content: {
//           ...defaultProperties.content,
//           ...tempContent,
//         },
//         style: {
//           ...defaultProperties.style,
//           ...propsStyle,
//         },
//       };
//     },
//     cloneWidget: primaryComponent,
//   };
//   appStore.handleCommandEvent(props);

//   // clone 이후 수행
//   if (isDefined(dataStoreObj)) {
//     insertPublishDataStoreInfo(appStore, dataStoreObj.dataStoreObject, dataStoreObj.customPropVariableMaps);
//   }

//   if (widgetType === 'ComponentPage') {
//     const insertedWidgetModel = appStore.findWidgetModelByID(widgetID);
//     registerFileFromPGX(insertedWidgetModel, primaryComponent, Number(targetAppID), appStore.getAppID());
//   }
// }

/**
 * page name 존재여부 확인.
 */
export function pageNameExist(appWidgetModel: WidgetModel, pageName: string) {
  for (let page = appWidgetModel.getFirstChild(); isDefined(page); page = page.getNextSibling()) {
    if (page.getName() === pageName) {
      return true;
    }
  }
  return false;
}

/**
 * 해당 WidgetMdoel들 중 삭제 가능한 PageModel들을 찾아 배열 형태로 반환
 * PageModel이 아닌 WidgetModel이 포함되어 있거나 삭제 불가능한 상태인 경우 빈 배열 반환
 */
export function getDeletablePageModels(
  widgetModels: WidgetModel[],
  appWidgetModel: WidgetModel,
  appModeContainer: AppModeContainer
): WidgetModel[] {
  if (widgetModels.some(widgetModel => !checkPageModel(widgetModel))) {
    return [];
  }

  if (isEditWidgetMode(appModeContainer)) {
    return [];
  }

  const firstPageModel = appWidgetModel.getFirstChild();
  const firstPageEmpty =
    isUndefined(firstPageModel) || (appWidgetModel.getChildCount() === 1 && firstPageModel.getChildCount() === 0);
  if (firstPageEmpty) {
    return [];
  }

  const deletablePageModels = widgetModels.filter(
    widgetModel => widgetModel.getProperties().content.locked.value === false
  );

  return deletablePageModels;
}

/**
 * 해당 WidgetMdoel들이 모두 삭제 가능한 상태의 PageModel인지 확인하는 함수
 * PageModel이 아닌 WidgetModel이 포함되어 있거나 삭제 불가능한 경우 false 반환
 */
export function isPagesDeletable(
  widgetModels: WidgetModel[],
  appWidgetModel: WidgetModel,
  appModeContainer: AppModeContainer
): boolean {
  return getDeletablePageModels(widgetModels, appWidgetModel, appModeContainer).length > 0;
}
