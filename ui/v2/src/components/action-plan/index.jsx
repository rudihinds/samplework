import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'twin.macro';
import ActionPlanModalDrawer from '@components/modals/ActionPlanModalDrawer';
import TextCard from '@dashboard/TextCard';
import insertionQ from 'insertion-query';
import { SVG as SpeechIcon } from '@assets/action-plan/speech.svg';
import { SVG as FinancingIcon } from '@assets/action-plan/financing.svg';
import { SVG as TrophyIcon } from '@assets/action-plan/trophy.svg';
import ActionPlans from './ActionPlans';
import { SVG as BackArrow } from './back-arrow.svg';
import ChildcarePartnersDetail from './ActionDetail/ChildcarePartnersDetail';
import RetailPartnersDetail from './ActionDetail/RetailPartnersDetail';
import ChildcareOptionsDetail from './ActionDetail/ChildcareOptionsDetail';
import ComingSoon from './ActionDetail/ComingSoon';

const BackButton = ({ onClick }) => (
  <button type="button" tw="flex items-center ml-2" onClick={onClick}>
    <BackArrow tw="mr-1" />
    &nbsp;Go&nbsp;back
  </button>
);
BackButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

const ActionPlan = () => {
  const [open, setOpen] = useState(false);
  const [pageSlug, setPageSlug] = useState('action_plan');
  useEffect(() => {
    console.log('useEffect');
    // By default modal starts at center scroll position on mobile
    // Watches for insertions of modal because react-responsive-modal doesn't have an API for this
    insertionQ('.react-responsive-modal-container').every((el) => {
      console.log('scrolling to 0,0');
      return setTimeout(() => {
        el.scroll(0, 0);
      }, 0);
    });
  }, []);

  const openModal = useCallback(() => {
    setPageSlug('action_plan');
    setOpen(true);
    window.dataLayer.push({ event: 'clicked_action_plan' });
  }, []);

  const goBack = useCallback(() => {
    setPageSlug('action_plan');
    window.dataLayer.push({ event: 'clicked_action_plan_back' });
  }, []);

  const renderPage = () => {
    switch (pageSlug) {
      case 'childcare_partners':
        return <ChildcarePartnersDetail />;
      case 'retail_partners':
        return <RetailPartnersDetail />;
      case 'financial_planning':
        return (
          <ComingSoon
            icon={SpeechIcon}
            title="1-1 Financial planning sessions are coming soon!"
            description="We’re working hard with our financial partners to bring 1-1 planning sessions. Click below to stay in the loop!"
            notificationType="1_1_financial_planning"
          />
        );
      case 'isa_csa':
        return (
          <ComingSoon
            icon={FinancingIcon}
            title="Financing solutions are coming soon!"
            description="Click below to stay in the loop!"
            notificationType="isa_csa"
          />
        );
      case 'financial_optimizer':
        return (
          <ComingSoon
            icon={TrophyIcon}
            title="Financial planning technology is coming soon!"
            description="Click below to stay in the loop!"
            notificationType="financial_optimizer"
          />
        );
      case 'childcare_options':
        return <ChildcareOptionsDetail />;
      default:
        return <div />;
    }
  };

  return (
    <>
      <TextCard
        tw="h-full cursor-pointer"
        title="How do I action a plan?"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus ac, elementum bibendum non id massa fermentum."
        onClick={openModal}
      />
      <ActionPlanModalDrawer open={open} onClose={() => setOpen(false)}>
        {pageSlug !== 'action_plan' && <BackButton onClick={goBack} />}
        <ActionPlans
          setPageSlug={setPageSlug}
          visible={pageSlug === 'action_plan'}
        />
        {renderPage()}
      </ActionPlanModalDrawer>
    </>
  );
};

export default ActionPlan;
