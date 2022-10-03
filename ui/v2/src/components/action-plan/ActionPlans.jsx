import React from 'react';
import PropTypes from 'prop-types';
import tw, { css } from 'twin.macro';
import ActionCard from '@components/action-plan/ActionCard';
import { SVG as ChildcareIcon } from '@assets/action-plan/childcare.svg';
import { SVG as FertilityIcon } from '@assets/action-plan/fertility.svg';
import { SVG as FinancingIcon } from '@assets/action-plan/financing.svg';
import { SVG as RockingHorseIcon } from '@assets/action-plan/rocking-horse.svg';
import { SVG as TrophyIcon } from '@assets/action-plan/trophy.svg';
import { SVG as SpeechIcon } from '@assets/action-plan/speech.svg';
import GridSwiper from './GridSwiper';

const visibleMap = {
  true: tw`block`,
  false: tw`hidden`
};

const ActionPlans = ({ visible, setPageSlug }) => {
  const goToPage = (pageSlug) => {
    setPageSlug(pageSlug);
    window.dataLayer.push({ event: `clicked_${pageSlug}` });
  };
  return (
    <div css={[visibleMap[visible]]}>
      <div tw="px-4">
        <h2 tw="text-mirza-purple text-center text-3 mb-1">Action a plan</h2>
        <p
          tw="text-center mb-4 mx-auto"
          css={[
            css`
              max-width: 493px;
            `
          ]}
        >
          Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit locale.
        </p>
      </div>
      <GridSwiper>
        <ActionCard
          icon={ChildcareIcon}
          title="Explore Mirza's childcare partners"
          description="We work with childcare providers of various types and pricepoints around the country"
          action={() => goToPage('childcare_partners')}
        />
        <ActionCard
          icon={FertilityIcon}
          title="Explore Mirza's retail partners"
          description="We work with incredible partners in the fertility space, from egg freezing, artificial insemination and IVF"
          action={() => goToPage('retail_partners')}
        />
        <ActionCard
          icon={FinancingIcon}
          title="Explore financing solutions to help pay for childcare"
          description="Mirza is working with employers, institutions, and foundations to help alleviate the finanical burden of care"
          action={() => goToPage('isa_csa')}
        />
        <ActionCard
          icon={RockingHorseIcon}
          title="Find the best childcare option close to me"
          description="We're thrilled to work with great databases that help you find the best care in your area"
          action={() => goToPage('childcare_options')}
        />
        <ActionCard
          icon={TrophyIcon}
          title="Use tech to help me with my financial planning goals"
          description="Use Mirza's financial optimizer to help me allocate my funds and maximize tax benefits"
          action={() => goToPage('financial_optimizer')}
        />
        <ActionCard
          icon={SpeechIcon}
          title="Speak to a Financial Advisor 1:1"
          description="Learn more about how to think about my family's finances face to face with someone"
          action={() => goToPage('financial_planning')}
        />
      </GridSwiper>
    </div>
  );
};

ActionPlans.propTypes = {
  visible: PropTypes.bool.isRequired,
  setPageSlug: PropTypes.func.isRequired
};

export default ActionPlans;
