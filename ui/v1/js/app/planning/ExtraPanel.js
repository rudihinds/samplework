import React from 'react';
import { makeStyles, withStyles, fade } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';

const useStyles = makeStyles(
  (theme) => {
    const flexSpacing = {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(0, 1)
      },
      '& > :nth-child(1)': {
        marginLeft: 0
      },
      '& > :nth-child(n)': {
        marginRight: 0
      }
    };
    return {
      label: {
        fontSize: '0.8rem',
        color: theme.colors.eggPlant
      },
      bottomMainGrid: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: 20,
        '& > *': {
          margin: theme.spacing(0, 1)
        },
        [theme.breakpoints.down('sm')]: {
          flexWrap: 'wrap'
        }
      },
      childbirthSelectGrid: {
        ...flexSpacing,
        [theme.breakpoints.down('sm')]: {
          marginBottom: 10
        }
      },
      timelineToggleGrid: {
        ...flexSpacing
      }
    };
  },
  { name: 'ExtraPanel' }
);

const ExtraPanel = ({ extraData, setExtraData }) => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  const handleChildbirthChange = (ev) => {
    const val = parseInt(ev.target.value);
    setExtraData((prev) => {
      return { ...prev, childbirth_on_year: val };
    });
  };

  const handleToggleYearsInFuture = (e, value) => {
    console.log('event',e.target);
    console.log('value',value);

    value = Number(value);

    setExtraData((state) => {
      if (state.childbirth_on_year > value) state.childbirth_on_year = value;
      return { ...state, years_in_future: value };
    });
  };

  return (
    <article>
      <div className={classes.bottomMainGrid}>
        <div className={classes.childbirthSelectGrid}>
          <div>
            <label className={classes.label}>Childbirth on year</label>
          </div>
          <div>
            <FormControl variant="outlined" size="small">
              <Select
                data-sel="childbirthOnYearSelect"
                id="childbirth_year_select"
                classes={{ root: classes.label }}
                value={extraData.childbirth_on_year}
                onChange={handleChildbirthChange}
              >
                <MenuItem value={0}>Select</MenuItem>
                {Array.from(Array(extraData.years_in_future), (_, yearOffset) => {
                  return (
                    <MenuItem value={yearOffset + 1} key={`select_childbirth_${yearOffset}`}>
                      {currentYear + yearOffset}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.timelineToggleGrid}>
          <div>
            <span className={classes.label}>Timeline view</span>
          </div>
          <div>
            <StyledToggleButton
              data-sel="timelineToggle5y"
              value="5"
              selected={extraData.years_in_future === 5}
              onChange={handleToggleYearsInFuture}
            >
              5 years
            </StyledToggleButton>
          </div>
          <div>
            <StyledToggleButton
              data-sel="timelineToggle10y"
              value="10"
              selected={extraData.years_in_future === 10}
              onChange={handleToggleYearsInFuture}
            >
              10 years
            </StyledToggleButton>
          </div>
        </div>
      </div>
    </article>
  );
};

const StyledToggleButton = withStyles(
  (theme) => ({
    root: {
      color: theme.colors.white,
      padding: '9px 10px',
      backgroundColor: fade(theme.colors.capecod, 0.3),
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.capecod
      },
      '&$selected': {
        color: theme.colors.white,
        backgroundColor: theme.colors.capecod,
        '&:hover': {
          backgroundColor: theme.colors.capecod
        }
      }
    },
    selected: {},
    label: {
      textTransform: 'none',
      fontSize: '0.8rem'
    }
  }),
  { name: 'StyledToggleButton' }
)(ToggleButton);

export default ExtraPanel;
