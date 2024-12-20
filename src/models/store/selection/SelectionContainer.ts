import { action, makeObservable } from 'mobx';
import { WidgetModel } from 'models/store/EditorStore';
import WidgetSelection from 'models/store/selection/WidgetSelection';

/**
 * SuperUX의 Selection 정보를 담기 위한 Class
 */
export default class SelectionContainer {
  // 현재 선택된 Basic WidgetSelection 정보.
  private widgetSelections: WidgetSelection[];

  // 추가적인 정보가 필요할 수도 있음 ex) 속한 구역 정보
  // 그럴 때는 WidgetSelection을 상속받아 사용
  private pageSelections: WidgetSelection[];

  // 이동 중 나타나는 floating widgetModel
  // 이동 시작 시 생기며 이동 완료 후 사라짐
  private floatingWidgetModels: WidgetModel[];

  // 해당 선택된 페이지들이 이동중인 상태인지 확인하는 boolean
  // 이동 중에는 handleMouseDown이 동작하면 안됨
  // 해당 로직은 superoffice 쪽 로직을 참고했음.
  // TODO 구조가 좋지 않아 보여 추후 수정필요
  private isMove?: boolean;

  //   private sectionSelection?: SectionSelection;

  private editingPage?: WidgetModel;

  // GX에서 만든 widget의 child widget 중 direct select될 수 있는 widget을 담는 배열
  private selectableWidgetModels: WidgetModel[];

