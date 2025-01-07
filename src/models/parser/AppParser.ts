import {
  dError,
  dWarn,
  isDefined,
  isNotNull,
  isUndefined,
  IWidgetContentProperties,
  IWidgetStyleProperties,
  Nullable,
  WidgetTypeEnum,
} from '@akron/runner';
import { boundMethod } from 'autobind-decorator';
import WidgetModel from 'models/node/WidgetModel';

export type AppJson = {
  components: NodeJson[];
};

/**
 * Node serialize 에 필요한 JSON 타입입니다.
 */
export interface NodeJson {
  appID?: number;
  componentID: number;
  componentType: string;
  name: string;
  contentsData: IWidgetContentProperties;
  stylesData: IWidgetStyleProperties;
  parentID: number | undefined;
  childID: number | undefined | null;
  nextID: number | undefined | null;
}

/**
 * 파싱 간 정보를 전달하는 context 자료구조 입니다.
 */
export interface AppParserContext {
  /**
   * 파싱할 JSON 자료구조입니다. Map<ID, JSON object 형태입니다. 직접 수정할 수 없습니다.
   */
  contents: Map<number, NodeJson>;
  /**
   * 현재 파싱을 진행하고 있는 node 의 id 입니다.
   */
  id: number | undefined | null;
  /*
   * 파싱할 node 의 부모 node 입니다. undefined 인 경우, root 입니다.
   */
  parentNode?: WidgetModel | undefined;
}

/**
 * app widget model tree 를 파싱하기 위한 class 입니다.
 */
class AppParser {
  /**
   * parser 가 생성한 node 입니다.
   */
  private node?: WidgetModel;

  /*
   * AppWidget 입니다. 하위의 child들을 붙입니다.
   */
  private rootNode?: WidgetModel;

  /**
   * 중복 파싱을 막기 위한 Widget ID set 입니다.
   */
  private widgetIDSet: Set<number>;

  /**
   * 파싱 간 정보를 전달하는 자료구조 입니다.
   */
  private ctx: AppParserContext;

  /**
   * 생성자
   * appJson을 토대로 app을 파싱합니다.
   */
  constructor(appJson: AppJson) {
    this.node = undefined;
    this.rootNode = undefined;
    this.widgetIDSet = new Set();
    this.ctx = this.createCtx(appJson.components);
    this.parse();
  }

  /**
   * 생성된 AppModel을 반환합니다.
   */
  public getAppModel() {
    return this.rootNode as WidgetModel;
  }

  /**
   * 서버에서 받아온 데이터를 파싱하기 위한 구조로 변환합니다.
   */
  private createCtx(items: NodeJson[]) {
    const contents = new Map<number, NodeJson>();
    items.forEach(item => contents.set(item.componentID, item));

    return {
      contents: contents,
      id: items[0].appID,
    } as AppParserContext;
  }

  /**
   * contents map 으로부터 json object 를 찾아줍니다.
   *
   * @param id 가져올 json object 의 id
   * @returns id 에 해당하는 json object, 찾지 못했다면 undefined
   */
  @boundMethod
  private getJson(id: number): Nullable<NodeJson> {
    const obj = this.ctx.contents.get(Number(id));
    return obj;
  }

  /**
   * page가 아닌 일반 WidgetModel을 생성하는 함수입니다.
   */
  private createComponent(item: NodeJson) {
    const { componentID, componentType, name, contentsData, stylesData } = item;
    const contents = contentsData;
    const styles = stylesData;

    return new WidgetModel({
      id: componentID,
      widgetCategory: '',
      widgetType: componentType as WidgetTypeEnum,
      name: name,
      properties: {
        content: contents,
        style: styles,
      },
    });
  }

  /**
   * node 생성 작업을 수행합니다. node 를 parent 에 append 합니다.
   */
  private onCreateNode(node: WidgetModel, ctx: AppParserContext): void {
    if (!!ctx.parentNode) {
      node.append(ctx.parentNode);
      return;
    }

    // undefined일 경우 rootNode가 parent가 됨
    ctx.parentNode = node;
    this.rootNode = node;
  }

  /**
   * 해당 Node 의 파싱을 진행합니다.
   *
   * @param item desrialize 해야 할 JSON object
   * @returns 파싱된 node instance
   */
  private parseNode(item: NodeJson): WidgetModel | undefined {
    let node: WidgetModel;

    if (this.widgetIDSet.has(item.componentID)) {
      // 간헐적으로 Widget tree가 꼬여서 서큘러가 되는 이슈가 있음
      dError(`${item.name} is already parsed!`);
      return undefined;
    }
    this.widgetIDSet.add(item.componentID);

    switch (item.componentType) {
      case 'App': {
        node = this.createComponent(item);
        break;
      }
      case 'Page': {
        node = this.createComponent(item);
        break;
      }
      default: {
        node = this.createComponent(item);
        break;
      }
    }

    this.onCreateNode(node, this.ctx);
    return node;
  }

  /**
   * 자식 node들을 찾아 parse() 를 호출합니다.
   */
  @boundMethod
  private parseChildNode(parentNode: WidgetModel, firstChildID: number): void {
    const cachedParent = this.ctx.parentNode;

    // 형제들 간에 중복 있는 경우 무한루프 걸리는 것을 방지.
    const siblingIDSet: Set<number> = new Set();

    for (this.ctx.id = firstChildID; isNotNull(this.ctx.id); ) {
      if (!!this.ctx.id) {
        siblingIDSet.add(this.ctx.id);
      }

      this.ctx.parentNode = parentNode;

      if (!!this.ctx.id) {
        const childItem = this.getJson(this.ctx.id);
        this.parse();
        const nextID = childItem?.nextID;

        if (isDefined(nextID) && isNotNull(nextID) && siblingIDSet.has(nextID)) {
          dError(`AppParser: 부모 ${parentNode.getName()} 아래에 중복된 노드들이 있습니다 - ID ${nextID}`);
          break;
        }

        this.ctx.id = nextID;
      } else {
        dWarn(`AppParser: In ${parentNode.getName()}, ID of a child is undefined.`);
        break;
      }
    }
    this.ctx.parentNode = cachedParent;
  }

  private parse() {
    if (!this.ctx.id) {
      dWarn(`AppParser: ctx.id is ${this.ctx.id}.`);
      return;
    }
    const item = this.getJson(this.ctx.id);
    if (isUndefined(item)) {
      dWarn();
      return;
    }
    this.node = this.parseNode(item);

    // dLog(this.node);
    // parse child
    if (!item.childID || !this.node) {
      return;
    }

    this.parseChildNode(this.node, item.childID);
  }
}

export default AppParser;
