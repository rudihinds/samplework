import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { OnboardingTooltip as Tooltip, Icon } from '.';

const useStyles = makeStyles(
  ({ colors }) => {
    return {
      grid: {
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridGap: 10
      },
      legend: {
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        alignItems: 'flex-start',
        gridGap: 5,
        fontSize: '0.85rem',
        color: colors.black
      }
    };
  },
  { name: 'GraphLegends' }
);

const GraphLegends = ({ items, width }) => {
  const classes = useStyles();
  return (
    <div style={{ ...width }}>
      <div className={classes.grid}>
        {items.map((item, i) => {
          return <GraphLegendItem {...item} key={i} />;
        })}
      </div>
    </div>
  );
};

const GraphLegendItem = ({ title, color, style, hidden, tooltip }) => {
  const classes = useStyles();
  if (hidden) return null;

  let fill = color;
  let dasharray = null;
  if (style === 'dashed') {
    fill = 'transparent';
    dasharray = '5 2';
  }

  return (
    <div className={classes.legend}>
      <svg width={15} height={15}>
        <rect
          rx="5"
          ry="2"
          width="100%"
          height="100%"
          fill={fill}
          stroke={color}
          strokeWidth={3}
          strokeDasharray={dasharray}
        />
      </svg>
      <span>
        {title}
        {tooltip && tooltip === 'motherhood' && (
          <Tooltip
            skipOffset
            content={
              <div>
                There has only been academic research on the impact of parenthood on mothers: 
                the gap pay between working mothers and their counterparts without children. But 
                fathers face an impact too, and that research in ongoing. So in real life terms, 
                the Parenthood Penalty is the drop in a parent’s earnings upon starting a family; 
                in effect, the cost when our personal and professional aspirations collide. We 
                have our sights set on ending this penalty and supporting you in minimizing its 
                impact on you.
              </div>
            }
          >
            <Icon icon="question-circle" width="15" />
          </Tooltip>
        )}
      </span>
    </div>
  );
};

GraphLegendItem.defaultProps = {
  hidden: false,
  style: 'filled'
};

export default GraphLegends;
