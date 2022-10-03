import React, { useContext } from 'react';
import { Formik, Form } from 'formik';
import { SlidesContext } from '@components/new-plan-form/button-section/SlidesContext';
import { FETCH_PLAN } from '@graphql/queries/plans';
import { useQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { UPDATE_PLAN } from '@graphql/mutations/plan';
import LocationForm from './LocationForm';
import IncomeForm from './IncomeForm';
import ExpensesForm from './ExpensesForm';
import ChildcareForm from './ChildcareForm';
import LeaveForm from './LeaveForm';
import ReturnForm from './ReturnForm';
import FertilityForm from './FertilityForm';

import 'twin.macro';

import toApollo from '../lib/toApollo';
import toFormik from '../lib/toFormik';
import validationSchema from '../lib/validationSchema';

function FormContentSection({ planId }) {
  const { ourActiveIndex } = useContext(SlidesContext);
  const getFormSection = () => {
    switch (ourActiveIndex) {
      case 0:
        return <LocationForm />;
      // return <FertilityForm />;
      case 1:
        return <IncomeForm />;
      case 2:
        return <ExpensesForm />;
      case 3:
        return <ChildcareForm />;
      case 4:
        return <LeaveForm />;
      case 5:
        return <ReturnForm />;
      case 6:
        return <FertilityForm planId={planId} />;
      default:
        return <LocationForm />;
    }
  };

  const { loading, error, data: { fetchPlan } = { fetchPlan: {} } } = useQuery(
    FETCH_PLAN,
    {
      variables: {
        id: planId
      }
    }
  );

  // useEffect(() => {
  //   console.log('useEffect');
  //   if (_formikBag) {
  //     console.log('useEffect setting values', fetchPlan);
  //     _formikBag.setValues(toFormik(fetchPlan));
  //   }
  // }, [fetchPlan, _formikBag]);

  console.log(loading, error);
  console.log('fetchPlan', fetchPlan);

  let _formikBag;
  const [updatePlan] = useMutation(UPDATE_PLAN, {
    onCompleted({ updatePlan: updatedPlan }) {
      _formikBag.setValues(toFormik(updatedPlan));
    }
  });

  return (
    <div>
      {!loading && !error && (
        <Formik
          initialValues={toFormik(fetchPlan)}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange={false}
          onSubmit={(values) => {
            console.log('onSubmit', values);
            updatePlan({
              variables: {
                id: planId,
                input: toApollo(values)
              }
            });
          }}
        >
          {(formik) => {
            _formikBag = formik;
            window.formikValues = formik.values;
            return (
              <>
                <Form tw="mb-2" onSubmit={formik.handleSubmit}>
                  {getFormSection()}
                </Form>
                {/* <pre tw="mb-2">
                  Formik state: {JSON.stringify(formik.values, null, 2)}
                </pre>
                <pre tw="mb-2">
                  Apollo state: {JSON.stringify(fetchPlan, null, 2)}
                </pre> */}
              </>
            );
          }}
        </Formik>
      )}
    </div>
  );
}

FormContentSection.propTypes = {
  planId: PropTypes.number.isRequired
};

export default FormContentSection;
