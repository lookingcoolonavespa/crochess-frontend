import React, { HTMLInputTypeAttribute } from 'react';
import { FieldsInterface } from '../types/interfaces';
import Select from './Select';

import styles from '../styles/InputField.module.scss';

interface InputFieldProps extends FieldsInterface {
  error: string;
  type: HTMLInputTypeAttribute;
  autoFocus: boolean;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
}

export default function InputField({
  label,
  error,
  unitsDisplay,
  ...inputProps
}: InputFieldProps) {
  const rootClasses = [styles.main, 'form-group'];
  if (error) rootClasses.push('error');

  return (
    <div className={rootClasses.join(' ')}>
      {label && (
        <label className="label">
          <span>{label}</span>
        </label>
      )}
      <div className={styles['input-wrapper']}>
        <input {...inputProps} />
        {error && <span className="error-msg"> - {error}</span>}
      </div>
      {unitsDisplay && (
        <div className="select-wrapper">
          <Select {...unitsDisplay} />
        </div>
      )}
    </div>
  );
}
