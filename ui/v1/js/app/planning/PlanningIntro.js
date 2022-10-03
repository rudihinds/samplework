import React, { useRef } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const PlanningIntro = () => {
  const { url } = useRouteMatch();
  const wrap = useRef();

  // @todo: onmount?
  setTimeout(() => {
    if (wrap.current) {
      wrap.current.classList.add('bg-section-intro');
    }
  }, 250);

  return (
    <div className="wrap flex wraptop" ref={wrap}>
      <div className="panel-btma flex">
        <div className="panel-btma--main">
          <div className="wrapcontent">
            <h2 className="section-title">Planning for the future</h2>
            <p className="section-intro">
              It’s key to know how having a family affects your income, so you can plan effectively. This tool enables
              you to explore scenarios, options and potential futures.
            </p>
          </div>
          <img src="/img/graph.png" />
        </div>
        <div className="panel-btma--cta">
          <Link to={`${url}/setup`}>Explore</Link>
        </div>
      </div>
    </div>
  );
};

export default PlanningIntro;
