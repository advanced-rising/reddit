import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import cls from 'classnames';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error: string | undefined;
  setValue: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = 'mb-2',
  error,
  setValue,
  ...rest
}) => {
  return (
    <div className={className}>
      <input
        autoComplete='off'
        style={{ minWidth: 300 }}
        className={cls(
          `w-full rounded border border-gray-400 bg-gray-50 p-3 transition duration-200 hover:bg-white focus:bg-white`,
          {
            'border-red-500': error,
          },
        )}
        onChange={setValue}
        {...rest}
      />
      <small className='font-medium text-red-500'>{error} </small>
    </div>
  );
};

export default InputGroup;
