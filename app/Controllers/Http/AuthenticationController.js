'use strict';

const { validateAll } = use('Validator');

class AuthenticationController {
  /**
   * Authenticates users using credentials and sets cookies
   * to autorize subsequent requests using ajax. If request comes from
   * mobile application, it will generate a token instead
   */
  async login({ request, response, auth }) {
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const { email, password } = request.only(['email', 'password']);
    let authData = null;

    if (request.fromMobileApp()) {
      authData = await auth.authenticator('api').attempt(email, password);
    } else {
      authData = await auth.attempt(email, password);
    }

    return response.json(authData);
  }

  /**
   * Logged out current user. This endopoint is for
   * web context only
   */
  async logout({ request, response, auth }) {
    await auth.logout();

    return response.json({ message: 'Logged out' });
  }

  /**
   * Empty request just to get XSRF-TOKEN cookie in order to set
   * an X-XSRF-TOKEN header in the subsequent POST, PUT, DELETE request
   */
  async csrfCookie({ response }) {
    return response.noContent();
  }

  async hasura({ request, response, auth }) {
    console.log('%%%%%%%%%%%% hasura headers', request.headers());
    console.log('%%%%%%%%%%%% hasura cookies', request.cookies());
    console.log('%%%%%%%%%% hasura request', request.all());

    return response.json({
      'x-hasura-user-id': '1'
    });
  }
}

module.exports = AuthenticationController;
