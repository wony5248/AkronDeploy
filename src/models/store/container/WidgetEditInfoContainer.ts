import { Nullable, BaseWidgetModel } from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import { observable, makeObservable, action } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import { LayoutWidgetType, WidgetEditingState } from 'models/store/command/widget/WidgetModelTypes';

export enum WidgetResizeHandle {
  NONE,
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  LEFT_TOP,
  RIGHT_TOP,
  LEFT_BOTTOM,
  RIGHT_BOTTOM,
}

export enum WidgetEditSubEventState {
  NONE,
  READY,
  PRESSED,
  DRAG,
  RELEASED,
}

export enum DragState {
  DRAG_START,
  DRAG_MOVE,
  DRAG_END,
}

export enum DragScrollState {
  NONE,
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
  LEFT_TOP,
  RIGHT_TOP,
  LEFT_BOTTOM,
  RIGHT_BOTTOM,
}

/**
 * Widget의 Size & position 정보(property와 다르게 대부분 DOM상의 정보를 저장함)
 */
export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * widget을 drag 삽입할 때 사용되는 info
 */
export interface DragInsertWidgetInfo {
  widgetId: number;
  widgetType: string;
  widgetTypeId?: number;
  libraryType?: string;
  primaryComponentID?: string;
  targetAppID?: string;
  gxPageID?: string;
  gxPageVariableIDs?: string;
  initialPropType?: string;
  libraryID?: number;
  //   libraryDependencyData?: LibraryDependencyData;
  //   insertedPuxLibraryInfoMap?: InsertedPuxLibraryInfoMap;
}

/**
 * Handle이 왼쪽에 위치하는 지 여부 반환
 */
export function isLeftSide(handle: WidgetResizeHandle): boolean {
  if (
    handle === WidgetResizeHandle.LEFT ||
    handle === WidgetResizeHandle.LEFT_BOTTOM ||
    handle === WidgetResizeHandle.LEFT_TOP
  ) {
    return true;
  }
  return false;
}
/**
 * Handle이 오른쪽에 위치하는 지 여부 반환
 */
export function isRightSide(handle: WidgetResizeHandle): boolean {
  if (
    handle === WidgetResizeHandle.RIGHT ||
    handle === WidgetResizeHandle.RIGHT_BOTTOM ||
    handle === WidgetResizeHandle.RIGHT_TOP
  ) {
    return true;
  }
  return false;
}
/**
 * Handle이 위쪽에 위치하는 지 여부 반환
 */
export function isTopSide(handle: WidgetResizeHandle): boolean {
  if (
    handle === WidgetResizeHandle.TOP ||
    handle === WidgetResizeHandle.LEFT_TOP ||
    handle === WidgetResizeHandle.RIGHT_TOP
  ) {
    return true;
  }
  return false;
}
/**
 * Handle이 아래쪽에 위치하는 지 여부 반환
 */
export function isBottomSide(handle: WidgetResizeHandle): boolean {
  if (
    handle === WidgetResizeHandle.BOTTOM ||
    handle === WidgetResizeHandle.LEFT_BOTTOM ||
    handle === WidgetResizeHandle.RIGHT_BOTTOM
  ) {
    return true;
  }
  return false;
}
/**
 * Handle이 수직 방향 중앙에 위치하는 지 여부 반환
 */
export function isVerticalCenterHandle(handle: WidgetResizeHandle): boolean {
  return handle === WidgetResizeHandle.TOP || handle === WidgetResizeHandle.BOTTOM;
}
/**
 * Handle이 수평 방향 중앙에 위치하는 지 여부 반환
 */
export function isHorizontalCenterHandle(handle: WidgetResizeHandle): boolean {
  return handle === WidgetResizeHandle.LEFT || handle === WidgetResizeHandle.RIGHT;
}

/**
 * Widget의 삽입, 이동/크기조절을 처리하기 위한 정보를 담은 컨테이너
 */
class WidgetEditInfoContainer {
  /**
   * 현재 편집의 기준이 되는 widgetModel을 보관
   */
  private editingWidgetModel: Nullable<BaseWidgetModel>;

  /**
   * 현재 편집 중인 widgetModel들을 보관
   */
  private editingWidgetModels: BaseWidgetModel[];

  /**
   * event의 대상이 되는 widgetModel을 보관
   */
  @observable private eventTargetWidgetModel: Nullable<BaseWidgetModel>;

