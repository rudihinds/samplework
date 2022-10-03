import React from 'react';
import classnames from 'classnames';

const Icon = ({ icon, fill, width, className }) => {
  const Svg = require(`../../svg/${icon}.svg`);
  const classNames = classnames({
    svg: true,
    [className]: true,
    'fill-svg': fill
  });
  const styles = { width: `${width}px` };
  return <i className={classNames} style={styles} dangerouslySetInnerHTML={{ __html: Svg }}></i>;
};

Icon.defaultProps = {
  width: 100,
  fill: true,
  className: ''
};

export default Icon;
