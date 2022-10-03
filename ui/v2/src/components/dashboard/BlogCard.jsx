import React from 'react';
import CommonCard from '@reuseable/cards/CommonCard';
import arrow from '@assets/black-arrow.svg';
import arrowMb from '@assets/arrow-mobile-blk.svg';
import tw, { styled } from 'twin.macro';
import { up } from 'styled-breakpoints';

import BlogPostDads from '@assets/blog-post-dads.jpg';
import BlogPost35 from '@assets/blog-post-35.jpg';

function BlogCard() {
  const str1 = 'Hey Dads! Tips for raising a healthy, confident daughter';
  const str2 =
    "Having a baby after 35: does fertility really 'fall off a cliff?'";

  return (
    <BlogCardStyles>
      <div className="title">
        <h2>Articles for you</h2>
        <a
          href="https://www.heymirza.com/articles"
          target="_blank"
          rel="noreferrer"
        >
          <img alt="" id="large-arrow" src={arrow} />
          <img alt="" id="small-arrow" src={arrowMb} />
        </a>
      </div>
      <div className="content">
        <a
          href="https://www.heymirza.com/articles/tips-raising-healthy-confident-daughters-hrxsp"
          target="_blank"
          className="postcover"
          rel="noreferrer"
        >
          <div className="postimg">
            <img alt="" src={BlogPostDads} tw="rounded-8" />
          </div>
          <div tw="text-left">{str1}</div>
        </a>
        <a
          href="https://www.heymirza.com/articles/having-a-baby-after-35-does-fertility-fall-off-a-cliff-47g2d"
          target="_blank"
          className="postcover"
          rel="noreferrer"
        >
          <div className="postimg">
            <img alt="" src={BlogPost35} tw="rounded-8" />
          </div>
          <div tw="text-left">{str2}</div>
        </a>
      </div>
    </BlogCardStyles>
  );
}

const BlogCardStyles = styled(CommonCard)`
  ${tw`bg-mirza-lightgrey`}
  order: 5;
  grid-area: bc;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;
  padding: 25px;

  & div {
    flex: 1;
    justify-content: center;
  }

  & .title {
    grid-column: 1;
    display: flex;
    justify-content: space-between;
    height: max-content;
    margin-bottom: 22px;
  }

  & .content {
    display: flex;

    & .postcover {
      display: flex;
      flex-direction: column;
      text-align: center;

      &:last-child {
        margin-left: 24px;
      }

      & .postimg {
        padding: 0;
        ${tw`pb-1 md:pb-1.5`}
      }

      // & .posttitle {
      //   flex: 3;
      //   text-align: start;
      //   width: 95%;
      //   margin-top: 7px;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   display: -webkit-box;
      //   -webkit-line-clamp: 3; /* number of lines to show */
      //   -webkit-box-orient: vertical;
      //   -moz-line-clamp: 3; /* number of lines to show */
      //   -moz-box-orient: vertical;

      //   ${up('sm')} {
      //     width: 85%;
      //     padding-left: 5px;
      //   }
      // }
    }
  }

  #large-arrow {
    display: none;
  }

  ${up('sm')} {
    #large-arrow {
      display: unset;
    }

    #small-arrow {
      display: none;
    }
  }
`;

export default BlogCard;
