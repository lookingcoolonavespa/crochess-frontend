type TimeControlButtonProps = {
  time: number | null;
  increment: number | null;
  type: 'blitz' | 'bullet' | 'rapid' | 'classical' | 'custom';
  className: string;
};

const TimeControlButton = ({
  time,
  increment,
  type,
  className,
}: TimeControlButtonProps) => {
  return (
    <div className={'hover-highlight outline ' + className || ''}>
      {typeof time === 'number' && typeof increment === 'number' ? (
        <>
          <h3 className="title">
            {time}+{increment}
          </h3>
          <p className="caption">{type}</p>
        </>
      ) : (
        <h3 className="title">{type}</h3>
      )}
    </div>
  );
};

export default TimeControlButton;
