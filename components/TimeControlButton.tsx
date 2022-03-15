type TimeControlButtonProps = {
  time: number | null;
  increment: number | null;
  type: 'blitz' | 'bullet' | 'rapid' | 'classical' | 'custom';
};

const TimeControlButton = ({
  time,
  increment,
  type,
}: TimeControlButtonProps) => {
  return (
    <div>
      {time && increment && (
        <h3>
          {time}+{increment}
        </h3>
      )}
      <p>{type}</p>
    </div>
  );
};

export default TimeControlButton;
