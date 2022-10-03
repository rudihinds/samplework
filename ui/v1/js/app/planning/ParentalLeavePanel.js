import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/auth';
import { firstWord, partnerName } from '../../utils';
import {
  TitleWithAction,
  PaddedPanel,
  LabeledInput,
  StylizedText,
  MiniGrid,
  OnboardingTooltip as Tooltip,
  Icon
} from '../../elements';

const ParentalLeavePanel = ({ planningData, setPlanningData, disabledKeys, setDisabledKeys, isFirstTimeUser }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [parentalLeaveSelf, setParentalLeaveSelf] = useState(planningData.parental_leave);
  const [parentalLeavePartner, setParentalLeavePartner] = useState(planningData.parental_leave_partner);
  const [parentalLeavePercentageSelf, setParentalLeavePercentageSelf] = useState(
    planningData.parental_leave_percentage
  );
  const [parentalLeavePercentagePartner, setParentalLeavePercentagePartner] = useState(
    planningData.parental_leave_percentage_partner
  );
  const [unpaidParentalLeaveSelf, setUnpaidParentalLeaveSelf] = useState(planningData.unpaid_parental_leave);
  const [unpaidParentalLeavePartner, setUnpaidParentalLeavePartner] = useState(
    planningData.unpaid_parental_leave_partner
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isLocalFirstTimeUser, setIsLocalFirstTimeUser] = useState(isFirstTimeUser);
  const formRef = useRef();
  let cancelToken;

  const save = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        '/api/benefits',
        {
          parental_leave: parentalLeaveSelf || 0,
          parental_leave_partner: parentalLeavePartner || 0,
          parental_leave_percentage: parentalLeavePercentageSelf || 0,
          parental_leave_percentage_partner: parentalLeavePercentagePartner || 0,
          unpaid_parental_leave: unpaidParentalLeaveSelf || 0,
          unpaid_parental_leave_partner: unpaidParentalLeavePartner || 0
        },
        { cancelToken: cancelToken?.token }
      );
      const benefits = response.data;
      setPlanningData((data) => {
        return { ...data, ...benefits };
      });
      setIsTooltipOpen(false);
      setIsLocalFirstTimeUser(isFirstTimeUser);
    } catch (error) {
      if (!axios.isCancel(error)) enqueueSnackbar(t('errors.generic'));
    }
  };

  const didMount = useRef(false);
  const debounced = debounce(async () => {
    if (formRef.current.reportValidity()) {
      await save();
    }
  }, 500);

  useEffect(() => {
    if (didMount.current) debounced();
    else didMount.current = true;
    return () => {
      cancelToken?.cancel('request_cancelled');
      debounced.cancel();
    };
  }, [
    parentalLeaveSelf,
    parentalLeavePartner,
    parentalLeavePercentageSelf,
    parentalLeavePercentagePartner,
    unpaidParentalLeaveSelf,
    unpaidParentalLeavePartner
  ]); 

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await save();
  };

  const handlePLeaveSelfChange = (ev) => {
    setParentalLeaveSelf(ev.target.value);
  };

  const handlePLeavePartnerChange = (ev) => {
    setParentalLeavePartner(ev.target.value);
  };

  const handleUnpaidPLeaveSelfChange = (ev) => {
    setUnpaidParentalLeaveSelf(ev.target.value);
  };

  const handlePLeavePSelfChange = (ev) => {
    setParentalLeavePercentageSelf(ev.target.value);
  };

  const handlePLeavePartnerPChange = (ev) => {
    setParentalLeavePercentagePartner(ev.target.value);
  };

  const handleUnpaidPLeavePartnerChange = (ev) => {
    setUnpaidParentalLeavePartner(ev.target.value);
  };

  const tooltip = (
    <Tooltip
      controlled={isLocalFirstTimeUser}
      visible={isTooltipOpen}
      content={
        <div>
          If your employer provides parental leave, add what your policy offers here. If your employer does not, the
          Family and Medical Leave Act (FMLA) offers 12 weeks of unpaid, job-protected leave for most parents.
        </div>
      }
      open={() => setIsTooltipOpen(true)}
      close={() => setIsTooltipOpen(false)}
    >
      <Icon icon="question-circle" width="15" />
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit} ref={formRef}>
      <PaddedPanel separator={true} mtop={2}>
        <TitleWithAction title="Parental Leave" titleTooltip={tooltip} />

        <Box mb={1}>
          <StylizedText theme="label-main">{user && firstWord(user.name)}</StylizedText>
        </Box>
        <MiniGrid columns={3}>
          <div>
            <StylizedText theme="small-purple-label">Paid</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">% Paid Salary</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">Unpaid</StylizedText>
          </div>
          <div>
            <span>
              <LabeledInput
                name="parental_leave"
                className="full"
                onChange={handlePLeaveSelfChange}
                kind="numeric"
                maxLength={3}
                value={parentalLeaveSelf}
                num={parentalLeaveSelf}
                label={t('week', { count: Number(parentalLeaveSelf) })}
              />
            </span>
          </div>
          <div>
            <span>
              <LabeledInput
                name="parental_leave_percentage"
                className="full"
                onChange={handlePLeavePSelfChange}
                maxLength={3}
                min={1}
                max={100}
                required
                step={1}
                type="number"
                value={parentalLeavePercentageSelf}
                num={parentalLeavePercentageSelf}
                label="%"
              />
            </span>
          </div>
          <div>
            <span>
              <LabeledInput
                name="unpaid_parental_leave"
                className="full"
                onChange={handleUnpaidPLeaveSelfChange}
                kind="numeric"
                maxLength={3}
                value={unpaidParentalLeaveSelf}
                num={unpaidParentalLeaveSelf}
                label={t('week', { count: Number(unpaidParentalLeaveSelf) })}
              />
            </span>
          </div>
        </MiniGrid>
        <Box mb={1} mt={2}>
          <StylizedText theme="label-main">{partnerName(user.partner_name)}</StylizedText>
        </Box>
        <MiniGrid columns={3}>
          <div>
            <StylizedText theme="small-purple-label">Paid</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">% Paid Salary</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">Unpaid</StylizedText>
          </div>
          <div>
            <span>
              <LabeledInput
                name="parental_leave_partner"
                className="full"
                onChange={handlePLeavePartnerChange}
                kind="numeric"
                maxLength={3}
                value={parentalLeavePartner}
                num={parentalLeavePartner}
                label={t('week', { count: Number(parentalLeavePartner) })}
              />
            </span>
          </div>
          <div>
            <span>
              <LabeledInput
                name="parental_leave_partner_percentage"
                className="full"
                onChange={handlePLeavePartnerPChange}
                maxLength={3}
                min={1}
                max={100}
                required
                step={1}
                type="number"
                value={parentalLeavePercentagePartner}
                num={parentalLeavePercentagePartner}
                label="%"
              />
            </span>
          </div>
          <div>
            <span>
              <LabeledInput
                name="unpaid_parental_leave_partner"
                className="full"
                onChange={handleUnpaidPLeavePartnerChange}
                kind="numeric"
                maxLength={3}
                value={unpaidParentalLeavePartner}
                num={unpaidParentalLeavePartner}
                label={t('week', { count: Number(unpaidParentalLeavePartner) })}
              />
            </span>
          </div>
        </MiniGrid>
      </PaddedPanel>
    </form>
  );
};

export default ParentalLeavePanel;
