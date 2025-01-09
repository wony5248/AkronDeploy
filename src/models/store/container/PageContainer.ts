import { isDefined, dError, dLog } from '@akron/runner';
import { action, makeObservable } from 'mobx';
import WidgetModel, { WidgetID } from 'models/node/WidgetModel';

/**
 * InnerPage 관계 정보.
 */
export interface InnerPageInfo {
  referencedPageIDs: Array<WidgetID>; // 해당 page를 innerPage로 가지는 pageID 배열
  innerPageLayout?: Readonly<WidgetModel>; // 해당 page가 가지고 있는 innerPageLayout Model
}

/**
 * Page에 관련된 정보들의 모음입니다.
 */
export default class PageContainer {
  /**
   * Runtime Preview 모드 실행 시, 애뮬레이팅 시작 페이지 ID 저장.
   */
  private startPageID: number;

  /**
   * Runtime Preview 모드 실행 시, 애뮬레이팅 시작 페이지 URL 저장.
   */
  private startPageURL: string;

  /**
   * innerPage 관계 정보를 가지는 Map
   * key: 각 Page의 ID
   * value: InnerPageInfo
   * - referencedPageIDs: 해당 Page를 innerPage로 가지는 parentPageID 배열
   * - innerPageLayout: 해당 Page가 가지고 있는 innerPageLayout Model (innerPageLayout은 한 Page 내 한 개만 존재 가능)
   */
  private innerPageMap = new Map<WidgetID, InnerPageInfo>();

  /**
   * 생성자.
   */
  constructor(args: { startPageID: number; startPageURL: string }) {
    makeObservable(this);
    this.startPageID = args.startPageID;
    this.startPageURL = args.startPageURL;
  }

  /**
   * 런타임 관련 모드에서 시작 시점의 페이지 ID 값을 가져옴.
   */
  getStartPageID() {
    return this.startPageID;
  }

  /**
   * 런타임 관련 모드에서 시작 시점의 페이지 URL값을 가져옴.
   */
  getStartPageURL() {
    return this.startPageURL;
  }

  /**
   * innerPageMap set.
   */
  @action
  setInnerPageMap(innerPageMap: Map<WidgetID, InnerPageInfo>) {
    this.innerPageMap = innerPageMap;
  }

  /**
   * InnerPage 관계 정보를 가지는 Map을 가져옴.
   */
  getInnerPageMap() {
    return this.innerPageMap;
  }

  /**
   * InnerPageMap에 새로운 PageID를 Key로 추가함.
   */
  addKeytoInnerPageMap(newPage: WidgetID) {
    const newInnerPageInfo: InnerPageInfo = {
      referencedPageIDs: [],
      innerPageLayout: undefined,
    };
    this.innerPageMap.set(newPage, newInnerPageInfo);
  }

  /**
   * InnerPageMap에 value를 추가
   *
   * @param editingPageID 편집 중인 PageID. key로 사용됨.
   * @param innerPageLayout 추가할 innerPageLayout
   */
  addValuetoInnerPageMap(editingPageID: WidgetID, innerPageLayout: Readonly<WidgetModel>) {
    // page가 Map에 아직 등록되어있지 않다면 새로운 key 추가
    if (!this.innerPageMap.has(editingPageID)) {
      this.addKeytoInnerPageMap(editingPageID);
    }

    // editingPage를 key 값으로 찾아 innerPageLayout을 set
    const editingPageInnerPageInfo = this.innerPageMap.get(editingPageID);
    if (isDefined(editingPageInnerPageInfo)) {
      const newInfo: InnerPageInfo = {
        referencedPageIDs: editingPageInnerPageInfo.referencedPageIDs,
        innerPageLayout,
      };
      this.innerPageMap.set(editingPageID, newInfo);
    }

    // innerPageLayout에 사용되는 page를 key로 찾아 referencedPageIDs set.
    const innerPageID = Number(innerPageLayout.getProperties().content.pageID.value);
    if (!this.innerPageMap.has(innerPageID)) {
      // 해당 page가 Map에 등록되어있지 않다면 새로운 key 추가
      this.addKeytoInnerPageMap(innerPageID);
    }

    const innerPageInfo = this.innerPageMap.get(innerPageID);
    if (isDefined(innerPageInfo)) {
      innerPageInfo.referencedPageIDs.push(editingPageID);
      const newInfo: InnerPageInfo = {
        referencedPageIDs: innerPageInfo.referencedPageIDs,
        innerPageLayout: innerPageInfo.innerPageLayout,
      };

      this.innerPageMap.set(innerPageID, newInfo);
    }
  }

