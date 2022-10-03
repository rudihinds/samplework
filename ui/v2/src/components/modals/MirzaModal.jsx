import React from 'react';
import { Modal } from 'react-responsive-modal';

import PropTypes from 'prop-types';

const MirzaModal = ({ children, open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    center
    classNames={{
      modal: 'mirza-modal'
    }}
  >
    {children}
  </Modal>
);

MirzaModal.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};

MirzaModal.defaultProps = {
  children: [],
  onClose: () => {}
};

export default MirzaModal;
