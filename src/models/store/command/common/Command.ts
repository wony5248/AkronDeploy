import { boundMethod } from 'autobind-decorator';
import SelectionContainer from '../../container/SelectionContainer';
import SimpleCommand from './SimpleCommand';
import AkronContext from 'models/store/context/AkronContext';

/**
 * 하나의 작업 단위를 나타내는 class 입니다.
 * 여러 simple command 를 list 로 가지고 있으며 do/undo/redo 의 단위가 됩니다.
 * Undo stack 이 이 class 의 life cycle 을 담당합니다.
 */
class Command {
  /**
   * Command 실행에 필요한 simple command 들의 list 입니다.
   */
  private commandList: SimpleCommand[];

  /**
   * Command 실행에 필요한 simple command 들의 list 로, 후처리로 진행되어야 하는 simple command 들입니다.
   * Do, undo, redo 시 commandList 의 작업이 마쳐진 뒤 postCommandList 의 작업을 수행합니다.
   */
  private postCommandList: SimpleCommand[];

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
  public constructor(ctx: AkronContext) {
    this.commandList = [] as SimpleCommand[];
    this.postCommandList = [] as SimpleCommand[];
    this.undoable = true;
    this.oldSelectionContainer = ctx.getSelectionContainer();
    this.newSelectionContainer = ctx.getSelectionContainer();
    this.tag = `UndoStackTag_${String(new Date().getTime())}`;
  }

  /**
   * Simple command 를 추가합니다.
   * 추가한 순서대로 do/redo 동작이 수행되고, 역순으로 undo 동작이 수행됩니다.
   *
   * @param command Command 에 추가할 simple command
   */
  @boundMethod
  public append(command: SimpleCommand): void {
    this.commandList.push(command);
  }

  /**
   * 후처리 될 simple command 를 추가합니다.
   * 추가한 순서대로 simple command 가 동작됩니다.
   *
   * @param command Command 에 추가할 후처리 simple command
   */
  @boundMethod
  public appendPost(command: SimpleCommand): void {
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
}

export default Command;
