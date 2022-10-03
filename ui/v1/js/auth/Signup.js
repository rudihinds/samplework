import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { TextFieldWithValidation, Button } from '../elements';
import { useAuth } from '../context/auth';
import AuthPanel from './AuthPanel';

import NProgress from 'nprogress';

const Signup = () => {
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { register } = useAuth();
  const history = useHistory();
  const { handleSubmit, control, errors, setError } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const signupSubmit = async (data) => {
    // NProgress for transition into V2
    // V2 starts at 0.2 and then calls .done()
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    NProgress.set(0.2);
    try {
      setFieldsDisabled(true);
      const response = await register({ ...data, password_confirmation: data.password });
      if (response.status === 201) {
        // history.push('/');
        // Uses window.location.href to force a reload into V2
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
      error.response.data.forEach((k) => {
        setError(k.field, { type: 'manual', message: k.message });
      });
      NProgress.done();
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <AuthPanel
      title="Create An Account"
      wrap="min"
      afterForm={
        <p>
          I already have an account:{' '}
          <Link to="/login">
            <strong>Login</strong>
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(signupSubmit)} data-sel="Signup">
        <div className="p">
          <Controller
            control={control}
            as={TextFieldWithValidation}
            data-sel="signup-name-input"
            name="name"
            label="Full name"
            autoComplete="name"
            fullWidth={true}
            disabled={fieldsDisabled}
            rules={{
              required: 'You must enter your name.',
              pattern: { value: /[a-z]{1,}/i, message: 'You must enter your name' }
            }}
            error={errors.name && errors.name.message}
          />
        </div>
        <div className="p">
          <Controller
            control={control}
            as={TextFieldWithValidation}
            data-sel="signup-email-input"
            name="email"
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
            data-sel="signup-password-input"
            name="password"
            type="password"
            label="Password"
            autoComplete="password"
            fullWidth={true}
            disabled={fieldsDisabled}
            rules={{
              required: 'You must enter your password.',
              minLength: { value: 6, message: 'Your password must contain at least 6 characters.' }
            }}
            error={errors.password && errors.password.message}
          />
        </div>
        <div className="p rgt">
          <Button disabled={fieldsDisabled}>Sign up</Button>
        </div>
      </form>
    </AuthPanel>
  );
};

export default Signup;
