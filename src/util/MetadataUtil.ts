import { IPropertyInstance, IWidgetContentProperties, IWidgetStyleProperties } from '@akron/runner';
import { ContentMetadata, StyleMetadata } from 'models/store/container/MetadataContainer';

export function createContentData(metadatas: { [key: string]: ContentMetadata }): IWidgetContentProperties {
  const contents: IWidgetContentProperties = {};
  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      let defaultValue = convertMetadataDefaultValue(key, metadata);
      const content: IPropertyInstance = { value: null, defaultValue: defaultValue, variableId: null };
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
      const defaultValue = convertMetadataDefaultValue(key, metadata);
      const style: IPropertyInstance = { value: null, defaultValue: defaultValue, variableId: null };
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
      const defaultValue = convertMetadataDefaultValue(key, metadata);
      result.set(key, { ...metadata, defaultValue: defaultValue });
    }
  }

  return result;
}

export function parseStylesToMap(metadatas: { [key: string]: StyleMetadata }): Map<string, StyleMetadata> {
  const result = new Map<string, StyleMetadata>();

  for (const key in metadatas) {
    const metadata = metadatas[key];
    if (metadata) {
      const defaultValue = convertMetadataDefaultValue(key, metadata);
      result.set(key, { ...metadata, defaultValue: defaultValue });
    }
  }

  return result;
}

export function convertMetadataDefaultValue(key: string, metadata: StyleMetadata | ContentMetadata) {
  let defaultValue = metadata.defaultValue;
  if (
    key === 'x' ||
    key === 'y' ||
    key === 'top' ||
    key === 'left' ||
    key === 'right' ||
    key === 'bottom' ||
    key === 'width' ||
    key === 'height'
  ) {
    defaultValue = JSON.parse(metadata.defaultValue);
  } else if (defaultValue === 'false') {
    defaultValue = false;
  } else if (defaultValue === 'true') {
    defaultValue = true;
  }
  return defaultValue;
}
