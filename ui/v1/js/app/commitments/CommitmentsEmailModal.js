import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, FormControl, FormHelperText } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { SimpleInput, Icon, SquareButton } from '../../elements';
import { useAuth } from '../../context/auth';

const useStyles = makeStyles(
  (theme) => ({
    container: {
      color: theme.colors.nevada
    },
    dialogClass: {
      padding: 32,
      maxWidth: 500
    },
    dialogTitle: {
      fontWeight: 900,
      fontSize: theme.fontSize.f24px,
      fontFamily: theme.fontBase
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,2fr)',
      gridGap: 16,
      [theme.breakpoints.down('xs')]: { gridTemplateColumns: 'auto' }
    },
    maxInput: {},
    modalClose: {
      display: 'inline-block',
      padding: 10
    }
  }),
  { name: 'CommitmentsEmailModal' }
);

const CommitmentsEmailModal = ({ isOpen, handleClose }) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const { handleSubmit, control, errors } = useForm({
    defaultValues: { email: user?.email }
  });

  const submitForm = async (data) => {
    try {
      setFieldsDisabled(true);
      await axios.post('/api/mailing-list/commitments/subscribe', data);
      setSubscribedSuccess(true);
    } catch (error) {
      console.error(error.response.data);
      enqueueSnackbar(
        'An unexpected error occurred! Please check that the entered email address is correct and try again.'
      );
    } finally {
      setFieldsDisabled(false);
    }
  };

  return (
    <Dialog
      PaperProps={{ classes: { root: classes.dialogClass } }}
      onClose={handleClose}
      open={isOpen}
      data-sel="commitments-email-modal"
    >
      <div className={classes.container}>
        <div className="rgt">
          <a data-sel="modal-close" href="/" className={classes.modalClose} onClick={handleClose}>
            <Icon icon="cross" width={16} />
          </a>
        </div>
        <div className="ctr">
          <Icon fill={false} icon="modal-dialog-gal" width={297}></Icon>
        </div>
        <h3 className={classes.dialogTitle}>&quot;Commitments&quot; is not available yet</h3>
        <p>
          Our team is working on developing this feature so you can bring it into your planning as soon as possible.
          Subscribe to the waitlist and we’ll let you know when it’s available.
        </p>
        {subscribedSuccess ? (
          <p className="ctr" data-sel="subscribed_success">
            <strong>You are subscribed!</strong>
          </p>
        ) : (
          <>
            <p>Email address</p>
            <form onSubmit={handleSubmit(submitForm)} className={classes.actions}>
              <FormControl fullWidth variant="filled" error={Boolean(errors?.email)}>
                <Controller
                  control={control}
                  as={SimpleInput}
                  fullWidth
                  data-sel="email_input"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  rules={{ required: 'Please input your email.' }}
                  disabled={fieldsDisabled}
                />
                {Boolean(errors?.email) && <FormHelperText>Error: {errors?.email.message}</FormHelperText>}
              </FormControl>
              <SquareButton data-sel="modal-subscribe" name="submit" disabled={fieldsDisabled}>
                Subscribe me
              </SquareButton>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default CommitmentsEmailModal;
