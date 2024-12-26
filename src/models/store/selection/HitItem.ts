import { boundMethod } from 'autobind-decorator';

/**
 * hit한 Widget의 정보를 담습니다.
 */
export default class HitItem<Model> {
  // hit한 domElement
  private domElement?: HTMLElement;

  // hit한 Widget의 Model
  private model?: Model;

  /**
   * 생성자
   */
  public constructor() {
    this.domElement = undefined;
    this.model = undefined;
  }

  /**
   * hit한 domElement 정보를 설정
   */
  @boundMethod
  public setDomElement(domElement: HTMLElement): void {
    this.domElement = domElement;
  }

  /**
   * hit한 Widget의 Model을 설정
   */
  @boundMethod
  public setModel(model: Model): void {
    this.model = model;
  }

  /**
   * hit한 Widget의 domElement 반환
   */
  @boundMethod
  public getDomElement(): HTMLElement | undefined {
    return this.domElement;
  }

  /**
   * hit한 Widget의 Model 반환
   */
  @boundMethod
  public getModel(): Model | undefined {
    return this.model;
  }
}
