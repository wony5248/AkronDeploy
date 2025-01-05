import { isDefined } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import UpdateMessage from 'models/message/UpdateMessage';

/**
 * API call을 하는 command들을 담는 message
 */
export type APIMessage = () => Promise<boolean>;

/**
 * UpdateMessage를 담는 컨테이너 입니다.
 */
export default class UpdateMessageContainer {
  private updateMessages: Array<UpdateMessage>;

  private reUpdateMessages: string;

  private apiMessages: Array<APIMessage>;

  private reExecuteApiMessages: Array<APIMessage>;

  private transformed: boolean;

  /**
   * contructor
   */
  public constructor() {
    this.updateMessages = new Array<UpdateMessage>();
    this.apiMessages = new Array<APIMessage>();
    this.transformed = false;
    this.reUpdateMessages = '';
    this.reExecuteApiMessages = new Array<APIMessage>();
  }

  /**
   * updateMessage 객체를 채우는 동작을 합니다.
   */
  @boundMethod
  public appendUpdateMessage(updateMessage: UpdateMessage): void {
    this.updateMessages.push(updateMessage);
  }

  /**
   * APIMessage 객체를 채우는 동작을 합니다.
   */
  @boundMethod
  public appendApiMessage(apiMessage: APIMessage): void {
    this.apiMessages.push(apiMessage);
  }

  /**
   * UpdateMessage를 채우는 동작을 합니다.
   */
  @boundMethod
  public appendUpdateMessages(updateMessages: UpdateMessage[], appID: number): void {
    updateMessages.forEach(updateMessage => {
      updateMessage.setAppID(appID);
    });

    let indicesToRemove: number[] = [];

    this.updateMessages.forEach((currentUpdateMessage, index) => {
      updateMessages.forEach(updateMessage => {
        if (
          isDefined(currentUpdateMessage.getModelID()) &&
          currentUpdateMessage.getModelID() === updateMessage.getModelID() &&
          currentUpdateMessage.getBehavior() === updateMessage.getBehavior() &&
          updateMessage.getBehavior() !== 'ie' &&
          updateMessage.getBehavior() !== 'de'
        ) {
          indicesToRemove.push(index);
        }
      });
    });

    indicesToRemove = Array.from(new Set(indicesToRemove));
    indicesToRemove
      .sort((a, b) => b - a)
      .forEach(index => {
        this.updateMessages.splice(index, 1);
      });

    this.updateMessages = [...this.updateMessages, ...updateMessages];
  }

  /**
   * 전송 유무를 확인하는 bool 값을 세팅합니다.
   */
  @boundMethod
  public setTransformed(isTransformed: boolean): void {
    this.transformed = isTransformed;
  }

  /**
   * UpdateMessage array를 반환
   */
  @boundMethod
  public getUpdateMessages(): UpdateMessage[] {
    return this.updateMessages;
  }

  /**
   * ReUpdateMessage를 반환
   */
  @boundMethod
  public getReUpdateMessages(): string {
    return this.reUpdateMessages;
  }

  /**
   * ReUpdateMessage를 세팅
   */
  @boundMethod
  public setReUpdateMessages(messages: string): void {
    this.reUpdateMessages = messages;
  }

  /**
   * APIMessage array를 반환
   */
  @boundMethod
  public getAPIMessages(): APIMessage[] {
    return this.apiMessages;
  }

  /**
   * ReExecuteAPIMessage array(reupdate용)를 반환
   */
  @boundMethod
  public getReExecuteAPIMessages(): APIMessage[] {
    return this.reExecuteApiMessages;
  }

  /**
   * ReExecuteAPIMessages를 세팅
   */
  @boundMethod
  public setReExecuteAPIMessages(messages: APIMessage[]): void {
    this.reExecuteApiMessages = messages;
  }

  /**
   * 컨테이너에 아직 전송하지 못한 메시지가 있는지 확인해줍니다.
   */
  public hasMessage(): boolean {
    if (this.updateMessages.length > 0 || this.apiMessages.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * 전송 유무를 판단합니다.
   */
  @boundMethod
  public getTransformed(): boolean {
    return this.transformed;
  }

  /**
   * update 메시지를 clear 합니다.
   */
  @boundMethod
  public clearUpdateMessage(): void {
    this.transformed = false;
    this.updateMessages = [];
  }

  /**
   * api 메시지를 clear 합니다.
   */
  @boundMethod
  public clearApiMessage(): void {
    this.apiMessages = [];
  }
}
