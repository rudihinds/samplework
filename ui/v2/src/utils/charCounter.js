/* eslint-disable */
function charCounter(str) {
  console.log(str);
  if (!str.length >= 56) return str;
  str = `${str.slice(0, 55)}...`;
  return str;
}

export default charCounter;
