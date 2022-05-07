import { FieldsInterface } from '../types/interfaces';

export default function RadioList({ label, name, options }: FieldsInterface) {
  return (
    <div id={name} className="form-group">
      <p className="label">{label}</p>
      <div className="radio-ctn">
        {options &&
          options.map((o, i) => (
            <div className="radio-wrapper" key={`${name}${i}`}>
              <input
                type="radio"
                id={`${name}${i}`}
                name={name}
                value={o.value}
              />
              {o.display && <label htmlFor={`${name}${i}`}>{o.display}</label>}
            </div>
          ))}
      </div>
    </div>
  );
}
