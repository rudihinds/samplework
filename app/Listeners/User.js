'use strict';

const Mail = use('Mail');
const Config = use('Config');
const User = (exports = module.exports = {});

/**
 * Send email with link to update the password
 */
User.sendEmailPasswordForgot = async (mailData) => {
  const { user } = mailData;
  await Mail.send('emails.password_reset', mailData, (message) => {
    message.to(user.email).from(Config.get('mail.defaultAddress')).subject('Password reset link');
  });
};

/**
 * Just a notification that passwors was updated
 */
User.sendEmailPasswordUpdated = async (mailData) => {
  const { user } = mailData;
  await Mail.send('emails.password_changed', mailData, (message) => {
    message.to(user.email).from(Config.get('mail.defaultAddress')).subject('Password was updated');
  });
};
