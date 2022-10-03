import React, { useState, useEffect } from 'react';
import { InputLabel, FormControl, FormHelperText } from '@material-ui/core';
import { FilledSelect as Select, Button } from '../../js/elements';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/auth';
import { useForm, Controller } from 'react-hook-form';
import OnboardingPanel from './OnboardingPanel';
import MapSelect from './MapSelectBit';

const OnboardingCareerStartStep = ({ next, currentStep, totalSteps }) => {
  const { t } = useTranslation();
  const { user, editUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [careerBeginAge, setCareerBeginAge] = useState('');
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { handleSubmit, control, errors, watch } = useForm({
    defaultValues: {
      career_begin_age:
        user.birthdate && user.career_begin_age ? new Date(user.birthdate).getFullYear() + user.career_begin_age : ''
    }
  });
  const watchCareerStartYear = watch('career_begin_age');
  useEffect(() => {
    if (user.birthdate && watchCareerStartYear)
      setCareerBeginAge(Math.abs(new Date(user.birthdate).getFullYear() - watchCareerStartYear));
  }, [watchCareerStartYear]);

  const saveUserCareerStart = async (data) => {
    try {
      setFieldsDisabled(true);
      await editUser({ career_begin_age: careerBeginAge });
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
      question="What year did you start working full time?"
      action={
        <Button disabled={fieldsDisabled} data-sel="savePref">
          Next
        </Button>
      }
      formAttributes={{
        'data-sel': 'onboarding_career_start_step',
        onSubmit: handleSubmit(saveUserCareerStart)
      }}
      afterForm={
        <>
          <p>
            We ask this to understand when your career “officially” started. While this looks very different for many of
            us, this could be after you finished high school or university and joined the workforce full time.
          </p>
          <p>
            If you continued to pursue part time education, switched to part-time work at any point, or had to take time
            out of work, that’s fine, but please use the year where you started working.
          </p>
        </>
      }
      bottomContent={
        <div>
          {currentStep} out of {totalSteps}
        </div>
      }
    >
      <FormControl fullWidth={true} variant="filled" error={Boolean(errors?.career_begin_age)}>
        <InputLabel>Start Year</InputLabel>
        <Controller
          control={control}
          as={
            <MapSelect
              select={Select}
              options={[...Array(new Date().getFullYear() - (new Date(user?.birthdate).getFullYear() + 1))].map(
                (_, i) => ({
                  key: new Date().getFullYear() - i,
                  value: new Date().getFullYear() - i
                })
              )}
            ></MapSelect>
          }
          data-sel="career_start_select"
          name="career_begin_age"
          disabled={fieldsDisabled}
          displayEmpty
          rules={{ required: 'Please select an option.' }}
        />
        {Boolean(errors?.career_begin_age) && (
          <FormHelperText>Error: {errors?.career_begin_age.message}</FormHelperText>
        )}
      </FormControl>
    </OnboardingPanel>
  );
};

export default OnboardingCareerStartStep;
