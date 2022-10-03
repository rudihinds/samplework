import currency from 'currency.js';
import { zipWith } from 'lodash';

const combineSelfPartner = ({ self, partner, key }) => {
  let combined = [];
  if (self?.ok && !partner?.ok) {
    combined = self.response.data.user_results[key];
  } else if (!self?.ok && partner?.ok) {
    combined = partner.response.data.user_results[key];
  } else if (self?.ok && partner?.ok) {
    combined = zipWith(
      self.response.data.user_results[key],
      partner.response.data.user_results[key],
      (a, b) => currency(a).add(b).value
    );
  }
  return combined;
};

export default combineSelfPartner;
