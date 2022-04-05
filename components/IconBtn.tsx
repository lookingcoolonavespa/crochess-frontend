import Image from 'next/image';

interface IconBtnProps {
  className: string;
  icon?: string;
  altText?: string;
  btnText?: string;
}

export default function IconBtn({
  className,
  icon,
  altText,
  btnText,
}: IconBtnProps) {
  return (
    <div className="icon-btn btn hover-highlight">
      {icon && <Image src={icon} alt={altText} />}
      {btnText && <p>{btnText}</p>}
    </div>
  );
}
