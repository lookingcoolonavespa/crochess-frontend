import { SelectOptionsInterface } from '../types/interfaces';

interface SelectProps {
  options?: SelectOptionsInterface[];
  name?: string;
  label?: string;
}

export default function Select({ options, name, label }: SelectProps) {
  return (
    <div className="select-wrapper">
      {label && <label>{label}</label>}
      {options && (
        <select name={name}>
          {options.map((o) => (
            <option key={o.value} value={o.value} selected={o.selected}>
              {o.display}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