  /**
   * Aspect Ratio Lock 여부
   */
  @observable private isAspectRatioLocked = false;

  /**
   * Aspect Ratio
   */
  @observable private aspectRatio: number | null = null;

  /**
   * 실시간으로 widget의 position 정보를 가지고 있는 map
   */
  @observable private realTimePosition: { top: number; right: number; bottom: number; left: number } | null = null;

  /**
   * 이동, 리사이징 중에 DOM상에서의 widget position 정보를 가지고 있는 map
   * WidgetModel의 ref와는 다르게 처음 이동, 리사이징을 시작한 순간의 ref의 위치와 좌표를 deepcopy해서 가지고 있습니다.
   * 툴페인, 브라우저 리사이징 등의 이유로 widget이 DOM과 property의 position 정보가 달라지는 경우에 쓰임
   * 이동, 리사이징이 끝나면 clear됨
   */
  private refPositionMap: Map<BaseWidgetModel, WidgetPosition>;

  /**
   * 리사이즈 시 생성되는 floating widget과 원본 widget을 저장하는 map
   */
  private floatingWidgetMap: Map<WidgetModel, WidgetModel>;

  /**
   * 현재 이동/리사이징 중인지 상태.
   * 위젯마다가 아닌 글로벌한 상태값이 필요할 때 사용.
   */
  @observable
  private editingState: WidgetEditingState;

  /**
   * 클릭 시작 시 ClientX (마우스 포인터 X)
   */
  private fromClientX: number;

  /**
   * 클릭 시작 시 ClientY (마우스 포인터 Y)
   */
  private fromClientY: number;

  /**
   * 드래깅 후 반영해야 하는 x,y,width,height 변화량
   * x,y: 변화량 절대값
   * width, height: 기존 값에 대한 비율(다중 선택 후 드래깅 시 사이즈는 비율로 조절됨)
   */
  @observable private deltaX: number;

  @observable private deltaY: number;

  @observable private deltaWidth: number;

  @observable private deltaHeight: number;

  /**
   * 방향키를 이용한 이동 시 움직일 거리
   */
  @observable private arrowKeyMovingDistance: number;

  /**
   * Shift+방향키를 이용한 이동 시 움직일 거리
   */
  @observable private arrowKeyMovingDistanceWithShift: number;

  /**
   * 방향키를 이용한 이동 시 움직일 단위
   */
  private arrowKeyMovingUnit: string;

  /**
   * 드래깅한 ResizeHandle 종류
   */
  private resizeHandle: WidgetResizeHandle;

  /**
   *
   */
  @observable private widgetEditSubEventState: WidgetEditSubEventState;

  /**
   * 삽입할 container type.
   * Container는 버튼 클릭 후 바로 삽입되지 않고 드래그로 삽입되므로 type을 저장해야 함.
   */
  private insertContainerType: LayoutWidgetType | undefined;

  /**
   * drag로 삽입하는 widget의 info
   */
  private dragInsertWidgetInfo?: DragInsertWidgetInfo;

  /**
   * drag 시작 마우스 x위치
   */
  @observable private dragGuideStartX: number;

  /**
   * drag 시작 마우스 y위치
   */
  @observable private dragGuideStartY: number;

  /**
   * drag 끝 마우스 x위치
   */
  @observable private dragGuideEndX: number;

  /**
   * drag 끝 마우스 y위치
   */
  @observable private dragGuideEndY: number;

  /**
   * 마우스 drag 상태
   */
  private dragState: DragState;

  /**
   * 마우스 drag scroll 상태
   */
  private dragScrollState: DragScrollState;

  /**
   * 생성자
   */
  public constructor() {
    makeObservable(this);
    this.editingWidgetModel = undefined;
    this.editingWidgetModels = new Array<BaseWidgetModel>();
    this.eventTargetWidgetModel = undefined;
    this.refPositionMap = new Map();
    this.fromClientX = 0;
    this.fromClientY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.deltaWidth = 0;
    this.deltaHeight = 0;
    this.arrowKeyMovingDistance = 1;
    this.arrowKeyMovingDistanceWithShift = 10;
    this.arrowKeyMovingUnit = 'px';
    this.resizeHandle = WidgetResizeHandle.NONE;
    this.widgetEditSubEventState = WidgetEditSubEventState.NONE;
    this.editingState = WidgetEditingState.NONE;
    this.floatingWidgetMap = new Map();
    this.dragGuideStartX = 0;
    this.dragGuideStartY = 0;
    this.dragGuideEndX = 0;
    this.dragGuideEndY = 0;
    this.dragState = DragState.DRAG_END;
    this.dragScrollState = DragScrollState.NONE;
  }

