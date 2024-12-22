import { boundMethod } from 'autobind-decorator';

import ConcreteIdContainer from './ConcreteIdContainer';

/**
 * 서버로 부터 전송받을 Id init 정보
 */
export interface IdList {
  componentId: number;
}

interface IIdContainerInitProps {
  idList: IdList;
  gap: number;
  order: number;
  users: number;
}

/**
 * Id Container 클래스
 */
class IdContainer {
  private componentIdContainer: ConcreteIdContainer;

  /**
   * constructor
   */
  constructor(args: IIdContainerInitProps) {
    this.componentIdContainer = new ConcreteIdContainer();
    this.initIdContainers(args.idList, args.gap, args.order, args.users);
  }

  /**
   * Id containers initializer
   */
  @boundMethod
  public initIdContainers(idList: IdList, gap: number, order: number, users: number): void {
    this.componentIdContainer.initIdContainer(idList.componentId, gap, order, users);
  }

  /**
   * getComponentIdContainer
   */
  @boundMethod
  public getComponentIdContainer(): ConcreteIdContainer {
    return this.componentIdContainer;
  }
}

export default IdContainer;
