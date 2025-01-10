import { IWidgetCommonProperties, WidgetContent, WidgetContentValue, WidgetTypeEnum } from '@akron/runner';
import ToolPaneComponentButton from 'components/toolpane/ToolPaneComponentButton';
import useEditorStore from 'hooks/useEditorStore';
import { observer } from 'mobx-react-lite';
import WidgetRepository from 'models/repository/WidgetRepository';
import CommandEnum from 'models/store/command/common/CommandEnum';
import { InsertWidgetCommandProps } from 'models/store/command/handler/WidgetEditCommandHandler';
import * as React from 'react';
import { getPropsHandler, IRibbonItemProp } from 'store/ribbon-menu/RibbonMenuComponentInfo';
import {
  toolPaneComponentCategory,
  toolPaneComponentCategoryButton,
  toolPaneComponentCategoryItems,
  toolPaneComponentCategoryTitle,
} from 'styles/toolpane/ComponentInsertToolpane';

/**
 * Item props.
 */
interface IItemProps {
  item: IRibbonItemProp;
  searchValue: string;
}

const Item: React.FC<IItemProps> = observer(({ item, searchValue }: IItemProps) => {
  const editorStore = useEditorStore();

  const propHandler = getPropsHandler(item, editorStore);
  const disabled = propHandler?.disabled ? propHandler.disabled : (item.disabled ?? false);
  const selected = propHandler?.selected ? propHandler.selected : (item.selected ?? false);

  if (
    searchValue !== '' &&
    !item.label?.replace(/\n|\s/g, '').toLowerCase().includes(searchValue.replace(/\s/g, '').toLowerCase())
  ) {
    return null;
  }
  return (
    <ToolPaneComponentButton
      key={item.id}
      label={item.label ?? ''}
      image={item.image ? item.image : 'IMG_GX_COMPONENT_DUMMY'}
      commandType={item.commandType ? item.commandType : 'None'}
      commandPropName={item.commandPropName ? item.commandPropName : 'None'}
      // tooltip={item.tooltip ? item.tooltip : 'MSG_CM_RIBBON_TOOLTIP_TEMP'}
      tooltip={item.label ?? ''}
      disabled={disabled}
      selected={selected}
      onClick={(commandPropName, commandType, ...args) => {
        console.log(commandPropName, commandType, args);
        const commandProps: InsertWidgetCommandProps = {
          commandID: CommandEnum.INSERT_WIDGET,
          widgetType: commandPropName as WidgetTypeEnum,
          widgetID: WidgetRepository.generateWidgetID(),
          initializeProperties: defaultProperties => {
            const tempContent: WidgetContent = {
              className: {
                value: '',
                locked: true,
              },
            };

            Object.keys(defaultProperties.content).forEach(key => {
              const contentValues = defaultProperties.content[key];
              tempContent[key] = {
                // locked: contentValues.locked,
                value: contentValues.defaultValue,
              } as WidgetContentValue;
            });

            return {
              ...defaultProperties,
              content: {
                ...defaultProperties.content,
                ...tempContent,
              },
              style: {
                ...defaultProperties.style,
              },
            } as IWidgetCommonProperties;
          },
        };
        editorStore.handleCommandEvent(commandProps);
        // ribbonStore.onClickedRibbonButton(commandPropName, commandType, ...args);
      }}
    />
  );
});

const LeftToolPaneCategory: React.FC<IItemProps> = ({ item, searchValue }: IItemProps) => {
  const [open, setOpen] = React.useState<boolean>(true);

  const filteredChildItemList = item.childList
    ? item.childList.filter(childItem => {
        if (searchValue !== '') {
          return childItem.label
            ?.replace(/\n|\s/g, '')
            .toLowerCase()
            .includes(searchValue.replace(/\s/g, '').toLowerCase());
        }
        return true;
      })
    : [];
  return (
    <>
      <div css={toolPaneComponentCategory}>
        {/* <ImageResourceButtonComponent
                    id={'IC_TOOLPANE_TOGGLE_OFF'}
                    pressedId={'IC_TOOLPANE_TOGGLE_ON'}
                    w={'16px'}
                    h={'16px'}
                    onClick={() => setOpen(!open)}
                    pressed={open}
                    disabled={false}
                    imageCss={toolPaneComponentCategoryButton}
                /> */}
        <button css={toolPaneComponentCategoryButton} style={{ width: '16px', height: '16px' }} />
        <div css={toolPaneComponentCategoryTitle}>{item.label}</div>
      </div>
      <div css={toolPaneComponentCategoryItems} style={{ display: open ? 'flex' : 'none' }}>
        {filteredChildItemList.map(childItem => (
          <Item key={childItem.label} item={childItem} searchValue={searchValue} />
        ))}
      </div>
    </>
  );
};

export default LeftToolPaneCategory;
