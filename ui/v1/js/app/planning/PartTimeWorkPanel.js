import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { FormControl, FormControlLabel, RadioGroup, Box } from '@material-ui/core';
import { useAuth } from '../../context/auth';
import { firstWord, partnerName } from '../../utils';
import {
  TitleWithAction,
  LabeledInput,
  PaddedPanel,
  Radio,
  StylizedText,
  MiniGrid,
  SliderInPercent,
  OnboardingTooltip as Tooltip,
  Icon
} from '../../elements';

const PartTimeWorkPanel = ({ planningData, setPlanningData, disabledKeys, setDisabledKeys, isFirstTimeUser }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [metric, setMetric] = useState('hours');
  const [partTimeWorkSelf, setPartTimeWorkSelf] = useState(planningData.part_time_work);
  const [partTimeLengthSelf, setPartTimeLengthSelf] = useState(planningData.part_time_length);
  const [partTimeWorkPartner, setPartTimeWorkPartner] = useState(planningData.part_time_work_partner);
  const [partTimeLengthPartner, setPartTimeLengthPartner] = useState(planningData.part_time_length_partner);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isLocalFirstTimeUser, setIsLocalFirstTimeUser] = useState(isFirstTimeUser);
  const partTimeFormRef = useRef();
  let cancelToken;

  const save = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        '/api/benefits',
        {
          part_time_work: partTimeWorkSelf || 0,
          part_time_length: partTimeLengthSelf || 0,
          part_time_work_partner: partTimeWorkPartner || 0,
          part_time_length_partner: partTimeLengthPartner || 0
        },
        { cancelToken: cancelToken?.token }
      );
      const benefits = response.data;
      setPartTimeWorkSelf(benefits.part_time_work);
      setPartTimeWorkPartner(benefits.part_time_work_partner);
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
    if (partTimeFormRef.current.reportValidity()) {
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
  }, [partTimeWorkSelf, partTimeWorkPartner, partTimeLengthSelf, partTimeLengthPartner]);

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await save();
  };

  const handlePartTimeWorkSelfChange = (_, val) => {
    setPartTimeWorkSelf(val);
  };

  const handlePartTimeLengthSelf = (ev) => {
    setPartTimeLengthSelf(ev.target.value);
  };

  const handlePartTimeWorkPartnerChange = (_, val) => {
    setPartTimeWorkPartner(val);
  };

  const handlePartTimeLengthPartner = (ev) => {
    setPartTimeLengthPartner(ev.target.value);
  };

  const tooltip = (
    <Tooltip
      controlled={isLocalFirstTimeUser}
      visible={isTooltipOpen}
      content={
        <div>
          Part-time work refers to, when you are returning to work after parental leave, how you plan on returning. This
          may also be covered by your employer’s policy. Do they offer the option to return part-time? If so, then check
          the policy for whether it’s built around % or number of hours and at what salary percent.
        </div>
      }
      open={() => setIsTooltipOpen(true)}
      close={() => setIsTooltipOpen(false)}
    >
      <Icon icon="question-circle" width="15" />
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit} ref={partTimeFormRef}>
      <PaddedPanel mtop={2}>
        <TitleWithAction title="Part time work" titleTooltip={tooltip} />
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="Part time work in percent or in hours"
            name="part_time_metric"
            onChange={(_, val) => setMetric(val)}
            value={metric}
          >
            <FormControlLabel
              data-sel="part_time_hrs_radio"
              labelPlacement="end"
              value="hours"
              control={<Radio />}
              label="Hrs"
            />
            <FormControlLabel
              data-sel="part_time_percent_radio"
              labelPlacement="end"
              value="percent"
              control={<Radio />}
              label="%"
            />
          </RadioGroup>
        </FormControl>
        <MiniGrid>
          <Box mt={3}>
            <StylizedText theme="label-main">{user && firstWord(user.name)}</StylizedText>
          </Box>
          <div>
            <Box mt={4}>
              <SliderInPercent
                convertToPercent={metric === 'percent'}
                max={metric === 'percent' ? planningData.full_time_hrs : 120}
                value={partTimeWorkSelf}
                name="part_time_work"
                onChange={handlePartTimeWorkSelfChange}
                min={0}
                step={1}
                valueLabelDisplay="on"
              />
            </Box>
          </div>
          <div>
            <StylizedText theme="label-main">Duration</StylizedText>
          </div>
          <div>
            <LabeledInput
              kind="numeric"
              format="###"
              name="part_time_length"
              className="min"
              onChange={handlePartTimeLengthSelf}
              value={partTimeLengthSelf}
              label={t('week', { count: Number(partTimeLengthSelf) })}
            />
          </div>
          <Box mt={3}>
            <StylizedText theme="label-main">{partnerName(user.partner_name)}</StylizedText>
          </Box>
          <div>
            <Box mt={4}>
              <SliderInPercent
                convertToPercent={metric === 'percent'}
                max={metric === 'percent' ? planningData.full_time_hrs_partner : 120}
                value={partTimeWorkPartner}
                name="part_time_work_partner"
                onChange={handlePartTimeWorkPartnerChange}
                min={0}
                step={1}
                valueLabelDisplay="on"
              />
            </Box>
          </div>
          <div>
            <StylizedText theme="label-main">Duration</StylizedText>
          </div>
          <div>
            <LabeledInput
              kind="numeric"
              format="###"
              name="part_time_length_partner"
              className="min"
              onChange={handlePartTimeLengthPartner}
              value={partTimeLengthPartner}
              label={t('week', { count: Number(partTimeLengthPartner) })}
            />
          </div>
        </MiniGrid>
      </PaddedPanel>
    </form>
  );
};

export default PartTimeWorkPanel;
