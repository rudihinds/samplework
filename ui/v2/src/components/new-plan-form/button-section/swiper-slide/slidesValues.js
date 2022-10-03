import locationIncomplete from '@assets/progress-icons/location-wizard.svg';
import locationActive from '@assets/progress-icons/location-active.svg';
import locationComplete from '@assets/progress-icons/location-complete.svg';
import incomeIncomplete from '@assets/progress-icons/income-wizard.svg';
import incomeActive from '@assets/progress-icons/income-active.svg';
import incomeComplete from '@assets/progress-icons/income-complete.svg';
import expensesIncomplete from '@assets/progress-icons/expenses-wizard.svg';
import expensesActive from '@assets/progress-icons/expenses-active.svg';
import expensesComplete from '@assets/progress-icons/expenses-complete.svg';
import childcareIncomplete from '@assets/progress-icons/childcare-wizard.svg';
import childcareActive from '@assets/progress-icons/childcare-active.svg';
import childcareComplete from '@assets/progress-icons/childcare-complete.svg';
import leaveIncomplete from '@assets/progress-icons/leave-wizard.svg';
import leaveActive from '@assets/progress-icons/leave-active.svg';
import leaveComplete from '@assets/progress-icons/leave-complete.svg';
import returnIncomplete from '@assets/progress-icons/return-wizard.svg';
import returnActive from '@assets/progress-icons/return-active.svg';
import returnComplete from '@assets/progress-icons/return-complete.svg';
import fertilityIncomplete from '@assets/progress-icons/fertility-wizard.svg';
import fertilityActive from '@assets/progress-icons/fertility-active.svg';
import fertilityComplete from '@assets/progress-icons/fertility-complete.svg';

const slidesValues = [
  {
    slide: 'location',
    incompleteImage: locationIncomplete,
    completeImage: locationComplete,
    activeImage: locationActive
  },
  {
    slide: 'income',
    incompleteImage: incomeIncomplete,
    completeImage: incomeComplete,
    activeImage: incomeActive
  },
  {
    slide: 'expenses',
    incompleteImage: expensesIncomplete,
    completeImage: expensesComplete,
    activeImage: expensesActive
  },
  {
    slide: 'childcare',
    incompleteImage: childcareIncomplete,
    completeImage: childcareComplete,
    activeImage: childcareActive
  },
  {
    slide: 'leave',
    incompleteImage: leaveIncomplete,
    completeImage: leaveComplete,
    activeImage: leaveActive
  },
  {
    slide: 'return',
    incompleteImage: returnIncomplete,
    completeImage: returnComplete,
    activeImage: returnActive
  },
  {
    slide: 'fertility',
    incompleteImage: fertilityIncomplete,
    completeImage: fertilityComplete,
    activeImage: fertilityActive
  }
];

export default slidesValues;
