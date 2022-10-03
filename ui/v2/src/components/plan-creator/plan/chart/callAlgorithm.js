import axios from 'axios';
import { selfIsValid, partnerIsValid } from './algoValidation';
import { mapSelf, mapPartner } from './mapAlgorithmRequest';

const ENDPOINTS = {
  dev: 'https://ff6dqtmzv1.execute-api.us-east-1.amazonaws.com/dev/v1/income',
  prod: 'https://rhpylm5lmf.execute-api.us-east-1.amazonaws.com/prod/v1/income'
};

const algorithmEnvironment = () => {
  switch (window.location.hostname) {
    case 'dev.heymirza.dev':
      return 'dev';
    case 'beta.heymirza.dev':
      return 'prod';
    case 'app.heymirza.com':
      return 'prod';
    case 'localhost':
      return 'dev';
    default:
      return 'prod';
  }
};

const algoRequest = (body) =>
  axios
    .post(ENDPOINTS[algorithmEnvironment()], {
      user_data: body
    })
    .then((response) => ({ ok: true, response }))
    .catch((error) =>
      Promise.resolve({
        ok: false,
        response: error.response,
        request: error.request
      })
    );

// Utility function
// Validates plan and user
// Calls algorithm separately for both self and partner

export default async ({ plan, me }) => {
  let responseSelf = null;
  let responsePartner = null;

  if (selfIsValid({ plan, me })) {
    responseSelf = await algoRequest(mapSelf(plan, me));
  }

  if (partnerIsValid({ plan, me })) {
    responsePartner = await algoRequest(mapPartner(plan, me));
  }

  if (!responseSelf && !responsePartner) {
    return {
      called: false,
      self: { ok: false },
      partner: { ok: false }
    };
  }

  // Log errors
  if (responseSelf && !responseSelf.ok) {
    console.log(
      'Algorithm error self',
      responseSelf.response,
      responseSelf.request
    );
  }
  if (responsePartner && !responsePartner?.ok) {
    console.log(
      'Algorithm error partner',
      responsePartner.response,
      responseSelf.request
    );
  }

  return { called: true, self: responseSelf, partner: responsePartner };
};
