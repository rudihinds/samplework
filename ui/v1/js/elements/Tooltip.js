import React from 'react';
import Tippy from '@tippyjs/react';
import { withStyles } from '@material-ui/core/styles';
import 'tippy.js/dist/tippy.css';

const styles = (theme) => ({
  root: {
    fontSize: theme.fontSize.f13px,
    background: theme.colors.limedspruce,
    '& .tippy-arrow': {
      color: theme.colors.limedspruce
    },
    '& .tippy-content': {
      padding: '8px 10px'
    },
    '& a, & a:hover': {
      color: 'inherit'
    }
  }
});

const Tooltip = ({ classes, offsetX, offsetY, skipOffset, ...props }) => {
  props.popperOptions = {
    modifiers: [
      {
        name: 'arrow',
        options: {
          padding: offsetX
        }
      }
    ]
  };
  props.offset = [offsetX * -1, offsetY];
  if (skipOffset) {
    const { popperOptions, offset, ..._props } = props;
    props = _props;
  }
  props.content = <div>{props.content}</div>;
  return <Tippy className={classes.root} {...props} />;
};

Tooltip.defaultProps = {
  offsetX: 40,
  offsetY: 10,
  placement: 'top-start'
};

export default withStyles(styles)(Tooltip);
