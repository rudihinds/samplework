import React from 'react';
import { styled } from 'twin.macro';
import { useQuery } from '@apollo/client';
import { ME } from '@graphql/queries/user';
import CommonCard from '@reuseable/cards/CommonCard';

const firstName = (name) => {
  if (!name || name === '') {
    return '';
  }
  const splitName = name.split(' ');
  if (splitName.length === 1) {
    return name;
  }
  return splitName[0];
};

function WelcomeCard() {
  const { data: { me } = { me: {} } } = useQuery(ME);
  return (
    <WelcomeBack>
      <h1>Welcome back, {firstName(me.name)}!</h1>
    </WelcomeBack>
  );
}

const WelcomeBack = styled(CommonCard)`
  order: 1;
  grid-area: wb;
  padding: 0;
  min-height: 0;
  background-color: #fff;
  align-items: center;
`;

export default WelcomeCard;
