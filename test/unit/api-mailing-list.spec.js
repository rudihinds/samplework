'use strict';

const { test, trait } = use('Test/Suite')('Api Mailing List');
const Env = use('Env');
const nock = use('nock');

trait('DatabaseTransactions');
trait('Test/ApiClient');

test('subscribe email', async ({ client, assert }) => {
  await Env.set('MAILCHIMP_API', 'mailchimp-apikey');
  await Env.set('MAILCHIMP_COMMITMENTS_LIST_ID', 'mailchimpcommitmentslistid');

  nock(/api\.mailchimp\.com/)
    .post(
      '/3.0/lists/mailchimpcommitmentslistid/members',
      (body) => body.email_address === 'c@d.com' && body.status === 'subscribed'
    )
    .reply(200, {});

  const response = await client
    .post('/api/mailing-list/commitments/subscribe')
    .type('json')
    .accept('json')
    .send({
      email: 'c@d.com'
    })
    .end();

  response.assertStatus(200);
});
