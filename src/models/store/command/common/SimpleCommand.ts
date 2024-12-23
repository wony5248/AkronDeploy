// import CommandMessage from 'ux/model/message/CommandMessage';
import { OperationMessage } from '../../../message/OperationMessage';

/**
 * Document 를 제어하는 가장 작은 단위입니다.
 * 여러 simple command 가 모여 하나의 동작이 되며, undo/redo 가 가능합니다.
 */
abstract class SimpleCommand {
  /**
   * Simple command 의 do 동작입니다.
   */
  public abstract apply(): void;

  /**
   * Simple command 의 undo 동작입니다.
   */
  public unapply(): void {
    // do nothing.
  }

  /**
   * Simple command 의 redo 동작입니다.
   */
  public reapply(): void {
    // do nothing.
  }

  /**
   * do 동작에 맞는 update message를 생성합니다.
   */
  public makeApplyUpdateMessage(): OperationMessage[] | OperationMessage | undefined {
    return undefined;
  }

  /**
   * undo 동작에 맞는 update message를 생성해 리턴합니다.
   */
  public makeUnApplyUpdateMessage(): OperationMessage[] | OperationMessage | undefined {
    return undefined;
  }

  /**
   * redo 동작에 맞는 update message를 생성해 리턴합니다.
   */
  public makeReApplyUpdateMessage(): OperationMessage[] | OperationMessage | undefined {
    return undefined;
  }

  /**
   * Simple command 의 do message 동작입니다.
   */
  protected applyMessage = async (): Promise<boolean> => {
    return true;
  };

  /**
   * Simple command 의 undo message 동작입니다.
   */
  protected unapplyMessage = async (): Promise<boolean> => {
    return true;
  };

  /**
   * Simple command 의 redo message 동작입니다.
   */
  protected reapplyMessage = async (): Promise<boolean> => {
    return true;
  };

  /**
   * do 동작에 맞는 message를 가져옵니다.
   */
  public getApplyMessage() {
    return this.applyMessage;
  }

  /**
   * undo 동작에 맞는 message 가져옵니다.
   */
  public getUnApplyMessage() {
    return this.unapplyMessage;
  }

  /**
   * redo 동작에 맞는 message 가져옵니다.
   */
  public getReApplyMessage() {
    return this.reapplyMessage;
  }
}

export default SimpleCommand;
