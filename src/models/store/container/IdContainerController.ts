import { boundMethod } from 'autobind-decorator';
import IdContainer, { IdList } from './IdContainer';

interface IIdContainerControllerInitProps {
  idList: IdList;
  gap: number;
  order: number;
  users: number;
}

/**
 * 모든 scope에서 IdContainer의 instance를 생성하고 접근할 수 있도록 하는 class
 */
class IdContainerController {
  /**
   * IdContainerController 내부에서 관리 할 IdContainer
   */
  private idContainer: IdContainer;

  /**
   * 생성자
   * idContainer를 아무 동작도 하지 않는 IdContainer로 생성
   */
  constructor(args: IIdContainerControllerInitProps) {
    this.idContainer = new IdContainer(args);
  }

  /**
   * generate dummy id for legacy code
   *
   * @returns 1
   *
   * @deprecated
   */
  @boundMethod
  public generateDummyId(): number {
    return 1;
  }

  /**
   * generate id for component
   *
   * @returns id generated from componentIdContainer
   */
  @boundMethod
  public generateComponentId(): number {
    return this.idContainer.getComponentIdContainer().getId();
  }
}

export default IdContainerController;
