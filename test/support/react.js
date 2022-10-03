/**
 * Select a MenuItem option from a Select Material-UI component
 *
 * @param {object} page,
 * @param {string} selectCssSelector
 * @param {string} option
 */
const selectOption = async (page, selectCssSelector, option) => {
  await page.evaluate(
    (selectCssSelector, option) => {
      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('mousedown', true, true);
      const selectElement = document.querySelector(
        `${selectCssSelector}.MuiSelect-root, ${selectCssSelector} .MuiSelect-root`
      );
      selectElement.dispatchEvent(clickEvent);
      [...document.querySelectorAll('li[role="option"]')].find((el) => el.dataset.value === option).click();
    },
    selectCssSelector,
    option
  );
};

/**
 * Select a MenuItem option from an Autocomplete Material-UI component
 *
 * @param {object} page,
 * @param {string} selectCssSelector
 * @param {string} option
 */
const autocompleteSelectOption = async (page, selectCssSelector, option) => {
  await page.evaluate(
    (selectCssSelector, option) => {
      const clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('mousedown', true, true);
      const selectElement = document.querySelector(`${selectCssSelector} input`);
      selectElement.dispatchEvent(clickEvent);

      setTimeout(() => {
        selectElement.dispatchEvent(clickEvent);
        [...document.querySelectorAll('li[role="option"]')].find((el) => el.textContent === option).click();
      }, 10);
    },
    selectCssSelector,
    option
  );
};

/**
 * Simulate a typing input, this method dispatch the onChange event of React.
 * It's mostly useful for cleaning an input
 *
 * @param {object} page
 * @param {string} cssSelector
 * @param {string} value
 */
const typeInput = async (page, cssSelector, value) => {
  await page.$eval(
    cssSelector,
    (el, value) => {
      const prevValue = el.value;
      el.value = value;
      const tracker = el._valueTracker;
      if (tracker) {
        tracker.setValue(prevValue);
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    value
  );
};

/**
 * Mimics mouse movement on a slide given by a input selector and
 * a percentage to move in the slider
 *
 * @param {object} page
 * @param {string} inputCssSelector
 * @param {number} percentage
 */
const slideInput = async (page, inputCssSelector, percentage) => {
  const dataSel = `slide-${Math.random().toString().substring(2, 15)}`;
  await page.$eval(
    inputCssSelector,
    (input, dataSel) => {
      input.parentNode.dataset.pupSel = dataSel;
    },
    dataSel
  );
  const sliderContainer = await page.$(`[data-pup-sel="${dataSel}"]`);
  const sliderContainerBox = await sliderContainer.boundingBox();
  const slider = await page.$(`${inputCssSelector} + span[role="slider"]`);
  const sliderBox = await slider.boundingBox();
  const slideX = sliderBox.x + sliderBox.width / 2;
  const slideY = sliderBox.y + sliderBox.height / 2;
  const percentageX = sliderContainerBox.x + (sliderContainerBox.width * percentage) / 100;
  await page.mouse.move(slideX, slideY);
  await page.mouse.down();
  await page.waitFor(100);
  await page.mouse.move(percentageX, slideY);
  await page.waitFor(100);
  await page.mouse.up();
  await page.waitFor(100);
};

/**
 * Return a string to type in input dates according to `navigator.language`
 *
 * @param {object} page
 * @param {string} date
 * @returns {Promise<string>}
 */
const asLocalizedDate = async (page, date) => {
  return await page.evaluate((date) => {
    return new Date(date).toLocaleDateString(navigator.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, new Date(date).toISOString());
};

module.exports = {
  autocompleteSelectOption,
  selectOption,
  typeInput,
  slideInput,
  asLocalizedDate
};
