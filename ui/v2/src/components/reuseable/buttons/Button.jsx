import tw from 'twin.macro';

export const Basic = tw.button`
  bg-mirza-purple text-white border border-mirza-purple rounded-8 outline-none
  px-2 py-1
  transition-colors duration-200
  hover:(bg-transparent text-mirza-purple)
  focus:outline-none
`;

export default Basic;
