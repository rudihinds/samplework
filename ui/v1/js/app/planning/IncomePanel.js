import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { FormControl } from '@material-ui/core';
import { useAuth } from '../../context/auth';
import { firstWord, partnerName } from '../../utils';
import {
  Icon,
  OnboardingTooltip as Tooltip,
  LabeledInput,
  TitleWithAction,
  PaddedPanel,
  StylizedText,
  MiniGrid,
  OutlinedAutocomplete
} from '../../elements';

const IncomePanel = ({ planningData, setPlanningData, isFirstTimeUser }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [occupations, setOccupations] = useState([]);
  const [incomeSelf, setIncomeSelf] = useState(planningData.myself);
  const [fullTimeHrsSelf, setFullTimeHrsSelf] = useState(planningData.full_time_hrs);
  const [incomePartner, setIncomePartner] = useState(planningData.partner);
  const [fullTimeHrsPartner, setFullTimeHrsPartner] = useState(planningData.full_time_hrs_partner);
  const [occupationSelf, setOccupationSelf] = useState(planningData.occupation_id || 0);
  const [occupationPartner, setOccupationPartner] = useState(planningData.partner_occupation_id || 0);
  const [isTooltipOpen, setIsTooltipOpen] = useState(isFirstTimeUser);
  const incomeFormRef = useRef();
  let cancelToken;

  const saveIncome = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        '/api/income',
        {
          myself: incomeSelf,
          partner: incomePartner,
          full_time_hrs: fullTimeHrsSelf || 0,
          full_time_hrs_partner: fullTimeHrsPartner || 0,
          occupation_id: occupationSelf,
          partner_occupation_id: occupationPartner
        },
        { cancelToken: cancelToken?.token }
      );
      const income = response.data;
      setIncomeSelf(income.myself);
      setIncomePartner(income.partner);
      setFullTimeHrsSelf(income.full_time_hrs);
      setFullTimeHrsPartner(income.full_time_hrs_partner);
      setOccupationSelf(income.occupation_id || 0);
      setOccupationPartner(income.partner_occupation_id || 0);
      setPlanningData((data) => {
        return { ...data, ...income };
      });
      setIsTooltipOpen(false);
    } catch (error) {
      if (!axios.isCancel(error)) enqueueSnackbar(t('errors.generic'));
    }
  };

  const didMount = useRef(false);
  const debounced = debounce(async () => {
    if (incomeFormRef.current.reportValidity()) {
      await saveIncome();
    }
  }, 500);

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        const response = await axios.get('/api/occupations');
        setOccupations(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOccupations();
  }, []);

  useEffect(() => {
    if (didMount.current) debounced();
    else didMount.current = true;
    return () => {
      cancelToken?.cancel('request_cancelled');
      debounced.cancel();
    };
  }, [incomeSelf, incomePartner, fullTimeHrsSelf, fullTimeHrsPartner, occupationSelf, occupationPartner]);

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await saveIncome();
  };

  const handleIncomeSelfChange = (ev) => {
    setIncomeSelf(ev.target.value);
  };

  const handleIncomePartnerChange = (ev) => {
    setIncomePartner(ev.target.value);
  };

  const handleFullTimeHrsChange = (ev) => {
    setFullTimeHrsSelf(ev.target.value);
  };

  const handleFulltimeHrsPartnerChange = (ev) => {
    setFullTimeHrsPartner(ev.target.value);
  };

  const handleOccupationSelfChange = (ev) => {
    setOccupationSelf(ev);
  };

  const handleOccupationPartnerChange = (ev) => {
    setOccupationPartner(ev);
  };

  const tooltip = (
    <Tooltip
      controlled={isFirstTimeUser}
      visible={isTooltipOpen}
      open={() => setIsTooltipOpen(true)}
      close={() => setIsTooltipOpen(false)}
      content={
        <div>
          Add your current annual post-tax earnings, including bonus if applicable here. Also add in what your current
          work hours/week look like, if you’re working a full time job. Need help?{' '}
          <a href="https://salaryaftertax.com/us/salary-calculator" target="_blank" rel="noopener, noreferrer">
            Click here!
          </a>
        </div>
      }
    >
      <Icon icon="question-circle" width="15" />
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit} ref={incomeFormRef}>
      <PaddedPanel separator={true} mtop={2}>
        <TitleWithAction title="Income After Tax" titleTooltip={tooltip} />
        <StylizedText theme="label-main">{user && firstWord(user.name)}</StylizedText>
        <PaddedPanel mtop={1} mbot={2}>
          <MiniGrid>
            <StylizedText theme="label-sec">Income</StylizedText>
            <div>
              <LabeledInput
                name="income_myself"
                className="min"
                onChange={handleIncomeSelfChange}
                value={incomeSelf}
                label="USD"
              />
            </div>
            <StylizedText theme="label-sec">Full-time</StylizedText>
            <div>
              <LabeledInput
                kind="numeric"
                format="##"
                name="full_time_hrs"
                className="min"
                onChange={handleFullTimeHrsChange}
                value={fullTimeHrsSelf}
                label={t('hrs_p_week', { count: Number(fullTimeHrsSelf) })}
              />
            </div>
            <StylizedText theme="label-sec">Industry</StylizedText>
            <div>
              <FormControl variant="outlined" size="small" fullWidth data-sel="user-industry-autocomplete">
                {Boolean(occupations.length) && (
                  <OutlinedAutocomplete
                    options={occupations}
                    currentValue={occupationSelf}
                    changeValue={handleOccupationSelfChange}
                  />
                )}
              </FormControl>
            </div>
          </MiniGrid>
        </PaddedPanel>

        <StylizedText theme="label-main">{partnerName(user.partner_name)}</StylizedText>
        <PaddedPanel mtop={1}>
          <MiniGrid>
            <StylizedText theme="label-sec">Income</StylizedText>
            <div>
              <LabeledInput
                name="income_partner"
                className="min"
                onChange={handleIncomePartnerChange}
                value={incomePartner}
                label="USD"
              />
            </div>
            <StylizedText theme="label-sec">Full-time</StylizedText>
            <div>
              <LabeledInput
                kind="numeric"
                format="##"
                name="full_time_hrs_partner"
                className="min"
                onChange={handleFulltimeHrsPartnerChange}
                value={fullTimeHrsPartner}
                label={t('hrs_p_week', { count: Number(fullTimeHrsPartner) })}
              />
            </div>
            <StylizedText theme="label-sec">Industry</StylizedText>
            <div>
              <FormControl variant="outlined" size="small" fullWidth data-sel="partner-industry-autocomplete">
                {Boolean(occupations.length) && (
                  <OutlinedAutocomplete
                    options={occupations}
                    currentValue={occupationPartner}
                    changeValue={handleOccupationPartnerChange}
                  />
                )}
              </FormControl>
            </div>
          </MiniGrid>
        </PaddedPanel>
      </PaddedPanel>
    </form>
  );
};

export default IncomePanel;
