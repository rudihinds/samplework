import { styled } from 'twin.macro';
import { up } from 'styled-breakpoints';

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;

  ${up('sm')} {
    max-width: 513px;
  }

  ${up('smLp')} {
    max-width: 1024px;
  }

  // ${up('xl')}{
  //   max-width: 1150px;
  // }
`;

export default Wrapper;
