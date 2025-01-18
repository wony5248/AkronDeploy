import { textLabel } from 'styles/controls/TextLabel';

/**
 * TextLabelComponent props.
 */
interface IProps {
  className?: string;
  name: string;
}

/**
 * 툴펜에서 속성 이름을 보여줄 text label입니다.
 */
const TextLabelComponent: React.FC<IProps> = ({ className, name }: IProps) => {
  return (
    <div className={className} css={textLabel}>
      {name}
    </div>
  );
};

export default TextLabelComponent;
