import React from 'react';


type SvgProps = {
  children: JSX.Element|JSX.Element[];
};

export const Svg = ({ children }: SvgProps) => {
  return (
    <g>
      {children}
    </g>
  );
};
