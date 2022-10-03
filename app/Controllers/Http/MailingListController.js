'use strict';

const Env = use('Env');

const Mailchimp = require('mailchimp-api-v3');

class MailingListController {
  async commitmentsSubscribe({ response, request }) {
    const mailchimp = new Mailchimp(Env.get('MAILCHIMP_API'));
    await mailchimp.post(`/lists/${Env.get('MAILCHIMP_COMMITMENTS_LIST_ID')}/members`, {
      email_address: request.input('email'),
      status: 'subscribed'
    });
    return response.json({ ok: true });
  }
}

module.exports = MailingListController;
