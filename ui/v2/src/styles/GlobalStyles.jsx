import React from 'react';
import { createGlobalStyle } from 'styled-components';
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro';
import { up } from 'styled-breakpoints';

// console.log('from global, ', theme`screens`);

const CustomStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    -webkit-tap-highlight-color: ${theme`colors.purple.500`};
    ${tw`antialiased font-sans`};
    font-size: 15px;
    line-height: 21px;
  }

  h1 {
    ${tw`font-heading font-bold`}
    font-size: 26px;
    line-height: 34px;
  }

  h2 {
    ${tw`font-heading font-bold`}
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.2;
  }

  p {
    ${tw`font-sans`}
  }

  ${up('sm')} {
    body {
      font-size: 15px;

      /* line-height: 25px; */
    }

    h1 {
      font-size: 28px;
      line-height: 27px;
    }

    h2 {
      font-size: 20px;
      line-height: 36px;
    }
  }

  ${up('smLp')} {
    body {
      font-size: 16px;
      line-height: 22px;
    }

    h1 {
      font-size: 32px;
      line-height: 42px;
    }

    h2 {
      font-size: 22px;
      line-height: 32px;
      letter-spacing: 0.2px;
    }

    p {
      font-size: 16px;
      line-height: 22px;
    }
  }

  .mirza-modal {
    border-radius: 20px;
    ${tw`px-3 py-2 md:(px-5 py-3)`}
    max-width: 975px;
  }

  .action-plan-modal-drawer {
    border-radius: 20px 20px 0 0;
    ${tw`px-0 py-5 md:(px-5 py-3)`}
    max-width: 975px;
    margin: 10rem 0 0 0;
    min-height: 75%;
    width: 100%;
    vertical-align: bottom;

    ${up('md')} {
      margin: 1rem;
      border-radius: 20px;
      min-height: unset;
      vertical-align: middle;
    }
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
