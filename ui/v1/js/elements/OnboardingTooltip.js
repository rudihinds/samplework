import React from 'react';
import Tooltip from './Tooltip';

const OnboardingTooltip = ({ controlled, visible, open, close, children, ...rest }) => {
  const tooltipProps = controlled
    ? {
        visible,
        onClickOutside() {
          close();
        }
      }
    : { trigger: 'click mouseenter focus', interactive: true, interactiveBorder: 20 };

  const triggererProps = controlled
    ? {
        onClick() {
          open();
        },
        onMouseEnter() {
          open();
        }
      }
    : {};

  return (
    <Tooltip {...tooltipProps} {...rest}>
      <span {...triggererProps}>{children}</span>
    </Tooltip>
  );
};

OnboardingTooltip.defaultProps = {
  controlled: false,
  visible: false
};

export default OnboardingTooltip;
