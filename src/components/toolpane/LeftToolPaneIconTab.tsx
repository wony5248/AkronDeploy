import useEditorStore from 'hooks/useEditorStore';
import { useState } from 'react';
import { toolPaneComponentTabPanel } from 'styles/toolpane/ComponentInsertToolpane';

/**
 * LeftToolPaneIconTab props.
 */
interface IProps {
  searchValue: string;
}

/**
 * LeftToolPane Icon tab.
 */
const LeftToolPaneIconTab: React.FC<IProps> = ({ searchValue }: IProps) => {
  // const editorStore = useEditorStore();
  // const UIStore = editorStore.getEditorUIStore();
  // const [themeValue, setThemeValue] = useState<string>(UIStore.getIconTabTheme());
  // const [sizeValue, setSizeValue] = useState<number>(UIStore.getIconTabSize());
  // const [colorValue, setColorValue] = useState<string>(UIStore.getIconTabColor());

  // const filteredIconList = Array.from(MUIIconMap.values()).filter(icon => {
  //     return (
  //         (searchValue === '' ||
  //             icon.importName
  //                 .replace(/\n|\s/g, '')
  //                 .toLowerCase()
  //                 .includes(searchValue.replace(/\s/g, '').toLowerCase())) &&
  //         icon.theme === themeValue
  //     );
  // });

  // const StyledSelect = styled(Select)({
  //     width: '61px',
  //     height: '12px',
  //     fontSize: '10px',
  //     display: 'inline-block',
  //     marginRight: '11px',
  //     '& .MuiSelect-select': {
  //         padding: '0px',
  //     },
  //     '& .MuiOutlinedInput-notchedOutline': {
  //         border: 'none',
  //         padding: '0px',
  //     },
  //     '& .MuiSvgIcon-root': {
  //         width: '15px',
  //         right: '0px',
  //     },
  // });

  // const handleThemeSelectChange = (event: SelectChangeEvent<unknown>) => {
  //     setThemeValue(String(event.target.value));
  //     UIStore.setIconTabTheme(String(event.target.value));
  // };

  // const handleSizeSelectChange = (event: SelectChangeEvent<unknown>) => {
  //     setSizeValue(Number(event.target.value));
  //     UIStore.setIconTabSize(Number(event.target.value));
  // };

  // const handleColorSelectChange = (color: ColorValue) => {
  //     const colorObject = color as Color;
  //     const cssString = `rgba(${colorObject.rgb[0]},${colorObject.rgb[1]},${colorObject.rgb[2]},${
  //         Math.round(colorObject.alpha * 100) / 100
  //     })`;
  //     setColorValue(cssString);
  //     UIStore.setIconTabColor(cssString);
  // };

  return (
    <div css={toolPaneComponentTabPanel}>
      {/* <div>
                <StyledSelect size="small" onChange={handleThemeSelectChange} value={themeValue} autoWidth={false}>
                    <MenuItem value={'Outlined'}>Outlined</MenuItem>
                    <MenuItem value={'Filled'}>Filled</MenuItem>
                </StyledSelect>
                <StyledSelect
                    size="small"
                    onChange={handleSizeSelectChange}
                    value={String(sizeValue)}
                    autoWidth={false}
                >
                    <MenuItem value={24}>24 dp</MenuItem>
                    <MenuItem value={48}>48 dp</MenuItem>
                    <MenuItem value={96}>96 dp</MenuItem>
                    <MenuItem value={192}>192 dp</MenuItem>
                </StyledSelect>
                <div
                    style={{
                        display: 'inline-block',
                    }}
                >
                    <ColorPicker hideTextfield value={colorValue} onChange={handleColorSelectChange} deferred />
                </div>
            </div>
            <div className={Menustyles.menuItems}>
                {filteredIconList.map((icon, index) => (
                    <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${icon.importName}-${index}`}
                        className={classNames(isGXProject ? Menustyles.gxMenuItem : Menustyles.uxMenuItem)}
                        onClick={() => {
                            // args: [iconname, size, color]
                            ribbonStore.onClickedRibbonButton(
                                'BasicIcon',
                                'InsertWidget',
                                icon.importName,
                                sizeValue,
                                colorValue
                            );
                        }}
                        onDragStart={e => {
                            e.dataTransfer.setData('widgetId', String(WidgetRepository.generateWidgetID()));
                            e.dataTransfer.setData('widgetType', 'BasicIcon');
                            e.dataTransfer.setData('icon', icon.importName);
                            e.dataTransfer.setData('size', String(sizeValue));
                            e.dataTransfer.setData('color', colorValue);
                            e.dataTransfer.effectAllowed = 'copy';
                        }}
                        draggable="true"
                    >
                        <icon.Component style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    </div>
                ))}
            </div> */}
    </div>
  );
};

export default LeftToolPaneIconTab;
