import React from 'react';
import { Link, Switch, Route, useRouteMatch, withRouter } from 'react-router-dom';
import { SectionTitle } from '../elements';
import ProfileEdit from './profile/ProfileEdit';
import ProfilePassword from './profile/ProfilePassword';
import { useAuth } from '../context/auth';

const { genders: gender_list, family_plans: plans } = require('../../catalog');

const Profile = withRouter(() => {
  const { user } = useAuth();
  const { path } = useRouteMatch();
  return (
    <div className="wrap">
      <Switch>
        <Route path={path} exact>
          <div data-sel="Profile">
            <SectionTitle>Profile</SectionTitle>
            <h4>Your account</h4>
            <p data-sel="profile-name">
              <strong>Name</strong>
              <br />
              {user.name}
            </p>
            <p data-sel="profile-email">
              <strong>Email</strong>
              <br />
              {user.email}
            </p>
            <p data-sel="profile-gender">
              <strong>Gender</strong>
              <br />
              {gender_list[user.gender] || 'N/A'}
            </p>
            <p data-sel="profile-birthdate">
              <strong>Birthdate</strong>
              <br />
              {user.birthdate}
            </p>
            <p data-sel="profile-career-begin">
              <strong>Career begin age</strong>
              <br />
              {user.career_begin_age}
            </p>
            <p data-sel="profile-family-plans">
              <strong>Family plans</strong>
              <br />
              {plans[user.family_plans] || 'N/A'}
            </p>
            {user.has_partner && (
              <div data-sel="profile-partner-section">
                <p data-sel="profile-partner-name">
                  <strong>Partner&apos;s name</strong>
                  <br />
                  {user.partner_name || 'Not set'}
                </p>
                <p data-sel="profile-partner-gender">
                  <strong>Partner&apos;s gender</strong>
                  <br />
                  {gender_list[user.partner_gender] || 'N/A'}
                </p>
                <p data-sel="profile-partner-birthdate">
                  <strong>Partner&apos;s birthdate</strong>
                  <br />
                  {user.partner_birthdate}
                </p>
                <p data-sel="profile-partner-career-begin">
                  <strong>Partner&apos;s career begin age</strong>
                  <br />
                  {user.partner_career_begin_age}
                </p>
              </div>
            )}
            <p data-sel="profile-childbearer">
              <strong>Childbearing parent</strong>
              <br />
              {user.is_primary_care_giver ? 'You' : 'Your Partner'}
            </p>
            <p>
              <Link to={`${path}/edit`}>Edit</Link>
              &bull;
              <Link to={`${path}/password`}>Change password</Link>
            </p>
          </div>
        </Route>
        <Route path={`${path}/edit`}>
          <ProfileEdit />
        </Route>
        <Route path={`${path}/password`}>
          <ProfilePassword />
        </Route>
      </Switch>
    </div>
  );
});

export default Profile;
