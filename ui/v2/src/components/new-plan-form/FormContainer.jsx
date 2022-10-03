import React from 'react';
import FormSteps from '@components/new-plan-form/form-sections/FormSteps';
import FormButtonSection from '@components/new-plan-form/button-section/FormButtonSection';
import FormContentSection from '@components/new-plan-form/content/FormContentSection';
import { styled } from 'twin.macro';
import { SlidesContextProvider } from '@components/new-plan-form/button-section/SlidesContext';

import PropTypes from 'prop-types';

function FormContainer({ planId }) {
  // min-width: 0 required for Swiper to work
  // because children of css grid have min-width: auto by default
  // which causes swiper to extend indefinitely off the page
  return (
    <div style={{ minWidth: 0 }}>
      <SlidesContextProvider>
        <FORMGUTTER>
          <FormSteps />
          <FormContentSection planId={planId} />
          <FormButtonSection />
        </FORMGUTTER>
      </SlidesContextProvider>
    </div>
  );
}

FormContainer.propTypes = {
  planId: PropTypes.number.isRequired
};

const FORMGUTTER = styled.div`
  /* padding: 21px; */
  margin-top: 30px;
`;

export default FormContainer;
