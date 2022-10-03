import React, { useState } from 'react';
import { InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { FilledSelect as Select, Button } from '../../js/elements';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { useForm, Controller } from 'react-hook-form';
import OnboardingPanel from './OnboardingPanel';
import MapSelect from './MapSelectBit';

const { family_plans: family_plans_list } = require('../../catalog');

const OnboardingFamilyPlansStep = ({ next, currentStep, totalSteps }) => {
  const { user, editUser } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: { family_plans: user?.family_plans || '' }
  });

  const saveFamilyPlans = async (data) => {
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
      question="Where are you in your journey to start a family?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_family_plans_step',
        onSubmit: handleSubmit(saveFamilyPlans)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.family_plans)}>
        <InputLabel>Select an Option</InputLabel>
        <Controller
          control={control}
          as={
            <MapSelect
              select={Select}
              options={Object.entries(family_plans_list).map(([key, value]) => ({ key, value }))}
            ></MapSelect>
          }
          data-sel="family_plan_select"
          name="family_plans"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{ required: 'Please select an option.' }}
        />
        {Boolean(errors?.family_plans) && <FormHelperText>Error: {errors?.family_plans.message}</FormHelperText>}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingFamilyPlansStep;
