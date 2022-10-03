import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Icon } from '.';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    container: {
      color: theme.colors.nevada
    },
    dialogClass: {
      padding: 32,
      maxWidth: 800,
      width: '100%'
    },
    mobileDialogClass: { padding: 0, width: '100%' },
    dialogTitle: {
      fontWeight: 900,
      fontSize: theme.fontSize.f24px,
      fontFamily: theme.fontBase,
      textAlign: 'center'
    },
    actions: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,4fr) minmax(0,2fr)',
      gridGap: 16,
      [theme.breakpoints.down('xs')]: { gridTemplateColumns: 'auto' }
    },
    modalClose: {
      display: 'inline-block',
      padding: 10
    },
    frameContainer: {
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '56.25%'
    },
    responsiveFrame: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0
    }
  }),
  { name: 'VideoModal' }
);

const VideoEmbedModal = ({ isOpen, handleClose, video }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const dialogClasses = classnames({
    [classes.dialogClass]: matches,
    [classes.mobileDialogClass]: !matches
  });
  return (
    <Dialog
      PaperProps={{ classes: { root: dialogClasses } }}
      onClose={handleClose}
      open={isOpen}
      maxWidth="xl"
      data-sel="video-modal"
    >
      <div className={classes.container}>
        {matches && (
          <div className="rgt">
            <a data-sel="modal-close" href="/" className={classes.modalClose} onClick={handleClose}>
              <Icon icon="cross" width={16} />
            </a>
          </div>
        )}
        <div className={classes.frameContainer}>
          <iframe
            className={classes.responsiveFrame}
            allow="autoplay;"
            src={video + '?autoplay=1'}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Dialog>
  );
};

export default VideoEmbedModal;
