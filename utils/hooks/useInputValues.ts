import React, { useState } from 'react';

export default function useInputValues() {
  const [inputValues, setInputValues] = useState<{
    [key: string]: string | number;
  }>({});

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setInputValues((prev) => ({
      ...prev,
      [e.currentTarget.name]: e.currentTarget.value,
    }));
  }

  function resetInputValues() {
    setInputValues({});
  }

  return {
    inputValues,
    setInputValues,
    handleChange,
    resetInputValues,
  };
}
