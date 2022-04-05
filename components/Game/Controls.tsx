import IconBtn from '../IconBtn';
import { ControlBtnObj } from '../../types/interfaces';

interface ControlsProps {
  className?: string;
  list: ControlBtnObj[];
}

export default function Controls({ className, list }: ControlsProps) {
  return (
    <div className={className}>
      {list.map((c, i) => (
        <IconBtn
          key={i}
          className=""
          icon={c.src}
          altText={c.alt}
          btnText={c.text}
        />
      ))}
    </div>
  );
}
