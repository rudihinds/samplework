import React, { useState } from 'react';
import { MenuItem, InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { FilledSelect as Select, Button } from '../../js/elements';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { useForm, Controller } from 'react-hook-form';
import OnboardingPanel from './OnboardingPanel';

const OnboardingPrimaryCaregiverStep = ({ next, currentStep, totalSteps }) => {
  const { user, editUser } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: { is_primary_care_giver: user?.is_primary_care_giver ?? '' }
  });

  const saveUserPrimaryCaregiver = async (data) => {
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
      question="Do you plan to be the childbearing parent?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_primary_caregiver_step',
        onSubmit: handleSubmit(saveUserPrimaryCaregiver)
      }}
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.is_primary_care_giver)}>
        <InputLabel>Select an Option</InputLabel>
        <Controller
          control={control}
          as={
            <Select>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          }
          data-sel="user_primary_caregiver_select"
          name="is_primary_care_giver"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{
            validate: (val) => Boolean(val) === val || 'Please select an option.'
          }}
        />
        {Boolean(errors?.is_primary_care_giver) && (
          <FormHelperText>Error: {errors?.is_primary_care_giver.message}</FormHelperText>
        )}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingPrimaryCaregiverStep;
