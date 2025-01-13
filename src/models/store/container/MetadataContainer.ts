import { Nullable, WidgetCategory, WidgetTypeEnum } from '@akron/runner';
import { makeObservable, observable } from 'mobx';
import WidgetModel from 'models/node/WidgetModel';
import AppRepository from 'models/repository/AppRepository';
import { createContentData, createStyleData } from 'util/MetadataUtil';

export interface MetadataContainerProp {
  componentMetadatas: ComponentMetadata[];
}

export interface ComponentMetadata {
  name: string;
  componentType: string;
  componentCategory: string;
  code?: string;
  contents: Map<string, ContentMetadata>;
  styles: Map<string, StyleMetadata>;
}

export interface ContentMetadata {
  name: string;
  componentType: string;
  dataType: number;
  defaultValue: any;
  control: number;
  description: string;
}

export interface StyleMetadata {
  name: string;
  componentType: string;
  dataType: number;
  defaultValue: any;
  control: number;
  description: string;
}

class MetadataContainer {
  @observable
  private defaultWidgetModels: Map<WidgetTypeEnum, WidgetModel>;

  @observable
  private contentMetadatas: Map<WidgetTypeEnum, Map<string, ContentMetadata>>;

  @observable
  private styleMetadatas: Map<WidgetTypeEnum, Map<string, StyleMetadata>>;

  constructor(initProp: MetadataContainerProp) {
    makeObservable(this);
    const { widgetModels, contentMetadatas, styleMetadatas } = this.createDefaultDatas(initProp.componentMetadatas);
    this.defaultWidgetModels = widgetModels;
    this.contentMetadatas = contentMetadatas;
    this.styleMetadatas = styleMetadatas;
  }

  public async updateWidgetModels(widgetTypes: WidgetTypeEnum[]) {
    const metadatas = await AppRepository.getComponentMetadatas({ componentTypes: widgetTypes });
    this.appendDefaultDatas(metadatas);
  }

  public getDefaultWidgetModels(): Map<WidgetTypeEnum, WidgetModel> {
    return this.defaultWidgetModels;
  }

  public getDefaultWidgetModel(widgetType: WidgetTypeEnum): Nullable<WidgetModel> {
    return this.defaultWidgetModels.get(widgetType);
  }

  public getContentMetadatas(): Map<WidgetTypeEnum, Map<string, ContentMetadata>> {
    return this.contentMetadatas;
  }

  public getStyleMetadatas(): Map<WidgetTypeEnum, Map<string, StyleMetadata>> {
    return this.styleMetadatas;
  }

  public getWidgetContentMetadata(widgetType: WidgetTypeEnum): Map<string, ContentMetadata> | undefined {
    return this.contentMetadatas.get(widgetType);
  }

  public getWidgetStyleMetadata(widgetType: WidgetTypeEnum): Map<string, ContentMetadata> | undefined {
    return this.styleMetadatas.get(widgetType);
  }

  private createDefaultDatas(metadatas: ComponentMetadata[]) {
    const widgetModels = new Map<WidgetTypeEnum, WidgetModel>();
    const contentMetadatas = new Map<WidgetTypeEnum, Map<string, ContentMetadata>>();
    const styleMetadatas = new Map<WidgetTypeEnum, Map<string, StyleMetadata>>();

    metadatas.forEach(metadata => {
      const widgetType = metadata.componentType as WidgetTypeEnum;
      const widgetModel = new WidgetModel({
        id: -1,
        widgetType: widgetType,
        widgetCategory: metadata.componentCategory as WidgetCategory,
        name: metadata.name,
        properties: {
          content: createContentData(metadata.contents),
          style: createStyleData(metadata.styles),
        },
      });

      contentMetadatas.set(widgetType, metadata.contents);
      styleMetadatas.set(widgetType, metadata.styles);
      widgetModels.set(widgetType, widgetModel);
    });

    return { widgetModels, contentMetadatas, styleMetadatas };
  }

  private appendDefaultDatas(metadatas: ComponentMetadata[]) {
    metadatas.forEach(metadata => {
      const widgetType = metadata.componentType as WidgetTypeEnum;
      const widgetModel = new WidgetModel({
        id: -1,
        widgetType: widgetType,
        widgetCategory: metadata.componentCategory as WidgetCategory,
        name: metadata.name,
        properties: {
          content: createContentData(metadata.contents),
          style: createStyleData(metadata.styles),
        },
      });

      this.contentMetadatas.set(widgetType, metadata.contents);
      this.styleMetadatas.set(widgetType, metadata.styles);
      this.defaultWidgetModels.set(widgetType, widgetModel);
    });
  }
}

export default MetadataContainer;
