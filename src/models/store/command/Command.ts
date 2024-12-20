import { boundMethod } from 'autobind-decorator';
import Context from '../context/Context';
import SelectionContainer from '../selection/SelectionContainer';
import SimpleCommand from './SimpleCommand';
import UpdateMessage from '../../message/UpdateMessage';

/**
 * 하나의 작업 단위를 나타내는 class 입니다.
 * 여러 simple command 를 list 로 가지고 있으며 do/undo/redo 의 단위가 됩니다.
 * Undo stack 이 이 class 의 life cycle 을 담당합니다.
 */
class Command<ID, CommandEnum, SelectionProp> {
  /**
   * Command 실행에 필요한 simple command 들의 list 입니다.
   */
  private commandList: Array<SimpleCommand<ID>>;

  /**
   * Command 실행에 필요한 simple command 들의 list 로, 후처리로 진행되어야 하는 simple command 들입니다.
   * Do, undo, redo 시 commandList 의 작업이 마쳐진 뒤 postCommandList 의 작업을 수행합니다.
   */
  private postCommandList: Array<SimpleCommand<ID>>;

  /**
   * Undo 가 가능한 command 인지를 나타냅니다. undoable === false 인 경우, undo stack 에 들어가지 않고 사라집니다.
   * 기본 값은 true 입니다.
   */
  private undoable: boolean;

  /**
   * Undo 시의 Selection 정보입니다.
   */
  private oldSelectionContainer?: SelectionContainer;

  /**
   * Redo 시의 Selection 정보입니다.
   */
  private newSelectionContainer?: SelectionContainer;

  /**
   * Tag
   */
  private tag: string;

  /**
   * 생성자
   */
  public constructor(ctx: Context<ID, CommandEnum, SelectionProp>) {
    this.commandList = [] as Array<SimpleCommand<ID>>;
    this.postCommandList = [] as Array<SimpleCommand<ID>>;
    this.undoable = true;
    this.oldSelectionContainer = ctx.selectionContainer;
    this.newSelectionContainer = ctx.selectionContainer;
    this.tag = `UndoStackTag_${String(new Date().getTime())}`;
  }

  /**
   * Simple command 를 추가합니다.
   * 추가한 순서대로 do/redo 동작이 수행되고, 역순으로 undo 동작이 수행됩니다.
   *
   * @param command Command 에 추가할 simple command
   */
  @boundMethod
  public append(command: SimpleCommand<ID>): void {
    this.commandList.push(command);
  }

  /**
   * 후처리 될 simple command 를 추가합니다.
   * 추가한 순서대로 simple command 가 동작됩니다.
   *
   * @param command Command 에 추가할 후처리 simple command
   */
  @boundMethod
  public appendPost(command: SimpleCommand<ID>): void {
    this.postCommandList.push(command);
  }

  /**
   * Undoable 속성을 결정합니다. 기본 값은 true 입니다.
   *
   * @param undoable Undo 가능 여부
   */
  @boundMethod
  public setUndoable(undoable: boolean): void {
    this.undoable = undoable;
  }

  /**
   * Undo 가능한 command 인지 확인합니다. Command 수행 후 true 인 경우 undo stack 에 들어가고, false 인 경우 소멸됩니다.
   *
   * @returns Undoable 여부
   */
  @boundMethod
  public isUndoable(): boolean {
    return this.undoable;
  }

  /**
   * Command 를 수행합니다.
   */
  @boundMethod
  public apply(): void {
    this.commandList.forEach(command => command.apply());
    this.postCommandList.forEach(command => command.apply());
  }

  /**
   * Command 의 undo 를 수행합니다.
   */
  @boundMethod
  public unapply(): void {
    this.commandList.reverse().forEach(command => command.unapply());
    this.postCommandList.forEach(command => command.unapply());
  }

  /**
   * Command 의 redo 를 수행합니다.
   */
  @boundMethod
  public reapply(): void {
    this.commandList.reverse().forEach(command => command.reapply());
    this.postCommandList.forEach(command => command.reapply());
  }

