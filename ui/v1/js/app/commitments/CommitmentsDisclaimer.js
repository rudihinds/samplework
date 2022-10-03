import React, { Fragment, useState } from 'react';
import axios from 'axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { DisclaimerWithAction, SquareButton } from '../../elements';
import { useAuth } from '../../context/auth';

const CommitmentsDisclaimer = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const ContainerElement = isDesktop ? Fragment : FloatingDisclaimer;
  const [disclaimerOpen, setDisclaimerOpen] = useState(!user.meta?.commitments_disclaimer_ok_at);
  const gotIt = async () => {
    try {
      await axios.put('/api/me/meta/commitments_disclaimer_ok');
      setDisclaimerOpen(false);
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    }
  };
  if (!disclaimerOpen) return null;
  return (
    <ContainerElement>
      <DisclaimerWithAction
        action={
          <SquareButton data-sel="disclaimer-button" icon="checkmark" theme="disclaimer-action" onClick={gotIt}>
            Got it
          </SquareButton>
        }
      >
        Commitments are core to relationships. Both those with other people, and your relationship with yourself.
        Research shows that after children are born, we tend to regress back into traditional gender norms, with mothers
        taking on up to 75% of all unpaid work. Our hope is that if you build in these commitments now, we can help you
        avoid that burden later down the road.
      </DisclaimerWithAction>
    </ContainerElement>
  );
};

const useStyles = makeStyles(() => {
  return {
    floating: {
      position: 'fixed',
      bottom: 10,
      left: '50%',
      width: '95%',
      transform: 'translateX(-50%)',
      zIndex: 9
    }
  };
});

const FloatingDisclaimer = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.floating}>{children}</div>;
};

export default CommitmentsDisclaimer;
