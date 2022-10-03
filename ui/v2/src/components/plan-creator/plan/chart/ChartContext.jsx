import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

const ChartContext = createContext({});

export const ChartProvider = ({ children }) => {
  const [datasetsObj, setDatasetsObj] = useState({});

  const setDataset = useCallback((name, value) => {
    setDatasetsObj((prevObj) => ({
      ...prevObj,
      [name]: value
    }));
  }, []);

  const getDataset = useCallback((name) => datasetsObj[name], [datasetsObj]);

  const bulkSetDatasets = useCallback((datasets) => {
    const objToMerge = {};
    datasets.forEach((dataset) => {
      objToMerge[dataset.label] = dataset;
    });
    setDatasetsObj((prevObj) => ({
      ...prevObj,
      ...objToMerge
    }));
  }, []);

  return (
    <ChartContext.Provider
      value={{
        hello: 'world',
        datasets: Object.values(datasetsObj),
        hasData: Object.values(datasetsObj).length > 0,
        setDataset,
        getDataset,
        bulkSetDatasets
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

ChartProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired
};

const useChartContext = () => useContext(ChartContext);

export default useChartContext;