  /**
   * Command 수행에 맞는
   * update messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeApplyUpdateMessages(): Array<UpdateMessage<ID>> {
    const updateMessages = new Array<UpdateMessage<ID>>();

    this.commandList.forEach(command => {
      const updateMessage = command.makeApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.makeApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });

    return updateMessages;
  }

  /**
   * Command undo 수행에 맞는
   * update messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeUnApplyUpdateMessages(): Array<UpdateMessage<ID>> {
    const updateMessages = new Array<UpdateMessage<ID>>();

    this.commandList.forEach(command => {
      const updateMessage = command.makeUnApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.makeUnApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });

    return updateMessages;
  }

  /**
   * Command redo 수행에 맞는
   * update messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeReApplyUpdateMessages(): Array<UpdateMessage<ID>> {
    const updateMessages = new Array<UpdateMessage<ID>>();

    this.commandList.forEach(command => {
      const updateMessage = command.makeReApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.makeReApplyUpdateMessage();
      if (updateMessage !== undefined) {
        if (updateMessage instanceof UpdateMessage) {
          updateMessages.push(updateMessage);
        } else {
          (updateMessage as Array<UpdateMessage<ID>>).forEach(m => {
            updateMessages.push(m);
          });
        }
      }
    });

    return updateMessages;
  }

  /**
   * Simple command 가 있는지 확인합니다.
   *
   * @returns Simple command 가 하나도 없으면 true
   */
  @boundMethod
  public isEmpty(): boolean {
    return this.commandList.length === 0 && this.postCommandList.length === 0;
  }

  /**
   * Commands가 가지는 oldSelection을 리턴합니다.
   */
  @boundMethod
  public getOldSelectionContainer(): SelectionContainer | undefined {
    return this.oldSelectionContainer;
  }

  /**
   * Commands가 가지는 newSelection을 리턴합니다.
   */
  @boundMethod
  public getNewSelectionContainer(): SelectionContainer | undefined {
    return this.newSelectionContainer;
  }

  /**
   * Commands가 가지는 newSelection을 set합니다.
   */
  @boundMethod
  public setNewSelectionContainer(selectioncontainer: SelectionContainer | undefined): void {
    this.newSelectionContainer = selectioncontainer;
  }

  /**
   * tag 를 반환합니다.
   */
  @boundMethod
  public getTag(): string {
    return this.tag;
  }

  /**
   * Command do 수행에 맞는
   * server messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeApplyMessages(): Array<{ (): Promise<boolean> }> {
    const serverMessages = new Array<{ (): Promise<boolean> }>();

    this.commandList.forEach(command => {
      const updateMessage = command.getApplyMessage();
      serverMessages.push(updateMessage);
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.getApplyMessage();
      serverMessages.push(updateMessage);
    });

    return serverMessages;
  }

  /**
   * Command undo 수행에 맞는
   * server messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeUnApplyMessages(): Array<{ (): Promise<boolean> }> {
    const serverMessages = new Array<{ (): Promise<boolean> }>();

    this.commandList.forEach(command => {
      const updateMessage = command.getUnApplyMessage();
      serverMessages.push(updateMessage);
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.getUnApplyMessage();
      serverMessages.push(updateMessage);
    });

    return serverMessages;
  }

  /**
   * Command redo 수행에 맞는
   * server messages를 만드는 작업을 수행합니다.
   */
  @boundMethod
  public makeReApplyMessages(): Array<{ (): Promise<boolean> }> {
    const serverMessages = new Array<{ (): Promise<boolean> }>();

    this.commandList.forEach(command => {
      const updateMessage = command.getReApplyMessage();
      serverMessages.push(updateMessage);
    });
    this.postCommandList.forEach(command => {
      const updateMessage = command.getReApplyMessage();
      serverMessages.push(updateMessage);
    });

    return serverMessages;
  }
}

export default Command;
