interface FlatBtnProps {
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  isUnderline?: boolean;
  onClick?: () => void;
}

export default function FlatBtn({
  className,
  type,
  text,
  isUnderline,
  onClick,
}: FlatBtnProps) {
  return (
    <button
      type={type || 'button'}
      className={className ? `flat-btn ${className}` : 'flat-btn'}
      onClick={onClick}
    >
      <span className={isUnderline ? 'underline-hover' : ''}>{text}</span>
    </button>
  );
}
