import styled from 'styled-components';
import { up } from 'styled-breakpoints';

const CommonCard = styled.div`
  display: grid;
  background: rgba(242, 230, 223, 0.7);
  border-radius: 1.8rem;
  padding: 16px;
  margin-top: 20px;

  ${up('sm')} {
    margin-top: 20px;
  }

  ${up('smLp')} {
    margin-top: 0;
  }
`;

export default CommonCard;
