import IconBtn from './IconBtn';
import Form from './Form';

import closeSVG from '../public/icons/close-line.svg';
import React, { FormEvent, Dispatch, SetStateAction } from 'react';

interface PopupProps {
  className?: string;
  title: string;
  subheader?: string;
  fields?: { label: string; name: string; type: string }[];
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  close: () => void;
  isMobile: boolean;
  inputValues: { [key: string]: string | number };
  actionBtnText?: string;
  noCancelBtn: boolean;
  cancelBtnText?: string;
  handleChange: (e: FormEvent<HTMLInputElement>) => void;
  submitAction: (() => Promise<void>) | (() => void);
  cleanUp?: () => void;
  setError: Dispatch<SetStateAction<string>>;
}

export default function Popup({
  className,
  title,
  subheader,
  fields,
  children,
  footerContent,
  close,
  isMobile,
  ...props
}: PopupProps) {
  return (
    <div
      className={className ? className + ' popup' : 'popup'}
      onClick={(e) => e.stopPropagation()}
    >
      <header>
        <h3>{title}</h3>
        {subheader && (
          <div className="subheader">
            <span>{subheader}</span>
          </div>
        )}
        <IconBtn icon={closeSVG} onClick={close} className="close-btn" />
      </header>
      {fields && <Form fields={fields} close={close} {...props} />}
      {children && (
        <>
          <div className="content">{children}</div>
          {footerContent && <footer>{footerContent}</footer>}
        </>
      )}
    </div>
  );
}