  private hoverableWidgetModel: WidgetModel | undefined;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);
    this.widgetSelections = Array<WidgetSelection>();
    this.pageSelections = Array<WidgetSelection>();
    this.floatingWidgetModels = Array<WidgetModel>();
    this.isMove = false;
    // this.sectionSelection = undefined;
    this.editingPage = undefined;
    this.selectableWidgetModels = Array<WidgetModel>();
    this.hoverableWidgetModel = undefined;
  }

  /**
   * 현재 선택된 Widget의 type에 따라 select를 수행합니다.
   *
   * @param selected widget의 select 유무.
   */
  @action.bound
  public setSelected(selected: boolean): void {
    selected;
    // this.widgetSelections.forEach(selection => {
    //     selection.setSelected(selected);
    // });
    // this.pageSelections.forEach(selection => {
    //     selection.setSelected(selected);
    // }); this.widgetSelections.forEach(selection => {
    //     selection.setSelected(selected);
    // });
    // this.pageSelections.forEach(selection => {
    //     selection.setSelected(selected);
    // });
    // this.sectionSelection?.setSelected(selected);
  }

  /**
   * HTML WidgetComponent의 경우, 선택된 Widget ID를 설정함.
   *
   * @param widgetModel BasicWidgetModel
   */
  @action.bound
  public setWidgetSelection(widgetModel: WidgetModel): void {
    this.widgetSelections.push(new WidgetSelection(widgetModel));
  }

  /**
   * Page Thumbnail Selection의 경우일반 WidgetComponent와 동일하게 set
   */
  @action.bound
  public setSelectedPage(widgetModel: WidgetModel | undefined): void {
    if (widgetModel) {
      this.pageSelections.push(new WidgetSelection(widgetModel));
    }
  }

  /**
   * SelectionProp에 editingPageModel을 세팅할 경우에 selectionContainer에 담기 위한 함수
   * getEditingPage의 경우, 해당 값이 세팅되어있지 않을경우 페이지들 중 가장 마지막 페이지를 반환함
   */
  public setEditingPage(widgetModel: WidgetModel | undefined): void {
    this.editingPage = widgetModel;
  }

  /**
   * section selection을 설정함. 구역을  생성하지 않으면 없음
   */
  //   @action.bound
  //   public setSelectedSection(
  //     appWidgetModel: WidgetModel,
  //     pageSection: PageSection,
  //     widgetModels: WidgetModel[] | undefined
  //   ): void {
  //     const sectionSelection = new SectionSelection(appWidgetModel, pageSection, widgetModels);
  //     this.sectionSelection = sectionSelection;
  //   }

  /**
   * floatingWidgetModels 셋팅.
   * 현재 선택중인 widgetModels을 한번에 셋팅함
   */
  public setFloatingWidgetModels(floatingWidgetModels: WidgetModel[]) {
    this.floatingWidgetModels = floatingWidgetModels;
  }

  /**
   * floatingWidgetModels getter.
   */
  public getFloatingWidgetModels() {
    return this.floatingWidgetModels;
  }

  /**
   * floatingWidgetModels clear.
   */
  public clearFloatingWidgetModels() {
    this.floatingWidgetModels = [];
  }

  /**
   * 선택된 widget 의 parent model 을 반환합니다.
   */
  public getSelectedWidgetParentWidget() {
    return this.widgetSelections.length !== 0 ? this.widgetSelections[0].getParentModel() : undefined;
  }

  /**
   * 현재 편집 중인 페이지를 반환합니다.
   * (선택된 페이지들 중 마지막 페이지와 동일합니다.)
   * mode에 따라 BusinesssDialog, Composite을 반환할 수도 있습니다.
   *
   * @returns 선택된 widget Model.
   */
  public getEditingPage() {
    if (this.editingPage) {
      return this.editingPage;
    }

    return this.pageSelections.length > 0
      ? this.pageSelections[this.pageSelections.length - 1].getWidgetModel()
      : undefined;
  }

  /**
   * 선택된 widget Model들을 반환합니다.
   *
   * @returns 선택된 widget Models.
   */
  public getSelectedWidgets() {
    return this.widgetSelections.map(selection => selection.getWidgetModel());
  }

  /**
   * 선택된 페이지 썸네일 WidgetModel들을 반환합니다.
   *
   * @returns 선택된 widget Models.
   */
  public getSelectedPages() {
    return this.pageSelections.map(selection => selection.getWidgetModel());
  }

  /**
   * 선택된 구역 셀렉션을 반환. 구역 페이지들의 정보와 구역 정보를 가지고 있음
   */
  //   public getSelectedSection() {
  //     return this.sectionSelection;
  //   }

  /**
   * 선택된 페이지들이 이동중인 상태인지를 세팅하는 함수
   */
  public setMoveMode(isMove: boolean) {
    this.isMove = isMove;
  }

  /**
   * 선택된 페이지들이 이동중인 상태인지를 반환하는 함수
   */
  public isMoveMode() {
    return this.isMove;
  }

  /**
   * selectableWidgetModels getter.
   */
  public getSelectableWidgetModels(): WidgetModel[] {
    return this.selectableWidgetModels;
  }

  /**
   * selectableWidgetModels 셋팅.
   * 선택 가능한 widgetModel
   */
  //   public initSelectableWidgetModels(widgetModel: WidgetModel) {
  //     if (widgetModel.getWidgetType() === 'Page') {
  //       return;
  //     }
  //     const parentWidget = widgetModel.getParent();
  //     if (isDefined(parentWidget) && parentWidget.getParent()?.getWidgetType() !== 'Page') {
  //       // parent가 1depth widget이 아니라면
  //       this.initSelectableWidgetModels(parentWidget);
  //     }
  //     // parent가 page면 child는 1depth widget이기 때문에 무의미하여 만들어주지 않음
  //     if (parentWidget?.getWidgetType() !== 'Page') {
  //       parentWidget?.forEachChild(child => {
  //         this.selectableWidgetModels.push(child);
  //       });
  //     }
  //   }

  /**
   * selectableWidgetModels 초기화.
   * selectable false
   */
  //   public clearSelectableWidgetModels() {
  //     this.selectableWidgetModels.forEach(model => {
  //       model.setSelectable(false);
  //     });
  //     this.selectableWidgetModels = [];
  //   }

  /**
   * selectableWidgetModels 셋팅.
   * selectable true
   */
  //   public setWidgetModelSelectable(): void {
  //     this.selectableWidgetModels.forEach(model => {
  //       model.setSelectable(true);
  //     });
  //   }

  /**
   * hoverWi
   */
  public getHoverableWidgetModel(): WidgetModel | undefined {
    return this.hoverableWidgetModel;
  }

  /**
   * hover되는 widgetModel을 set
   */
  public setHoverableWidgetModel(widgetModel: WidgetModel | undefined): void {
    this.hoverableWidgetModel = widgetModel;
  }

  /**
   * Selection Container를 Clone하여 반환하는 함수
   */
  public clone(): SelectionContainer {
    const newContainer = new SelectionContainer();
    this.widgetSelections.forEach(selection => {
      newContainer.setWidgetSelection(selection.getWidgetModel());
    });
    this.pageSelections.forEach(selection => {
      newContainer.setSelectedPage(selection.getWidgetModel());
    });
    const widgetModels = newContainer.getFloatingWidgetModels().slice();
    newContainer.setFloatingWidgetModels(widgetModels);
    if (this.isMove !== undefined) {
      newContainer.setMoveMode(this.isMove);
    }
    // if (this.sectionSelection !== undefined)
    //   newContainer.setSelectedSection(
    //     this.sectionSelection.getAppWidgetModel(),
    //     this.sectionSelection.getSectionInfo(),
    //     this.sectionSelection.getSectionPages()
    //   );
    newContainer.setEditingPage(this.editingPage);
    return newContainer;
  }
}