  /**
   * refPositionMap set.
   */
  @boundMethod
  public setRefPositionMap(widgetModel: BaseWidgetModel, refPosition: WidgetPosition): void {
    this.refPositionMap.set(widgetModel, refPosition);
  }

  /**
   * refPositionMap set.
   */
  @boundMethod
  public setEditingFloatingWidget(floatingWidget: WidgetModel, originWidget: WidgetModel): void {
    this.floatingWidgetMap.set(originWidget, floatingWidget);
  }

  /**
   * refPositionMap get.
   */
  @boundMethod
  public getRefPositionMap(widgetModel: BaseWidgetModel): WidgetPosition | undefined {
    return this.refPositionMap.get(widgetModel);
  }

  /**
   * refPositionMap get.
   */
  @boundMethod
  public getEditingFloatingWidget(originWidget: WidgetModel): WidgetModel | undefined {
    return this.floatingWidgetMap.get(originWidget);
  }

  /**
   * editingWidgetModel setter
   */
  public setEditingWidgetModel(widgetModel: Nullable<BaseWidgetModel>): void {
    this.editingWidgetModel = widgetModel;
  }

  /**
   * editingWidgetModel getter
   */
  public getEditingWidgetModel(): Nullable<BaseWidgetModel> {
    return this.editingWidgetModel;
  }

  /**
   * Append widget model to editingWidgetModels
   */
  public appendEditingWidgetModel(widgetModel: BaseWidgetModel): void {
    this.editingWidgetModels.push(widgetModel);
  }

  /**
   * claer editingWidgetModels
   */
  public clearEditingWidgetModel(): void {
    this.setEditingWidgetModel(undefined);
    this.setEditingWidgetModels(new Array<BaseWidgetModel>());
  }

  /**
   * editingWidgetModels setter
   */
  public setEditingWidgetModels(widgetModels: BaseWidgetModel[]): void {
    this.editingWidgetModels = widgetModels;
  }

  /**
   * editingWidgetModels getter
   */
  @boundMethod
  public getEditingWidgetModels(): BaseWidgetModel[] {
    return this.editingWidgetModels;
  }

  /**
   * eventTargetWidgetModel setter
   */
  @boundMethod
  public setEventTargetWidgetModel(graphicModel: Nullable<BaseWidgetModel>): void {
    this.eventTargetWidgetModel = graphicModel;
  }

  /**
   * eventTargetWidgetModel getter
   */
  @boundMethod
  public getEventTargetWidgetModel(): Nullable<BaseWidgetModel> {
    return this.eventTargetWidgetModel;
  }

  /**
   * refPositionMap clear.
   */
  @boundMethod
  public clearRefPositionMap(): void {
    this.refPositionMap.clear();
  }

  /**
   * floatingWidgetMap clear.
   */
  @boundMethod
  public clearFloatingWidgetMap(): void {
    this.floatingWidgetMap.clear();
  }

  /**
   * 드래깅 시작 시 커서의 X값 설정
   */
  @boundMethod
  public setFromClientX(fromClientX: number): void {
    this.fromClientX = fromClientX;
  }

  /**
   * 드래깅 시작 시 커서의 X값 반환
   */
  @boundMethod
  public getFromClientX(): number {
    return this.fromClientX;
  }

  /**
   * 드래깅 시작 시 커서의 X값 설정
   */
  @boundMethod
  public setFromClientY(fromClientY: number): void {
    this.fromClientY = fromClientY;
  }

  /**
   * 드래깅 시작 시 커서의 X값 반환
   */
  @boundMethod
  public getFromClientY(): number {
    return this.fromClientY;
  }

  /**
   * X 변화량 설정
   */
  @action.bound
  public setDeltaX(deltaX: number): void {
    this.deltaX = deltaX;
  }

  /**
   * X 변화량 반환
   */
  @boundMethod
  public getDeltaX(): number {
    return this.deltaX;
  }

  /**
   * Y 변화량 설정
   */
  @action.bound
  public setDeltaY(deltaY: number): void {
    this.deltaY = deltaY;
  }

