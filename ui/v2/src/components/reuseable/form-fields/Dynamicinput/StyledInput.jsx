import React from 'react';
import { styled, theme } from 'twin.macro';

function StyledInput(props) {
  return <Input {...props} />;
}

const Input = styled.input`
  width: ${({ width }) => width || '100%'};
  padding: ${({ open }) => (!open ? '0px 14px' : '0px 12px')};
  height: ${({ height }) => height || '37px'};
  border: ${({ open }) =>
    open ? '2px solid rgba(79, 158, 251, 0.5)' : 'none'};
  border-radius: 4px;
  background: ${({ open }) =>
    !open ? theme`backgroundColor.grey-4` : 'white'};
  color: ${theme`colors.dark-green`};
  box-sizing: border-box;
`;

export default StyledInput;
