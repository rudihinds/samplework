import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    panel: {
      paddingLeft: 16
    },
    separator: {
      borderBottom: `1px solid ${theme.colors.cloud}`,
      paddingBottom: 24,
      marginBottom: 15
    }
  }),
  { name: 'PaddedPanel' }
);

const PaddedPanel = ({ children, ...props }) => {
  const classes = useStyles(props);
  const className = classnames({
    [classes.panel]: true,
    [classes.separator]: props.separator
  });

  return (
    <Box className={className} mt={props.mtop} mb={props.mbot}>
      {children}
    </Box>
  );
};

PaddedPanel.defaultProps = {
  mtop: 0,
  mbot: 0
};

export default PaddedPanel;
