import React, { useEffect } from 'react';
import { css, styled, theme } from 'twin.macro';
import inviteTick from '@assets/invite-tick.svg';
import PropTypes from 'prop-types';

function NotUsedInvites({
  setShowAllInvitesUsed,
  emailValue,
  setEmailValue,
  invitesUsed,
  setInvitesUsed
}) {
  // const [emailValue, setEmailValue] = useState({ emailOne: '', emailTwo: '' });
  // const [invitesUsed, setInvitesUsed] = useState([false, false]);

  const validateEmail = (email) => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  useEffect(() => {
    const isTrue = (currVal) => currVal === true;
    const allInvitesUsed = invitesUsed.every(isTrue);
    setShowAllInvitesUsed(allInvitesUsed);
  }, [invitesUsed, setShowAllInvitesUsed]);

  const handleChange = (e) => {
    setEmailValue({
      ...emailValue,
      [e.target.id]: e.target.value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailValue[e.target.id];
    const index = e.target.id === 'emailOne' ? 0 : 1;

    if (validateEmail(email)) {
      const newInvitesUsed = invitesUsed;
      newInvitesUsed[index] = true;
      setInvitesUsed([...newInvitesUsed]);
      // send email to db
    } else {
      console.log('bad email');
    }
  };
  return (
    <div>
      <div
        tw="flex-row md:max-w-3xl"
        css={[
          css`
            max-width: 330px;
            margin: 0 auto;
          `
        ]}
      >
        <div
          tw="md:max-w-2xl"
          css={[
            css`
              max-width: 270px;
              margin: 0 auto;
            `
          ]}
        >
          <div
            tw="flex justify-center max-w-sm max-w-full"
            css={[
              css`
                margin: 0 auto;
              `
            ]}
          >
            <p
              tw="text-purple-2 text-2.6 md:text-2.1 text-center font-bold md:max-w-max"
              css={[
                css`
                  margin: 27px 0 12px 0;
                `
              ]}
            >
              You have 2 invites available!
            </p>
          </div>
          <p tw="text-center mb-1 md:mb-0">
            Got someone in mind that would benefit from Mirza?
          </p>
          <p
            tw="font-sans text-center"
            css={[
              css`
                margin-bottom: 23px;
              `
            ]}
          >
            Enter their email below and we’ll send them an early invite
          </p>
        </div>
        <Form tw="mt-0" onSubmit={handleSubmit} id="emailOne">
          <input
            placeholder="Enter email address"
            tw="border border-grey-3 border-r-0 rounded-l-xl pl-1"
            css={[
              css`
                flex: 2;
              `
            ]}
            type="text"
            value={emailValue.emailOne}
            onChange={handleChange}
            id="emailOne"
          />
          <Button
            type="submit"
            tw="text-white border-none rounded-r-xl flex justify-center items-center"
            css={[
              css`
                flex: 1;
              `
            ]}
            inviteUsed={invitesUsed[0]}
          >
            {invitesUsed[0] ? <img src={inviteTick} alt="" /> : 'Send'}
          </Button>
        </Form>
        <Form onSubmit={handleSubmit} id="emailTwo">
          <input
            placeholder="Enter email address"
            tw="border border-grey-3 border-r-0 rounded-l-xl pl-1"
            css={[
              css`
                flex: 2;
              `
            ]}
            type="text"
            value={emailValue.emailTwo}
            onChange={handleChange}
            id="emailTwo"
          />
          <Button
            type="submit"
            tw="text-white border-none rounded-r-xl flex justify-center items-center"
            css={[
              css`
                flex: 1;
              `
            ]}
            inviteUsed={invitesUsed[1]}
          >
            {invitesUsed[1] ? <img src={inviteTick} alt="" /> : 'Send'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default NotUsedInvites;

const Button = styled.button`
  background-color: ${({ inviteUsed }) =>
    inviteUsed ? theme`colors.teal-2` : theme`colors.purple-2`};
`;
const Form = styled.form`
  height: 40px;
  margin-top: 15px;
  max-width: 100%;
  display: flex;
`;

NotUsedInvites.propTypes = {
  setShowAllInvitesUsed: PropTypes.func,
  emailValue: PropTypes.shape({
    emailOne: PropTypes.string,
    emailTwo: PropTypes.string
  }),
  setEmailValue: PropTypes.func,
  invitesUsed: PropTypes.arrayOf(PropTypes.bool),
  setInvitesUsed: PropTypes.func
};

NotUsedInvites.defaultProps = {
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [false, false],
  setShowAllInvitesUsed: () => {},
  setEmailValue: () => {},
  setInvitesUsed: () => {}
};
