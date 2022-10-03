import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Button, Checkbox } from '../elements';
import AuthPanel from '../auth/AuthPanel';
const useStyles = makeStyles(() => ({
  noMarginBox: {
    textAlign: 'right',
    margin: 0
  }
}));
const OnboardingWelcome = ({ next, currentStep, totalSteps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [isBoxChecked, setIsBoxChecked] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setIsBoxChecked(event.target.checked);
    if (error) setError(!event.target.checked);
  };

  const saveUserFinishedOnboarding = async (event) => {
    event.preventDefault();
    if (!isBoxChecked) {
      setError(true);
      return;
    }
    try {
      setFieldsDisabled(false);
      next();
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
      setFieldsDisabled(false);
    }
  };

  return (
    <AuthPanel title="Welcome" theme="white" wrap="med" subtitle="Thank you for helping us test this product.">
      <div style={{ lineHeight: 1.65 }} data-sel="OnboardingWelcome">
        <p>
          Hey, welcome to Mirza. We’re here to help future, expecting, and current parents navigate the tricky decisions
          that come with starting a family. When should I have a child? How much parental leave should I take? How will
          this affect my career? What will daycare cost?
        </p>
        <p>
          By using our tool, you can see the impact that your choices will have on you and your partners’ short and long
          term earnings, understand upcoming costs, and start to plan for your future. We know that life has a tendency
          to throw curveballs at us (hello, COVID) and plans change; as they do, feel free to come back in and try as
          many scenarios as you want. Creating a profile allows you to save your answers in case you want to change them
          later. <strong>We will not sell any of your data to advertisers.</strong>
        </p>
        <p>
          We use academic studies and historic occupational data to give you the most accurate projections possible, and
          help you understand how some of the choices we make (or are forced to choose) contribute to the motherhood
          penalty. Some choice stats:
        </p>
        <ul>
          <li>Overall, working mothers see a “penalty” close to 20% in the long run</li>
          <li>
            For every year out of the workforce, the hit on your longterm earnings is up to 10x your annual salary
          </li>
          <li>
            On the bright side, for every month of paternity leave a father takes, the working mother’s earnings
            increase by 7%
          </li>
        </ul>
        <p>
          This solution is meant to provide you the information you need to be proactive about the decisions surrounding
          having children while growing a career. By planning ahead and budgeting for upcoming costs, we hope you can
          feel confident and prepared for your new life goals. What we’re showing is a combination of research data,
          standard growth rates for salaries, average costs of childcare and fertility, etc. So our big caveat: we’re
          talking about making informed decisions, and not guarantees for future earning or results. We don’t know the
          future :)
        </p>
        <p>
          <strong>We’re excited for your feedback to help us tailor and personalize the final product.</strong>
        </p>
        <div className="rgt">
          <FormControl required error={Boolean(error)} component="fieldset">
            <FormGroup>
              <FormControlLabel
                className={classes.noMarginBox}
                control={
                  <Checkbox checked={isBoxChecked} onChange={handleChange} name="tos_box" data-sel="terms-of-service" />
                }
                labelPlacement="end"
                label={
                  <p className="rgt">
                    I agree to the&nbsp;
                    <a href="/termsofservice.html" rel="noreferrer" target="_blank">
                      Terms of Use
                    </a>
                  </p>
                }
              />
            </FormGroup>
          </FormControl>
        </div>
        {Boolean(error) && (
          <div className="rgt">
            <FormControl error={Boolean(error)}>
              <FormHelperText className="rgt">You must accept the Terms of Use before continuing</FormHelperText>
            </FormControl>
          </div>
        )}
        <p className="rgt">
          <Button disabled={fieldsDisabled} onClick={saveUserFinishedOnboarding} data-sel="i-understand-button">
            I understand
          </Button>
        </p>
      </div>
    </AuthPanel>
  );
};

export default OnboardingWelcome;
