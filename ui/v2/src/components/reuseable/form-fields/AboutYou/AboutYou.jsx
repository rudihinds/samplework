import React, { useState, useEffect } from 'react';
import { css } from 'twin.macro';
import ProfileRow from '../ProfileRow/ProfileRow';
import AboutYouTableHead from './AboutYouTableHead';

function AboutYou() {
  const activeUser = {
    name: 'Joanna Dope',
    hasPartner: true,
    partnerName: 'Michael',
    gender: 'female',
    careerStart: '01/01/2010',
    familyStage: 'expecting',
    dueDate: '08/01/2021',
    childbearingParent: 'Joanna',
    basedIn: 'NY'
  };

  const partner = {
    name: 'Michael',
    partnerName: 'Joanna',
    gender: 'male',
    careerStart: '01/01/2013',
    familyStage: 'expecting',
    dueDate: '08/01/2021',
    childbearingParent: 'Joanna',
    basedIn: 'NY'
  };

  const genders = [
    { id: 0, value: 'Female' },
    { id: 1, value: 'Male' },
    { id: 2, value: 'Non-binary' },
    { id: 3, value: 'Prefer not to say' }
  ];

  const [primaryUserActive, setPrimaryUserActive] = useState(true);
  const [primaryUser, setPrimaryUser] = useState(activeUser);

  const {
    name,
    gender,
    careerStart,
    familyStage,
    dueDate,
    childbearingParent,
    basedIn
  } = primaryUser;

  const setNewValue = (newName) => {
    setPrimaryUser({
      ...primaryUser,
      name: newName
    });
  };

  useEffect(() => {
    const setPrimaryUserFunc = () => {
      const user = primaryUserActive ? activeUser : partner;
      setPrimaryUser(user);
    };
    setPrimaryUserFunc();
  });
  //   primaryUserActive ? setPrimaryUser(activeUser) : setPrimaryUser(partner);
  // }, [primaryUserActive]);

  const items = [];
  // console.log(primaryUser);

  return (
    <>
      <p tw="text-dark-green">About You</p>
      <div
        tw="bg-grey-4"
        css={[
          css`
            max-width: 600px;
          `
        ]}
      >
        <AboutYouTableHead
          primaryUserActive={primaryUserActive}
          setPrimaryUserActive={setPrimaryUserActive}
          user={activeUser}
          partner={activeUser.hasPartner ? partner : null}
        />
        <div
          css={[
            css`
              max-width: 546px;
              margin: auto;
            `
          ]}
        >
          <ProfileRow
            field="Name"
            value={name}
            type="input"
            items={items}
            setNewValue={setNewValue}
          />
          <ProfileRow
            field="Gender"
            value={gender}
            type="dropdown"
            items={genders}
          />
          <ProfileRow
            field="Career start date"
            value={careerStart}
            type="datepicker"
            items={items}
          />
          <ProfileRow
            field="Family Stage"
            value={familyStage}
            type="dropdown"
            items={items}
          />
          <ProfileRow
            field="Due date"
            value={dueDate}
            type="datepicker"
            items={items}
          />
          <ProfileRow
            field="Childbearing parent"
            value={childbearingParent}
            type="dropdown"
            items={items}
          />
          <ProfileRow
            field="Based in"
            value={basedIn}
            type="dropdown"
            items={items}
          />
        </div>
      </div>
    </>
  );
}

export default AboutYou;
