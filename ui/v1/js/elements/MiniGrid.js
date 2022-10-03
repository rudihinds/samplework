import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const firstColumnBaseWidth = 80;
const useStyles = makeStyles(
  (theme) => ({
    grid: (props) => {
      const firstColumnWidth = firstColumnBaseWidth * props.firstColumnRatio;
      return {
        display: 'grid',
        gridGap: 10,
        alignItems: 'center',
        gridTemplateColumns: `${firstColumnWidth}px repeat(${props.columns - 1}, minmax(0, 1fr))`
      };
    }
  }),
  { name: 'MiniGrid' }
);

const MiniGrid = (props) => {
  const classes = useStyles(props);
  const { firstColumnRatio, ..._props } = props;
  return (
    <div {..._props} className={classes.grid}>
      {props.children}
    </div>
  );
};

MiniGrid.defaultProps = {
  firstColumnRatio: 1, // Used whenever we need a bigger column 1, this gets multiplied by 80
  columns: 2
};
export default MiniGrid;
