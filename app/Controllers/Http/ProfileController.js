'use strict';

const Hash = use('Hash');
const { validateAll } = use('Validator');

class ProfileController {
  /**
   * Returns authenticated user information
   */
  async me({ response, auth }) {
    const user = auth.user;

    return response.json(user);
  }

  /**
   * Update profile for authenticated user
   */
  async update({ auth, request, response }) {
    const user = auth.user;
    const validation = await validateAll(request.all(), {
      name: 'string|min:3',
      currency: 'string|min:2|max:3'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    user.merge(
      request.only([
        'name',
        'currency',
        'gender',
        'partner_gender',
        'birthdate',
        'partner_birthdate',
        'career_begin_age',
        'partner_career_begin_age',
        'is_primary_care_giver',
        'planning_params',
        'family_plans',
        'has_partner',
        'partner_name'
      ])
    );
    await user.save();
    await user.reload();

    return response.json(user);
  }

  async update_meta({ auth, request, response, params }) {
    const user = auth.user;

    const user_meta = {
      ...user.meta,
      ...(params.key === 'commitments_disclaimer_ok' ? { commitments_disclaimer_ok_at: new Date() } : {}),
      ...(!['commitments_disclaimer_ok'].includes(params.key) ? { ...request.all() } : {})
    };

    user.meta = user_meta;
    await user.save();
    await user.reload();

    return response.json(user);
  }

  async finishOnboarding({ auth, response }) {
    const user = auth.user;
    user.onboarding_finished_at = new Date();
    if (!user.has_partner) {
      user.is_primary_care_giver = true;
      for (const attribute in user.$attributes) {
        if (attribute.match(/partner_/)) {
          user[attribute] = null;
        }
      }
    }
    await user.save();
    await user.reload();
    return response.json(user);
  }

  /**
   * Update user password. User MUST know his current password to change it
   */
  async password({ auth, request, response }) {
    const user = auth.user;
    const validation = await validateAll(request.all(), {
      old_password: 'required',
      password: 'required|min:6|confirmed'
    });

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const old_password = request.input('old_password');
    const authorized = await Hash.verify(old_password, user.password);
    if (!authorized) {
      return response.status(403).json({
        error: 'Action not authorized'
      });
    }

    user.password = request.input('password');
    await user.save();

    return response.json({ message: 'Password updated' });
  }
}

module.exports = ProfileController;
