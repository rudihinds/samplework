import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const PanelPlaceholder = (props) => {
  return (
    <div>
      <Skeleton width="30%" height={50} animation="wave" />
      <Skeleton width="50%" height={30} animation="wave" />
      <Skeleton width="50%" height={30} animation="wave" />
    </div>
  );
};

export default PanelPlaceholder;
