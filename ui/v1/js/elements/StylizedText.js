import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => {
    const COLOR_HIGHLIGHT = theme.colors.eggPlant;
    const COLOR_PURPLE_SUBTLE = theme.colors.mountbattenpink;
    const COLOR_GRAY = theme.colors.nevada;

    return {
      boldhighlight: {
        color: COLOR_HIGHLIGHT,
        fontWeight: 800
      },
      highlightSm: {
        color: COLOR_HIGHLIGHT,
        fontSize: theme.fontSize.f12px
      },
      subtlest: {
        color: theme.colors.limedSpruce,
        opacity: 0.2
      },
      subtlestSm: {
        color: COLOR_HIGHLIGHT,
        fontSize: theme.fontSize.f12px,
        opacity: 0.2
      },
      small: {
        fontSize: theme.fontSize.f13px
      },
      labelMain: {
        color: COLOR_GRAY
      },
      labelSec: {
        color: COLOR_HIGHLIGHT
      },
      smallPurpleLabel: {
        color: COLOR_PURPLE_SUBTLE,
        fontSize: theme.fontSize.f13px
      },
      bulletSeparatorSubtle: {
        opacity: 0.2,
        display: 'inline-block',
        padding: '0 5px'
      },
      emptyState: {
        color: COLOR_GRAY,
        display: 'block',
        padding: 24
      }
    };
  },
  { name: 'StylizedText' }
);

const StylizedText = (props) => {
  const classes = useStyles();
  const className = classnames({
    [classes.boldhighlight]: props.theme === 'boldhighlight',
    [classes.highlightSm]: props.theme === 'highlight-sm',
    [classes.subtlestSm]: props.theme === 'subtlest-sm',
    [classes.labelMain]: props.theme === 'label-main',
    [classes.labelSec]: props.theme === 'label-sec',
    [classes.smallPurpleLabel]: props.theme === 'small-purple-label',
    [classes.bulletSeparatorSubtle]: props.theme === 'bullet-separator-subtle',
    [classes.emptyState]: props.theme === 'empty-state',
    [classes.spaced]: props.theme === 'spaced'
  });

  return <span className={className}>{props.children}</span>;
};

export default StylizedText;
