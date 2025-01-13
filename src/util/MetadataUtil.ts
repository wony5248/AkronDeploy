import { IPropertyInstance, IWidgetContentProperties, IWidgetStyleProperties } from '@akron/runner';
import { ContentMetadata, StyleMetadata } from 'models/store/container/MetadataContainer';

export function createContentData(metadatas: Map<string, ContentMetadata>): IWidgetContentProperties {
  const contents: IWidgetContentProperties = {};
  metadatas.forEach((metadata, key) => {
    const content: IPropertyInstance = { value: null, defaultValue: metadata.defaultValue, variableId: null };
    contents[key] = content;
  });
  return contents;
}

export function createStyleData(metadatas: Map<string, StyleMetadata>): IWidgetStyleProperties {
  const styles: IWidgetStyleProperties = {};
  metadatas.forEach((metadata, key) => {
    const style: IPropertyInstance = { value: null, defaultValue: metadata.defaultValue, variableId: null };
    styles[key] = style;
  });
  return styles;
}
