import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Input, Button } from '../../elements';

const ProfilePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [formEnabled, setFormEnabled] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setFormEnabled(oldPassword.length >= 4 && password.length >= 4 && passwordConfirmation.length >= 4);
    setFieldErrors({});
  }, [oldPassword, password, passwordConfirmation]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      setFormEnabled(false);
      setFieldsDisabled(true);
      setFieldErrors({});

      const response = await axios.put('/api/me/password', {
        old_password: oldPassword,
        password,
        password_confirmation: passwordConfirmation
      });
      alert(response.data.message);
      history.push('/profile');
    } catch (error) {
      const err = {};
      if (error.response.status === 403) {
        err.current_password = 'Your current password is incorrect, please try again.';
      } else {
        error.response.data.map((r_err) => {
          let err_text;
          if (r_err.validation === 'confirmed') {
            err_text = "Your new password and password confirmation don't match.";
          }
          if (r_err.validation === 'min') {
            err_text = 'Your new password is too short.';
          }
          err_text ||= r_err.message;
          err[r_err.field] ||= err_text;
        });
      }
      setFieldErrors(err);
    } finally {
      setFormEnabled(true);
      setFieldsDisabled(false);
    }
  };

  const handleOldPasswordChanges = (ev) => {
    setOldPassword(ev.target.value);
  };

  const handlePasswordChanges = (ev) => {
    setPassword(ev.target.value);
  };

  const handlePasswordConfirmationChanges = (ev) => {
    setPasswordConfirmation(ev.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change password</h2>
      <div className="p">
        <label>
          {fieldErrors.current_password && (
            <p className="form-error">
              <span className="form-error--label">Error</span> {fieldErrors.current_password}
            </p>
          )}
          Current password
          <br />
          <Input type="password" name="old_password" disabled={fieldsDisabled} onChange={handleOldPasswordChanges} />
        </label>
      </div>
      <div className="p">
        <label>
          {fieldErrors.password && (
            <p className="form-error">
              <span className="form-error--label">Error</span> {fieldErrors.password}
            </p>
          )}
          New password
          <br />
          <Input type="password" name="password" disabled={fieldsDisabled} onChange={handlePasswordChanges} />
        </label>
      </div>
      <div className="p">
        <label>
          Confirm new password
          <br />
          <Input
            type="password"
            name="password_confirmation"
            disabled={fieldsDisabled}
            onChange={handlePasswordConfirmationChanges}
          />
        </label>
      </div>
      <div className="p">
        <Button disabled={fieldsDisabled || !formEnabled}>Save</Button>
      </div>
    </form>
  );
};

export default ProfilePassword;
