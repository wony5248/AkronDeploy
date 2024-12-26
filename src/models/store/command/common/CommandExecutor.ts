import AkronContext from 'models/store/context/AkronContext';

/**
 * Context 내의 simpleCommand들을 차례대로 execute/unexecute/reexecute 합니다.
 */
class CommandExecutor {
  /**
   * Context 에 있는 command 를 execute 하고 undo stack 에 반영합니다.
   *
   * @param ctx Command 가 보관되어 있는 context
   */
  public executeCommand(ctx: AkronContext): void {
    if (ctx.getCommand() === undefined) {
      return;
    }
    ctx.getCommand()?.apply();
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
  public unExecuteCommand(ctx: AkronContext): void {
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
    ctx.getCommand()?.unapply();
  }

  /**
   * Context 에 있는 undo stack 으로 redo 를 합니다.
   *
   * @param ctx Undo stack 이 보관되어 있는 context
   */
  public reExecuteCommand(ctx: AkronContext): void {
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
    ctx.getCommand()?.reapply();
  }
}

export default CommandExecutor;
