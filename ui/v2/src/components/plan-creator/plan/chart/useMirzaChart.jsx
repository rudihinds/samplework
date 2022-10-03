import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ChartJS from 'chart.js/auto';

import { find } from 'lodash';
import Tooltip from './Tooltip';
import Triangle from './Triangle';

export default ({ plan }) => {
  const chartRef = useRef(null);
  const chartJs = useRef(null);

  useEffect(() => {
    const years = [...Array(parseInt(plan.view_years, 10) + 1).keys()].map(
      (n) => new Date().getFullYear() + n
    );
    if (chartJs.current) {
      // Update years labels
      chartJs.current.data.labels = years;
    } else {
      chartJs.current = new ChartJS(chartRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: years,
          datasets: []
        },
        options: {
          barPercentage: 1.0,
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
                drawBorder: false
              }
            },
            y: {
              stacked: true,
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                callback: (value) => (value === 0 ? '0' : `${value / 1000}K`)
              }
            }
          },
          aspectRatio: 1.72,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              // backgroundColor: 'rgba(255, 255, 255, 1.0)',
              // titleColor: '#9e9e9e',
              // bodyColor: '#9e9e9e',
              // bodyFont: {
              //   family: 'Averta, sans-serif',
              //   size: 14
              // },
              // displayColors: false,
              enabled: false,
              xAlign: 'center',
              external: (context) => {
                // Tooltip Element
                let tooltipEl = document.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  const bodyDiv = document.createElement('div');
                  bodyDiv.style.zIndex = 9997;
                  tooltipEl.appendChild(bodyDiv);
                  tooltipEl.style.zIndex = 9999;
                  document.body.appendChild(tooltipEl);
                }

                // Create caret element
                let caretEl = document.getElementById('tooltip-caret');
                if (!caretEl) {
                  caretEl = document.createElement('div');
                  caretEl.id = 'tooltip-caret';
                  caretEl.style.zIndex = 9999;
                  document.body.appendChild(caretEl);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  caretEl.style.opacity = 0;
                  return;
                }

                const { datasets } = context.chart.config._config.data;

                // Fail out if cannot access data index
                if (context.tooltip.dataPoints.length <= 0) {
                  return;
                }

                const { dataIndex } = context.tooltip.dataPoints[0];

                const selfNoInterrupt = find(datasets, {
                  label: 'self_no_interrupt'
                });
                const partnerNoInterrupt = find(datasets, {
                  label: 'partner_no_interrupt'
                });
                const combinedPenalty = find(datasets, {
                  label: 'combined_penalty'
                });

                // const selfInterrupt = find(datasets, {
                //   label: 'self_interrupt'
                // });
                // const partnerInterrupt = find(datasets, {
                //   label: 'partner_interrupt'
                // });
                const yearlyExpenses = find(datasets, {
                  label: 'yearly_expenses'
                });
                const childcareExpenses = find(datasets, {
                  label: 'childcare_expenses'
                });
                const selfNetIncome = find(datasets, {
                  label: 'self_net_income'
                });
                const partnerNetIncome = find(datasets, {
                  label: 'partner_net_income'
                });

                // By default the caret is positioned on the right of the bar
                // Below gets the width of the bar from dataset meta and subtracts half width from caret
                const barWidth = chartJs.current.getDatasetMeta(0).data[
                  dataIndex
                ].width;
                tooltipModel.caretX -= barWidth / 2;

                ReactDOM.render(
                  <Tooltip
                    potentialIncome={
                      (selfNoInterrupt.data[dataIndex] || null) +
                      (partnerNoInterrupt.data[dataIndex] || null)
                    }
                    parenthoodPenalty={combinedPenalty.data[dataIndex] || 0}
                    childcareExpenses={childcareExpenses.data[dataIndex] || 0}
                    yearlyExpenses={yearlyExpenses.data[dataIndex] || 0}
                    netIncome={
                      (selfNetIncome.data[dataIndex] || null) +
                      (partnerNetIncome.data[dataIndex] || null)
                    }
                    caretXPos={tooltipModel.caretX - 5}
                  />,
                  tooltipEl.querySelector('div')
                );

                const canvasRect = context.chart.canvas.getBoundingClientRect();
                const tooltipRect = tooltipEl.getBoundingClientRect();

                // Render caret

                ReactDOM.render(<Triangle />, caretEl);

                caretEl.style.position = 'absolute';
                caretEl.style.opacity = 1;

                // Left of canvas plus caret recommended x pos
                caretEl.style.left = `${
                  canvasRect.left + tooltipModel.caretX
                }px`;
                // Top of canvas relative to top of page +
                // Current scroll y pos +
                // Recommended caret y pos -
                // Caret height
                caretEl.style.top = `${
                  canvasRect.top + window.pageYOffset + tooltipModel.caretY - 14 // caret height
                }px`;

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.pointerEvents = 'none';

                // If tooltip will go offscreen (outside of chart area)
                // Moves tooltip to right side of chart
                if (tooltipModel.caretX + 60 > tooltipRect.width) {
                  tooltipEl.style.left = `${
                    canvasRect.right + 30 - tooltipRect.width
                  }px`;
                } else {
                  tooltipEl.style.left = `${canvasRect.left}px`;
                }

                tooltipEl.style.top = `${
                  canvasRect.top + // top of canvas relative to top of page
                  window.pageYOffset + // current scroll position
                  tooltipModel.caretY - // chartjs recommended caret position (top of bar relative to top of canvas)
                  tooltipRect.height - // height of tooltip
                  14 // caret height
                }px`;
              }
            }
          }
        }
      });
      // console.log('Tooltip', chartJs.current.options.plugins.tooltip);
      // window.tooltip = chartJs.current.options.plugins.tooltip;
      // window.chartjs = chartJs.current;
    }
  }, [plan.view_years]);

  return { chartRef, chartJs };
};
