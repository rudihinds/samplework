import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextFieldWithValidation } from '../elements';
import { useAuth } from '../context/auth';

import NProgress from 'nprogress';

const useStyles = makeStyles(
  {
    forgotPwdLinkAndButton: {
      display: 'flex'
    },
    btnContainer: {
      flex: 1
    }
  },
  { name: 'Login' }
);

const Login = () => {
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const { login } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const { handleSubmit, control, errors, setError } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const loginSubmit = async (data) => {
    // NProgress for transition into V2
    // V2 starts at 0.2 and then calls .done()
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    NProgress.set(0.2);

    try {
      setFieldsDisabled(true);
      const response = await login(data);
      if (response.status === 200) {
        // history.push('/');
        // Uses window.location.href to force a reload into V2
        window.location.href = '/';
      }
    } catch (e) {
      setError('email', { type: 'manual', message: 'Invalid email or password, please try again' });
      NProgress.done();
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(loginSubmit)} data-sel="Login">
      <div className="p">
        <Controller
          control={control}
          as={TextFieldWithValidation}
          data-sel="login-email-input"
          name="email"
          label="Email"
          fullWidth={true}
          disabled={fieldsDisabled}
          autoComplete="email"
          autoFocus={true}
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
          data-sel="login-password-input"
          name="password"
          type="password"
          label="Password"
          fullWidth={true}
          disabled={fieldsDisabled}
          autoComplete="current-password"
          rules={{
            required: 'You must enter your password.',
            minLength: { value: 3, message: 'You must enter your password.' }
          }}
          error={errors.password && errors.password.message}
        />
      </div>

      <div className={classes.forgotPwdLinkAndButton}>
        <p>
          <Link to="/password/forgot">Forgot password?</Link>
        </p>
        <div className={`p rgt ${classes.btnContainer}`}>
          <Button disabled={fieldsDisabled}>Log in</Button>
        </div>
      </div>
    </form>
  );
};

export default Login;
