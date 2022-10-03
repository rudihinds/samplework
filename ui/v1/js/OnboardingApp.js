import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import AuthHeader from './auth/AuthHeader';
import {
  OnboardingIdentityStep,
  OnboardingBirthdayStep,
  OnboardingFamilyPlansStep,
  OnboardingCareerStartStep,
  OnboardingUserPartnerStep,
  OnboardingPrimaryCaregiverStep,
  OnboardingPartnerIdentityStep,
  OnboardingPartnerBirthdayStep,
  OnboardingPartnerCareerStartStep,
  OnboardingPartnerNameStep,
  OnboardingWelcome
} from './onboarding';
import { useAuth } from './context/auth';
import NProgress from 'nprogress';

const useStyles = makeStyles(() => {
  return {
    flex: { flex: 1, display: 'flex', flexFlow: 'column' }
  };
}, 'OnboardingApp');

const OnboardingApp = withRouter(({ history, location }) => {
  const classes = useStyles();
  const layoutClasses = classnames(['wrap', classes.flex]);
  const { user } = useAuth();
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [totalSteps, setTotalSteps] = useState(null);

  const updateStep = (user_data) => {
    if (!Object.values(user_data || {}).length) user_data = user;

    let routes = {
      '/intro/welcome': user_data.gender !== null,
      '/intro/you': Boolean(user_data.gender),
      '/intro/your-birthdate': Boolean(user_data.birthdate),
      '/intro/family-plans': Boolean(user_data.family_plans),
      '/intro/your-career-start-age': Boolean(user_data.career_begin_age),
      '/intro/do-you-have-a-partner': user_data.has_partner !== null
    };

    let maxSteps = Object.values(routes).length - 1;

    if (user_data.has_partner === true) {
      routes = {
        ...routes,
        '/intro/childbearing-parent': user_data.primary_care_giver !== null,
        '/intro/partner-name': Boolean(user_data.partner_name),
        '/intro/partner': Boolean(user_data.partner_gender),
        '/intro/partner-birthdate': Boolean(user_data.partner_birthdate),
        '/intro/partner-career-start-age': Boolean(user_data.partner_career_begin_age)
      };
    }
    // 5 is added to max steps manually because we cannot access routes until set by the partner step
    maxSteps += 5;
    routes = { ...routes, '/intro/finish': false };

    // this will let us figure out on which step the user left off last time
    let ix = Object.values(routes).indexOf(false);
    setTotalSteps(maxSteps);

    let updatedSteps = Object.keys(routes).slice(0, ix + 1);

    if (updatedSteps.includes(history.location.pathname)) {
      ix = updatedSteps.indexOf(history.location.pathname);
      updatedSteps = updatedSteps.slice(0, ix + 1);
    }

    let next_step_ix;
    if (Object.keys(routes).includes(history.location.pathname)) {
      next_step_ix = Object.keys(routes).indexOf(history.location.pathname);
    } else {
      // if current location is not in routes map, then we're starting
      next_step_ix = 0;
    }
    const updatedNextStep = Object.keys(routes)[next_step_ix + 1];
    setCurrentStep(next_step_ix);
    return { updatedSteps, updatedNextStep };
  };

  useEffect(() => {
    const unListen = history.listen((location) => {
      if (!onboardingReady) return;
      updateStep();
    });

    return () => {
      unListen();
    };
  }, [onboardingReady, history]);

  useEffect(() => {
    updateStep();
  }, [currentStep]);

  useEffect(() => {
    const { updatedSteps: steps_to_push } = updateStep();
    history.replace('/');
    steps_to_push.forEach((step) => history.push(step));
    setOnboardingReady(true);
  }, []);

  const next = (user = {}) => {
    const { updatedNextStep: nextStep } = updateStep(user);
    history.push(nextStep);
  };

  // we use `onboardingReady` on every route to prevent a weird flickering issue caused by the initial render and then
  // being replaced by the recreated route tree, it seems that we could simply wrap the whole root div into
  // conditional, but then we'd lost the initial transition, which looks quite nice
  return (
    <div className={layoutClasses}>
      <AuthHeader />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        p{
          line-height: 1.65;
        }
      `
        }}
      ></style>
      <SwitchTransition>
        <CSSTransition key={`${onboardingReady}-${location.key || '/'}`} timeout={150} classNames="slide">
          <div className={classes.flex}>
            <Switch location={location}>
              <Route exact path="/intro/welcome">
                {onboardingReady && <OnboardingWelcome next={next} currentStep={currentStep} totalSteps={totalSteps} />}
              </Route>
              <Route exact path="/intro/you">
                {onboardingReady && (
                  <OnboardingIdentityStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/your-birthdate">
                {onboardingReady && (
                  <OnboardingBirthdayStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/family-plans">
                {onboardingReady && (
                  <OnboardingFamilyPlansStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/your-career-start-age">
                {onboardingReady && (
                  <OnboardingCareerStartStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/do-you-have-a-partner">
                {onboardingReady && (
                  <OnboardingUserPartnerStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/childbearing-parent">
                {onboardingReady && (
                  <OnboardingPrimaryCaregiverStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/partner-name">
                {onboardingReady && (
                  <OnboardingPartnerNameStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/partner">
                {onboardingReady && (
                  <OnboardingPartnerIdentityStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/partner-birthdate">
                {onboardingReady && (
                  <OnboardingPartnerBirthdayStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/partner-career-start-age">
                {onboardingReady && (
                  <OnboardingPartnerCareerStartStep next={next} currentStep={currentStep} totalSteps={totalSteps} />
                )}
              </Route>
              <Route exact path="/intro/finish">
                {onboardingReady && <OnboardingFinished />}
              </Route>
              {onboardingReady && (
                <Route>
                  <Redirect to="/intro/welcome" />
                </Route>
              )}
            </Switch>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
});

const OnboardingFinished = withRouter(({ history }) => {
  const { finishOnboarding } = useAuth();
  finishOnboarding().then(() => {
    console.log('Finish onboarding');
    // Shows NProgress bar and then does hard reload into V2 with window.location.href
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    NProgress.set(0.2);
    window.location.href = '/';
    //
    return <div></div>;
    // history.push('/');
  });
  // return null;
});

export default OnboardingApp;
