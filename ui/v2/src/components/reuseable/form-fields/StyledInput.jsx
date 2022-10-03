import tw, { styled } from 'twin.macro';

const StyledInput = styled.input`
  ${tw`block border-grey-2 text-1.5 md:text-1.4`}
  padding: 1rem 1.2rem;
  width: ${({ width }) => width || '100%'};
  border: 0.75px solid #969696;
  border-radius: 7px;
  position: relative;
`;

export default StyledInput;
