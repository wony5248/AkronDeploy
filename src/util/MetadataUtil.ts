import { IPropertyInstance, IWidgetContentProperties, IWidgetStyleProperties } from '@akron/runner';
import { ContentMetadata, StyleMetadata } from 'models/store/container/MetadataContainer';

export function createContentData(metadatas: { [key: string]: ContentMetadata }): IWidgetContentProperties {
  const contents: IWidgetContentProperties = {};
  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      const content: IPropertyInstance = { value: null, defaultValue: metadata.defaultValue, variableId: null };
      contents[key] = content;
    }
  }
  return contents;
}

export function createStyleData(metadatas: { [key: string]: StyleMetadata }): IWidgetStyleProperties {
  const styles: IWidgetStyleProperties = {};
  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      const style: IPropertyInstance = { value: null, defaultValue: metadata.defaultValue, variableId: null };
      styles[key] = style;
    }
  }
  return styles;
}

export function parseContentsToMap(metadatas: { [key: string]: ContentMetadata }): Map<string, ContentMetadata> {
  const result = new Map<string, ContentMetadata>();

  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      result.set(key, metadata);
    }
  }

  return result;
}

export function parseStylesToMap(metadatas: { [key: string]: StyleMetadata }): Map<string, StyleMetadata> {
  const result = new Map<string, StyleMetadata>();

  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      result.set(key, metadata);
    }
  }

  return result;
}
