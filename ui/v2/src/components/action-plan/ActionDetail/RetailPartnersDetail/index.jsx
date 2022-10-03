import React from 'react';
import { SVG as FertilityIcon } from '@assets/action-plan/fertility.svg';
import { css } from 'twin.macro';
import GridSwiper from '@components/action-plan/GridSwiper';
import ImageCaption from '../ImageCaption';
import Elanza from './images/elanza.png';
import Stix from './images/stix.png';
import ThreeMDs from './images/threemds.png';

const RetailPartnersDetail = () => (
  <div>
    <div tw="text-center px-4 mb-2">
      <div tw="w-7 mx-auto mb-2">
        <FertilityIcon />
      </div>
      <h2 tw="text-mirza-purple text-3 mb-3 md:mb-2">
        Explore our retail partners
      </h2>
      <p
        tw="hidden md:block md:mx-auto"
        css={[
          css`
            max-width: 493px;
          `
        ]}
      >
        We know that fertility can be emotionally and physically heavy.
        That&apos;s why we work with incredible partners to help make this
        journey as comfortable as possible for you.
      </p>
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
          imageSrc={Elanza}
          altText="Screenshot of Elanza"
          description="Elanza takes the fear out of fertility by providing empathetic, effective and expert care."
          buttonText="Visit the Elanza website"
          actionHref="https://www.elanzawellness.com/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={Stix}
          altText="Screenshot of Stix"
          description="Stix offers doctor-approved and discreetly delivered pregnancy, ovulation and UTI products."
          buttonText="Visit the Stix website"
          actionHref="https://getstix.co/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={ThreeMDs}
          altText="Screenshot of ThreeMDs"
          description="ThreeMDs provide easily digestible, evidence-based, and integrative medical information."
          buttonText="Visit the Three MDs website"
          actionHref="https://threemds.com/?utm_source=heymirza"
        />
      </GridSwiper>
    </div>
  </div>
);

export default RetailPartnersDetail;
