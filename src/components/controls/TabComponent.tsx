import * as React from 'react';
import { CSSProperties, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  value: number;
  onChange: (index: number) => void;
  style?: CSSProperties;
}

interface TabProps {
  label: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({ children, value, onChange, style }) => {
  const tabsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...style,
  };

  return (
    <div style={tabsStyle}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isSelected: value === index,
            onClick: () => onChange(index),
          } as TabProps);
        }
        return child;
      })}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ label, isSelected, onClick, style }) => {
  const tabStyle: CSSProperties = {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
    borderBottom: isSelected ? '2px solid #9ea1fb' : '2px solid transparent',
    fontWeight: isSelected ? 'bold' : 'normal',
    color: isSelected ? '#333' : '#777',
    transition: 'background-color 0.2s, border-bottom 0.2s',
    ...style,
  };

  return (
    <div style={tabStyle} onClick={onClick}>
      {label}
    </div>
  );
};
