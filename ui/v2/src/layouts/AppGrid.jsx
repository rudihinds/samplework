import styled from 'styled-components';

const AppGrid = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 71px auto;
  position: relative;
  margin: ${(props) => (props.marginDefault ? props.marginDefault : '0')};
`;
export default AppGrid;

/* gap: ${(props) => props.gapDefault ? props.gapDefault : "26px 30px"}; */
