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

const OnboardingIdentityStep = ({ next, currentStep, totalSteps }) => {
  const { user, editUser } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: { gender: user?.gender || '' }
  });

  const saveUserIdentity = async (data) => {
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
      title="Now tell us a little bit about yourself..."
      question="How do you identify?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
      formAttributes={{
        'data-sel': 'onboarding_gender_step',
        onSubmit: handleSubmit(saveUserIdentity)
      }}
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.gender)}>
        <InputLabel>Select an Option</InputLabel>
        <Controller
          control={control}
          as={
            <MapSelect
              select={Select}
              options={Object.entries(gender_list).map(([key, value]) => ({ key, value }))}
            ></MapSelect>
          }
          data-sel="gender_identity_select"
          name="gender"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{ required: 'Please select an option.' }}
        />
        {Boolean(errors?.gender) && <FormHelperText>Error: {errors?.gender.message}</FormHelperText>}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingIdentityStep;
