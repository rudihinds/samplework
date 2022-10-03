import React from 'react';
import { Modal } from 'react-responsive-modal';

import PropTypes from 'prop-types';

const ActionPlanModalDrawer = ({ children, open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    center
    classNames={{
      modal: 'action-plan-modal-drawer'
    }}
  >
    {children}
  </Modal>
);

ActionPlanModalDrawer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};

ActionPlanModalDrawer.defaultProps = {
  children: [],
  onClose: () => {}
};

export default ActionPlanModalDrawer;
