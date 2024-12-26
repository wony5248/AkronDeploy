import { boundMethod } from 'autobind-decorator';
import { computed } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import AkronContext from 'models/store/context/AkronContext';

/**
 * Widget 관련 Property들을 관리하는 Class입니다.
 */
class WidgetPropContainer {
  private isSmartGuide: boolean;

  private composite?: boolean;

  private isAsset?: boolean;

  /**
   * 생성자
   */
  public constructor() {
    this.isSmartGuide = false;
    this.clear();
  }

  /**
   * 초기화 함수 입니다.
   */
  @boundMethod
  public clear(): void {
    this.composite = undefined;
    this.isAsset = undefined;
  }

  /**
   * 스마트 가이드 모드일때 true 반환합니다.
   */
  @boundMethod
  public getIsSmartGuide(): boolean {
    return this.isSmartGuide;
  }

  /**
   * 스마트 가이드 모드를 설정합니다.
   */
  @boundMethod
  public setIsSmartGuide(isSmartGuide: boolean): void {
    this.isSmartGuide = isSmartGuide;
  }

  /**
   * Composite 가능 여부 반환
   */
  @computed
  public getCompositeValid() {
    return this.composite ?? false;
  }

  /**
   * 선택된 Widget의 Asset화 여부를 반환
   */
  @computed
  public getIsAsset() {
    return this.isAsset ?? false;
  }

  /**
   * Custom Property Binding 프롭을 Update 합니다.
   * 선택된 Widget이 Asset화 된 경우 True 반환
   * TODO: 다중 선택 정책 반영
   */
  @boundMethod
  public updatePropBindable(ctx: AkronContext, selectedWidgets: WidgetModel[]): void {
    if (selectedWidgets.length !== 1) {
      return;
    }
    // this.isAsset = checkCompositeChildModel(ctx.getCompositeComponentContainer(), selectedWidgets[0]);
  }

  /**
   * Composite Property를 Update 합니다.
   *
   * 케이스 모두 만족해야 Valid 합니다.
   * 1. 선택된 Widget이 TopLevel인 경우
   * 2. 다중 선택되지 않은 경우
   * 3. 컴포넌트화 되지 않은 경우
   * 4. Lock 되지 않은 경우
   */
  //   @boundMethod
  //   public updateCompositeProp(ctx: AkronContext, selectedWidgets: (WidgetModel | WorkAreaModel)[]): void {
  //     if (selectedWidgets.length !== 1) {
  //       return;
  //     }

  //     const topLevelModel = getCompositeKeyModel(selectedWidgets[0]) as NewWidgetModel;

  //     if (
  //       topLevelModel &&
  //       !topLevelModel.getLocked() &&
  //       !checkCompositeModel(ctx.getCompositeComponentContainer(), topLevelModel)
  //     ) {
  //       this.composite = topLevelModel === selectedWidgets[0];
  //     }
  //   }

  /**
   * 선택된 Widget의 UI Property를 Update 합니다.
   */
  @boundMethod
  public updateProps(ctx: AkronContext, selectedWidgets: WidgetModel[]): void {
    this.updatePropBindable(ctx, selectedWidgets);
    // this.updateCompositeProp(ctx, selectedWidgets);
  }
}

export default WidgetPropContainer;
