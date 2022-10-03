import { styled } from 'twin.macro';
import { up } from 'styled-breakpoints';

const Gutter = styled.div`
  padding: 0 19px;

  ${up('sm')} {
    /* padding: 0 35px; */
  }
`;

export default Gutter;
