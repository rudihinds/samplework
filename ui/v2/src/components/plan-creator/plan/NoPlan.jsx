import React from 'react';
import 'twin.macro';
import noPlanImage from '@assets/default-no-plan.svg';

const captionText = 'Edit the plan below to see your projections!';

const NoPlan = () => (
  <>
    <div tw="m-0 justify-center mb-2.5">
      <div tw="flex justify-center">
        <img src={noPlanImage} alt="" />
      </div>
    </div>
    <div tw="flex justify-center" style={{ marginTop: '-30px' }}>
      <p
        style={{
          maxWidth: '175px',
          textAlign: 'center',
          justifyContent: 'center'
        }}
      >
        {captionText}
      </p>
    </div>
  </>
);

export default NoPlan;
