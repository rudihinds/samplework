import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { TextFieldWithValidation, Button } from '../../js/elements';
import OnboardingPanel from './OnboardingPanel';

const OnboardingPartnerNameStep = ({ next, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const { user, editUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: { partner_name: user?.partner_name ?? '' }
  });

  const saveUserPartnerName = async (data) => {
    try {
      setFieldsDisabled(true);
      const response = await editUser(data);
      next(response.data);
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <OnboardingPanel
      title="About your Partner..."
      question="What's your Partner's name?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_user_partner_name_step',
        onSubmit: handleSubmit(saveUserPartnerName)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <Controller
        control={control}
        as={TextFieldWithValidation}
        label="Enter your partner's name"
        data-sel="user_partner_name"
        name="partner_name"
        fullWidth
        disabled={fieldsDisabled}
        error={errors?.partner_name && errors?.partner_name.message}
        rules={{
          required: `Please enter your partner's name.`,
          pattern: { value: /[a-z]{1,}/i, message: `You must enter your partner's name` }
        }}
      />
    </OnboardingPanel>
  );
};

export default OnboardingPartnerNameStep;
