import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IncomePanel from './IncomePanel';
import ZipCodePanel from './ZipCodePanel';
import ParentalLeavePanel from './ParentalLeavePanel';
import PartTimeWorkPanel from './PartTimeWorkPanel';
import ChildcarePanel from './ChildcarePanel';
import FertilityTreatmentPanel from './FertilityTreatmentPanel';
import { PanelPlaceholder, PanelBg, SectionTitle, VideoEmbedModal } from '../../elements';
import ExtraPanel from './ExtraPanel';
import PlanningGraph from './PlanningGraph';
import PlanningGraphContainer from './PlanningGraphContainer';
import { useAuth } from '../../context/auth';

const useStyles = makeStyles(
  (theme) => ({
    titleContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, max-content)',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        marginBottom: 20
      }
    },
    whatMovesTheNeedle: {
      fontFamily: theme.fontTitle,
      fontWeight: '900',
      fontSize: theme.fontSize.f20px
    }
  }),
  { name: 'PlanningUI' }
);

const PlanningUI = () => {
  const { user, editUser } = useAuth();
  const classes = useStyles();
  const [location, setLocation] = useState({});
  const [planningData, setPlanningData] = useState({});
  const [disabledKeys, setDisabledKeys] = useState([]);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [extraData, setExtraData] = useState(
    Object.assign(
      {
        childbirth_on_year: 0,
        years_in_future: 5,
        split_incomes: true
      },
      user.planning_params || {}
    )
  );

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (ev) => {
    ev.preventDefault();
    setIsOpen(true);
  };

  const closeDialog = (ev) => {
    ev.preventDefault();
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchPlanningData = async () => {
      try {
        const locationFetch = axios.get('/api/location');
        const incomeFetch = axios.get('/api/income');
        const benefitsFetch = axios.get('/api/benefits');
        const expensesFetch = axios.get('/api/expenses');

        const responses = await Promise.all([incomeFetch, benefitsFetch, expensesFetch]);
        const [income, benefits, expenses] = responses.map((res) => {
          if (res.status === 200) {
            return res.data;
          }
          return {};
        });

        const locationResponse = await locationFetch;
        setLocation({ ...locationResponse.data });
        setIsFirstTimeUser(Number(income.myself) === 0 && Number(income.partner) === 0);
        setPlanningData((data) => {
          return {
            ...data,
            ...income,
            ...benefits,
            ...expenses
          };
        });
      } catch (error) {
        console.error(error.response);
      }
    };

    fetchPlanningData();
  }, []);

  useEffect(() => {
    // They're a first time user if income is set to zero (as income == 0 is the initial state)
    setIsFirstTimeUser(Number(planningData.myself) === 0 && Number(planningData.partner) === 0);
  }, [planningData]);

  // Since the algorith requires an index that represents the year, starting from 1 (which is
  // the current year), we need to fix those cases in which the user selects a year «two years
  // from now», which in 2020 would be 2022, but in 2021 it would be 2023; which would certainly
  // mess up her calculations.
  // Because of this, we need to send a calculated value to the API, and on the first render,
  // we make sure that both the index and the real year are actually the same.

  /* 
  assumption:
  real childbirth on year = [index]
  chilbirth_on_year = [actual year]
  */
  useEffect(() => {
    setExtraData((exdata) => {
      if (exdata?.childbirth_on_year && exdata?.real_childbirth_on_year) {
        let yearIndexCalculated = exdata.real_childbirth_on_year - new Date().getFullYear() + 1;
        if (yearIndexCalculated !== exdata.childbirth_on_year) {
          if (yearIndexCalculated < 1) yearIndexCalculated = 1;
          if (yearIndexCalculated > exdata.years_in_future) yearIndexCalculated = exdata.years_in_future;
          exdata.childbirth_on_year = yearIndexCalculated;
        }
      }
      return exdata;
    });
  }, []);

  useEffect(() => {
    extraData.real_childbirth_on_year = new Date().getFullYear() - 1 + extraData.childbirth_on_year;
    const savePlanningParams = async () => editUser({ planning_params: extraData });

    savePlanningParams();
  }, [extraData]);

  return (
    <div>
      <div className="wrap">
        <div className={classes.titleContainer}>
          <SectionTitle>Planning</SectionTitle>
          <span>
            <a data-sel="video-guide-link" href="/" onClick={openDialog} className={classes.whatMovesTheNeedle}>
              What moves the needle?
            </a>
          </span>
        </div>
      </div>
      <div className="wrap">
        <Grid container spacing={2} direction="row-reverse">
          <Grid item md={7} xs={12}>
            <PanelBg className="mq-tablet-center wrap-graph">
              <PlanningGraphContainer isFirstTimeUser={isFirstTimeUser}>
                <PlanningGraph planningData={planningData} extraData={extraData} setExtraData={setExtraData} />
                <ExtraPanel extraData={extraData} setExtraData={setExtraData} />
              </PlanningGraphContainer>
            </PanelBg>
          </Grid>
          <Grid item md={5} xs={12}>
            {!Object.keys(planningData).length ? (
              <>
                <PanelBg>
                  <PanelPlaceholder />
                  <PanelPlaceholder />
                  <PanelPlaceholder />
                  <PanelPlaceholder />
                  <PanelPlaceholder />
                </PanelBg>
              </>
            ) : (
                <>
                  <PanelBg className="mq-tablet-center">
                    <ZipCodePanel location={location} setLocation={setLocation}></ZipCodePanel>
                  </PanelBg>
                  <PanelBg className="mq-tablet-center" title="Income">
                    <IncomePanel
                      planningData={planningData}
                      setPlanningData={setPlanningData}
                      isFirstTimeUser={isFirstTimeUser}
                    />
                    <ParentalLeavePanel
                      planningData={planningData}
                      setPlanningData={setPlanningData}
                      disabledKeys={disabledKeys}
                      setDisabledKeys={setDisabledKeys}
                      isFirstTimeUser={isFirstTimeUser}
                    />
                    <PartTimeWorkPanel
                      planningData={planningData}
                      setPlanningData={setPlanningData}
                      disabledKeys={disabledKeys}
                      setDisabledKeys={setDisabledKeys}
                      isFirstTimeUser={isFirstTimeUser}
                    />
                  </PanelBg>
                  <PanelBg className="mq-tablet-center" title="Expenses">
                    <ChildcarePanel planningData={planningData} setPlanningData={setPlanningData} />
                    <FertilityTreatmentPanel planningData={planningData} setPlanningData={setPlanningData} />
                  </PanelBg>
                </>
              )}
          </Grid>
        </Grid>
      </div>
      <VideoEmbedModal
        isOpen={isOpen}
        handleClose={closeDialog}
        title="What moves the needle?"
        video="https://www.youtube.com/embed/uCOnmVpjeRQ"
      />
    </div>
  );
};

export default PlanningUI;
