import React from 'react';
import { isEmpty } from 'lodash';
import StylizedText from './StylizedText';

const LocationLabel = ({ location }) => {
  if (isEmpty(location) || isEmpty(location.zip_code)) {
    return <StylizedText theme="subtlest">Not Specified</StylizedText>;
  }

  return (
    <div>
      <strong>{location.zip_code + ' '}</strong>
      <small>
        ({location.city}, {location.state})
      </small>
    </div>
  );
};

export default LocationLabel;
