import CommandHandler from 'models/store/command/common/CommandHandler';
import AppCommandHandler from 'models/store/command/handler/AppCommandHandler';
import AppStylesCommandHandler from 'models/store/command/handler/AppStylesCommandHandler';
import ClipboardCommandHandler from 'models/store/command/handler/clipboard/ClipboardCommandHandler';
import PageCommandHandler from 'models/store/command/handler/PageCommandHandler';
import PageListSortCommandHandler from 'models/store/command/handler/PageListSortCommandHandler';
import WidgetEditCommandHandler from 'models/store/command/handler/WidgetEditCommandHandler';
import WidgetLayerCommandHandler from 'models/store/command/handler/WidgetLayerCommandHandler';
import WidgetSelectCommandHandler from 'models/store/command/handler/WidgetSelectionCommandHandler';
import EditorZoomInOutCommandHandler from 'models/store/command/handler/ZoomInOutCommandHandler';

/**
 * Command handler 를 생성하는 abstract factory 입니다.
 * 제품별로 생성해야 하는 command handler 가 다를 수 있기 때문에 factory 를 사용합니다.
 */
class CommandHandlerFactory {
  /**
   * WidgetEditCommandHandler 반환
   */
  public createWidgetEditCommandHandler(): CommandHandler {
    return new WidgetEditCommandHandler();
  }

  /**
   * WidgetLayerCommandHandler 반환
   */
  public createWidgetLayerCommandHandler(): CommandHandler {
    return new WidgetLayerCommandHandler();
  }

  /**
   * WidgetEditCommandHandler 반환
   */
  public createWidgetSelectCommandHandler(): CommandHandler {
    return new WidgetSelectCommandHandler();
  }

  /**
   * ClipboardCommandHandler 반환
   */
  public createClipboardCommandHandler(): CommandHandler {
    return new ClipboardCommandHandler();
  }

  /**
   * PkgCommandHandler 반환
   */
  public createAppCommandHandler(): CommandHandler {
    return new AppCommandHandler();
  }

  /**
   * PageCommandHandler 반환
   */
  public createPageCommandHandler(): CommandHandler {
    return new PageCommandHandler();
  }

  //   /**
  //    * CompositeWidgetCommandHandler 반환
  //    */
  //   public createCompositeWidgetCommandHandler(): CommandHandler {
  //     return new CompositeWidgetCommandHandler();
  //   }

  //   /**
  //    * FileCommandHandler 반환
  //    */
  //   public createFileCommandHandler(): CommandHandler {
  //     return new FileCommandHandler();
  //   }

  //   /**
  //    * ParagraphCommandHandler 반환
  //    */
  //   public createParagraphCommandHandler(): CommandHandler {
  //     return new ParagraphCommandHandler();
  //   }

  //   /**
  //    * BusinessLogicCommandHandler 반환
  //    */
  //   public creatBusinessLogicCommandHandler(): CommandHandler {
  //     return new BusinessLogicCommandHandler();
  //   }

  //   /**
  //    * DataCommandHandler를 반환합니다.
  //    */
  //   public createDataCommandHandler(): CommandHandler {
  //     return new DataCommandHandler();
  //   }

  /**
   * EditorZoomInOutCommandHandler 반환
   */
  public createEditorZoomInOutCommandHandler(): CommandHandler {
    return new EditorZoomInOutCommandHandler();
  }

  /**
   * PageListSortCommandHandler 반환
   */
  public createPageListSortCommandHandler(): CommandHandler {
    return new PageListSortCommandHandler();
  }

  //   /**
  //    * BusinessDialogWidgetCommandHandler 반환
  //    */
  //   public createBusinessDialogWidgetWidgetCommandHandler(): CommandHandler {
  //     return new BusinessDialogWidgetCommandHandler();
  //   }

  //   /**
  //    * ExternalServiceCommandHandler 반환
  //    */
  //   public createExternalCommandHandler(): CommandHandler {
  //     return new ExternalServiceCommandHandler();
  //   }

  /**
   * AppStylesCommandHandler 반환
   */
  public createAppStylesCommandHandler(): CommandHandler {
    return new AppStylesCommandHandler();
  }

  //   /**
  //    * OSCommandHandler 반환
  //    */
  //   public createOSCommandHandler(): CommandHandler {
  //     return new OSCommandHandler();
  //   }

  //   /**
  //    * DxCustomServiceCommandHandler 반환
  //    */
  //   public createDxCustomServiceCommandHandler(): CommandHandler {
  //     return new DxCustomServiceCommandHandler();
  //   }

  //   /**
  //    * CustomCodeCommandHandler 반환
  //    */
  //   public createCustomCodeCommandHandler(): CommandHandler {
  //     return new CustomCodeCommandHandler();
  //   }

  //   /**
  //    * LibraryCommandHandler 반환
  //    */
  //   public createLibraryCommandHandler(): CommandHandler {
  //     return new LibraryCommandHandler();
  //   }
}

export default CommandHandlerFactory;