  /**
   * Y 변화량 반환
   */
  @boundMethod
  public getDeltaY(): number {
    return this.deltaY;
  }

  /**
   * width 변화량 설정
   */
  @action.bound
  public setDeltaWidth(deltaWidth: number): void {
    this.deltaWidth = deltaWidth;
  }

  /**
   * width 변화량 반환
   */
  @boundMethod
  public getDeltaWidth(): number {
    return this.deltaWidth;
  }

  /**
   * height 변화량 설정
   */
  @action.bound
  public setDeltaHeight(deltaHeight: number): void {
    this.deltaHeight = deltaHeight;
  }

  /**
   * height 변화량 반환
   */
  @boundMethod
  public getDeltaHeight(): number {
    return this.deltaHeight;
  }

  /**
   * ResizeHandle 종류 설정
   */
  @boundMethod
  public setResizeHandle(handle: WidgetResizeHandle): void {
    this.resizeHandle = handle;
  }

  /**
   * ResizeHandle 종류 반환
   */
  @boundMethod
  public getResizeHandle(): WidgetResizeHandle {
    return this.resizeHandle;
  }

  /**
   * insertContainerType getter.
   */
  public getInsertContainerType(): LayoutWidgetType | undefined {
    return this.insertContainerType;
  }

  /**
   * insertContainerType setter.
   */
  public setInsertContainerType(insertContainerType: LayoutWidgetType) {
    this.insertContainerType = insertContainerType;
  }

  /**
   * state getter.
   */
  public getEditingState(): WidgetEditingState {
    return this.editingState;
  }

  /**
   * state setter.
   */
  @action
  public setEditingState(editingState: WidgetEditingState) {
    this.editingState = editingState;
  }

  /**
   * widgetEditSubEventState setter
   */
  @boundMethod
  public setWidgetEditSubEventState(state: WidgetEditSubEventState): void {
    this.widgetEditSubEventState = state;
  }

  /**
   * widgetEditSubEventState getter
   */
  @boundMethod
  public getWidgetEditSubEventState(): WidgetEditSubEventState {
    return this.widgetEditSubEventState;
  }

  /**
   * 편집 관련 정보를 초기화하는 함수
   */
  public clear(): void {
    this.clearEditingWidgetModel();
    // TODO: clearEditingWidgetModel 함수에 포함시켜야될지 검토
    this.setEventTargetWidgetModel(undefined);
    this.clearRefPositionMap();
    this.clearFloatingWidgetMap();

    this.setFromClientX(0);
    this.setFromClientY(0);
    this.setDeltaX(0);
    this.setDeltaY(0);
    this.setDeltaWidth(0);
    this.setDeltaHeight(0);

    this.setEditingState(WidgetEditingState.NONE);
    this.setWidgetEditSubEventState(WidgetEditSubEventState.NONE);
    this.setResizeHandle(WidgetResizeHandle.NONE);

    this.setDragInsertWidgetInfo(undefined);

    this.setDragGuideStartX(0);
    this.setDragGuideStartY(0);
    this.setDragGuideEndX(0);
    this.setDragGuideEndY(0);
    this.setDragState(DragState.DRAG_END);
    this.setDragScrollState(DragScrollState.NONE);
    // 편집 이벤트 종료 시에도 초기화되지 않아야 하는 정보
    // this.arrowKeyMovingDistance = 1;
    // this.arrowKeyMovingDistanceWithShift = 10;
    // this.arrowKeyMovingUnit = 'px';
  }

  /**
   * get arrowKeyMovingDistance.
   */
  public getArrowKeyMovingDistance(): number {
    return this.arrowKeyMovingDistance;
  }

  /**
   * set arrowKeyMovingDistance.
   */
  @boundMethod
  public setarrowKeyMovingDistance(arrowKeyMovingDistance: number) {
    this.arrowKeyMovingDistance = arrowKeyMovingDistance;
  }

  /**
   * get arrowKeyMovingDistanceWithShift.
   */
  public getArrowKeyMovingDistanceWithShift(): number {
    return this.arrowKeyMovingDistanceWithShift;
  }

  /**
   * set arrowKeyMovingDistanceWithShift.
   */
  @boundMethod
  public setarrowKeyMovingDistanceWithShift(arrowKeyMovingDistanceWithShift: number) {
    this.arrowKeyMovingDistanceWithShift = arrowKeyMovingDistanceWithShift;
  }

