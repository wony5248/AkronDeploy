import { observable, makeObservable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import WidgetModel, { WidgetTypeID } from 'models/node/WidgetModel';
import AkronContext from 'models/store/context/AkronContext';
import EditorStore from 'models/store/EditorStore';
import EventState from 'models/store/event/EventState';
import { WidgetTypeEnum } from '@akron/runner';

/**
 * SubToolpaneInfo
 */
interface SubToolpaneInfo {
  component: React.ElementType;
  title: string;
}

/**
 * editingSubToolpane 위치
 */
export interface SubToolpanePosition {
  right: number;
  top: number;
}

/**
 * SubToolpane의 이동을 처리하기 위한 정보를 담은 컨테이너
 */
class SubToolpaneContainer {
  private subToolpane: WidgetTypeEnum | undefined;

  private editingSubToolpane: WidgetTypeEnum | undefined;

  private widgetModel: WidgetModel | undefined;

  @observable
  private editingStartX: number;

  @observable
  private editingStartY: number;

  @observable
  private editingCurrX: number;

  @observable
  private editingCurrY: number;

  @observable
  private subToolpanePositionMap = new Map<WidgetTypeEnum, SubToolpanePosition>();

  private subToolpaneMap = new Map<WidgetTypeEnum, SubToolpaneInfo>();

  @observable
  private isSubToolpaneOpen: boolean;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);
    this.subToolpane = undefined;
    this.editingSubToolpane = undefined;
    this.widgetModel = undefined;
    this.editingStartX = 0;
    this.editingStartY = 0;
    this.editingCurrX = 0;
    this.editingCurrY = 0;
    this.isSubToolpaneOpen = false;
    // this.initSubToolpaneMap();
    this.initSubToolpanePositionMap();
  }

  /**
   * update editingSubToolpane component
   *
   * @param ctx AppContext
   */
  public update(ctx: AkronContext) {
    const selectedWidgets = ctx.getSelectionContainer()?.getSelectedWidgets() ?? [];
    if (selectedWidgets.length === 1) {
      const selectedWidget = selectedWidgets[0];
      if (selectedWidget !== this.getCurrentWidgetModel()) {
        const widgetTypeId = selectedWidgets[0].getWidgetType();
        if (Array.from(this.subToolpaneMap.keys()).includes(widgetTypeId)) {
          this.setSubToolpane(widgetTypeId);
          this.setOpenSubToolpane(true);
          this.setCurrentWidgetModel(selectedWidgets[0] as WidgetModel);
        } else {
          this.setSubToolpane(undefined);
          this.setOpenSubToolpane(false);
          this.setCurrentWidgetModel(undefined);
        }
      }
    } else {
      this.setSubToolpane(undefined);
      this.setOpenSubToolpane(false);
      this.setCurrentWidgetModel(undefined);
    }
  }

  /**
   * editingSubToolpane context update
   *
   * @param ctx AppContext
   */
  @boundMethod
  public setSubToolpane(subToolpane: WidgetTypeEnum | undefined): void {
    this.subToolpane = subToolpane;
  }

  /**
   * editingSubToolpane context update
   *
   * @param ctx AppContext
   */
  @boundMethod
  public getSubToolpane(): WidgetTypeEnum | undefined {
    return this.subToolpane;
  }

  /**
   * editingSubToolpane context update
   *
   * @param ctx AppContext
   */
  @boundMethod
  public getSubToolpaneComponent(appStore: EditorStore): React.ReactNode {
    const widgetModel = appStore.getSelectedWidgets()[0] as WidgetModel;
    const editorUIStore = appStore.getEditorUIStore();
    const isLogicToolpaneOpen = editorUIStore.getIsLogicToolpaneOpen();

    if (this.subToolpane && this.isOpenSubToolpane() && !isLogicToolpaneOpen && widgetModel !== undefined) {
      const subToolpaneInfo = this.subToolpaneMap.get(this.subToolpane);
      if (subToolpaneInfo) {
        // const { component: InnerComponent, title } = subToolpaneInfo;
        return (
          <div></div>
          // <SubToolpaneComponent widgetModel={widgetModel} title={title} subToolpane={this.subToolpane}>
          //     <InnerComponent widgetModel={widgetModel} />
          // </SubToolpaneComponent>
        );
      }
      return <></>;
    }
    return <></>;
  }

  /**
   * get editingSubToolpane
   */
  @boundMethod
  public getEditingSubToolpane(): WidgetTypeEnum | undefined {
    return this.editingSubToolpane;
  }

  /**
   * set editingSubToolpane
   */
  @boundMethod
  public setEditingSubToolpane(editingSubToolpane: WidgetTypeEnum): void {
    this.editingSubToolpane = editingSubToolpane;
  }

  /**
   * get editingStartX
   */
  @boundMethod
  public getEditingStartX(): number {
    return this.editingStartX;
  }

  /**
   * set editingStartX
   */
  @boundMethod
  public setEditingStartX(editingStartX: number): void {
    this.editingStartX = editingStartX;
  }

  /**
   * get editingStartY
   */
  @boundMethod
  public getEditingStartY(): number {
    return this.editingStartY;
  }

  /**
   * set editingStartY
   */
  @boundMethod
  public setEditingStartY(editingStartY: number): void {
    this.editingStartY = editingStartY;
  }

  /**
   * get editingCurrX
   */
  @boundMethod
  public getEditingCurrX(): number {
    return this.editingCurrX;
  }

  /**
   * set editingCurrX
   */
  @boundMethod
  public setEditingCurrX(editingCurrX: number): void {
    this.editingCurrX = editingCurrX;
  }

  /**
   * get editingCurrY
   */
  @boundMethod
  public getEditingCurrY(): number {
    return this.editingCurrY;
  }

  /**
   * set editingCurrY
   */
  @boundMethod
  public setEditingCurrY(editingCurrY: number): void {
    this.editingCurrY = editingCurrY;
  }

  /**
   * get mouse delta x
   */
  @boundMethod
  public getDeltaX(): number {
    return this.editingCurrX - this.editingStartX;
  }

  /**
   * get mouse delta y
   */
  @boundMethod
  public getDeltaY(): number {
    return this.editingCurrY - this.editingStartY;
  }

  /**
   * editingSubToolpane position을 return
   * Event state가 TOOLPANE_MOVE라면 이동중인 position 값을 return하고,
   * 아니라면 toolpanePoisitonMap에 있는 값을 return
   *
   */
  @boundMethod
  public getSubToolpanePosition(editingSubToolpane: WidgetTypeEnum, state: EventState): SubToolpanePosition {
    let startPosition = this.subToolpanePositionMap.get(editingSubToolpane) as SubToolpanePosition;

    if (state === EventState.TOOLPANE_MOVE) {
      const editingCurrX = this.getEditingCurrX();
      const editingCurrY = this.getEditingCurrY();
      const editingStartX = this.getEditingStartX();
      const editingStartY = this.getEditingStartY();
      const right = startPosition.right - (editingCurrX - editingStartX);
      const top = startPosition.top + (editingCurrY - editingStartY);

      startPosition = { right, top };
    }

    let { right, top } = startPosition;

    const ribbonMenu = document.getElementById('ribbonMenu');
    const workspace = document.getElementById('workspace');
    const sideNavigationBar = document.getElementById('sideNavigationBar');
    const rightToolpane = document.getElementById('rightToolPane');
    const subToolpane = document.getElementById('subToolpane');

    if (ribbonMenu && workspace && sideNavigationBar && rightToolpane && subToolpane) {
      const { width: workspaceWidth } = workspace.getBoundingClientRect();
      const { right: sideNavigationBarRight } = sideNavigationBar.getBoundingClientRect();
      const { left: rightToolpaneLeft, width: rightToolpaneWidth } = rightToolpane.getBoundingClientRect();
      const { width: subToolpaneWidth } = subToolpane.getBoundingClientRect();

      if (top < 0) {
        top = 0;
      }
      if (workspaceWidth - (right + subToolpaneWidth) < sideNavigationBarRight) {
        right = rightToolpaneLeft + rightToolpaneWidth - sideNavigationBarRight - subToolpaneWidth;
      }
    }

    return { top, right };
  }

  /**
   * set editingSubToolpane Toolpaneposition
   */
  @boundMethod
  public setSubToolpanePosition(editingSubToolpane: WidgetTypeEnum, Toolpaneposition: SubToolpanePosition): void {
    this.subToolpanePositionMap.set(editingSubToolpane, Toolpaneposition);
  }

  /**
   * get current editingSubToolpane Toolpaneposition
   */
  @boundMethod
  public getCurrentSubToolpanePosition(): SubToolpanePosition | undefined {
    const currentToolpane = this.getEditingSubToolpane();
    if (currentToolpane === undefined) {
      return undefined;
    }
    return this.subToolpanePositionMap.get(currentToolpane);
  }

  /**
   * set current editingSubToolpane Toolpaneposition
   */
  @boundMethod
  public setCurrentSubToolpanePosition(position: SubToolpanePosition): void {
    const currentToolpane = this.getEditingSubToolpane();
    if (currentToolpane === undefined) {
      return;
    }
    this.subToolpanePositionMap.set(currentToolpane, position);
  }

  /**
   * clear container
   */
  @boundMethod
  public clear(): void {
    this.editingStartX = 0;
    this.editingStartY = 0;
    this.editingCurrX = 0;
    this.editingCurrY = 0;
  }

  /**
   * SubToolpane의 open 여부
   *
   * @returns isSubToolpaneOpen
   */
  @boundMethod
  public isOpenSubToolpane(): boolean {
    return this.isSubToolpaneOpen;
  }

  /**
   * SubToolpane open set
   *
   * @param isSubToolpaneOpen isSubToolpaneOpen
   */
  @boundMethod
  public setOpenSubToolpane(isSubToolpaneOpen: boolean) {
    this.isSubToolpaneOpen = isSubToolpaneOpen;
  }

  /**
   * get current widget model
   */
  private getCurrentWidgetModel(): WidgetModel | undefined {
    return this.widgetModel;
  }

  /**
   * set current widget model
   */
  private setCurrentWidgetModel(model: WidgetModel | undefined): void {
    this.widgetModel = model;
  }

  /**
   * editingSubToolpane map 초기화
   */
  // @boundMethod
  // private initSubToolpaneMap(): void {
  //   this.subToolpaneMap.set(119, { title: '차트 상세 설정', component: ChartSubToolpaneComponent });
  //   this.subToolpaneMap.set(141, { title: '펜 상세 설정', component: DrawingToolPaneComponent });
  //   this.subToolpaneMap.set(142, { title: '형광펜 상세 설정', component: DrawingToolPaneComponent });
  //   this.subToolpaneMap.set(145, { title: '선 상세 설정', component: DrawingToolPaneComponent });
  // }

  /**
   * defaulftToolpanePositionMap 초기화
   */
  @boundMethod
  private initSubToolpanePositionMap(): void {
    Array.from(this.subToolpaneMap.keys()).forEach(key =>
      this.subToolpanePositionMap.set(key, { right: 310, top: 20 })
    );
  }
}

export default SubToolpaneContainer;
