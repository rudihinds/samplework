import React from 'react';
import { styled } from 'twin.macro';

const Triangle = () => (
  <CSSTriangle>
    <CSSTriangleInner />
    <CSSTriangleInner2 />
  </CSSTriangle>
);

export default Triangle;

// Black outer triangle for border
const CSSTriangle = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 14px solid black;
`;

// Covers middle of black triangle to create border effect
// Leaves black border top
const CSSTriangleInner = styled.div`
  position: absolute;
  top: -14px;
  left: -13px;
  width: 0;
  height: 0;
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;
  border-top: 13px solid white;
`;

// Slightly bigger triangle stretched over black border top
const CSSTriangleInner2 = styled.div`
  position: absolute;
  top: -16px;
  left: -15px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 14px solid white;
`;
