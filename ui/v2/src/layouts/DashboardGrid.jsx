import styled from 'styled-components';

const DashboardGrid = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: 250px repeat(14, 1fr) 250px;
  grid-template-rows: repeat(10, 1fr);
  gap: ${(props) => (props.gapDefault ? props.gapDefault : '26px 30px')};
  margin: ${(props) => (props.marginDefault ? props.marginDefault : '0')};
`;

export default DashboardGrid;
