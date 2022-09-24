import React, { ChangeEvent } from 'react';
import cls from 'classnames';

interface InputGroupProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  name: string;
  error: string | undefined;
  setValue: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = 'mb-2',
  type = 'text',
  placeholder = '',
  error,
  value,
  name,
  setValue,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        style={{ minWidth: 300 }}
        className={cls(
          `w-full p-3 transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white`,
          {
            'border-red-500': error,
          },
        )}
        placeholder={placeholder}
        onChange={setValue}
        value={value}
        name={name}
      />
      <small className='font-medium text-red-500'>{error} </small>
    </div>
  );
};

export default InputGroup;
