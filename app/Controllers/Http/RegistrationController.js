'use strict';

const Env = use('Env');

const Database = use('Database');
const Logger = use('Logger');
const User = use('App/Models/User');
const Mailchimp = require('mailchimp-api-v3');
const { validateAll } = use('Validator');

class RegistrationController {
  /**
   * Creates a new user and authenticated him,
   * return an api token in case request comes from
   * mobile application
   */
  async register({ request, response, auth }) {
    const validation = await validateAll(
      request.all(),
      {
        name: 'required',
        email: 'required|email|unique:users,email',
        password: 'required|confirmed|min:6'
      },
      {
        'email.unique': 'This email address is already associated with an account.',
        'email.email': 'You must enter a valid email address.',
        'password.min': 'Your password must contain at least 6 characters.'
      }
    );

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const userData = request.only(['name', 'email', 'password']);
    const trx = await Database.beginTransaction();
    let user = null;
    try {
      user = await User.create(userData, trx);

      // Bootstrap initial plan
      await user.plans().create({ country_id: 237, title: 'Plan 1' }, trx);
      await trx.commit();
    } catch (error) {
      Logger.error(error);
      await trx.rollback();
      return response.status(500).json({
        message: 'Error while saving user and its relations'
      });
    }
    let token = null;
    await user.reload();
    if (request.fromMobileApp()) {
      token = await auth.authenticator('api').generate(user);
    } else {
      await auth.login(user);
    }

    const info = { user };
    if (token) {
      info.token = token;
    }
    if (Boolean(Env.get('MAILCHIMP_API')) && Boolean(Env.get('MAILCHIMP_USERS_LIST_ID'))) {
      try {
        const mailchimp = new Mailchimp(Env.get('MAILCHIMP_API'));
        await mailchimp.post(`/lists/${Env.get('MAILCHIMP_USERS_LIST_ID')}/members`, {
          email_address: user.email,
          status: 'subscribed'
        });
      } catch (error) {
        Logger.error(error);
      }
    }
    return response.status(201).json(info);
  }
}

module.exports = RegistrationController;
