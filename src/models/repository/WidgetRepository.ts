import { boundMethod } from 'autobind-decorator';
import { WidgetID } from 'models/node/WidgetModel';

/**
 * widget과 관련된 repository class 입니다.
 * 싱글톤으로 구현되어 있어 앱에 단 하나만 존재합니다.
 */
class WidgetRepository {
  // Widget ID 생성에 쓸 counter입니다.
  // 앱을 이전에 열었을 때와 (왠만하면) 겹치지 않도록 초기값을 현재 시간으로 설정합니다.
  // 추후 ID 생성이 백엔드로 넘어가면 사라질 예정입니다.
  private nextWidgetID = new Date().getTime();

  // 원본 및 Clone된 WidgetModel의 ID를 관리합니다.
  // 새로 발행된 Library Component ID에 맞춰 Variable, Custom Props/State 정보를 Update 하기 위해 사용.
  private cloneNodeIDMatchMap: Map<WidgetID, WidgetID | undefined> = new Map<WidgetID, WidgetID | undefined>();
  // private cloneDataIDMatchMap: Map<DataID, DataID> = new Map<DataID, DataID>();

  /**
   * Widget에 할당할 ID를 생성합니다.
   * 후에 백엔드 쪽에서 ID를 생성할 예정이며, 그 때 이 함수는 **삭제될 예정입니다.**
   */
  @boundMethod
  public generateWidgetID(): WidgetID {
    const newWidgetID = this.nextWidgetID;
    this.nextWidgetID += 1;
    return newWidgetID;
  }

  /**
   * Origin ID 및 New ID 추가
   */
  @boundMethod
  public setCloneNodeIDMatchMap(originID: WidgetID, newID: WidgetID | undefined): void {
    this.cloneNodeIDMatchMap.set(originID, newID);
  }

  /**
   * Old ID와 Mapping된 New ID 반환
   *
   * @param originID Old ID 정보
   */
  @boundMethod
  public getCloneNodeIDMatchMap(originID: WidgetID): WidgetID | undefined {
    return this.cloneNodeIDMatchMap.get(originID);
  }

  /**
   * Old ID와 Mapping된 Map 반환
   */
  @boundMethod
  public getCloneNodeIDMap(): Map<number, number | undefined> {
    return this.cloneNodeIDMatchMap;
  }

  /**
   * key가 있는지 Check
   *
   * @param originID Old ID 정보
   */
  @boundMethod
  public hasCloneNodeIDMap(originID: WidgetID): boolean {
    return this.cloneNodeIDMatchMap.has(originID);
  }

  // /**
  //  * Origin Data ID 및 New Data ID 추가
  //  */
  // @boundMethod
  // public setCloneDataIDMatchMap(originID: DataID, newID: DataID): void {
  //     this.cloneDataIDMatchMap.set(originID, newID);
  // }

  // /**
  //  * Old DataID와 Mapping된 New DataID 반환
  //  *
  //  * @param originID Old ID 정보
  //  */
  // @boundMethod
  // public getCloneDataIDMatchMap(originID: DataID): DataID | undefined {
  //     return this.cloneDataIDMatchMap.get(originID);
  // }

  /**
   * cloneNodeIDMatchMap 초기화
   */
  @boundMethod
  public clearCloneIDMatchMap(): void {
    this.cloneNodeIDMatchMap.clear();
    // this.cloneDataIDMatchMap.clear();
  }
}

export default new WidgetRepository();
