import styled from 'styled-components';

const Card = styled.div`
  display: grid;
  height: 270px;
  width: 377px;
  grid-column: ${(props) =>
    props.gridColumn ? props.gridColumn : '2/max-content'};
  grid-row: ${(props) => (props.gridRow ? props.gridRow : '2/max-content')};
  background-color: rgba(242, 230, 223, 0.7);
  border-radius: 18px;
  padding: 24px;
`;

export default Card;
