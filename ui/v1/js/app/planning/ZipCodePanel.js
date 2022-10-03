import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { LabeledInput, StylizedText } from '../../elements';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(
  {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'max-content minmax(0, auto) min-content',
      gridGap: 15,
      alignItems: 'center'
    }
  },
  { name: 'ZipCodePanel' }
);

const ZipCodePanel = ({ location, setLocation }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [zipCode, setZipCode] = useState(location?.zip_code || '');
  const zipcodeFormRef = useRef();
  let cancelToken;

  const handleZipCodeChange = (ev) => {
    setZipCode(ev.target.value);
  };

  const submit = async () => {
    try {
      cancelToken = axios.CancelToken.source();
      const response = await axios.post('/api/location', { zip_code: zipCode }, { cancelToken: cancelToken?.token });
      setLocation({ ...response.data });
    } catch (error) {
      if (!axios.isCancel(error))
        enqueueSnackbar('Cannot find a location with this zip code', { preventDuplicate: false });
      cancelToken = axios.CancelToken.source();
    }
  };

  const didMount = useRef(false);
  const debounced = debounce(async () => {
    if (zipcodeFormRef.current.reportValidity()) {
      await submit();
    }
  }, 500);

  useEffect(() => {
    if (didMount.current) debounced();
    else didMount.current = true;
    return () => {
      cancelToken?.cancel('request_cancelled');
      debounced.cancel();
    };
  }, [zipCode]);

  return (
    <form onSubmit={submit} ref={zipcodeFormRef}>
      <div className={classes.grid}>
        <StylizedText theme="label-main">Zip Code</StylizedText>
        <LabeledInput
          pattern="^[0-9]{5}"
          name="zip_code"
          value={zipCode}
          onChange={handleZipCodeChange}
          kind="numeric"
          format="#####"
          mask="_"
          minLength="5"
          className="min"
        ></LabeledInput>
      </div>
    </form>
  );
};

export default ZipCodePanel;
