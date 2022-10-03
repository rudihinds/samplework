import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { MenuItem, FormControl } from '@material-ui/core';
import {
  TitleWithAction,
  PaddedPanel,
  LabeledInput,
  Icon,
  OnboardingTooltip as Tooltip,
  OutlinedMiniSelect as Select,
  StylizedText,
  MiniGrid
} from '../../elements';

const ChildcarePanel = (props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { planningData, setPlanningData } = props;
  const [childcareType, setChildcareType] = useState(planningData.child_care_type);
  const [childcareCost, setChildcareCost] = useState(planningData.child_care_cost || 0);
  const childcareFormRef = useRef();
  let cancelToken;

  const saveChildcare = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        '/api/expenses',
        {
          child_care_type: childcareType,
          child_care_cost: childcareCost || 0
        },
        { cancelToken: cancelToken?.token }
      );
      const expenses = response.data;
      setChildcareType(expenses.child_care_type);
      setChildcareCost(expenses.child_care_cost);
      setPlanningData((data) => {
        return { ...data, ...expenses };
      });
    } catch (error) {
      if (!axios.isCancel(error)) enqueueSnackbar(t('errors.generic'));
    }
  };

  const didMount = useRef(false);
  const debounced = debounce(async () => {
    if (childcareFormRef.current.reportValidity()) {
      await saveChildcare();
    }
  }, 500);

  useEffect(() => {
    if (didMount.current) debounced();
    else didMount.current = true;
    return () => {
      cancelToken?.cancel('request_cancelled');
      debounced.cancel();
    };
  }, [childcareType, childcareCost]);

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await saveChildcare();
  };

  const handleChildcareTypeChange = (ev) => {
    const val = ev.target.value;
    setChildcareType(val);
    if (val === 'off') setChildcareCost(0);
  };
  const handleChildcareCostChange = (ev) => {
    setChildcareCost(ev.target.value);
  };

  const tooltip = (
    <Tooltip content={<div>Add in the costs for your preferred method of childcare in your area.</div>}>
      <Icon icon="question-circle" width="15" />
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit} ref={childcareFormRef}>
      <PaddedPanel separator={true} mtop={2}>
        <TitleWithAction title="Child care" titleTooltip={tooltip} />
        <MiniGrid firstColumnRatio={1.5}>
          <div>
            <StylizedText theme="small-purple-label">Type</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">Monthly cost</StylizedText>
          </div>
          <span>
            <FormControl variant="outlined" size="small">
              <Select
                id="child_care_type_select"
                name="child_care_type"
                value={childcareType}
                onChange={handleChildcareTypeChange}
              >
                <MenuItem value="off">No childcare</MenuItem>
                <MenuItem value="nanny">Nanny</MenuItem>
                <MenuItem value="daycare">Daycare</MenuItem>
              </Select>
            </FormControl>
          </span>
          <span>
            <LabeledInput
              name="child_care_cost"
              className="min"
              value={childcareCost}
              onChange={handleChildcareCostChange}
              disabled={childcareType === 'off'}
            />
          </span>
        </MiniGrid>
      </PaddedPanel>
    </form>
  );
};

export default ChildcarePanel;
