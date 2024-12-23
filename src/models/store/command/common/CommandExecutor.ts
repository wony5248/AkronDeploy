import Context from '../../context/Context';

/**
 * Context 내의 simpleCommand들을 차례대로 execute/unexecute/reexecute 합니다.
 */
class CommandExecutor<ID, CommandEnum, SelectionProp> {
  /**
   * Context 에 있는 command 를 execute 하고 undo stack 에 반영합니다.
   *
   * @param ctx Command 가 보관되어 있는 context
   */
  public executeCommand(ctx: Context<ID, CommandEnum, SelectionProp>): void {
    if (ctx.command === undefined) {
      return;
    }
    ctx.command.apply();
    // if (ctx.command.isUndoable() === true) {
    //   if (isEditAppMode(ctx.appModeContainer)) {
    //     ctx.undoStack.push(ctx.command);
    //   } else if (isEditDialogWidgetMode(ctx.appModeContainer)) {
    //     ctx.editBusinessDialogWidgetModeUndoStack.push(ctx.command);
    //   }
    // }
  }

  /**
   * Context 에 있는 undo stack 으로 undo 를 합니다.
   *
   * @param ctx Undo stack 이 보관되어 있는 context
   */
  public unExecuteCommand(ctx: Context<ID, CommandEnum, SelectionProp>): void {
    // if (isEditAppMode(ctx.appModeContainer)) {
    //   if (ctx.undoStack.canUndo() === false) {
    //     return;
    //   }
    //   ctx.command = ctx.undoStack.prev();
    // } else if (isEditDialogWidgetMode(ctx.appModeContainer)) {
    //   if (ctx.editBusinessDialogWidgetModeUndoStack.canUndo() === false) {
    //     return;
    //   }
    //   ctx.command = ctx.editBusinessDialogWidgetModeUndoStack.prev();
    // }
    ctx.command?.unapply();
  }

  /**
   * Context 에 있는 undo stack 으로 redo 를 합니다.
   *
   * @param ctx Undo stack 이 보관되어 있는 context
   */
  public reExecuteCommand(ctx: Context<ID, CommandEnum, SelectionProp>): void {
    // if (isEditAppMode(ctx.appModeContainer)) {
    //   if (ctx.undoStack.canRedo() === false) {
    //     return;
    //   }
    //   ctx.command = ctx.undoStack.next();
    // } else if (isEditDialogWidgetMode(ctx.appModeContainer)) {
    //   if (ctx.editBusinessDialogWidgetModeUndoStack.canRedo() === false) {
    //     return;
    //   }
    //   ctx.command = ctx.editBusinessDialogWidgetModeUndoStack.next();
    // }
    ctx.command?.reapply();
  }
}

export default CommandExecutor;
