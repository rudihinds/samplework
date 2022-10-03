import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { TextFieldWithValidation, Button, Icon } from '../elements';
import AuthPanel from './AuthPanel';

const PasswordRecovery = () => {
  const [showRecoveryConfirmation, setShowRecoveryConfirmation] = useState(false);
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const forgotPwdSubmit = async (data) => {
    try {
      setFieldsDisabled(true);
      await axios.post('/api/password/forgot', data);
      setShowRecoveryConfirmation(true);
    } catch (error) {
      const message = error.response?.data?.error ?? 'Unexpected error, please try again';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setFieldsDisabled(false);
    }
  };

  return showRecoveryConfirmation ? (
    <AuthPanel
      title="Email sent"
      theme="white"
      afterForm={
        <p>
          Go back to:{' '}
          <Link to="/login">
            <strong>Login</strong>
          </Link>
        </p>
      }
    >
      <div data-sel="PasswordRecovery-confirmation">
        <div>
          <p className="ctr">
            <Icon icon="email" width={24} />
          </p>
          <p>An email has been sent to your email address. Follow the directions to reset your password!</p>
        </div>
        <p>Can&apos;t find the email? Check your spam folder</p>
      </div>
    </AuthPanel>
  ) : (
    <AuthPanel
      title="Password recovery"
      afterForm={
        <p>
          Go back to:{' '}
          <Link to="/login">
            <strong>Login</strong>
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(forgotPwdSubmit)} data-sel="PasswordRecovery-form">
        <div className="p">
          <Controller
            control={control}
            as={TextFieldWithValidation}
            data-sel="password-recovery-email-input"
            name="email"
            type="email"
            label="Email"
            fullWidth={true}
            disabled={fieldsDisabled}
            rules={{
              required: 'You must enter your email',
              minLength: { value: 3, message: 'You must enter your email' }
            }}
            error={errors.email && errors.email.message}
          />
        </div>
        <div className="p rgt">
          <Button disabled={fieldsDisabled}>Submit</Button>
        </div>
      </form>
    </AuthPanel>
  );
};

export default PasswordRecovery;
