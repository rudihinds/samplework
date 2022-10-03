import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FormControl, MenuItem } from '@material-ui/core';
import { nFormatter } from '../../utils';
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
import { useSnackbar } from 'notistack';

const FertilityTreatmentPanel = (props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { planningData, setPlanningData } = props;
  const [fertilityTreatmentType, setFertilityTreatmentType] = useState(planningData.fertility_treatment_type);
  const [fertilityTreatmentCost, setFertilityTreatmentCost] = useState(planningData.fertility_treatment_cost);
  const [fertilityTreatmentCycles, setFertilityTreatmentCycles] = useState(planningData.fertility_treatment_cycles);
  const fertilityFormRef = useRef();
  let cancelToken;

  const saveFertilityTreatment = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        '/api/expenses',
        {
          fertility_treatment_type: fertilityTreatmentType,
          fertility_treatment_cost: fertilityTreatmentCost,
          fertility_treatment_cycles: fertilityTreatmentCycles
        },
        { cancelToken: cancelToken?.token }
      );
      const expenses = response.data;
      setPlanningData((data) => {
        return { ...data, ...expenses };
      });
      setFertilityTreatmentCost(expenses.fertility_treatment_cost);
      setFertilityTreatmentType(expenses.fertility_treatment_type);
      setFertilityTreatmentCycles(expenses.fertility_treatment_cycles);
    } catch (error) {
      if (!axios.isCancel(error)) enqueueSnackbar(t('errors.generic'));
    }
  };

  const didMount = useRef(false);
  const debounced = debounce(async () => {
    if (fertilityFormRef.current.reportValidity()) {
      await saveFertilityTreatment();
    }
  }, 500);

  useEffect(() => {
    if (didMount.current) debounced();
    else didMount.current = true;
    return () => {
      cancelToken?.cancel('request_cancelled');
      debounced.cancel();
    };
  }, [fertilityTreatmentCycles, fertilityTreatmentType]);

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await saveFertilityTreatment();
  };

  const handleFertilityTreatmentTypeChange = (ev) => {
    const val = ev.target.value;
    setFertilityTreatmentType(val);
    if (val === 'off') {
      setFertilityTreatmentCost(0);
      setFertilityTreatmentCycles(0);
    }
  };

  const handleFertilityTreatmentCyclesChange = (ev) => {
    setFertilityTreatmentCycles(ev.target.value);
  };

  const tooltip = (
    <Tooltip
      content={
        <div>
          Our calculated cost of fertility treatment is for one full round of IVF, including hormonal treatment, and is
          the average across the US without insurance.
        </div>
      }
    >
      <Icon icon="question-circle" width="15" />
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit} ref={fertilityFormRef}>
      <PaddedPanel mtop={2}>
        <TitleWithAction title="Fertility treatment" titleTooltip={tooltip} />

        <MiniGrid columns={3} firstColumnRatio={1.5}>
          <div>
            <StylizedText theme="small-purple-label">Type</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">Total cycles</StylizedText>
          </div>
          <div>
            <StylizedText theme="small-purple-label">Total cost</StylizedText>
          </div>
          <div>
            <FormControl variant="outlined" size="small">
              <Select
                id="fertility_treatment_type_select"
                name="fertility_treatment_type"
                value={fertilityTreatmentType}
                onChange={handleFertilityTreatmentTypeChange}
              >
                <MenuItem value="off">No fertility treatment</MenuItem>
                <MenuItem value="ivf">IVF</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            {fertilityTreatmentType === 'ivf' && (
              <LabeledInput
                name="fertility_treatment_cycles"
                className="min"
                defaultValue={fertilityTreatmentCycles}
                onChange={handleFertilityTreatmentCyclesChange}
              />
            )}
          </div>
          <div>
            <StylizedText theme="boldhighlight">${nFormatter(planningData.fertility_treatment_cost, 1)}</StylizedText>
          </div>
        </MiniGrid>
      </PaddedPanel>
    </form>
  );
};

export default FertilityTreatmentPanel;
