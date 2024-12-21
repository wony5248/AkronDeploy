import { boundMethod } from 'autobind-decorator';

/**
 * Id를 부여하기 위한 container class
 */
class ConcreteIdContainer {
  private startId: number;

  private endId: number;

  private currentId: number;

  /**
   * 순번
   */
  private order: number;

  /**
   * 접속한 유저 숫자
   */
  private users: number;

  /**
   * 생성자
   */
  public constructor() {
    this.currentId = 10000000;
    this.startId = 10001001;
    this.endId = 10002000;
    this.order = 0;
    this.users = 1;
  }

  /**
   * id getter
   */
  @boundMethod
  public getId(): number {
    if (this.endId - this.currentId < 3) {
      this.setNextId();
    }
    this.currentId += 1;
    return this.currentId;
  }

  /**
   * initializer
   */
  @boundMethod
  public initIdContainer(startElementId: number, gap: number, order: number, users: number): void {
    const elementId = startElementId + gap * order;
    this.setStartId(elementId);
    this.setEndId(elementId + gap - 1);
    this.setOrder(order);
    this.setUsers(users);
    this.setCurrentId();
  }

  /**
   * startID setter
   */
  @boundMethod
  private setStartId(elementId: number): void {
    this.startId = elementId;
  }

  /**
   * endID setter
   */
  @boundMethod
  private setEndId(elementId: number): void {
    this.endId = elementId;
  }

  /**
   * currentID setter
   */
  @boundMethod
  private setCurrentId(): void {
    this.currentId = this.startId;
  }

  /**
   * order setter
   */
  @boundMethod
  private setOrder(order: number): void {
    this.order = order;
  }

  /**
   * users setter
   */
  @boundMethod
  private setUsers(users: number): void {
    this.users = users;
  }

  /**
   * nextID setter
   */
  @boundMethod
  private setNextId(): void {
    const gap = (this.endId - this.startId + 1) * this.users;
    this.setStartId(this.startId + gap);
    this.setEndId(this.endId + gap);
    this.setCurrentId();
  }
}

export default ConcreteIdContainer;
