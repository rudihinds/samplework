import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';

import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { MY_PLANS } from '@graphql/queries/plans';
import tw, { styled, theme } from 'twin.macro';
import DuplicatePlan from '@plan-creator/duplicate-plan';
import Plan from './plan/Plan';

import SwiperContext from './SwiperProvider';

SwiperCore.use([Pagination]);

const Plans = () => {
  const { loading, error, data = {} } = useQuery(MY_PLANS);
  const swiperRef = useRef(null);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error:{error}</div>}
      <SwiperContext.Provider value={swiperRef}>
        {data.me?.plans?.length > 0 && (
          <SwiperStyles tw="smlp:hidden">
            <Swiper
              onSwiper={(s) => {
                swiperRef.current = s;
              }}
              spaceBetween={15}
              pagination={{
                clickable: true,
                slidesPerView: 1
              }}
            >
              {data.me.plans.map((plan) => (
                <SwiperSlide>
                  <Plan plan={plan} plans={data.me?.plans} />
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperStyles>
        )}
        <div tw="hidden smlp:(grid grid-cols-2 gap-3)">
          {data.me?.plans.map((plan) => (
            <Plan plan={plan} plans={data.me?.plans} />
          ))}
          <div>
            <DuplicatePlan />
          </div>
        </div>

        <div tw="mt-3 smlp:hidden">
          <DuplicatePlan />
        </div>
      </SwiperContext.Provider>
    </div>
  );
};

const SwiperStyles = styled.div`
  --swiper-theme-color: ${theme`colors.mirza-green`};

  .swiper-container {
    ${tw`pb-3.5`}
  }

  .swiper-pagination {
    bottom: 0 !important;
  }

  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
  }
`;

export default Plans;