  /**
   * get ArrowKeyMovingUnit.
   */
  public getArrowKeyMovingUnit(): string {
    return this.arrowKeyMovingUnit;
  }

  /**
   * set ArrowKeyMovingUnit.
   */
  public setArrowKeyMovingUnit(arrowKeyMovingUnit: string) {
    this.arrowKeyMovingUnit = arrowKeyMovingUnit;
  }

  /**
   * 드래그 시작 시 삽입할 widgetInfo 저장
   */
  @boundMethod
  public setDragInsertWidgetInfo(dragInsertWidgetInfo: DragInsertWidgetInfo | undefined): void {
    this.dragInsertWidgetInfo = dragInsertWidgetInfo;
  }

  /**
   * 드래그 시작 시 설정한 삽입될 widgetInfo 반환
   */
  @boundMethod
  public getDragInsertWidgetInfo(): DragInsertWidgetInfo | undefined {
    return this.dragInsertWidgetInfo;
  }

  /**
   * 드래그 시작 시 마우스 X위치 저장
   */
  @boundMethod
  public setDragGuideStartX(dragGuideStartX: number): void {
    this.dragGuideStartX = dragGuideStartX;
  }

  /**
   * 드래그 시작 시 마우스 Y위치 저장
   */
  @boundMethod
  public setDragGuideStartY(dragGuideStartY: number): void {
    this.dragGuideStartY = dragGuideStartY;
  }

  /**
   * 드래그 종료 시 마우스 X위치 저장
   */
  @boundMethod
  public setDragGuideEndX(dragGuideEndX: number): void {
    this.dragGuideEndX = dragGuideEndX;
  }

  /**
   * 드래그 종료 시 마우스 Y위치 저장
   */
  @boundMethod
  public setDragGuideEndY(dragGuideEndY: number): void {
    this.dragGuideEndY = dragGuideEndY;
  }

  /**
   * 드래그 시작 시 마우스 X위치 반환
   */
  @boundMethod
  public getDragGuideStartX(): number {
    return this.dragGuideStartX;
  }

  /**
   * 드래그 시작 시 마우스 Y위치 반환
   */
  @boundMethod
  public getDragGuideStartY(): number {
    return this.dragGuideStartY;
  }

  /**
   * 드래그 종료 시 마우스 X위치 반환
   */
  @boundMethod
  public getDragGuideEndX(): number {
    return this.dragGuideEndX;
  }

  /**
   * 드래그 종료 시 마우스 Y위치 반환
   */
  @boundMethod
  public getDragGuideEndY(): number {
    return this.dragGuideEndY;
  }

  /**
   * Aspect Ratio Lock 여부 반환
   */
  @boundMethod
  public getIsAspectRatioLocked(): boolean {
    return this.isAspectRatioLocked;
  }

  /**
   * Aspect Ratio Lock 여부 설정
   */
  @boundMethod
  public setIsAspectRatioLocked(locked: boolean): void {
    this.isAspectRatioLocked = locked;
  }

  /**
   * Aspect Ratio 반환
   */
  @boundMethod
  public getAspectRatio(): number | null {
    return this.aspectRatio;
  }

  /**
   * Aspect Ratio 설정
   */
  @boundMethod
  public setAspectRatio(ratio: number | null): void {
    this.aspectRatio = ratio;
  }

  /**
   * 실시간으로 widget의 position 정보를 가지고 있는 map 반환
   */
  @boundMethod
  public setRealTimePosition(position: { top: number; right: number; bottom: number; left: number } | null) {
    this.realTimePosition = position;
  }

  /**
   * 실시간으로 widget의 position 정보를 가지고 있는 map 반환
   */
  @boundMethod
  public getRealTimePosition() {
    return this.realTimePosition;
  }

  /**
   * 드래그 상태 저장
   */
  public setDragState(state: DragState): void {
    this.dragState = state;
  }

  /**
   * 드래그 상태 반환
   */
  public getDragState(): DragState | undefined {
    return this.dragState;
  }

  /**
   * 드래그 스크롤 상태 저장
   */
  public setDragScrollState(state: DragScrollState): void {
    this.dragScrollState = state;
  }

  /**
   * 드래그 스크롤 상태 반환
   */
  public getDragScrollState(): DragScrollState | undefined {
    return this.dragScrollState;
  }
}

export default WidgetEditInfoContainer;
