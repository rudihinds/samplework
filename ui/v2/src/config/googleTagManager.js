import TagManager from 'react-gtm-module';
import environment from './environment';

const tagManagerArgs = {
  gtmId: 'GTM-TFH8X6N'
};

export default () => {
  switch (environment()) {
    case 'development':
      tagManagerArgs.auth = 'vg7zf9gRPTdakRQHHiwUuQ';
      tagManagerArgs.preview = 'env-3';
      break;
    case 'beta':
      tagManagerArgs.auth = 'rS0SGtO2409jLWFwYExUpQ';
      tagManagerArgs.preview = 'env-4';
      break;
    case 'production':
      tagManagerArgs.auth = 'tihgtNnryXsXoPw82uEWag';
      tagManagerArgs.preview = 'env-1';
      break;
    default:
      return;
  }
  TagManager.initialize(tagManagerArgs);
};
