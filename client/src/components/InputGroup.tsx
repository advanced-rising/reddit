import React, { ChangeEvent, InputHTMLAttributes } from 'react';
import cls from 'classnames';
import ErrorText from './ErrorText';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  helperText?: string | false;
  setValue: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className = 'mb-2',
  error,
  setValue,
  helperText,
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
      {error && <ErrorText>{helperText} </ErrorText>}
    </div>
  );
};

export default InputGroup;
