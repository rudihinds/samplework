import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  ({ colors, fontSize }) => {
    return {
      wrapMin: {
        '&.wrap': {
          // Beats CSS specificity
          maxWidth: 330
        }
      },
      wrapMed: {
        '&.wrap': {
          // Beats CSS specificity
          maxWidth: 760
        }
      },
      title: {
        textAlign: 'center',
        fontSize: fontSize.f32px,
        color: colors.firefly
      },
      titleHasSubtitle: {
        marginBottom: 0
      },
      subtitle: {
        marginTop: 0,
        font: 'inherit',
        textAlign: 'center'
      },
      content: {
        borderRadius: 20,
        marginBottom: 30
      },
      contentWhiteBg: {
        padding: '15px 23px',
        color: colors.woodsmoke,
        background: colors.white
      },
      afterForm: {
        textAlign: 'center',
        marginTop: 120,
        color: colors.nevada
      }
    };
  },
  { name: 'AuthPanel' }
);

const AuthPanel = ({ theme, wrap, title, subtitle, children, afterForm, ...props }) => {
  const classes = useStyles();
  const outerWrapClasses = classnames({
    wrap: true, // Global styles wrapper
    [classes.wrapMin]: ['min'].includes(wrap),
    [classes.wrapMed]: ['med'].includes(wrap)
  });
  const innerWrapClasses = classnames({
    wrap: true, // Global styles wrapper
    [classes.wrapMin]: ['min'].includes(wrap),
    [classes.wrapMed]: ['med'].includes(wrap),
    [classes.content]: true,
    [classes.contentWhiteBg]: theme === 'white'
  });
  const titleClasses = classnames({
    [classes.title]: true,
    [classes.titleHasSubtitle]: Boolean(subtitle)
  });
  const subtitleClasses = classnames({
    [classes.subtitle]: true
  });
  return (
    <div>
      <div className={outerWrapClasses}>
        <h3 className={titleClasses}>{title}</h3>
        {subtitle && (
          <h5 style={{ marginTop: '1rem' }} className={subtitleClasses}>
            {subtitle}
          </h5>
        )}
      </div>
      <div className={innerWrapClasses}>{children}</div>

      {afterForm && <div className={classes.afterForm}>{afterForm}</div>}
    </div>
  );
};

AuthPanel.defaultProps = {
  wrap: 'min'
};

export default AuthPanel;
