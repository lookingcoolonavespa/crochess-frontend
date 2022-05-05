import React, { useState } from 'react';
import { dynamicValidation } from '../formValidation';

export default function useInputError(inputNames: string[]) {
  const [inputError, setInputError] = useState(
    () =>
      inputNames.reduce((acc: { [key: string]: string }, curr: string) => {
        acc[curr] = '';
        return acc;
      }, {}) // turn inputNames into object keys
  );

  async function validateInput(el: HTMLInputElement, isSubmit = false) {
    const validationStatus = await dynamicValidation(el, isSubmit); // have to await bc it might return a promise (depends on input name)

    const value = validationStatus.error ? validationStatus.error : '';
    setInputError((prev) => ({
      ...prev,
      [el.name]: value,
    }));

    return !validationStatus.error;
  }

  async function submitForm(
    e: React.FormEvent<HTMLFormElement>,
    submitAction: (() => Promise<void>) | (() => void),
    cleanUp: () => void,
    setError: (msg: string) => void
  ) {
    e.preventDefault();

    const {
      currentTarget: { elements }, // destructure e to get elements
    } = e;

    try {
      let errors = false;
      for (const fname of inputNames) {
        // iterate through each input field and validate
        const currEl = elements.namedItem(fname);
        if (!(currEl instanceof HTMLInputElement)) {
          return;
        }
        const isValid = await validateInput(currEl, true);
        if (!isValid) errors = true;
      }
      if (errors) return;

      await submitAction();
      cleanUp();
    } catch (error: unknown) {
      if (typeof error === 'string') setError && setError(error);
      else if (error instanceof Error) setError && setError(error.message);
    }
  }

  return { inputError, validateInput, submitForm };
}
