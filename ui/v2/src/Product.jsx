import React from 'react';

import Navbar from '@reuseable/Navbar';
import { useAuth } from '@contexts/auth';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { RenderRoutes } from '@routing/helpers';

import NProgress from 'nprogress';

const Product = ({ routes }) => {
  // Redirects back to top of routes, which hits AuthRedirect
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  NProgress.done();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    userId: user.id
  });

  return (
    <>
      <Navbar />
      <RenderRoutes routes={routes} />
    </>
  );
};

Product.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Product;
