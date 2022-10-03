import React from 'react';
import { css } from 'twin.macro';

import { SVG as SpeechIcon } from '@assets/action-plan/speech.svg';
import { Basic as ButtonBasic } from '@reuseable/buttons/Button';

const FinancialPlanningDetail = () => (
  <div tw="text-center px-4 mb-2">
    <div tw="w-7 mx-auto mb-2">
      <SpeechIcon />
    </div>
    <h2
      tw="text-mirza-purple text-center text-3 mb-1 mx-auto"
      style={{ maxWidth: '450px' }}
    >
      1-1 Financial planning sessions are coming soon!
    </h2>
    <p
      tw="text-center mb-4 mx-auto"
      css={[
        css`
          max-width: 493px;
        `
      ]}
    >
      We’re working hard with our financial partners to bring 1-1 planning
      sessions. Click below to stay in the loop!
    </p>
    <ButtonBasic type="button" onClick={() => console.log('Notify me')}>
      Notify me
    </ButtonBasic>
  </div>
);

export default FinancialPlanningDetail;
