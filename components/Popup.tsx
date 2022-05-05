import IconBtn from './IconBtn';
import Form from './Form';

interface PopupProps {
  className: string;
  title: string;
  subheader: string;
  fields: {};
  children: React.ReactNode;
  footerContent: React.ReactNode;
  close: () => void;
  isMobile: boolean;
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
        <IconBtn svg={closeSVG} onClick={close} className="close-btn" />
      </header>
      {fields && <Form fields={fields} close={close} {...props} />}
      {children && (
        <>
          <div className="content">{children}</div>
          <footer>{footerContent}</footer>
        </>
      )}
    </div>
  );
}
