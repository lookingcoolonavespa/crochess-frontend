import { FieldsInterface } from '../types/interfaces';

export default function RadioList({ label, name, options }: FieldsInterface) {
  return (
    <div className="radio-ctn">
      <p>{label}</p>
      {options &&
        options.map((o, i) => (
          <div className="radio-wrapper" key={`${name}${i}`}>
            <input
              type="radio"
              id={`${name}${i}`}
              name={name}
              value={o.value}
            />
            <label htmlFor={`${name}${i}`}>{o.display}</label>
          </div>
        ))}
    </div>
  );
}
