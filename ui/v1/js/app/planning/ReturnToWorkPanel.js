import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { FormControl, FormControlLabel, RadioGroup, Box } from '@material-ui/core';
import { useAuth } from '../../context/auth';
import { firstWord, partnerName } from '../../utils';
import {
  TitleWithAction,
  PaddedPanel,
  Button,
  Radio,
  StylizedText,
  MiniGrid,
  SliderInPercent,
  Tooltip,
  Icon
} from '../../elements';

const ReturnToWorkPanel = ({ planningData, setPlanningData, disabledKeys, setDisabledKeys, isFirstTimeUser }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [metric, setMetric] = useState('hours');
  const [returnToWorkSelf, setReturnToWorkSelf] = useState(planningData.return_to_work);
  const [returnToWorkPartner, setReturnToWorkPartner] = useState(planningData.return_to_work_partner);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isIsLocalFirstTimeUser, setIsIsLocalFirstTimeUser] = useState(isFirstTimeUser);

  const save = async () => {
    try {
      const response = await axios.post('/api/benefits', {
        return_to_work: returnToWorkSelf || 0,
        return_to_work_partner: returnToWorkPartner || 0
      });
      const benefits = response.data;
      setReturnToWorkSelf(benefits.return_to_work);
      setReturnToWorkPartner(benefits.return_to_work_partner);
      setPlanningData((data) => {
        return { ...data, ...benefits };
      });
      setEditing(false);
      setIsTooltipOpen(false);
      setIsIsLocalFirstTimeUser(isFirstTimeUser);
    } catch (error) {
      enqueueSnackbar(t('errors.generic'));
    }
  };

  const formSubmit = async (ev) => {
    ev.preventDefault();
    await save();
  };

  const edit = (ev) => {
    ev.preventDefault();
    setEditing(true);
    setIsTooltipOpen(isIsLocalFirstTimeUser);
  };

  const handleReturnToWorkSelfChange = (_, val) => {
    setReturnToWorkSelf(val);
  };

  const handleReturnToWorkPartnerChange = (_, val) => {
    setReturnToWorkPartner(val);
  };

  const tooltip = (
    <Tooltip
      trigger={['hover', 'click']}
      placement="topLeft"
      visible={isTooltipOpen}
      onVisibleChange={(value) => setIsTooltipOpen(value)}
      align={{ offset: [-40] }}
      overlay={
        <div>
          When you return to your job full time, how many hours per week do you plan on working? We compare this to what
          your hours looked like prior to your parental leave.
        </div>
      }
    >
      <span>
        <Icon icon="question-circle" width="15" />
      </span>
    </Tooltip>
  );

  return (
    <form onSubmit={formSubmit}>
      <PaddedPanel mtop={2}>
        <TitleWithAction
          title="Full Time Return"
          action={
            editing ? (
              <Button data-sel="saveReturnWork" theme="save">
                Save
              </Button>
            ) : (
              <Button data-sel="editReturnWork" theme="hollow" onClick={edit}>
                Edit
              </Button>
            )
          }
          titleTooltip={tooltip}
        />
        {editing && (
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="return to work self"
              name="return_to_work_metric"
              onChange={(ev, val) => setMetric(val)}
              value={metric}
            >
              <FormControlLabel
                data-sel="return_to_work_hrs_radio"
                labelPlacement="end"
                value="hours"
                control={<Radio />}
                label="Hrs"
              />
              <FormControlLabel
                data-sel="return_to_work_percent_radio"
                labelPlacement="end"
                value="percent"
                control={<Radio />}
                label="%"
              />
            </RadioGroup>
          </FormControl>
        )}
        <MiniGrid>
          <Box mt={editing ? 3 : 0}>
            <StylizedText theme="label-main">{user && firstWord(user.name)}</StylizedText>
          </Box>
          <div>
            {editing ? (
              <Box mt={4}>
                <SliderInPercent
                  convertToPercent={metric === 'percent'}
                  max={metric === 'percent' ? planningData.full_time_hrs : 120}
                  value={returnToWorkSelf}
                  name="return_to_work"
                  onChange={handleReturnToWorkSelfChange}
                  min={0}
                  step={1}
                  valueLabelDisplay="on"
                />
              </Box>
            ) : (
              <StylizedText theme="boldhighlight">{planningData.return_to_work} hrs/week</StylizedText>
            )}
          </div>
          <Box mt={editing ? 3 : 0}>
            <StylizedText theme="label-main">{partnerName(user.partner_name)}</StylizedText>
          </Box>
          <div>
            {editing ? (
              <Box mt={4}>
                <SliderInPercent
                  convertToPercent={metric === 'percent'}
                  max={metric === 'percent' ? planningData.full_time_hrs_partner : 120}
                  value={returnToWorkPartner}
                  name="return_to_work_partner"
                  onChange={handleReturnToWorkPartnerChange}
                  min={0}
                  step={1}
                  valueLabelDisplay="on"
                />
              </Box>
            ) : (
              <StylizedText theme="boldhighlight">{planningData.return_to_work_partner} hrs/week</StylizedText>
            )}
          </div>
        </MiniGrid>
      </PaddedPanel>
    </form>
  );
};

export default ReturnToWorkPanel;
