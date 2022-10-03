import React, { useState } from 'react';
import { parseISO } from 'date-fns';
import { Button } from '../../js/elements';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import OnboardingPanel from './OnboardingPanel';
import OnboardingBirthdaySelector from './OnboardingBirthdaySelectBit';

const OnboardingBirthdayStep = ({ next, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const { user, editUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [userBirthdate] = useState(user.birthdate && parseISO(user.birthdate));
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      day: userBirthdate?.getDate() ?? '',
      month: userBirthdate?.getMonth() ?? '',
      year: userBirthdate?.getFullYear() ?? ''
    }
  });

  const saveUserBirthdate = async (data) => {
    try {
      setFieldsDisabled(true);
      await editUser({ birthdate: new Date(data.year, data.month, data.day, 12) });
      next();
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <OnboardingPanel
      title="Now tell us a little bit about yourself..."
      question="What is your date of birth?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_birthdate_step',
        onSubmit: handleSubmit(saveUserBirthdate)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <OnboardingBirthdaySelector
        controlRef={control}
        errorRef={errors}
        disabled={fieldsDisabled}
      ></OnboardingBirthdaySelector>
    </OnboardingPanel>
  );
};

export default OnboardingBirthdayStep;
