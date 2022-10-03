import React, { useState } from 'react';
import { InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { FilledSelect as Select, Button } from '../../js/elements';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { useForm, Controller } from 'react-hook-form';
import OnboardingPanel from './OnboardingPanel';
import MapSelect from './MapSelectBit';

const { genders: gender_list } = require('../../catalog');

const OnboardingPartnerIdentityStep = ({ next, currentStep, totalSteps }) => {
  const { user, editUser } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: { partner_gender: user?.partner_gender || '' }
  });

  const savePartnerIdentity = async (data) => {
    try {
      setFieldsDisabled(true);
      await editUser(data);
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
      question="How does your Partner identify?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_partner_gender_step',
        onSubmit: handleSubmit(savePartnerIdentity)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.partner_gender)}>
        <InputLabel>Select an Option</InputLabel>
        <Controller
          control={control}
          as={
            <MapSelect
              select={Select}
              options={Object.entries(gender_list).map(([key, value]) => ({ key, value }))}
            ></MapSelect>
          }
          data-sel="partner_gender_identity_select"
          name="partner_gender"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{ required: 'Please select an option.' }}
        />
        {Boolean(errors?.partner_gender) && <FormHelperText>Error: {errors?.partner_gender.message}</FormHelperText>}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingPartnerIdentityStep;
