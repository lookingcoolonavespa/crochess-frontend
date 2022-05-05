import {
  HTMLInputTypeAttribute,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';
import useInputError from '../utils/hooks/useInputError';

import FlatBtn from './FlatBtn';
import InputField from './InputField';

interface FormProps {
  fields: { label: string; name: string; type: HTMLInputTypeAttribute }[];
  inputValues: { [key: string]: string | number };
  actionBtnText?: string;
  noCancelBtn: boolean;
  cancelBtnText?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitAction: (() => Promise<void>) | (() => void);
  cleanUp?: () => void;
  close: () => void;
  setError: Dispatch<SetStateAction<string>>;
}

export default function Form({
  fields,
  inputValues,
  actionBtnText,
  noCancelBtn,
  cancelBtnText,
  handleChange,
  submitAction,
  cleanUp,
  close,
  setError,
}: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldNames = fields.map((f) => f.name);
  const { inputError, validateInput, submitForm } = useInputError(fieldNames);

  return (
    <form
      ref={formRef}
      autoComplete="nope"
      onSubmit={async (e) => {
        cleanUp = cleanUp || close;
        await submitForm(e, submitAction, cleanUp, setError);
      }}
    >
      <div className="content">
        <input type="password" hidden />
        {/* need this to turn off autocomplete */}
        {fields.map((f, idx) => {
          return (
            <InputField
              key={idx}
              type={f.type}
              autoFocus={idx === 0}
              onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                validateInput(e.currentTarget)
              }
              error={inputError[f.name]}
              label={f.label}
              name={f.name}
              onChange={handleChange}
              value={inputValues[f.name] || ''}
            />
          );
        })}
      </div>
      <footer>
        <div className="btn-ctn">
          {!noCancelBtn && (
            <FlatBtn
              text={cancelBtnText || 'Cancel'}
              isUnderline={true}
              onClick={close}
            />
          )}
          <FlatBtn
            type="submit"
            text={actionBtnText || 'Done'}
            className="filled small"
          />
        </div>
      </footer>
    </form>
  );
}
