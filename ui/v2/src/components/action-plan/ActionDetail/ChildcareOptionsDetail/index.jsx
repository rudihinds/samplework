import React from 'react';
import { css } from 'twin.macro';

import GridSwiper from '@components/action-plan/GridSwiper';
import { SVG as RockingHorse } from '@assets/action-plan/rocking-horse.svg';
import CareComScreenshot from './images/care-com-screenshot.png';
import UpfrontScreenshot from './images/upfront-screenshot.png';
import ImageCaption from '../ImageCaption';

const ChildcareOptionsDetail = () => (
  <div>
    <div tw="text-center px-4 mb-2">
      <div tw="w-7 mx-auto mb-2">
        <RockingHorse />
      </div>
      <h2 tw="text-mirza-purple text-3 mb-3 md:mb-2">
        Explore childcare options
      </h2>
    </div>
    <div
      css={[
        css`
          max-width: 649px;
        `
      ]}
      tw="mx-auto"
    >
      <GridSwiper gridCols={2}>
        <ImageCaption
          imageSrc={CareComScreenshot}
          altText="Screenshot of care.com"
          description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit locale."
          buttonText="Visit the care.com website"
          actionHref="https://www.care.com/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={UpfrontScreenshot}
          altText="Screenshot of allupfront.com"
          description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit locale."
          buttonText="Visit the Upfront website"
          actionHref="https://www.allupfront.com/?utm_source=heymirza"
        />
      </GridSwiper>
    </div>
  </div>
);

export default ChildcareOptionsDetail;
