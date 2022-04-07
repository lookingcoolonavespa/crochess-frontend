import Image from 'next/image';

interface IconBtnProps {
  className: string;
  icon?: string;
  altText?: string;
  btnText?: string;
  onClick?: () => void;
}

export default function IconBtn({
  className,
  icon,
  altText,
  btnText,
  onClick,
}: IconBtnProps) {
  console.log(onClick);
  return (
    <div className="icon-btn btn hover-highlight" onClick={onClick}>
      {icon && <Image src={icon} alt={altText} />}
      {btnText && <p>{btnText}</p>}
    </div>
  );
}
