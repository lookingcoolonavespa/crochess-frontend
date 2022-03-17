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
    <div className={className}>
      {typeof time === 'number' && typeof increment === 'number' ? (
        <>
          <h3>
            {time}+{increment}
          </h3>
          <p>{type}</p>
        </>
      ) : (
        <h3>{type}</h3>
      )}
    </div>
  );
};

export default TimeControlButton;