  /**
   * InnerPageMap에서 innerPageID와 관련 관계를 삭제함.
   *
   * @param editingPageID innerPageLayout을 삭제할 editingPageID
   * @param deleteKey Key를 삭제 중인지 여부
   */
  deleteValuefromInnerPageMap(editingPageID: WidgetID, deleteKey?: boolean) {
    // 현재 편집 중인 PageID를 Map에서 찾아 innerPageLayout을 undefined로 지정.
    const editingPageInnerPageInfo = this.innerPageMap.get(editingPageID);
    const targetInnerPageID = editingPageInnerPageInfo?.innerPageLayout?.getProperties().content.pageID?.value;
    if (isDefined(editingPageInnerPageInfo)) {
      const updateInfo: InnerPageInfo = {
        referencedPageIDs: editingPageInnerPageInfo.referencedPageIDs,
        innerPageLayout: undefined,
      };
      this.innerPageMap.set(editingPageID, updateInfo);
    } else {
      dError('editiningPage의 InnerPageInfo가 존재하지 않습니다.');
      return;
    }

    if (deleteKey) {
      return;
    } // key를 delete할 경우 별도로 innerPageInfo를 update할 필요 없음.

    // 삭제되는 innerPageLayout가 가지는 pageID 정보를 찾아 해당 pageInfo도 update 해줌.
    const innerPageInfo = this.innerPageMap.get(targetInnerPageID);
    if (isDefined(innerPageInfo)) {
      const newParentPageIDs = innerPageInfo.referencedPageIDs.filter(id => {
        return id !== editingPageID;
      });
      const updateInfo: InnerPageInfo = {
        referencedPageIDs: newParentPageIDs,
        innerPageLayout: innerPageInfo.innerPageLayout,
      };
      this.innerPageMap.set(targetInnerPageID, updateInfo);
    } else {
      dError('innerPageInfo가 존재하지 않습니다.');
    }
  }

  /**
   * InnerPageMap에서 해당 Page를 innerPage로 가지는 Page들을 찾아 관계를 삭제한 뒤, key를 제거합니다.
   *
   * @param targetPageID 삭제할 Page의 ID
   */
  deleteKeyfromInnerPageMap(targetPageID: WidgetID) {
    const innerPageInfo = this.innerPageMap.get(targetPageID);

    if (isDefined(innerPageInfo)) {
      const referencedPageIDList = innerPageInfo.referencedPageIDs;
      if (referencedPageIDList.length !== 0) {
        // target Page를 innerPage로 가지는 Page가 있다면, 해당 Page를 찾아 value를 삭제함.
        referencedPageIDList.forEach(pageID => {
          this.deleteValuefromInnerPageMap(pageID, true);
        });
      } else {
        dLog('제거할 page를 innerPage로 가지는 page가 존재하지 않습니다.');
      }
      if (isDefined(innerPageInfo.innerPageLayout)) {
        // 해당 Page가 innerPage를 가지고 있다면, value 찾아 삭제
        this.deleteValuefromInnerPageMap(targetPageID);
      } else {
        dLog('제거할 innerPage가 존재하지 않습니다.');
      }
      // 최종적으로 key 제거
      this.innerPageMap.delete(targetPageID);
    } else {
      dError('InnerPageMap에 삭제할 PageID가 존재하지 않습니다.');
    }
  }

  /**
   * 해당 Page가 InnerPageMap의 value를 가지고 있는지 여부 확인
   */
  canEditPageLevel(pageID: WidgetID) {
    let canEdit = true;
    const parentPageList = this.innerPageMap.get(pageID)?.referencedPageIDs;
    const innerPageID = this.innerPageMap.get(pageID)?.innerPageLayout;
    if ((isDefined(parentPageList) && parentPageList.length > 0) || isDefined(innerPageID)) {
      canEdit = false;
    }
    return canEdit;
  }
}
