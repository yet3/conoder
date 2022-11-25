import clsx from 'clsx';
import { ChangeEvent, DetailedHTMLProps, FocusEvent, InputHTMLAttributes, ReactNode, useId, useState } from 'react';

interface Props extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  containerClassName?: string;
  labelClassName?: string;
  label?: ReactNode;
  onChange?: <T = string | number>(value: T, e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ id: _id, type, className, containerClassName, labelClassName, label, onChange, value, onBlur, ...props }: Props) => {
  let id = useId();

  const [tmpValue, setTmpValue] = useState<typeof value | null>(null);

  if (_id) id = _id;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      let newValue: string | number = e.target.value;

      if (type === 'number') {
        newValue = parseFloat(newValue);
        if (isNaN(newValue)) setTmpValue('');
        else if (props.min != null && newValue < props.min) setTmpValue(newValue);
        else {
          setTmpValue(null);
          onChange(newValue, e);
        }
      } else onChange(newValue, e);
    }
  };

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (tmpValue !== null) {
      setTmpValue(null);
    }

    if (onBlur) onBlur(e);
  };

  return (
    <div className={clsx(containerClassName, 'input-container')}>
      {label && (
        <label htmlFor={id} className={clsx(labelClassName, 'input-label')}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        type={type}
        className={clsx(className, 'input')}
        onBlur={handleOnBlur}
        value={tmpValue ?? value}
        onChange={handleOnChange}
      />
    </div>
  );
};

export { Input };
