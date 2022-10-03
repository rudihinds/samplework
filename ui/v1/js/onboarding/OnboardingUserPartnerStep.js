import React, { useState } from 'react';
import { MenuItem, InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { FilledSelect as Select, Button } from '../../js/elements';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { useForm, Controller } from 'react-hook-form';
import OnboardingPanel from './OnboardingPanel';

const OnboardingUserPartnerStep = ({ next, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const { user, editUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors, watch } = useForm({
    defaultValues: { has_partner: user?.has_partner ?? '' }
  });

  const shouldRenderPartnerMessage = watch('has_partner') === false;

  const saveUserHasPartner = async (data) => {
    try {
      setFieldsDisabled(true);
      const response = await editUser(data);
      // for most cases, we don't send an argument to next(), but since on this step, the user response will let us
      // know which branching path we'll take, we'd need to wait for the next render to get an updated user, this
      // is where Vue's nextTick would be very useful (or at least, a one-time useEffect)
      // in order to prevent callback hell, we just pass the updated object to let `next` know that for this time,
      // we won't be using the user state since it's not updated
      next(response.data);
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <OnboardingPanel
      title="Now tell us a little bit about yourself..."
      question="Do you have a partner?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_user_partner_step',
        onSubmit: handleSubmit(saveUserHasPartner)
      }}
      afterForm={
        <div>
          {shouldRenderPartnerMessage && (
            <p>
              As a heads up, you’ll still see an area to input partner information. We chose to leave that there in case
              you wanted to play around with scenarios.
            </p>
          )}
        </div>
      }
      bottomContent={
        <div>
          {currentStep} out of {shouldRenderPartnerMessage ? currentStep : totalSteps}
        </div>
      }
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.has_partner)}>
        <InputLabel>Select an Option</InputLabel>
        <Controller
          control={control}
          as={
            <Select>
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          }
          data-sel="user_partner_select"
          name="has_partner"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{ validate: (val) => Boolean(val) === val || 'Please select an option.' }}
        />
        {Boolean(errors?.has_partner) && <FormHelperText>Error: {errors?.has_partner.message}</FormHelperText>}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingUserPartnerStep;
