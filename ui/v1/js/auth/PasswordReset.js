import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button, TextFieldWithValidation } from '../elements';
import { useForm, Controller } from 'react-hook-form';

const PasswordReset = () => {
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { token } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: ''
    }
  });

  const updatePwdSubmit = async (data) => {
    try {
      setFieldsDisabled(true);
      const response = await axios.post(`/api/password/reset/${token}`, data);
      enqueueSnackbar(response.data.message, { variant: 'success' });
      history.push('/login');
    } catch (error) {
      enqueueSnackbar('Something gone wrong, check again your data', { variant: 'error' });
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(updatePwdSubmit)} data-sel="PasswordReset">
      <div className="p">
        <Controller
          control={control}
          as={TextFieldWithValidation}
          name="email"
          type="email"
          data-sel="password-reset-email-input"
          label="Email"
          autoComplete="email"
          fullWidth={true}
          disabled={fieldsDisabled}
          rules={{
            required: 'You must enter your email.',
            minLength: { value: 3, message: 'You must enter your email.' }
          }}
          error={errors.email && errors.email.message}
        />
      </div>
      <div className="p">
        <Controller
          control={control}
          as={TextFieldWithValidation}
          name="password"
          type="password"
          data-sel="password-reset-password-input"
          label="New Password"
          autoComplete="new-password"
          fullWidth={true}
          disabled={fieldsDisabled}
          rules={{
            required: 'You must enter your new password.',
            minLength: { value: 6, message: 'You must enter your new password.' }
          }}
          error={errors.password && errors.password.message}
        />
      </div>
      <div className="p">
        <Controller
          control={control}
          as={TextFieldWithValidation}
          name="password_confirmation"
          type="password"
          data-sel="password-reset-passwordconfirmation-input"
          label="Password Confirmation"
          autoComplete="new-password-confirmation"
          fullWidth={true}
          disabled={fieldsDisabled}
          rules={{
            required: 'You must enter your new password confirmation.',
            minLength: { value: 6, message: 'You must enter your new password confirmation.' }
          }}
          error={errors.password_confirmation && errors.password_confirmation.message}
        />
      </div>
      <div className="p rgt">
        <Button disabled={fieldsDisabled}>Submit</Button>
      </div>
    </form>
  );
};

export default PasswordReset;
