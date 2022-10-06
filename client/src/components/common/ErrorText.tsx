import React from 'react';

interface ErrorTextProps {
  children: string | React.ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps) {
  return <p className='text-xs text-red-500'>{children}</p>;
}
