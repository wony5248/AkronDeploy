import { boundMethod } from 'autobind-decorator';
import CommandMapper from './CommandMapper';
import CommandExecutor from './CommandExecutor';
import Context from '../../context/Context';
import CommandEnum from './CommandEnum';
import { SelectionProp } from './CommandProps';
import { WidgetID } from 'models/node/WidgetModel';
import Command from './Command';

export interface AkronCommandManager extends CommandManager<WidgetID, CommandEnum, SelectionProp> {}
/**
 * Command 수행을 담당하는 class 입니다.
 * Document model 의 제어는 Command manager 안에서만 가능합니다.
 */
class CommandManager<ID, CommandEnum, SelectionProp> {
  /**
   * Command ID 에 대한 command handler list 를 가지고 있는 mapper 입니다. 상황에 따라 map 구성이 달라질 수 있습니다.
   */
  private commandMap: CommandMapper<ID, CommandEnum, SelectionProp>;

  /**
   * Command 를 실제 실행하는 객체입니다.
   */
  private readonly commandExecutor: CommandExecutor<ID, CommandEnum, SelectionProp>;

  /**
   * 생성자
   */
  public constructor(map: CommandMapper<ID, CommandEnum, SelectionProp>) {
    this.commandMap = map;
    this.commandExecutor = new CommandExecutor();
  }

  /**
   * Command ID 에 입각한 command handling 을 수행합니다.
   *
   * @param commandID 최초 command ID 로 context 의 command ID 변화를 확인하기 위해 인자가 구분되어 있습니다.
   * @param ctx context 정보로 로직에 필요한 데이터를 가지고 있습니다.
   */
  @boundMethod
  public execute(ctx: Context<ID, CommandEnum, SelectionProp>): void {
    if (ctx.commandProps === undefined) {
      return;
    }
    // undo
    if (ctx.commandProps.commandID === this.UndoCommandEnum()) {
      this.commandExecutor.unExecuteCommand(ctx);
      return;
    }
    // redo
    if (ctx.commandProps.commandID === this.RedoCommandEnum()) {
      this.commandExecutor.reExecuteCommand(ctx);
      return;
    }

    ctx.command = new Command(ctx);
    // compose simple commands
    this.commandMap
      .get(ctx.commandProps.commandID)
      ?.some(handler => (ctx.commandProps ? handler.processCommand(ctx.commandProps, ctx) : true));
    // execute
    if (ctx.command.isEmpty() === false) {
      if (ctx.commandProps.undoable !== undefined) {
        ctx.command.setUndoable(ctx.commandProps.undoable);
      }
      this.commandExecutor.executeCommand(ctx);
    }
  }

  public UndoCommandEnum(): CommandEnum | void {}

  public RedoCommandEnum(): CommandEnum | void {}
}

export default CommandManager;
