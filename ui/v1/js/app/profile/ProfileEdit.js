import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MenuItem, Select, FormControl, FormControlLabel, RadioGroup } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { differenceInYears, parseISO } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Radio, SectionTitle } from '../../elements';
import { useAuth } from '../../context/auth';

const { genders: gender_list, family_plans } = require('../../../catalog');

const ProfileEdit = () => {
  const { user, editUser } = useAuth();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      name: user.name,
      partner_name: (user.partner_name || '').trim(),
      gender: user.gender || '',
      partner_gender: user.partner_gender || '',
      birthdate: user.birthdate || '',
      partner_birthdate: user.partner_birthdate || '',
      career_begin_age: user.career_begin_age || '',
      partner_career_begin_age: user.partner_career_begin_age || '',
      is_primary_care_giver: Number(user.is_primary_care_giver),
      family_plans: user.family_plans || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setFieldsDisabled(true);
      await editUser({ ...data, has_partner: true });
      enqueueSnackbar('Profile saved');
      history.push('/planning');
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setFieldsDisabled(false);
    }
  };

  const validate = (birthdate) => {
    if (Boolean(birthdate) && differenceInYears(new Date(), parseISO(birthdate)) < 16) {
      return 'Oops! Please enter an age of 16 or older';
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-sel="ProfileEdit">
      <SectionTitle>Edit profile</SectionTitle>
      <p>
        <label>
          Your name
          {errors.name && <> &bull; This field is required</>}
          <br />
          <Controller control={control} as={Input} name="name" rules={{ required: true }} disabled={fieldsDisabled} />
        </label>
      </p>
      <p>
        <label>
          Partner name
          {errors.partner_name && <> &bull; This field is required</>}
          <br />
          <Controller
            control={control}
            as={Input}
            name="partner_name"
            rules={{ required: true }}
            disabled={fieldsDisabled}
          />
        </label>
      </p>
      <div>
        <label>
          Your gender
          {errors.gender && <> &bull; This field is required</>}
          <br />
          <FormControl variant="outlined" size="small">
            <Controller
              control={control}
              as={
                <Select>
                  {Object.entries(gender_list).map(([key, value]) => (
                    <MenuItem value={key} key={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              }
              id="gender"
              name="gender"
              disabled={fieldsDisabled}
              rules={{ required: true }}
            />
          </FormControl>
        </label>
      </div>
      <div>
        <label>
          Your partner&apos;s gender
          {errors.partner_gender && <> &bull; This field is required</>}
          <br />
          <FormControl variant="outlined" size="small">
            <Controller
              control={control}
              as={
                <Select>
                  {Object.entries(gender_list).map(([key, value]) => (
                    <MenuItem value={key} key={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              }
              id="partner_gender"
              name="partner_gender"
              disabled={fieldsDisabled}
            />
          </FormControl>
        </label>
      </div>
      <p>
        <label>
          Your birthdate
          {errors.birthdate && <> &bull; {errors.birthdate.message}</>}
          <br />
          <Controller
            control={control}
            as={Input}
            type="date"
            name="birthdate"
            disabled={fieldsDisabled}
            rules={{ validate, required: 'Please enter a date' }}
          />
        </label>
      </p>
      <p>
        <label>
          Your partner&apos;s birthdate
          {errors.partner_birthdate && <> &bull; {errors.partner_birthdate.message}</>}
          <br />
          <Controller
            control={control}
            as={Input}
            type="date"
            name="partner_birthdate"
            disabled={fieldsDisabled}
            rules={{ validate, required: 'Please enter a date' }}
          />
        </label>
      </p>
      <div>
        <label>
          Your career begin age
          {errors.career_begin_age && <> &bull; This field is required</>}
          <br />
          <FormControl variant="outlined" size="small">
            <Controller
              control={control}
              as={
                <Select>
                  {Array.from(Array(40), (_, i) => {
                    i = i + 18;
                    return (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    );
                  })}
                </Select>
              }
              id="career_begin_age"
              name="career_begin_age"
              disabled={fieldsDisabled}
              rules={{ required: true }}
            />
          </FormControl>
        </label>
      </div>
      <div>
        <label>
          Your partner&apos;s career begin age
          {errors.partner_career_begin_age && <> &bull; This field is required</>}
          <br />
          <FormControl variant="outlined" size="small">
            <Controller
              control={control}
              as={
                <Select>
                  {Array.from(Array(40), (_, i) => {
                    i = i + 18;
                    return (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    );
                  })}
                </Select>
              }
              id="partner_career_begin_age"
              name="partner_career_begin_age"
              disabled={fieldsDisabled}
            />
          </FormControl>
        </label>
      </div>
      <div>
        <label>
          Your family plans
          {errors.family_plans && <> &bull; This field is required</>}
          <br />
          <FormControl variant="outlined" size="small">
            <Controller
              control={control}
              as={
                <Select>
                  {Object.entries(family_plans).map(([key, value]) => (
                    <MenuItem value={key} key={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              }
              id="family_plans"
              name="family_plans"
              disabled={fieldsDisabled}
              rules={{ required: true }}
            />
          </FormControl>
        </label>
      </div>
      <div>
        <label>
          Who is the childbearing parent?
          {errors.primary_care_giver && <> &bull; This field is required</>}
          <br />
          <FormControl component="fieldset">
            <Controller
              control={control}
              render={({ name, value, onChange }) => {
                return (
                  <RadioGroup row name={name} value={value} onChange={(_, val) => onChange(Number(val))}>
                    <FormControlLabel
                      data-sel="primary_care_giver_self"
                      labelPlacement="end"
                      value={1}
                      control={<Radio />}
                      label="Me"
                    />
                    <FormControlLabel
                      data-sel="primary_care_giver_partner"
                      labelPlacement="end"
                      value={0}
                      control={<Radio />}
                      label="Partner"
                    />
                  </RadioGroup>
                );
              }}
              aria-label="Choose who's the primary care giver"
              name="is_primary_care_giver"
              rules={{ required: true }}
            />
          </FormControl>
        </label>
      </div>
      <p>
        <Button name="submit" disabled={fieldsDisabled}>
          Save
        </Button>
      </p>
    </form>
  );
};

export default ProfileEdit;
