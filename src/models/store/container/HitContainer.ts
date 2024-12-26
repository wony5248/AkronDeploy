import { boundMethod } from 'autobind-decorator';
import HitItem from 'models/store/selection/HitItem';

/**
 * 드래깅 시작점과 끝점에 대한 hitItem을 관리합니다
 */
export default class HitContainer<Model> {
  // 드래깅 시작 지점의 hit 정보
  private startHitItem?: HitItem<Model>;

  // 드래깅 중 또는 종료 지점의 hit정보
  private endHitItem?: HitItem<Model>;

  /**
   * Hit 정보 초기화
   */
  @boundMethod
  public initHitContainer(): void {
    this.startHitItem = undefined;
    this.endHitItem = undefined;
  }

  /**
   * 드래깅 시작 지점의 hit 정보 설정
   */
  @boundMethod
  public setStartHitItem(hitItem: HitItem<Model> | undefined): void {
    this.startHitItem = hitItem;
  }

  /**
   * 드래깅 시작 지점의 hit 정보 반환
   */
  public getStartHitItem(): HitItem<Model> | undefined {
    return this.startHitItem;
  }

  /**
   * 드래깅 중/끝 지점의 hit 정보 설정
   */
  @boundMethod
  public setEndHitItem(hitItem: HitItem<Model>): void {
    this.endHitItem = hitItem;
  }

  /**
   * 드래깅 중/끝 지점의 hit 정보 반환
   */
  public getEndHitItem(): HitItem<Model> | undefined {
    return this.endHitItem;
  }
}
