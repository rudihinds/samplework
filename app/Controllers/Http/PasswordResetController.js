'use strict';

const User = use('App/Models/User');
const PasswordReset = use('App/Models/PasswordReset');
const Event = use('Event');
const { validateAll } = use('Validator');
const randomToken = require('rand-token');

class PasswordResetController {
  async forgotPassword({ request, response }) {
    const validation = await validateAll(request.only('email'), {
      email: 'required|email'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }
    try {
      const user = await User.findBy({ email: request.input('email') });
      await PasswordReset.query().where('email', user.email).delete();
      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomToken.generate(16)
      });
      Event.fire('password:forgot', { user: user, token: token });

      return response.json({
        message: 'Password reset link has been sent to your email'
      });
    } catch (error) {
      return response.status(404).json({
        error: 'User not found'
      });
    }
  }

  async updatePasswordByToken({ request, response, params }) {
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required|min:6|confirmed'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const user = await User.findBy({ email: request.input('email') });
    const token = await PasswordReset.query().where('email', user.email).where('token', params.token).first();
    if (!token) {
      return response.status(404).json({
        error: 'This password reset token does not exist'
      });
    }

    user.password = request.input('password');
    await user.save();
    await PasswordReset.query().where('email', user.email).delete();
    Event.fire('password:updated', { user });

    return response.json({
      message: 'Your password has been updated'
    });
  }
}

module.exports = PasswordResetController;
