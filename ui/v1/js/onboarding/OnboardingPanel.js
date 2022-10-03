import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import AuthPanel from '../auth/AuthPanel';
import { Button } from '../elements';

const useStyles = makeStyles(
  ({ colors, fontSize, fontBase }) => {
    return {
      afterFormContent: {
        maxWidth: 488,
        margin: '20px auto',
        fontSize: fontSize.f14px
      },
      question: {
        maxWidth: 395,
        margin: '0 auto',
        fontSize: fontSize.f18px,
        fontFamily: fontBase,
        textAlign: 'center',
        color: colors.limedSpruce,
        marginBottom: 8
      },
      questionButton: {
        marginTop: 8,
        textAlign: 'right'
      },
      flexDiv: {
        maxWidth: 312,
        margin: '0 auto'
      },
      bottomContentClass: {
        paddingBottom: 60,
        paddingTop: 100,
        fontSize: fontSize.f14px
      },
      onboardingFlex: {
        flex: 1
      },
      actionsWrapper: {
        marginTop: 8,
        display: 'flex',
        justifyContent: 'space-between'
      }
    };
  },
  { name: 'OnboardingPanel' }
);

const OnboardingPanel = ({ title, question, action, children, afterForm, bottomContent, ...props }) => {
  const classes = useStyles();
  const bottomCenterContent = classnames(['ctr', classes.bottomContentClass]);
  return (
    <>
      <div className={classes.onboardingFlex}>
        <AuthPanel wrap="mid" title={title}>
          <h5 className={classes.question}>{question}</h5>
          <div className={classes.flexDiv}>
            <form {...props.formAttributes}>
              {children}
              <div className={classes.actionsWrapper}>
                <Button type="button" onClick={() => window.history.back()} theme="hollow">
                  Back
                </Button>
                {action}
              </div>
            </form>
          </div>
          {Boolean(afterForm) && <div className={classes.afterFormContent}>{afterForm}</div>}
        </AuthPanel>
      </div>
      {Boolean(bottomContent) && (
        <div data-sel="bottom-content" className={bottomCenterContent}>
          {bottomContent}
        </div>
      )}
    </>
  );
};

export default OnboardingPanel;
