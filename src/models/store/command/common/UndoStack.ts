import { boundMethod } from 'autobind-decorator';
import { observable, action, makeObservable } from 'mobx';
import Command from './Command';

/**
 * Command 들을 stack 형태로 보관하는 class 입니다.
 * 모든 undoable 한 command 들은 execution 후 undo stack 에 보관되어야 합니다.
 */
class UndoStack<ID, CommandEnum, SelectionProp> {
  /**
   * Undo stack 입니다. Execute 된 command 를 보관합니다.
   * Stack 의 이름이나, 실제로는 deque 형태로 동작합니다. Command 가 계속 push 되면 stack size 를 넘어가면서 FIFO 형태로 command 가 pop 됩니다.
   */
  @observable.shallow
  private undoStack: Array<Command<ID, CommandEnum, SelectionProp>>;

  /**
   * Undo 된 command 를 보관하는 redo stack 입니다. Command execute 시 clear 됩니다.
   */
  @observable.shallow
  private redoStack: Array<Command<ID, CommandEnum, SelectionProp>>;

  /**
   * Undo stack 의 max size 를 의미합니다.
   */
  private readonly size: number;

  /**
   * 생성자
   */
  public constructor(size = 20) {
    makeObservable(this);
    this.undoStack = [] as Array<Command<ID, CommandEnum, SelectionProp>>;
    this.redoStack = [] as Array<Command<ID, CommandEnum, SelectionProp>>;
    this.size = size;
  }

  /**
   * Undo 가 가능한 상태인지 확인합니다.
   *
   * @returns Undo stack 에 command 가 있는 경우 true
   */
  @boundMethod
  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Redo 가 가능한 상태인지 확인합니다.
   *
   * @returns Redo stack 에 command 가 있는 경우 true
   */
  @boundMethod
  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Execute 된 command 를 undo stack 에 집어넣습니다.
   * Redo stack 을 clear 하며, undo stack size 가 넘어가는 경우 FIFO 형태로 pop 합니다.
   *
   * @param command Execute 된 command
   */
  @action.bound
  public push(command: Command<ID, CommandEnum, SelectionProp>): void {
    // clear redo stack
    this.redoStack = [] as Array<Command<ID, CommandEnum, SelectionProp>>;
    // push command to undo stack
    this.undoStack.push(command);
    // erase oldest command if stack is full
    if (this.undoStack.length > this.size) {
      this.undoStack.shift();
    }
  }

  /**
   * 현재 command 를 return 합니다
   */
  @action.bound
  public cur(): Command<ID, CommandEnum, SelectionProp> | undefined {
    const command = this.undoStack[this.undoStack.length - 1];
    if (command === undefined) {
      return undefined;
    }
    return command;
  }

  /**
   * Undo 해야 할 command 를 return 합니다.
   * Return 할 command 를 redo stack 으로 옮깁니다.
   *
   * @returns Undo 해야 할 command, undo stack 이 비어있다면 undefined
   */
  @action.bound
  public prev(): Command<ID, CommandEnum, SelectionProp> | undefined {
    // pop command from undo stack
    const command = this.undoStack.pop();
    if (command === undefined) {
      return undefined;
    }
    // push command to redo stack
    this.redoStack.push(command);
    // return command to execute undo
    return command;
  }

  /**
   * Redo 해야 할 command 를 return 합니다.
   * Return 할 command 를 undo stack 으로 옮깁니다.
   *
   * @returns Redo 해야 할 command, redo stack 이 비어있다면 undefined
   */
  @action.bound
  public next(): Command<ID, CommandEnum, SelectionProp> | undefined {
    // pop command from redo stack
    const command = this.redoStack.pop();
    if (command === undefined) {
      return undefined;
    }
    // push command to undo stack
    this.undoStack.push(command);
    // return command to execute redo
    return command;
  }

  /**
   * Undo stack 을 clear 합니다. undo/redo stack 모두를 clear 합니다.
   */
  @action.bound
  public clear(): void {
    this.undoStack = [] as Array<Command<ID, CommandEnum, SelectionProp>>;
    this.redoStack = [] as Array<Command<ID, CommandEnum, SelectionProp>>;
  }

  /**
   * Undo stack pop
   */
  @action.bound
  public pop(): Command<ID, CommandEnum, SelectionProp> | undefined {
    const command = this.undoStack.pop();
    return command;
  }

  /**
   * Redo stack 에 해당 tag 가 포함되는지 확인
   * 있다면 해당 tag 까지의 거리를 반환
   */
  @action.bound
  public redoStackHasTag(tag: string): number {
    let count = this.redoStack.length + 1;
    let result = -1;
    this.redoStack.forEach((c: Command<ID, CommandEnum, SelectionProp>) => {
      count -= 1;
      if (c.getTag() === tag) {
        result = count;
      }
    });
    return result;
  }

  /**
   * Undo stack 에 해당 tag 가 포함되는지 확인
   * 있다면 해당 tag 까지의 거리를 반환
   */
  @action.bound
  public undoStackHasTag(tag: string): number {
    let count = 0;
    let result = -1;
    this.undoStack.forEach((c: Command<ID, CommandEnum, SelectionProp>) => {
      count += 1;
      if (c.getTag() === tag) {
        result = count;
      }
    });
    return result;
  }

  /**
   * undoStack 의 size 를 반환
   */
  @action.bound
  public getUndoStackSize(): number {
    return this.undoStack.length;
  }
}

export default UndoStack;
