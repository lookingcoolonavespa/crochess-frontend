type TimeControlButtonProps = {
  time: number | null;
  increment: number | null;
  type: 'blitz' | 'bullet' | 'rapid' | 'classical' | 'custom';
  className: string;
  search: boolean;
  onClick: () => void;
};

const TimeControlButton = ({
  time,
  increment,
  type,
  className,
  search,
  onClick,
}: TimeControlButtonProps) => {
  return (
    <div
      className={'hover-highlight outline ' + (className || '')}
      onClick={onClick}
    >
      {type !== 'custom' ? (
        <>
          <h3 className="title">
            {time}+{increment}
          </h3>
          <p className="caption">{type}</p>
        </>
      ) : (
        <h3 className="title">{type}</h3>
      )}
      {search && <div className="loader"></div>}
    </div>
  );
};

export default TimeControlButton;
