import React, { useState } from 'react';
import { parseISO } from 'date-fns';
import { Button } from '../../js/elements';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import OnboardingPanel from './OnboardingPanel';
import OnboardingBirthdaySelector from './OnboardingBirthdaySelectBit';

const OnboardingPartnerBirthdayStep = ({ next, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const { user, editUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [userPartnerBirthdate] = useState(user.partner_birthdate && parseISO(user.partner_birthdate));
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      day: userPartnerBirthdate?.getDate() ?? '',
      month: userPartnerBirthdate?.getMonth() ?? '',
      year: userPartnerBirthdate?.getFullYear() ?? ''
    }
  });

  const saveUserPartnerBirthdate = async (data) => {
    try {
      setFieldsDisabled(true);
      await editUser({ partner_birthdate: new Date(data.year, data.month, data.day, 12) });
      next();
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <OnboardingPanel
      title="About your Partner..."
      question="What is your partner's date of birth?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_partner_birthdate_step',
        onSubmit: handleSubmit(saveUserPartnerBirthdate)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <OnboardingBirthdaySelector controlRef={control} errorRef={errors} disabled={fieldsDisabled} />
    </OnboardingPanel>
  );
};

export default OnboardingPartnerBirthdayStep;
